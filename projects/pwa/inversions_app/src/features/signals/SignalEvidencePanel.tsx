import type { SourceVerdict } from "../../services/signals/signalApi";

interface SignalEvidencePanelProps {
  evidence: SourceVerdict[];
}

export function SignalEvidencePanel({ evidence }: SignalEvidencePanelProps) {
  if (evidence.length === 0) {
    return <p>No hay evidencia para mostrar.</p>;
  }

  return (
    <section style={{ border: "1px solid #d0d7de", borderRadius: 10, padding: "0.75rem" }}>
      <h2>Evidencia por fuente</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
        {evidence.map((item) => (
          <li key={item.sourceId} style={{ border: "1px solid #f0f3f6", borderRadius: 8, padding: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{item.sourceId}</strong>
              <span>{item.verdict}</span>
            </div>
            <p style={{ margin: "0.25rem 0", color: "#57606a" }}>{item.rationale}</p>
            <small style={{ color: "#57606a" }}>Confianza: {Math.round(item.confidence * 100)}%</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
