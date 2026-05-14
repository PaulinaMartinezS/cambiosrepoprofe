import React, { useMemo, useState } from "react";
import {
  getDashboardOrchestrator,
  type DashboardOrchestratorResponse,
  type DashboardSignalCard
} from "../../services/signals/signalApi";
import { CoreSelector, type CoreDefinition } from "./CoreSelector";
import { SignalOverlay } from "./SignalOverlay";
import { ExplainabilityTable } from "./ExplainabilityTable";
import { SignalEvidencePanel } from "../signals/SignalEvidencePanel";

const initialCores: CoreDefinition[] = [
  { id: "technical", label: "Technical", description: "Momentum y estructura", enabled: true },
  { id: "options", label: "Options", description: "Flujo y skew", enabled: true },
  { id: "flow", label: "Institutional Flow", description: "UOA/bloques", enabled: true },
  { id: "news", label: "News", description: "Sentimiento y eventos", enabled: true },
  { id: "ai", label: "AI", description: "Confirmación IA", enabled: true }
];

/**
 * FIC: Main operational dashboard with instrument/timeframe filters and confluence views.
 * Integrates orchestrator API payload with overlays, explainability and evidence panel.
 *
 * FIC: Dashboard operativo principal con filtros de instrumento/timeframe y vistas de confluencia.
 * Integra payload de API orquestador con overlays, explicabilidad y panel de evidencia.
 */
export function MainDashboard() {
  const [timeframe, setTimeframe] = useState("1d");
  const [instrumentsInput, setInstrumentsInput] = useState("AAPL,MSFT,NVDA,SPY");
  const [cores, setCores] = useState<CoreDefinition[]>(initialCores);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<DashboardOrchestratorResponse | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<DashboardSignalCard | null>(null);

  const activeCoreCount = useMemo(() => cores.filter((core) => core.enabled).length, [cores]);

  const refreshDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDashboardOrchestrator({
        instruments: instrumentsInput,
        timeframe
      });

      setPayload(response);
      setSelectedSignal(response.cards[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar dashboard");
    } finally {
      setLoading(false);
    }
  };

  const toggleCore = (coreId: string) => {
    setCores((prev) => prev.map((core) => (core.id === coreId ? { ...core, enabled: !core.enabled } : core)));
  };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
      <header style={{ marginBottom: "1rem" }}>
        <h1>Dashboard de Confluencia</h1>
        <p style={{ color: "#57606a" }}>
          Monitoreo operativo por instrumento y broker con evidencia y score consolidado.
        </p>
      </header>

      <section style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "2fr 1fr 1fr auto", marginBottom: "1rem" }}>
        <input
          value={instrumentsInput}
          onChange={(event) => setInstrumentsInput(event.target.value)}
          placeholder="AAPL,MSFT,NVDA"
        />
        <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
          <option value="15m">15m</option>
          <option value="1h">1h</option>
          <option value="4h">4h</option>
          <option value="1d">1d</option>
        </select>
        <input value={`${activeCoreCount} cores activos`} disabled />
        <button onClick={refreshDashboard} disabled={loading}>
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </section>

      <CoreSelector cores={cores} onToggle={toggleCore} />

      {error ? <p style={{ color: "#cf222e" }}>{error}</p> : null}

      {payload ? (
        <>
          <SignalOverlay cards={payload.cards} />
          <ExplainabilityTable cards={payload.cards} />

          <section style={{ marginTop: "1rem" }}>
            <h2>Detalle de evidencia</h2>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              {payload.cards.map((card) => (
                <button key={card.signalId} onClick={() => setSelectedSignal(card)}>
                  {card.instrument}
                </button>
              ))}
            </div>
            <SignalEvidencePanel evidence={selectedSignal?.evidence ?? []} />
          </section>
        </>
      ) : (
        <p style={{ color: "#57606a" }}>Presiona Actualizar para cargar el dashboard.</p>
      )}
    </main>
  );
}
