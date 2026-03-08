import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      data-ocid="back_to_top.button"
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "#ff8c42",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(255,140,66,0.45)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(12px) scale(0.85)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#e87830";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(-2px) scale(1.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#ff8c42";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0) scale(1)";
      }}
    >
      <ChevronUp size={22} color="white" strokeWidth={2.5} />
    </button>
  );
}
