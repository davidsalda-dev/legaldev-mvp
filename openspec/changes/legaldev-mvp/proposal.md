# Propuesta de Cambio: legaldev-mvp

## Problema
Los desarrolladores de software independientes (freelancers) y pequeños equipos en Colombia suelen formalizar proyectos mediante acuerdos informales o plantillas genéricas que omiten disposiciones obligatorias de la legislación colombiana (cesión expresa de derechos patrimoniales, irrenunciabilidad de derechos morales, acuerdos de confidencialidad como medida razonable de secreto empresarial, equivalencia probatoria digital y garantías antimalware).

## Objetivo
Construir **LegalDev**, una aplicación web estática interactiva que guíe al usuario en la configuración y generación en tiempo real de Contratos de Prestación de Servicios de Desarrollo de Software bajo bolsa de horas, integrando automáticamente 5 reglas jurídicas colombianas, sello de integridad SHA-256 y exportación formal a PDF.

## Alcance (Incluye)
- Interfaz dividida: formulario guiado de 4 pasos (izquierda) y previsualización tipo hoja carta en vivo (derecha).
- Selector de roles operativos (*Desarrollador / Contratista* vs. *Cliente / Revisor*) con bloqueo de cláusulas legales en modo revisor.
- Precarga rápida del caso demo ficticio (*NovaTech Solutions S.A.S.* y *LegalDev Team* — CRM Web, 80h × $65.000 COP).
- Motor paramétrico de las 5 reglas legales obligatorias (E2).
- Cálculo en tiempo real de huella criptográfica SHA-256 mediante Web Crypto API.
- Persistencia automática en `localStorage`, bitácora de historial de cambios y exportación/importación de respaldo `.json`.
- Exportación limpia a documento PDF mediante vista de impresión optimizada (`@media print`).

## Fuera de Alcance (Excluye)
- Pasarelas de pagos reales o procesamiento bancario.
- Firma digital con certificado emitido por entidad de certificación abierta (ONAC).
- Contratos laborales con subordinación o dependencia.
- Bases de datos remotas o servidores backend (arquitectura 100% frontend estática desplegable en GitHub + Vercel y ejecutable en local).