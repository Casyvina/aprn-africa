import type { PipelineStatus } from "@/lib/pipelines/data";

const CONFIG: Record<PipelineStatus, { label: string; dot: string; text: string; border: string }> = {
  operating:    { label: "Operating",    dot: "#D4A017", text: "#E5B83B", border: "rgba(212,160,23,.25)" },
  proposed:     { label: "Proposed",     dot: "#C97A2B", text: "#e0a066", border: "rgba(201,122,43,.25)" },
  construction: { label: "Construction", dot: "#4a90c2", text: "#7db6de", border: "rgba(74,144,194,.25)" },
  shelved:      { label: "Shelved",      dot: "#7c8b98", text: "#7c8b98", border: "rgba(124,139,152,.2)" },
  cancelled:    { label: "Cancelled",    dot: "#7c8b98", text: "#7c8b98", border: "rgba(124,139,152,.2)" },
  retired:      { label: "Retired",      dot: "#7c8b98", text: "#7c8b98", border: "rgba(124,139,152,.2)" },
};

export default function StatusPill({ status }: { status: PipelineStatus }) {
  const c = CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 10, fontWeight: 700, letterSpacing: "1.3px",
        textTransform: "uppercase", padding: "5px 10px",
        border: `1px solid ${c.border}`, color: c.text,
      }}
    >
      <span style={{ width: 6, height: 6, flexShrink: 0, background: c.dot }} />
      {c.label}
    </span>
  );
}
