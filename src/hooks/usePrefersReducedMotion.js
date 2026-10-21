import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getPreference() {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
    ? window.matchMedia(QUERY).matches
    : false;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(getPreference);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const update = () => setReduced(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}
