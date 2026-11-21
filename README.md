# LegalDev - Generador de Contratos de Desarrollo de Software (MVP Colombia)

**LegalDev** es una aplicación web estática e interactiva diseñada para desarrolladores de software independientes (freelancers) y pequeñas empresas tecnológicas en Colombia. Permite configurar y generar en tiempo real Contratos de Prestación de Servicios bajo la modalidad de **Bolsa de Horas**, garantizando la integración automática de 5 reglas jurídicas colombianas obligatorias, sello criptográfico de integridad SHA-256 y exportación formal a PDF.

---

## 🚀 Características Principales

- **Layout Dividido Interactivo:** Formulario guiado de 4 pasos a la izquierda (45%) y previsualización en vivo formato hoja carta a la derecha (55%).
- **Gestión de Roles:** Alterna entre el perfil *Desarrollador / Contratista* y *Cliente / Revisor* (con bloqueo automático de modificación en cláusulas legales R1-R5).
- **Carga de Caso Demo NovaTech:** Botón de un solo clic para precargar datos de un proyecto real ficticio (*NovaTech Solutions S.A.S.* - CRM Web, 80h × $65.000 COP).
- **Cálculo Financiero Dinámico:** Estimación en tiempo real del valor mensual de la bolsa de horas con validaciones de valores no negativos.
- **Sello de Integridad SHA-256:** Cálculo hash criptográfico en vivo mediante `Web Crypto API` que valida la autenticidad del contrato.
- **Bitácora de Auditoría:** Registro cronológico de todas las modificaciones con rol y timestamp.
- **Exportación e Interoperabilidad:** Exportación PDF limpia optimizada (`@media print`) y guardado/restauración de datos de respaldo en archivo `.json`.
- **Persistencia Local:** Sincronización automática de datos en `localStorage`.

---

## ⚖️ Motor de las 5 Reglas Legales Obligatorias (E2)

1. **Regla R1 — Cesión Patrimonial Condicionada al Pago** *(Ley 23 de 1982 / Decisión Andina 351)*: Condiciona la cesión de la propiedad económica del software a la acreditación efectiva del pago. En caso de pago pendiente, otorga una Licencia de Uso Limitada y Revocable.
2. **Regla R2 — Reserva Perpetua de Derechos Morales y Portafolio** *(Ley 23 de 1982)*: Mantiene inalienables los derechos de paternidad del desarrollador y autoriza expresamente la mención del proyecto en portafolio profesional sin revelar código propietario.
3. **Regla R3 — Secreto Empresarial y Confidencialidad NDA** *(Decisión Andina 486 / Ley 256 de 1996)*: Parametrización de cláusula de reserva con plazo de vigencia poscontractual configurable (1, 2, 3 o 5 años).
4. **Regla R4 — Equivalencia Probatoria y Mensajes de Datos** *(Ley 527 de 1999)*: Reconoce validez probatoria digital al documento mediante la incrustación del hash SHA-256 inmutable.
5. **Regla R5 — Garantía de Ciberseguridad y Ausencia de Malware** *(Ley 1273 de 2009)*: Garantía explícita de entrega de código libre de código malicioso o puertas traseras con cobertura de saneamiento por 30 días calendario.

---

## 🛠️ Ejecución Local

No requiere instalación de dependencias ni servidores backend (Arquitectura 100% Frontend Estática).

1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/legaldev.git
   ```
2. Abre el archivo `index.html` directamente en tu navegador web preferido (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
3. Opcionalmente, puedes ejecutarlo mediante extensiones como **Live Server** en VS Code.

---

## 🌐 Despliegue en Vercel o GitHub Pages

### Despliegue en Vercel
1. Sube tu proyecto a un repositorio de GitHub.
2. Ingresa a [Vercel](https://vercel.com) e importa el repositorio.
3. En la configuración del proyecto:
   - **Framework Preset:** Other
   - **Build Command:** *(dejar en blanco)*
   - **Output Directory:** `.` *(raíz)*
4. Haz clic en **Deploy**.

---

## 📄 Licencia y Descargo de Responsabilidad

Este proyecto se distribuye con fines pedagógicos y académicos. No constituye asesoría ni representación legal formal.
