import React, { useState, useEffect } from "react";
import { BarChart2, BookOpen, TrendingUp, Building2, Newspaper, Cpu, Play } from "lucide-react";
import { getMarketQuotes } from "../../../services/signals/marketApi";
import {
  runSimulation,
  ALL_CORES,
  ALL_SUBCORES,
  CANONICAL_ESTRATEGIAS,
  type CoreId,
  type SubCoreIndicador,
  type SimulationRequestPayload,
  type SimulationResponse
} from "../../../services/signals/confluenceTableApi";
import { TermStrategyModal, type TermStrategyParams } from "./TermStrategyModal";
import { CoverageParamsModal, type CoverageModalParams } from "./CoverageParamsModal";

// ─── Google Fonts ──────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("sim-panel-fonts")) return;
    const link = document.createElement("link");
    link.id = "sim-panel-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ─── Panel CSS (pseudo-selectors, transitions) ─────────────────────────────────
const PANEL_CSS = `
  .sim-panel * { box-sizing: border-box; }
  .sim-panel { font-family: 'Space Grotesk', system-ui, sans-serif; }
  .sim-field-input {
    width: 100%;
    padding: 7px 10px;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-tertiary);
    border-radius: 8px;
    color: var(--color-text-primary);
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    -webkit-appearance: none;
    appearance: none;
  }
  .sim-field-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 2px rgba(83,74,183,0.15);
  }
  .sim-field-input:hover:not(:focus) {
    border-color: var(--color-border-secondary);
  }
  .sim-date-input {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 12px;
  }
  .sim-select-input {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
    cursor: pointer;
  }
  .sim-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px 5px 8px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
    border-width: 1px;
    border-style: solid;
  }
  .sim-chip:hover { opacity: 0.82; }
  .sim-seg-btn {
    flex: 1;
    padding: 6px 8px;
    border: none;
    font-weight: 600;
    font-size: 11px;
    cursor: pointer;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .sim-exec-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 20px;
    background: #534AB7;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.03em;
    transition: background 0.15s ease, transform 0.15s ease;
    white-space: nowrap;
  }
  .sim-exec-btn:hover:not(:disabled) {
    background: #3f379a;
    transform: translateY(-1px);
  }
  .sim-exec-btn:active:not(:disabled) { transform: translateY(0); }
  .sim-exec-btn:disabled { opacity: 0.6; cursor: not-allowed; }
`;

// ─── Meta ──────────────────────────────────────────────────────────────────────
const CORE_META: Record<CoreId, { label: string; icon: React.ReactNode; tooltip: string }> = {
  A_INDICADORES:  { label: "Indicadores",   icon: <BarChart2 size={13} />,  tooltip: "Señales técnicas clásicas (RSI, MACD, EMA). Analiza momentum y tendencia a través de indicadores matemáticos." },
  A_FUNDAMENTAL:  { label: "Fundamental",   icon: <BookOpen size={13} />,   tooltip: "Datos de balance, ingresos y valoración. Evalúa la salud económica y el valor intrínseco de la empresa." },
  A_TECNICO:      { label: "Técnico",       icon: <TrendingUp size={13} />, tooltip: "Patrones de precio y volumen en el chart. Detecta soportes, resistencias y formaciones técnicas clave." },
  A_INSTITUCIONAL:{ label: "Institucional", icon: <Building2 size={13} />,  tooltip: "Actividad de grandes capitales: fondos, opciones institucionales y flujo de dinero inteligente (smart money)." },
  A_NOTICIAS:     { label: "Noticias",      icon: <Newspaper size={13} />,  tooltip: "Sentimiento del mercado basado en noticias y eventos recientes que afectan directamente al ticker." },
  A_IA:           { label: "IA",            icon: <Cpu size={13} />,        tooltip: "Motor de inteligencia artificial que sintetiza señales multi-fuente y detecta patrones no lineales." },
};

