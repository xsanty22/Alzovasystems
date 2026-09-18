import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export type LeadSource = 
  | "cotizador" 
  | "auditoria" 
  | "servicio_tecnico" 
  | "contacto" 
  | "newsletter" 
  | "producto";

export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export interface Lead {
  id: string;
  user_id: string | null;
  source: LeadSource;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  metadata: Record<string, any>;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewLead {
  source: LeadSource;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  metadata?: Record<string, any>;
}

export function useLeads(options?: { autoFetch?: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      setError(error.message);
    } else if (data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchLeads();
    }
  }, []);

  // Realtime
  useEffect(() => {
    if (channelRef.current) return;

    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const newLead = payload.new as Lead;
          setLeads((prev) => {
            if (prev.some((l) => l.id === newLead.id)) return prev;
            return [newLead, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leads" },
        (payload) => {
          const updated = payload.new as Lead;
          setLeads((prev) =>
            prev.map((l) => (l.id === updated.id ? updated : l))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "leads" },
        (payload) => {
          const deletedId = (payload.old as any).id;
          setLeads((prev) => prev.filter((l) => l.id !== deletedId));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, []);

  const createLead = async (lead: NewLead): Promise<{ error: string | null; id?: string }> => {
    const { data: { user } } = await supabase.auth.getUser();

    const clean = (s?: string) => s?.replace(/[<>]/g, "").trim().slice(0, 500) || null;

    const payload = {
      user_id: user?.id ?? null,
      source: lead.source,
      name: clean(lead.name),
      email: clean(lead.email)?.toLowerCase() ?? null,
      phone: clean(lead.phone),
      company: clean(lead.company),
      message: clean(lead.message),
      metadata: lead.metadata || {},
      status: "new" as const,
    };

    const { data, error } = await supabase
      .from("leads")
      .insert(payload)
      .select("id")
      .single();

    if (error) return { error: error.message };
    return { error: null, id: data?.id };
  };

  const updateStatus = async (id: string, status: LeadStatus): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: error.message };
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    return { error: null };
  };

  const updateNotes = async (id: string, notes: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from("leads")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: error.message };
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
    return { error: null };
  };

  const deleteLead = async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return { error: error.message };
    setLeads((prev) => prev.filter((l) => l.id !== id));
    return { error: null };
  };

  const getBySource = (source: LeadSource) => leads.filter((l) => l.source === source);
  const getByStatus = (status: LeadStatus) => leads.filter((l) => l.status === status);

  return {
    leads,
    loading,
    error,
    refresh: fetchLeads,
    createLead,
    updateStatus,
    updateNotes,
    deleteLead,
    getBySource,
    getByStatus,
  };
}