# Especificación Funcional: legaldev-mvp

## ADDED Requirements

### Requirement: Gestión de Roles y Auditoría de Cambios
El sistema SHALL permitir alternar entre el perfil Desarrollador y Cliente / Revisor, registrando cada modificación en el historial de cambios.

#### Scenario: Bloqueo de cláusulas en modo Revisor
- **WHEN** el usuario selecciona el rol Cliente / Revisor en la barra superior
- **THEN** los controles de configuración de las 5 reglas legales pasan a estado de solo lectura (disabled) y el sistema registra el cambio de perfil con marca de tiempo.

### Requirement: Cálculo de Bolsa de Horas y Validación
El sistema SHALL calcular automáticamente el valor mensual estimado a partir de las horas pactadas y la tarifa por hora, rechazando valores negativos.

#### Scenario: Cálculo estándar del caso demo
- **WHEN** el usuario ingresa 80 horas mensuales y una tarifa de 65000 COP
- **THEN** el sistema calcula y muestra $5.200.000 COP en el formulario y en la cláusula económica del contrato.

### Requirement: Regla R1 — Cesión Patrimonial Condicionada al Pago
El sistema SHALL adaptar la cláusula de titularidad económica según el estado de acreditación del pago (Ley 23 de 1982 y Decisión Andina 351).

#### Scenario: Pago pendiente de acreditación
- **WHEN** r1_pago_acreditado es false
- **THEN** el contrato genera la cláusula de Licencia de Uso Limitada manteniendo los derechos patrimoniales en cabeza del Contratista hasta el pago efectivo.

#### Scenario: Pago acreditado
- **WHEN** r1_pago_acreditado es true
- **THEN** el contrato genera la cláusula de Cesión Total y Exclusiva de Derechos Patrimoniales a favor del Contratante.

### Requirement: Regla R2 — Reserva Perpetua de Derechos Morales y Portafolio
El sistema SHALL incluir de manera obligatoria e inmutable la reserva de derechos morales y mención en portafolio (Ley 23 de 1982).

#### Scenario: Generación de cualquier contrato
- **WHEN** se renderiza el contrato en pantalla o PDF
- **THEN** aparece la cláusula declarando inalienables e irrenunciables los derechos de paternidad e integridad y autorizando la mención descriptiva en portafolio profesional sin divulgar código propietario.

### Requirement: Regla R3 — Secreto Empresarial / NDA
El sistema SHALL parametrizar la cláusula de confidencialidad y su vigencia poscontractual (Decisión Andina 486 y Ley 256 de 1996).

#### Scenario: Activación de NDA con plazo específico
- **WHEN** el usuario activa el NDA y selecciona 3 años de reserva poscontractual
- **THEN** el contrato incorpora la cláusula de secreto empresarial exigiendo no divulgación y borrado seguro de copias durante 3 años tras finalizar el contrato.

### Requirement: Regla R4 — Equivalencia Probatoria y Sello SHA-256
El sistema SHALL calcular y mostrar en vivo una huella hash SHA-256 sobre el contenido del contrato (Ley 527 de 1999).

#### Scenario: Alteración de datos contractuales
- **WHEN** el usuario modifica el nombre del contratante o el número de horas
- **THEN** el sistema recalcula automáticamente un nuevo hash SHA-256 de 64 caracteres hexadecimales en el pie de página del contrato.

### Requirement: Regla R5 — Garantía de Ciberseguridad y Ausencia de Malware
El sistema SHALL incluir la garantía técnica contra código malicioso y el plazo de saneamiento de 30 días calendario (Ley 1273 de 2009).

#### Scenario: Emisión de cláusula de garantía técnica
- **WHEN** se visualiza el clausulado del contrato
- **THEN** figura explícitamente la garantía de software libre de malware, troyanos o puertas traseras y cobertura de corrección por 30 días calendario.

### Requirement: Persistencia, Interoperabilidad JSON y Exportación PDF
El sistema SHALL conservar el estado en localStorage, permitir exportar e importar JSON y generar salida limpia en PDF.

#### Scenario: Precarga y exportación del caso demo
- **WHEN** el usuario hace clic en Cargar Caso Demo y luego en Exportar PDF
- **THEN** se cargan los datos ficticios de NovaTech Solutions S.A.S. y LegalDev Team y se abre la vista limpia de impresión sin botones ni paneles laterales.
### Requirement: Firma Electrónica Remota y Enlace Compartible (Ley 527 de 1999)
El sistema SHALL permitir que Contratante y Contratista estampen su firma electrónica en pantalla y compartan el estado del contrato mediante una URL codificada.

#### Scenario: Firma remota mediante enlace compartible
- **WHEN** el usuario genera un enlace compartible y lo abre en otro navegador o dispositivo
- **THEN** el sistema carga automáticamente los datos del contrato en modo lectura, permite estampar la firma de la parte correspondiente, recalcula el hash SHA-256 e incluye la rúbrica en la exportación PDF y JSON.