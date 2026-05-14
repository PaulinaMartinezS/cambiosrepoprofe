import React from "react";
import type { DashboardSignalCard } from "../../services/signals/signalApi";

interface SignalOverlayProps {
  cards: DashboardSignalCard[];
}

function badgeColor(signal: DashboardSignalCard["signal"]) {
  if (signal === "BUY") return "#1a7f37";
  if (signal === "SELL") return "#cf222e";
  return "#9a6700";
}

/**
 * FIC: Visual overlay for confluence signals by instrument/core confidence.
 * Provides quick operational scan for BUY/SELL/HOLD at a glance.
 *
 * FIC: Overlay visual de señales de confluencia por instrumento/confianza de core.
 * Provee escaneo operativo rápido de BUY/SELL/HOLD de un vistazo.
 */
export function SignalOverlay({ cards }: SignalOverlayProps) {
  return (
    <section>
      <h2>Overlay de señales</h2>
      <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {cards.map((card) => (
          <article key={card.signalId} style={{ border: "1px solid #d0d7de", borderRadius: 10, padding: "0.75rem" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{card.instrument}</strong>
              <span
                style={{
                  background: badgeColor(card.signal),
                  color: "white",
                  borderRadius: 999,
                  padding: "0.15rem 0.55rem",
                  fontSize: "0.75rem"
                }}
              >
                {card.signal}
              </span>
            </header>
            <p style={{ margin: "0.5rem 0", fontSize: "0.85rem", color: "#57606a" }}>
              Riesgo: {card.riskLevel} | Confluencia: {card.confluenceScore}
            </p>
            <small style={{ color: "#57606a" }}>Cores: {card.activeCores.join(", ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
