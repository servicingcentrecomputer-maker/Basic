import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import fallbackContent from "../../data/site.json";

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(fallbackContent);
  const [status, setStatus] = useState("loading");

  const refresh = useCallback(async (signal) => {
    try {
      const response = await fetch("/api/content", {
        signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Content request failed with ${response.status}`);
      }

      const data = await response.json();
      if (!data?.profile || !Array.isArray(data?.projects)) {
        throw new Error("Content response did not match the expected shape");
      }

      setContent(data);
      setStatus("live");
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      console.warn("[content] Using the bundled snapshot because the API was unavailable.", error);
      setStatus("fallback");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const value = useMemo(
    () => ({ content, status, refresh }),
    [content, refresh, status]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const value = useContext(SiteContentContext);
  if (!value) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }
  return value;
}
