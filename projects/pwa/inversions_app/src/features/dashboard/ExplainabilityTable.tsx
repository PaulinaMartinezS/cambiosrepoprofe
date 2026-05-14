import React from "react";
import type { DashboardSignalCard } from "../../services/signals/signalApi";

interface ExplainabilityTableProps {
  cards: DashboardSignalCard[];
}

/**
 * FIC: Explainability matrix with score, confidence and evidence source count.
 * Supports audit and operator decision with concise transparent metrics.
 *
 * FIC: Matriz de explicabilidad con score, confianza y conteo de fuentes de evidencia.
 * Soporta auditoría y decisión de operador con métricas concisas y transparentes.
 */
export function ExplainabilityTable({ cards }: ExplainabilityTableProps) {
  return (
    <section>
      <h2>Explicabilidad</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #d0d7de", padding: "0.5rem" }}>Instrumento</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #d0d7de", padding: "0.5rem" }}>Score</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #d0d7de", padding: "0.5rem" }}>Confianza</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #d0d7de", padding: "0.5rem" }}>Fuentes</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.signalId}>
              <td style={{ borderBottom: "1px solid #f0f3f6", padding: "0.5rem" }}>{card.instrument}</td>
              <td style={{ borderBottom: "1px solid #f0f3f6", padding: "0.5rem" }}>{card.confluenceScore}</td>
              <td style={{ borderBottom: "1px solid #f0f3f6", padding: "0.5rem" }}>{Math.round(card.confidence * 100)}%</td>
              <td style={{ borderBottom: "1px solid #f0f3f6", padding: "0.5rem" }}>{card.evidence.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
