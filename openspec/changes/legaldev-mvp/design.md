# Diseño Técnico y Arquitectura: legaldev-mvp

## 1. Decisiones de Arquitectura
- **Frontend Estático Puro:** `index.html`, `styles.css` y `app.js` utilizando Tailwind CSS vía CDN (`https://cdn.tailwindcss.com`) para lograr una interfaz moderna, responsiva y limpia sin pasos de compilación complejos, garantizando despliegue directo en GitHub + Vercel y apertura local inmediata (`file://`).
- **Estado Centralizado (`state`):** Un único objeto JavaScript (`contractState`) sincronizado bidireccionalmente con los inputs del DOM y persistido automáticamente en `localStorage` bajo la clave `legaldev_state_v1`.
- **Motor de Plantillas Jurídicas:** Funciones puras en `app.js` que interpolan los datos del estado y evalúan las condiciones lógicas de las 5 reglas (`R1` a `R5`) para renderizar HTML semántico dentro del contenedor `#contract-preview`.
- **Criptografía en Navegador:** Uso asíncrono de `crypto.subtle.digest('SHA-256', encoder.encode(textoContrato))` para actualizar el hash cada vez que cambia el estado.
- **Estilos de Impresión (`@media print`):** Ocultamiento total de la barra superior, el panel izquierdo de formulario y botones auxiliares al imprimir, ajustando `#contract-preview` al 100% del ancho de página con márgenes legales estándar.

## 2. Seguridad y Privacidad de Datos (Ley 1581 de 2012)
- Ningún dato ingresado se envía a servidores externos.
- Los datos precargados en el botón *Cargar Caso Demo* son 100% ficticios (*NovaTech Solutions S.A.S.*, NIT `901.888.777-1`).
- Incluye banner permanente de descargo de responsabilidad académica y legal.