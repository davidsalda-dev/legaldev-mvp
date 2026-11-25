# Reporte de Pruebas Automatizadas E2E — LegalDev

- **Fecha de ejecución:** 2026-11-24
- **Entorno:** Servidor HTTP local (`http://127.0.0.1:61520/index.html`) · Playwright (Python 3.14, Chromium headless)
- **Resultado global:** **PASS (3/3)**

---

## Caso 1 — Carga Demo NovaTech, Cálculo Mensual y Ausencia de Anglicismos
- **Estado:** **PASS**
- **Evidencia técnica:**
  - `#calc-monthly-total`: `$ 5.200.000`
  - `#summary-grid-value`: `$ 5.200.000`
  - Búsqueda de `"strictly"` en `#contract-preview` y `#deliverables`: `False`
  - Búsqueda de `"staging"` en `#contract-preview` y `#deliverables`: `False`

---

## Caso 2 — Recálculo de Hash SHA-256 ante Cambios en Reglas Operativas de Bolsa de Horas
- **Estado:** **PASS**
- **Evidencia de hashes SHA-256 (`#preview-sha256-hash`):**
  - **Estado inicial (`rollover`, `previa`, `3dias`):**
    `2a941e31e0f991d927d29c69788d9c94008129b57928e8ecfa6b8e8719a6a0fe`
  - **Tras cambiar `vigenciaHoras` → `vencen`:**
    `f8d9074f1a1edaf3d372aad66c6f7447912b025bbb32615d203394ab17600bd3`
  - **Tras cambiar `aprobacionExcedentes` → `bloqueo`:**
    `d689868f2086adef61e9fb35531857f4c71dcd17ae4b1a3d5a70d89b97e228f8`
  - **Tras cambiar `slaInsumos` → `5dias`:**
    `2013af4bc972e3ffbaec971d8977c231aee4897222fc91749e26f8b5c0a384e9`

---

## Caso 3 — Firma Electrónica (Ley 527/1999), Enlace Compartible (`#contract=...`) y Contexto Limpio
- **Estado:** **PASS**
- **Evidencia técnica:**
  - Firma tipográfica estampada como **Contratista** en el Paso 04.
  - Enlace generado mediante `#btn-share-link`: longitud total `36435` caracteres (con payload `#contract=...`).
  - Apertura en contexto limpio (`browser.new_context()`):
    - `#form-sidebar.editing-locked`: `True`
    - `#locked-edition-banner` visible: `True`
    - `vigenciaHoras`: `vencen` (`disabled=True`)
    - `aprobacionExcedentes`: `bloqueo` (`disabled=True`)
    - `slaInsumos`: `5dias` (`disabled=True`)
    - `hours_monthly`: `80`
    - `hourly_rate`: `65000`
    - Errores de consola del navegador (`console` / `pageerror`): `0`
