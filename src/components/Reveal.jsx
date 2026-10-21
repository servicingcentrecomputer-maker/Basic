import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function Reveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  ...rest
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduceMotion);
  const ref = useRef(null);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const classes = [className, "reveal", visible ? "is-visible" : ""]
    .filter(Boolean)
    .join(" ");

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
