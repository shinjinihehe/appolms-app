import { useState, useCallback } from "react";
import { useApp } from "../app/context/AppContext";
import { useAuth } from "../app/context/AuthContext";

export function useFilters() {
  const { baseUrl } = useApp();
  const { token } = useAuth();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiltersData = useCallback(async () => {
    if (!baseUrl || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      // Fetch categories
      const catRes = await fetch(`${baseUrl}/api/all_categories`, { headers });
      const catData = catRes.ok ? await catRes.json() : [];

      // Fetch languages
      const langRes = await fetch(`${baseUrl}/api/languages`, { headers });
      const langData = langRes.ok ? await langRes.json() : [];

      // Laravel may return an associative object (not a proper JSON array), so we normalize to array
      setCategories(Array.isArray(catData) ? catData : Object.values(catData || {}));
      setLanguages(Array.isArray(langData) ? langData : Object.values(langData || {}));
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token]);

  return {
    categories,
    languages,
    isLoading,
    error,
    fetchFiltersData,
  };
}

