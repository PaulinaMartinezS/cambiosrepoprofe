# 📜 Constitución del Proyecto
## Plataforma de Inversiones y Desarrollo de Aplicaciones Asistidas por IA

---

## 1. Metadatos

- **Nombre del Proyecto**: Plataforma de Inversiones con IA (DR.FIC)
- **Tipo**: PWA + REST API + IA Copilot
- **Versión**: 1.0.0
- **Estado**: Activa
- **Última Enmienda**: 2026-04-21
- **Repositorio**: (definir)
- **Autor / Responsable**: Dr. Francisco Ibarra Carlos
- **Framework de Desarrollo**:
  - Spec‑Driven Development (SpecKit / Specify)
  - AI Skill Development & Spec Driven Assistance AI (Framework DR.FIC)

---

## 2. Propósito Supremo

Este proyecto existe para **desarrollar aplicaciones complejas de forma trazable, auditable y gobernada**, utilizando Inteligencia Artificial como **asistente especializada**, **nunca como sustituto del criterio humano**.

En particular:
- Facilitar el desarrollo de plataformas de inversión con análisis técnico, opciones y confirmación por IA.
- Facilitar el desarrollo de plataformas educativas con contenido estructurado y copilotos IA conectados a datos reales.
- Garantizar que toda decisión técnica, financiera o de arquitectura sea **explicable, validable y reversible**.

---

## 3. Principios Fundamentales (NO negociables)

1. **Decisión Humana Primero**  
   Ningún sistema ejecuta operaciones financieras ni cambios críticos sin aprobación humana explícita.

2. **IA como Asistente, no como Autoridad**  
   La IA propone, analiza y valida; el humano decide.

3. **Trazabilidad Total**  
   Toda acción relevante debe estar ligada a:
   - SPEC
   - Ticket
   - Knowledge
   - Evidencia

4. **Validación Antes de Ejecución**  
   No se implementa ni ejecuta código, migraciones o señales sin gates aprobados.

5. **Degradación Elegante**  
   Fallos de APIs, IA o datos nunca deben colapsar el sistema.

6. **Separación de Responsabilidades**  
   - PWA = contrato, visualización, lógica cliente
   - REST API = persistencia real y ejecución
   - IA = análisis y apoyo

7. **Simplicidad Controlada (YAGNI)**  
   No se implementa complejidad sin justificación documentada.

---

## 4. Alcance y Límites

### Incluye
- Desarrollo de PWA y APIs REST.
- Integración con brokers (IBKR, Alpaca).
- Análisis técnico, estrategias de opciones y señales.
- Uso de IA (Claude u otros) para análisis y confirmación.
- Plataforma educativa con contenidos y copiloto IA.
- Uso de agentes IA documentados y gobernados.

### Excluye explícitamente
- Trading automático sin aprobación humana.
- Gestión de capital real sin validación manual.
- Inferencias de IA sin explicación o trazabilidad.
- Credenciales, secretos o claves en código o documentación.

---

## 5. Gobierno de Agentes de IA

- Los agentes (Picoro, Goku, Vegeta, Bulma, Krillin) son **roles documentados**, no entidades autónomas sin control.
- Todo agente:
  - DEBE declarar skill activo
  - DEBE mostrar cabecera de actividad
  - DEBE dejar evidencia de salida
- El orden operativo es obligatorio:
  **Picoro → Goku → (Vegeta ∥ Bulma) → Aprobación**

Violaciones a este flujo bloquean el avance del trabajo.

---

## 6. Gates Obligatorios

Ningún trabajo puede avanzar sin cumplir los gates definidos, entre ellos:

- PROJECT START MODE GATE
- PROJECT CONTEXT INTAKE GATE
- DATABASE SELECTION GATE
- DATABASE MODEL GATE
- SPECIFICATION GATE
- TICKET START AUTHORIZATION GATE

Un gate rechazado **detiene el sistema**.

---

## 7. Reglas Técnicas y de Calidad

- Código fuente en `src/`
- Comentarios obligatorios con prefijo `FIC` (EN/ES)
- API keys y secretos solo en `.env` (gitignored)
- Validación de indicadores contra fuentes externas (ej. TradingView)
- Tests obligatorios para lógica crítica
- Naming consistente y versionado SemVer

---

## 8. Riesgos y Mitigación

| Riesgo | Mitigación |
|------|-----------|
| Señales falsas | Confluencia + validación IA + confirmación humana |
| Fallo de broker | Broker secundario + fallback |
| Error de IA | Modo degradado + advertencia |
| Latencia | Optimización y throttling |
| Pérdida de trazabilidad | Gates y evidencia obligatoria |

---

## 9. Criterios de Éxito

- Precisión mínima de señales: ≥ 70 %
- Latencia crítica: < 500 ms (sin IA)
- Disponibilidad: ≥ 99 %
- 100 % de tickets cerrados con evidencia
- 0 credenciales expuestas en repositorio

---

## 10. Enmiendas y Versionado

- Toda modificación a esta Constitución:
  - Requiere revisión humana
  - Incrementa versión SemVer
  - Queda registrada en Git
- Ningún agente IA puede modificar esta Constitución sin instrucción explícita.

---

## 11. Precedencia

En caso de conflicto:

1. **Esta Constitución**
2. SPECIFICATION.md
3. Specs incrementales
4. Tickets
5. Código

Nada puede contradecir la Constitución.

---
``