---
name: diseno-legal-premium
description: Estándares de diseño LegalTech SaaS 2026 (Bento UI, Glassmorphism sutil, tipografía moderna y microinteracciones) para LegalDev.
---

# Sistema de Diseño LegalTech 2026 (LegalDev)

1. **Estética SaaS Contemporánea (Inspiración: Harvey AI, Linear, Vercel):**
   - **Paleta Cromática 2026:** Superficie base en gris alabastro ultraclaro (`#F9FAFB` / `bg-zinc-50`), paneles flotantes con efecto vidrio esmerilado sutil (`bg-white/80 backdrop-blur-md`), bordes de 1px de alta precisión (`border-zinc-200/80`) y sombras difusas multicapa (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]`).
   - **Acento LegalTech:** Índigo profundo (`#1E1B4B` / `indigo-950`) para autoridad institucional, combinado con acentos en azul eléctrico (`#2563EB`) para acciones principales y esmeralda (`#10B981`) para validación criptográfica SHA-256.
   - **Tipografía Dual de Alta Gama (Google Fonts):** Usa `Plus Jakarta Sans` o `Inter` (tracking ajustado `-0.02em`) para toda la interfaz SaaS, `JetBrains Mono` para valores en COP, horas, marcas de tiempo y el hash SHA-256, y `Newsreader` o `Lora` exclusivamente dentro del lienzo del contrato para dar autenticidad de documento notarial/jurídico.

2. **Arquitectura de Componentes Modernos:**
   - **Barra Superior Flotante (Command Header):** Diseño compacto estilo barra de herramientas moderna con selector de rol tipo *Segmented Control* (píldora deslizante entre *Desarrollador* y *Cliente/Revisor*), indicador de estado en vivo (*Autoguardado activo*) y botones con iconos vectoriales limpios (Lucide Icons vía CDN).
   - **Stepper Horizontal Moderno:** Reemplaza botones cuadrados antiguos por una barra de progreso conectada con indicadores circulares, estado activo con anillo luminoso (`ring-4 ring-blue-500/15`) y check verde al completar cada paso.
   - **Tarjetas de Reglas Legales (R1–R5) tipo Bento:** Cada regla legal debe presentarse como una tarjeta interactiva limpia con badge normativo (ej. `Ley 23/1982`, `Ley 527/1999`), descripción concisa y toggle switch moderno estilo iOS/Linear.
   - **Lienzo del Contrato (Paper Canvas):** Hoja tamaño carta centrada sobre un escritorio digital con textura de puntos sutiles (`bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]`), encabezado institucional moderno, sello de verificación SHA-256 estilizado como certificado digital en el pie de página y bloque de firmas limpio a dos columnas.

3. **Flujo de Cierre y Botón "Finalizado ✓":**
   - Al pulsar **Finalizado ✓** en el Paso 4:
     - Valida campos obligatorios y bloquea la edición del formulario mostrando una insignia de **"Documento Sellado y Listo para Firma"**.
     - Despliega un **Modal Moderno con Backdrop Blur** que presenta: resumen financiero (horas, tarifa, total COP), huella SHA-256 con botón de copiar animado, botón primario **Exportar PDF Oficial**, botón secundario **Descargar Respaldo .JSON** y opción **Desbloquear para Editar**.