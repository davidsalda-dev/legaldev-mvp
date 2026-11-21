# Plan de Tareas de Implementación: legaldev-mvp

- [ ] **Tarea 1 (Estructura Base):** Crear `index.html`, `styles.css` y `app.js` con layout dividido (45% formulario multipaso / 55% hoja carta de previsualización) y banner de descargo legal.
- [ ] **Tarea 2 (Gestión de Estado y Caso Demo):** Implementar `contractState`, persistencia automática en `localStorage`, botón *Cargar Caso Demo NovaTech* y selector de roles (*Desarrollador* vs. *Revisor*).
- [ ] **Tarea 3 (Formulario Multipaso y Bolsa de Horas):** Construir los 4 pasos de captura (Partes, Bolsa de Horas con cálculo automático y validación >= 0, Reglas Legales y Auditoría/Exportación).
- [ ] **Tarea 4 (Motor de las 5 Reglas Legales E2):** Codificar la generación dinámica de cláusulas `R1` (cesión condicionada al pago), `R2` (derechos morales inmutables), `R3` (NDA configurable), `R4` (validez mensaje de datos) y `R5` (garantía antimalware 30 días).
- [ ] **Tarea 5 (Sello SHA-256 y Bitácora):** Integrar `crypto.subtle.digest` para recalcular en vivo el hash SHA-256 en el pie de página y registrar cada cambio en el historial con usuario y timestamp.
- [ ] **Tarea 6 (Exportación PDF e Interoperabilidad JSON):** Configurar `@media print` en `styles.css` para impresión limpia a PDF y programar los botones de descargar y cargar respaldo `.json`.
- [ ] **Tarea 7 (Documentación y Despliegue):** Redactar `README.md` con instrucciones de ejecución local y pasos de despliegue en GitHub + Vercel.
- [x] **Tarea 8 (Firma Electrónica y Enlace Compartible Ley 527/1999):** Implementar pad de firma digital (canvas táctil/mouse y firma tipográfica), integración de firmas en el sello SHA-256 y generación de enlace compartible por URL.