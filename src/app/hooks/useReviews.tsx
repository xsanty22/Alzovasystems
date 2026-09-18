import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export interface Review {
  id: string;
  user_id: string | null;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export interface NewReview {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);
  const channelRef = useRef<any>(null);

  // Cargar reviews iniciales
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) setReviews(data as Review[]);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    // Evita doble suscripción en StrictMode
    if (channelRef.current) return;

    const channel = supabase
      .channel("reviews-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        (payload) => {
          const newReview = payload.new as Review;
          if (!newReview.is_approved) return;

          setReviews((prev) => {
            // Evita duplicados
            if (prev.some((r) => r.id === newReview.id)) return prev;
            return [newReview, ...prev];
          });

          // Contador de "nuevas reseñas"
          setLiveCount((c) => c + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "reviews" },
        (payload) => {
          const deletedId = (payload.old as any).id;
          setReviews((prev) => prev.filter((r) => r.id !== deletedId));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, []);

  // Crear nueva review
  const addReview = async (review: NewReview): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Debes iniciar sesión para dejar una reseña" };
    }

    // Sanitización básica
    const clean = (s?: string) => s?.replace(/[<>]/g, "").trim().slice(0, 500) || "";

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      name: clean(review.name) || user.email?.split("@")[0] || "Cliente",
      role: clean(review.role) || null,
      company: clean(review.company) || null,
      content: clean(review.content),
      rating: Math.max(1, Math.min(5, review.rating)),
      is_approved: true,
    });

    return { error: error?.message ?? null };
  };

  return { reviews, loading, addReview, liveCount };
}