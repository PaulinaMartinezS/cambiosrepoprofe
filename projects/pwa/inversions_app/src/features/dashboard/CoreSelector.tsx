import React from "react";

export interface CoreDefinition {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface CoreSelectorProps {
  cores: CoreDefinition[];
  onToggle: (coreId: string) => void;
}

/**
 * FIC: Selector for active analytical cores in dashboard confluence.
 * Allows operators to enable/disable strategy cores before refresh.
 *
 * FIC: Selector de cores analíticos activos en la confluencia del dashboard.
 * Permite a operadores habilitar/deshabilitar cores antes de refrescar.
 */
export function CoreSelector({ cores, onToggle }: CoreSelectorProps) {
  return (
    <section>
      <h2>Cores activos</h2>
      <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {cores.map((core) => (
          <label
            key={core.id}
            style={{ border: "1px solid #d0d7de", borderRadius: 8, padding: "0.75rem", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={core.enabled}
              onChange={() => onToggle(core.id)}
              style={{ marginRight: 8 }}
            />
            <strong>{core.label}</strong>
            <p style={{ margin: "0.35rem 0 0", color: "#57606a", fontSize: "0.85rem" }}>{core.description}</p>
          </label>
        ))}
      </div>
    </section>
  );
}