const SUBCORE_TOOLTIP: Record<string, string> = {
  RSI:  "Relative Strength Index — mide si el activo está sobrecomprado (>70) o sobrevendido (<30).",
  MACD: "Moving Average Convergence/Divergence — señal de cambio de tendencia por cruce de medias exponenciales.",
  EMA:  "Exponential Moving Average — media dinámica que pondera más el precio reciente para reducir el ruido.",
  ADX:  "Average Directional Index — cuantifica la fuerza de la tendencia sin importar su dirección.",
  BB:   "Bandas de Bollinger — mide volatilidad y marca niveles dinámicos de soporte y resistencia.",
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--color-background-primary)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-secondary)",
          borderRadius: "8px",
          padding: "0.45rem 0.65rem",
          fontSize: "11px",
          lineHeight: 1.5,
          whiteSpace: "normal",
          width: "180px",
          textAlign: "center",
          zIndex: 100,
          pointerEvents: "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
        }}>
          {text}
          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid var(--color-border-secondary)",
          }} />
        </div>
      )}
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <span style={{
        fontSize: "10px",
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
        color: "var(--color-text-tertiary)",
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

const RISK_OPTS: Array<{ key: "BAJO" | "MEDIO" | "ALTO"; label: string; activeColor: string; activeBg: string }> = [
  { key: "BAJO",  label: "Bajo",  activeColor: "#166534", activeBg: "#DCFCE7" },
  { key: "MEDIO", label: "Medio", activeColor: "#3C3489", activeBg: "#EEEDFE" },
  { key: "ALTO",  label: "Alto",  activeColor: "#9A3412", activeBg: "#FFEDD5" },
];

function RiskSegmented({ value, onChange }: { value: "BAJO" | "MEDIO" | "ALTO"; onChange: (v: "BAJO" | "MEDIO" | "ALTO") => void }) {
  return (
    <div style={{
      display: "flex",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid var(--color-border-tertiary)",
      height: "33px",
    }}>
      {RISK_OPTS.map((opt, i) => (
        <button
          key={opt.key}
          type="button"
          className="sim-seg-btn"
          onClick={() => onChange(opt.key)}
          aria-pressed={value === opt.key}
          style={{
            borderLeft: i > 0 ? "1px solid var(--color-border-tertiary)" : "none",
            background: value === opt.key ? opt.activeBg : "var(--color-background-secondary)",
            color: value === opt.key ? opt.activeColor : "var(--color-text-tertiary)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  icon,
  label,
  tooltip,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  tooltip: string;
}) {
  return (
    <Tooltip text={tooltip}>
      <button
        type="button"
        className="sim-chip"
        onClick={onClick}
        aria-pressed={active}
        style={{
          background:   active ? "#EEEDFE" : "var(--color-background-secondary)",
          borderColor:  active ? "#AFA9EC" : "var(--color-border-tertiary)",
          color:        active ? "#3C3489" : "var(--color-text-tertiary)",
        }}
      >
        <span style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: active ? "#534AB7" : "var(--color-border-secondary)",
          flexShrink: 0,
          display: "inline-block",
          transition: "background 0.15s ease",
        }} />
        {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
        {label}
      </button>
    </Tooltip>
  );
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const TERM_STRATEGIES = new Set(["CALENDAR_SPREAD", "DIAGONAL_SPREAD"]);
function isTermStrategy(e: string): boolean { return TERM_STRATEGIES.has(e); }
function isCoverageStrategy(e: string): boolean { return e === "COVERED_CALL"; }

const DEFAULT_TERM_PARAMS: TermStrategyParams = {
  optionStyle: "CALL",
  strikeShort: 0,
  strikeLong: 0,
  expirationShort: new Date().toISOString().slice(0, 10),
  expirationLong: new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10),
  premiumShort: 0,
  premiumLong: 0,
  contracts: 1,
  riskFreeRate: 0.05
};

const DEFAULT_COVERAGE_PARAMS: CoverageModalParams = {
  currentPrice: 0,
  shares: 100,
  riskTolerancePct: 0.05,
};

type Preset = "2A" | "1A" | "6M" | "3M" | "1M";
const PRESETS: Preset[] = ["2A", "1A", "6M", "3M", "1M"];
const TIMEFRAMES: Array<"1m" | "5m" | "15m" | "1h" | "4h" | "1d"> = ["1m", "5m", "15m", "1h", "4h", "1d"];

function isoToday(): string { return new Date().toISOString().slice(0, 10); }
function isoPlusDays(days: number): string { return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10); }

// ─── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  ticket: string;
  onResult: (result: SimulationResponse) => void;
  onExecute?: (activeCoreIds: CoreId[]) => void;
  onStrategyChange?: (estrategia: string) => void;
  onCoverageParamsConfirmed?: (params: CoverageModalParams, kind: string) => void;
}

// ─── Main component ────────────────────────────────────────────────────────────
export function SimulationControlPanel({ ticket, onResult, onExecute, onStrategyChange, onCoverageParamsConfirmed }: Props) {
  useFonts();

  const [preset, setPreset]               = useState<Preset>("3M");
  const [estrategiaFrom, setEstrategiaFrom] = useState(isoToday());
  const [estrategiaTo, setEstrategiaTo]   = useState(isoPlusDays(30));
  const [temporalidad, setTemporalidad]   = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d">("1h");
  const [estrategia, setEstrategia]       = useState("IRON_CONDOR");
  const [tolerancia, setTolerancia]       = useState<"BAJO" | "MEDIO" | "ALTO">("MEDIO");
  const [coresOn, setCoresOn]             = useState<Record<CoreId, boolean>>(
    ALL_CORES.reduce((acc, c) => ({ ...acc, [c]: true }), {} as Record<CoreId, boolean>)
  );
  const [indicadoresOn, setIndicadoresOn] = useState<Record<SubCoreIndicador, boolean>>(
    ALL_SUBCORES.reduce((acc, s) => ({ ...acc, [s]: true }), {} as Record<SubCoreIndicador, boolean>)
  );
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [termParams, setTermParams]       = useState<TermStrategyParams>(DEFAULT_TERM_PARAMS);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [coverageParams, setCoverageParams]       = useState<CoverageModalParams>(DEFAULT_COVERAGE_PARAMS);

  useEffect(() => {
    if (!coverageModalOpen || coverageParams.currentPrice > 0) return;
    getMarketQuotes([ticket])
      .then((data) => {
        const q = data.quotes.find((qt) => qt.symbol === ticket.toUpperCase());
        if (q && q.price > 0) setCoverageParams((prev) => ({ ...prev, currentPrice: q.price }));
      })
      .catch(() => { /* user can enter manually */ });
  }, [coverageModalOpen, ticket, coverageParams.currentPrice]);

  const handleEstrategiaChange = (e: string) => {
    setEstrategia(e);
    onStrategyChange?.(e);
    if (isTermStrategy(e)) setTermModalOpen(true);
    else if (isCoverageStrategy(e)) setCoverageModalOpen(true);
  };

  const toggleCore = (c: CoreId) => setCoresOn((prev) => ({ ...prev, [c]: !prev[c] }));
  const toggleSub  = (s: SubCoreIndicador) => setIndicadoresOn((prev) => ({ ...prev, [s]: !prev[s] }));

  const run = async () => {
    setLoading(true);
    setError(null);
    const activeCoreIds = ALL_CORES.filter((c) => coresOn[c]);
    onExecute?.(activeCoreIds);
    try {
      const payload: SimulationRequestPayload = {
        ticket,
        rangoHistorico: preset,
        rangoEstrategia: { from: estrategiaFrom, to: estrategiaTo },
        temporalidad,
        runtimeMode: "OFFLINE",
        coresHabilitados: ALL_CORES.filter((c) => coresOn[c]),
        indicadoresHabilitados: ALL_SUBCORES.filter((s) => indicadoresOn[s]),
        estrategia,
        toleranciaRiesgo: tolerancia
      };
      const result = await runSimulation(payload);
      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "simulation_failed");
    } finally {
      setLoading(false);
    }
  };

  const periodDays = Math.max(
    0,
    Math.round((new Date(estrategiaTo).getTime() - new Date(estrategiaFrom).getTime()) / 86_400_000)
  );

  const sectionLabel: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--color-text-tertiary)",
    display: "block",
    marginBottom: "8px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
  };

  return (
    <>
      <style>{PANEL_CSS}</style>

      <section className="card sim-panel" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid var(--color-border-tertiary)",
        }}>
          <span style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--color-text-tertiary)",
          }}>
            Panel de control · Simulación
          </span>
          <span style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "20px",
            background: "#1D9E75",
            color: "#E1F5EE",
            letterSpacing: "0.02em",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {estrategia.replace(/_/g, " ")}
          </span>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>

          {/* Row 1 — 3 cols */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <FieldLabel label="Rango Histórico">
              <select
                className="sim-field-input sim-select-input"
                value={preset}
                onChange={(e) => setPreset(e.target.value as Preset)}
              >
                {PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FieldLabel>

            <FieldLabel label="Estrategia Desde">
              <input
                type="date"
                className="sim-field-input sim-date-input"
                value={estrategiaFrom}
                onChange={(e) => setEstrategiaFrom(e.target.value)}
              />
            </FieldLabel>

            <FieldLabel label="Estrategia Hasta">
              <input
                type="date"
                className="sim-field-input sim-date-input"
                value={estrategiaTo}
                onChange={(e) => setEstrategiaTo(e.target.value)}
              />
            </FieldLabel>
          </div>

          {/* Row 2 — 3 cols */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <FieldLabel label="Temporalidad">
              <select
                className="sim-field-input sim-select-input"
                value={temporalidad}
                onChange={(e) => setTemporalidad(e.target.value as typeof temporalidad)}
              >
                {TIMEFRAMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FieldLabel>

            <FieldLabel label="Estrategia">
              <select
                className="sim-field-input sim-select-input"
                value={estrategia}
                onChange={(e) => handleEstrategiaChange(e.target.value)}
              >
                {CANONICAL_ESTRATEGIAS.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </FieldLabel>

            <FieldLabel label="Tolerancia al Riesgo">
              <RiskSegmented value={tolerancia} onChange={setTolerancia} />
            </FieldLabel>
          </div>

          {/* Divider */}
          <hr style={{ border: "none", borderTop: "1px solid var(--color-border-tertiary)", margin: "2px 0" }} />

          {/* Cores de Análisis */}
          <div>
            <span style={sectionLabel}>Cores de Análisis</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ALL_CORES.map((c) => {
                const { label, icon, tooltip } = CORE_META[c];
                return (
                  <ChipButton
                    key={c}
                    active={coresOn[c]}
                    onClick={() => toggleCore(c)}
                    icon={icon}
                    label={label}
                    tooltip={tooltip}
                  />
                );
              })}
            </div>
          </div>

          {/* Indicadores Técnicos */}
          <div>
            <span style={sectionLabel}>Indicadores Técnicos</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ALL_SUBCORES.map((s) => (
                <ChipButton
                  key={s}
                  active={indicadoresOn[s]}
                  onClick={() => toggleSub(s)}
                  label={s}
                  tooltip={SUBCORE_TOOLTIP[s] ?? s}
                />
              ))}
            </div>
          </div>

          {error && (
            <div style={{ color: "var(--color-sell, #ef4444)", fontSize: "12px", fontWeight: 500 }}>
              Error: {error}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderTop: "1px solid var(--color-border-tertiary)",
          background: "var(--color-background-secondary)",
          gap: "12px",
        }}>
          <span style={{
            fontSize: "11px",
            color: "var(--color-text-tertiary)",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}>
            Estrategia activa:{" "}
            <strong style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
              {estrategia.replace(/_/g, " ")}
            </strong>
            {" · "}Periodo:{" "}
            <strong style={{ color: "var(--color-text-secondary)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
              {periodDays} días
            </strong>
          </span>

          <button
            type="button"
            className="sim-exec-btn"
            onClick={run}
            disabled={loading}
          >
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "6px",
              background: "rgba(255,255,255,0.18)",
              flexShrink: 0,
            }}>
              <Play size={11} fill="currentColor" strokeWidth={0} />
            </span>
            {loading ? "Ejecutando…" : "Ejecutar Simulación"}
          </button>
        </div>
      </section>

      <TermStrategyModal
        open={termModalOpen}
        estrategia={estrategia}
        params={termParams}
        onChange={setTermParams}
        onClose={() => setTermModalOpen(false)}
      />
      <CoverageParamsModal
        open={coverageModalOpen}
        estrategia={estrategia}
        ticker={ticket}
        params={coverageParams}
        onChange={setCoverageParams}
        onClose={() => setCoverageModalOpen(false)}
        onConfirm={(params) => onCoverageParamsConfirmed?.(params, estrategia)}
      />
    </>
  );
}

export default SimulationControlPanel;
