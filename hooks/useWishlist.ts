import { useState, useCallback } from "react";
import { useApp } from "../app/context/AppContext";
import { useAuth } from "../app/context/AuthContext";

export function useWishlist() {
  const { baseUrl } = useApp();
  const { token } = useAuth();
  
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!baseUrl || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/my_wishlist`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlist(data || []);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token]);

  const toggleWishlist = async (courseId: string | number) => {
    if (!baseUrl || !token) return;
    try {
      const res = await fetch(`${baseUrl}/api/toggle_wishlist_items?course_id=${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      // Refetch wishlist after toggle
      await fetchWishlist();
      return data;
    } catch (err: any) {
      console.error(err);
    }
  };

  return {
    wishlist,
    isLoading,
    error,
    fetchWishlist,
    toggleWishlist,
  };
}
