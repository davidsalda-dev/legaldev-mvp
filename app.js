/* app.js - Lógica LegalTech SaaS 2026 para LegalDev */

// ESTADO CENTRALIZADO DEL CONTRATO
const STORAGE_KEY = 'legaldev_state_v1';

const defaultState = {
  role: 'developer', // 'developer' | 'reviewer'
  currentStep: 1,
  isLocked: false,   // Bloqueo de edición al finalizar

  // Datos Contratante (Cliente)
  client_name: '',
  client_id: '',
  client_rep: '',
  client_city: '',
  client_email: '',

  // Datos Contratista (Desarrollador)
  dev_name: '',
  dev_id: '',
  dev_city: '',
  dev_email: '',

  // Alcance y Bolsa de Horas
  contract_scope: '',
  hours_monthly: 0,
  hourly_rate: 0,
  contract_duration: 1,
  start_date: new Date().toISOString().split('T')[0],
  deliverables: '',

  // Reglas Operativas Bolsa de Horas
  vigenciaHoras: 'vencen',
  aprobacionExcedentes: 'previa',
  slaInsumos: '3dias',

  // Reglas Legales E2
  rule_r1_paid: false,
  rule_r3_active: true,
  rule_r3_years: 3,

  // Firmas Electrónicas (Ley 527/1999)
  signatures: {
    client: null,
    dev: null
  },

  // Auditoría e Historial
  auditLog: [],
  currentHash: ''
};

let contractState = { ...defaultState };

// DATOS DEMO: NOVATECH SOLUTIONS S.A.S.
const demoData = {
  client_name: 'NovaTech Solutions S.A.S.',
  client_id: '901.888.777-1',
  client_rep: 'Carlos Eduardo Mendoza',
  client_city: 'Bogotá D.C.',
  client_email: 'contacto@novatech.co',

  dev_name: 'LegalDev Team / Juan Pablo Pérez',
  dev_id: '1.098.765.432',
  dev_city: 'Medellín',
  dev_email: 'dev@legaldev.co',

  contract_scope: 'Desarrollo, pruebas e implementación del módulo principal de gestión de clientes CRM Web con panel analítico y API REST.',
  hours_monthly: 80,
  hourly_rate: 65000,
  contract_duration: 3,
  start_date: new Date().toISOString().split('T')[0],
  deliverables: 'Repositorio de código fuente en GitHub, API REST documentada, despliegue en ambiente de pruebas y capacitación técnica de 2 horas.',

  vigenciaHoras: 'rollover',
  aprobacionExcedentes: 'previa',
  slaInsumos: '3dias',

  rule_r1_paid: false,
  rule_r3_active: true,
  rule_r3_years: 3,

  signatures: {
    client: null,
    dev: null
  }
};

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  const loadedFromUrl = loadStateFromUrlHash();
  if (!loadedFromUrl && !contractState.client_name) {
    loadDemoData(false);
  }
  setupEventListeners();
  renderAll();
  refreshIcons();
});

window.addEventListener('hashchange', () => {
  loadStateFromUrlHash();
});

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// SISTEMA DE NOTIFICACIONES TOAST SAAS 2026
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'warning' ? 'bg-amber-900/90 border-amber-600 text-amber-100' :
                  type === 'error' ? 'bg-rose-950/90 border-rose-600 text-rose-100' :
                  'bg-[#0F2E28] border-emerald-500/50 text-white';

  const iconName = type === 'warning' ? 'alert-triangle' : type === 'error' ? 'x-circle' : 'check-circle-2';
  const iconColor = type === 'warning' ? 'text-amber-400' : type === 'error' ? 'text-rose-400' : 'text-emerald-400';

  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold fade-in-fast ${bgClass}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 ${iconColor} shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  refreshIcons();

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// CARGAR Y GUARDAR EN LOCALSTORAGE
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      contractState = {
        ...defaultState,
        ...parsed,
        signatures: { ...defaultState.signatures, ...(parsed.signatures || {}) }
      };
    }
  } catch (e) {
    console.error('Error leyendo localStorage:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contractState));
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
  }
}

// CARGAR CASO DEMO NOVATECH
function loadDemoData(logAction = true) {
  contractState = {
    ...contractState,
    ...demoData
  };
  if (logAction) {
    addAuditLog('Caso Demo NovaTech cargado');
  }
  saveState();
  renderAll();
}

// REGISTRO DE AUDITORÍA
function addAuditLog(actionDescription) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const roleLabel = contractState.role === 'developer' ? '👨‍💻 Desarrollador' : '👔 Cliente / Revisor';
  
  const entry = {
    timestamp: timeStr,
    role: roleLabel,
    action: actionDescription
  };

  if (!Array.isArray(contractState.auditLog)) contractState.auditLog = [];
  contractState.auditLog.unshift(entry);
  if (contractState.auditLog.length > 50) {
    contractState.auditLog.pop();
  }
  saveState();
  renderAuditLog();
}

// ENLACE COMPARTIBLE PARA FIRMA REMOTA (SERIALIZACIÓN EN URL SIN SERVIDOR)
function generateShareableUrl() {
  try {
    const jsonStr = JSON.stringify(contractState);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    utf8Bytes.forEach(b => binary += String.fromCharCode(b));
    const base64 = btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const shareUrl = `${window.location.origin}${window.location.pathname}#contract=${base64}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Enlace de firma remota copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
      showToast('Enlace generado. Copia manualmente desde la URL', 'warning');
    });

    addAuditLog('Enlace de firma remota generado y copiado al portapapeles');
    return shareUrl;
  } catch (err) {
    console.error('Error generando URL compartible:', err);
    showToast('Error generando enlace compartible', 'error');
  }
}

function loadStateFromUrlHash() {
  const hash = window.location.hash;
  if (!hash || !hash.includes('contract=')) return false;

  try {
    const rawPayload = hash.split('contract=')[1];
    if (!rawPayload) return false;

    let base64 = rawPayload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';

    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    const importedState = JSON.parse(jsonStr);

    contractState = {
      ...defaultState,
      ...importedState,
      role: 'reviewer', // Activa perfil Cliente / Revisor (Modo Solo Lectura R1-R5)
      signatures: { ...defaultState.signatures, ...(importedState.signatures || {}) }
    };

    addAuditLog('Contrato cargado desde Enlace de Firma Remota');
    saveState();

    const banner = document.getElementById('remote-sign-banner');
    if (banner) banner.classList.remove('hidden');

    renderAll();
    switchStep(4);
    showToast('Modo Firma Remota activado: Revisa las cláusulas y estampa tu firma');
    return true;
  } catch (err) {
    console.error('Error decodificando estado desde URL:', err);
    showToast('No se pudo decodificar el enlace del contrato', 'error');
    return false;
  }
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
  // Selector de Rol
  const roleSelect = document.getElementById('role-select');
  if (roleSelect) {
    roleSelect.value = contractState.role;
    roleSelect.addEventListener('change', (e) => {
      const oldRole = contractState.role;
      contractState.role = e.target.value;
      addAuditLog(`Cambió rol de ${oldRole} a ${contractState.role}`);
      saveState();
      renderAll();
    });
  }

  // Botón Demo NovaTech
  document.getElementById('btn-demo')?.addEventListener('click', () => {
    if (contractState.isLocked) return;
    loadDemoData(true);
  });

  // Botón Compartir Enlace
  document.getElementById('btn-share-link')?.addEventListener('click', generateShareableUrl);
  document.getElementById('btn-modal-share')?.addEventListener('click', generateShareableUrl);

  // Botón Cerrar Banner Remoto
  document.getElementById('btn-close-remote-banner')?.addEventListener('click', () => {
    document.getElementById('remote-sign-banner')?.classList.add('hidden');
  });

  // Imprimir / PDF
  document.getElementById('btn-print')?.addEventListener('click', () => {
    window.print();
  });

  // Exportar JSON
  const exportJsonFn = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contractState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `legaldev_contrato_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  document.getElementById('btn-export-json')?.addEventListener('click', exportJsonFn);
  document.getElementById('btn-modal-json')?.addEventListener('click', exportJsonFn);

  // Importar JSON
  document.getElementById('input-import-json')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        contractState = {
          ...defaultState,
          ...imported,
          signatures: { ...defaultState.signatures, ...(imported.signatures || {}) }
        };
        addAuditLog('Respaldo JSON importado exitosamente');
        saveState();
        renderAll();
        showToast('Respaldo JSON importado correctamente');
      } catch (err) {
        showToast('Archivo JSON no válido', 'error');
      }
    };
    reader.readAsText(file);
  });

  // Limpiar Borrador
  document.getElementById('btn-clear-draft')?.addEventListener('click', () => {
    if (contractState.isLocked) {
      showToast('Desbloquea el contrato primero para reiniciar el borrador', 'warning');
      return;
    }
    if (confirm('¿Deseas reiniciar el borrador del contrato?')) {
      contractState = {
        ...defaultState,
        signatures: { client: null, dev: null },
        auditLog: []
      };
      addAuditLog('Borrador del contrato reiniciado');
      saveState();
      renderAll();
      showToast('Borrador del contrato reiniciado');
    }
  });

  // Navegación de Pasos
  document.querySelectorAll('.step-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step);
      switchStep(step);
    });
  });

  document.getElementById('btn-prev-step')?.addEventListener('click', () => {
    if (contractState.currentStep > 1) switchStep(contractState.currentStep - 1);
  });

  // Botón Siguiente / Finalizado ✓
  document.getElementById('btn-next-step')?.addEventListener('click', () => {
    if (contractState.currentStep < 4) {
      switchStep(contractState.currentStep + 1);
    } else {
      finalizeAndOpenModal();
    }
  });

  // Botones de Desbloqueo y Modal
  document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-print')?.addEventListener('click', () => {
    window.print();
  });

  const unlockFn = () => {
    contractState.isLocked = false;
    addAuditLog('Contrato desbloqueado para edición');
    saveState();
    closeModal();
    renderAll();
    showToast('Edición de contrato desbloqueada');
  };

  document.getElementById('btn-modal-unlock')?.addEventListener('click', unlockFn);
  document.getElementById('btn-unlock-inline')?.addEventListener('click', unlockFn);

  // Copiar Hash
  document.getElementById('btn-copy-hash')?.addEventListener('click', () => {
    if (!contractState.currentHash) return;
    navigator.clipboard.writeText(contractState.currentHash).then(() => {
      const btn = document.getElementById('btn-copy-hash');
      const origText = btn.innerHTML;
      btn.innerHTML = '✓ ¡Copiado!';
      setTimeout(() => btn.innerHTML = origText, 2000);
      showToast('Hash SHA-256 copiado al portapapeles');
    });
  });

  // Limpiar Historial de Auditoría
  document.getElementById('btn-clear-history')?.addEventListener('click', () => {
    if (contractState.isLocked) return;
    contractState.auditLog = [];
    addAuditLog('Historial de cambios reiniciado');
    showToast('Historial de cambios reiniciado');
  });

  // Inputs de Texto y Selectores
  const textInputs = [
    'client_name', 'client_id', 'client_rep', 'client_city', 'client_email',
    'dev_name', 'dev_id', 'dev_city', 'dev_email',
    'contract_scope', 'hours_monthly', 'hourly_rate', 'contract_duration', 'start_date', 'deliverables',
    'vigenciaHoras', 'aprobacionExcedentes', 'slaInsumos',
    'rule_r3_years'
  ];

  textInputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      if (contractState.isLocked) return;
      let val = e.target.value;
      if (id === 'hours_monthly' || id === 'hourly_rate' || id === 'contract_duration' || id === 'rule_r3_years') {
        val = Math.max(0, parseFloat(val) || 0);
      }
      contractState[id] = val;
      saveState();
      renderCalculations();
      renderPreview();
    });

    el.addEventListener('change', (e) => {
      if (contractState.isLocked) return;
      addAuditLog(`Modificó campo '${id}'`);
    });
  });

  // Checkboxes R1 y R3
  const chkR1 = document.getElementById('rule_r1_paid');
  chkR1?.addEventListener('change', (e) => {
    if (contractState.isLocked) return;
    contractState.rule_r1_paid = e.target.checked;
    addAuditLog(`Actualizó R1 (Pago acreditado: ${e.target.checked})`);
    saveState();
    renderAll();
  });

  const chkR3 = document.getElementById('rule_r3_active');
  chkR3?.addEventListener('change', (e) => {
    if (contractState.isLocked) return;
    contractState.rule_r3_active = e.target.checked;
    addAuditLog(`Actualizó R3 (NDA Activo: ${e.target.checked})`);
    saveState();
    renderAll();
  });
}

// CAMBIO DE PASO
function switchStep(stepNum) {
  contractState.currentStep = stepNum;
  saveState();

  const titles = [
    '01 Partes del contrato',
    '02 Objeto y bolsa de horas',
    '03 Condiciones legales y pago',
    '04 Firma electrónica Ley 527/1999'
  ];

  document.getElementById('current-step-num').textContent = stepNum;
  document.getElementById('step-title').textContent = titles[stepNum - 1];
  document.getElementById('step-progress-label').textContent = `Paso ${stepNum} de 4`;

  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step-content-${i}`);
    if (stepEl) {
      if (i === stepNum) stepEl.classList.remove('hidden');
      else stepEl.classList.add('hidden');
    }
  }

  document.querySelectorAll('.step-pill').forEach(btn => {
    const bStep = parseInt(btn.dataset.step);
    btn.classList.remove('active', 'completed');
    if (bStep === stepNum) {
      btn.classList.add('active');
    } else if (bStep < stepNum) {
      btn.classList.add('completed');
    }
  });

  document.getElementById('btn-prev-step').disabled = (stepNum === 1);

  const nextBtn = document.getElementById('btn-next-step');
  const nextBtnText = document.getElementById('btn-next-step-text');

  if (stepNum === 4) {
    if (nextBtnText) nextBtnText.textContent = 'Finalizado ✓';
    nextBtn.className = "allow-when-locked bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors shadow-md flex items-center gap-1.5 cursor-pointer font-sans";
  } else {
    if (nextBtnText) nextBtnText.textContent = 'Siguiente →';
    nextBtn.className = "allow-when-locked bg-[#0F2E28] hover:bg-emerald-900 text-amber-300 text-xs font-bold px-5 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer font-sans";
  }

  if (stepNum === 4) {
    renderSignatureCards('signature-cards-step4');
  }

  refreshIcons();
}

// FINALIZAR Y ABRIR MODAL DE CIERRE
function finalizeAndOpenModal() {
  contractState.isLocked = true;
  addAuditLog('Contrato formalizado y sellado criptográficamente');
  saveState();
  renderLockState();

  // Poblar Modal
  document.getElementById('modal-summary-client').textContent = contractState.client_name || 'N/A';
  document.getElementById('modal-summary-dev').textContent = contractState.dev_name || 'N/A';

  const monthlyTotal = (contractState.hours_monthly || 0) * (contractState.hourly_rate || 0);
  const formattedVal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monthlyTotal);
  document.getElementById('modal-summary-value').textContent = formattedVal;

  document.getElementById('modal-summary-duration').textContent = `${contractState.contract_duration || 1} mes(es)`;
  document.getElementById('modal-hash-display').textContent = contractState.currentHash || 'Calculando...';

  renderSignatureCards('signature-cards-modal');

  // Abrir Modal
  const modal = document.getElementById('modal-completion');
  if (modal) modal.classList.remove('hidden');

  refreshIcons();
}

function closeModal() {
  const modal = document.getElementById('modal-completion');
  if (modal) modal.classList.add('hidden');
}

// MÓDULO DE FIRMAS ELECTRÓNICAS (LEY 527 DE 1999)
function generateTypographicImage(signerName, signerId) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '700 52px "Caveat", cursive, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(signerName || 'Firma Electrónica', canvas.width / 2, 75);

  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`NIT / C.C. ${signerId || '---'}`, canvas.width / 2, 135);

  return canvas.toDataURL('image/png');
}

function initSignatureCanvas(canvasId, clearBtnId, stampBtnId, role) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let hasStrokes = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  canvas._resizeFn = resizeCanvas;
  resizeCanvas();

  let isDrawing = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    isDrawing = true;
    hasStrokes = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function moveDraw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDraw() {
    isDrawing = false;
  }

  canvas.onmousedown = startDraw;
  canvas.onmousemove = moveDraw;
  canvas.onmouseup = stopDraw;
  canvas.onmouseleave = stopDraw;

  canvas.ontouchstart = (e) => { e.preventDefault(); startDraw(e); };
  canvas.ontouchmove = (e) => { e.preventDefault(); moveDraw(e); };
  canvas.ontouchend = (e) => { e.preventDefault(); stopDraw(); };

  document.getElementById(clearBtnId)?.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokes = false;
  });

  document.getElementById(stampBtnId)?.addEventListener('click', () => {
    if (!hasStrokes) {
      showToast('Por favor dibuja tu firma antes de estampar', 'warning');
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    stampSignature(role, 'drawn', dataUrl);
  });
}

function stampSignature(role, type, dataUrl) {
  const isClient = (role === 'client');
  const signerName = isClient ? (contractState.client_name || contractState.client_rep || 'Contratante') : (contractState.dev_name || 'Contratista');
  const signerId = isClient ? (contractState.client_id || 'N/A') : (contractState.dev_id || 'N/A');
  const roleTitle = isClient ? 'Contratante (Cliente)' : 'Contratista (Desarrollador)';

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO') + ' ' + now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let finalDataUrl = dataUrl;
  if (type === 'typed' || !finalDataUrl) {
    finalDataUrl = generateTypographicImage(signerName, signerId);
  }

  if (!contractState.signatures) {
    contractState.signatures = { client: null, dev: null };
  }

  contractState.signatures[role] = {
    type: type,
    dataUrl: finalDataUrl,
    name: signerName,
    id: signerId,
    role: roleTitle,
    timestamp: dateStr,
    seal: 'Firmado Electrónicamente (Ley 527/1999)'
  };

  // Bloquea automáticamente la edición al estampar firma
  contractState.isLocked = true;

  addAuditLog(`Firma electrónica estampada por ${signerName} (${roleTitle}) - Ley 527/1999`);
  saveState();
  renderAll();
  showToast(`Firma de ${signerName} estampada con éxito (Ley 527/1999)`);
}

function clearSignature(role) {
  if (contractState.isLocked) {
    showToast('Debes desbloquear el contrato primero para limpiar esta firma', 'warning');
    return;
  }
  if (contractState.signatures && contractState.signatures[role]) {
    const signerName = contractState.signatures[role].name;
    contractState.signatures[role] = null;
    addAuditLog(`Firma de ${signerName} eliminada tras desbloqueo`);
    saveState();
    renderAll();
    showToast('Firma eliminada exitosamente');
  }
}

function renderSignatureCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const roles = [
    { key: 'client', title: 'Firma del Contratante (Cliente)', name: contractState.client_name || contractState.client_rep || 'Contratante', id: contractState.client_id || 'N/A' },
    { key: 'dev', title: 'Firma del Contratista (Desarrollador)', name: contractState.dev_name || 'Contratista', id: contractState.dev_id || 'N/A' }
  ];

  container.innerHTML = roles.map(r => {
    const sig = contractState.signatures ? contractState.signatures[r.key] : null;
    const isSigned = !!sig;

    if (isSigned) {
      return `
        <div class="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <span class="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i> ${r.title}
            </span>
            <span class="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <i data-lucide="check-circle-2" class="w-3 h-3 text-emerald-600"></i> Firmado Electrónicamente
            </span>
          </div>

          <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center space-y-1.5">
            <img src="${sig.dataUrl}" alt="Firma ${sig.name}" class="h-14 mx-auto object-contain my-1 bg-white p-1 rounded border border-slate-200 shadow-2xs">
            <p class="text-xs font-bold text-slate-900">${sig.name}</p>
            <p class="text-[10px] font-mono text-slate-600">NIT / C.C. ${sig.id}</p>
            <div class="text-[10px] font-mono text-emerald-800 bg-emerald-100/80 p-1.5 rounded-md border border-emerald-300 font-semibold flex items-center justify-center gap-1">
              <i data-lucide="award" class="w-3.5 h-3.5 text-emerald-700"></i> ${sig.seal} • ${sig.timestamp}
            </div>
          </div>

          <div class="flex justify-end pt-1">
            <button data-clear-sig="${r.key}" class="allow-when-locked text-[10px] font-mono text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-40 disabled:no-underline">
              <i data-lucide="trash-2" class="w-3 h-3"></i> Limpiar firma estampada
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <span class="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
            <i data-lucide="user-check" class="w-4 h-4 text-emerald-700"></i> ${r.title}
          </span>
          <span class="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <i data-lucide="clock" class="w-3 h-3 text-amber-600"></i> Pendiente de firma
          </span>
        </div>

        <!-- Pestañas de modo de firma -->
        <div class="flex border-b border-slate-200 text-xs">
          <button data-sig-tab="drawn" data-container="${containerId}" data-role="${r.key}" class="sig-tab-btn active px-3 py-1.5 text-slate-700 font-medium flex items-center gap-1">
            <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i> Dibujar Firma
          </button>
          <button data-sig-tab="typed" data-container="${containerId}" data-role="${r.key}" class="sig-tab-btn px-3 py-1.5 text-slate-500 font-medium flex items-center gap-1">
            <i data-lucide="type" class="w-3.5 h-3.5"></i> Firma Tipográfica
          </button>
        </div>

        <!-- Panel Dibujar Firma -->
        <div id="panel-drawn-${containerId}-${r.key}" class="sig-panel space-y-2">
          <div class="sig-canvas-container relative bg-slate-50 border border-slate-300 rounded-lg overflow-hidden shadow-inner">
            <canvas id="canvas-${containerId}-${r.key}" class="w-full h-28 cursor-crosshair block"></canvas>
            <span class="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 pointer-events-none select-none">Mouse / Pantalla táctil</span>
          </div>
          <div class="flex items-center justify-between gap-2">
            <button id="btn-clear-canvas-${containerId}-${r.key}" class="allow-when-locked bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i> Limpiar trazo
            </button>
            <button id="btn-stamp-drawn-${containerId}-${r.key}" class="allow-when-locked bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> Estampar Firma
            </button>
          </div>
        </div>

        <!-- Panel Firma Tipográfica -->
        <div id="panel-typed-${containerId}-${r.key}" class="sig-panel space-y-2 hidden">
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-1 shadow-inner">
            <p class="font-caveat text-3xl text-slate-900 font-bold leading-tight font-caveat">${r.name}</p>
            <p class="text-[10px] font-mono text-slate-500">NIT / C.C. ${r.id}</p>
          </div>
          <button id="btn-stamp-typed-${containerId}-${r.key}" class="allow-when-locked w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <i data-lucide="check" class="w-3.5 h-3.5"></i> Estampar Firma Tipográfica
          </button>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();

  roles.forEach(r => {
    const sig = contractState.signatures ? contractState.signatures[r.key] : null;

    if (sig) {
      const clearBtn = container.querySelector(`button[data-clear-sig="${r.key}"]`);
      if (clearBtn) {
        if (contractState.isLocked) {
          clearBtn.disabled = true;
          clearBtn.title = 'Desbloquea el contrato primero para limpiar esta firma';
        } else {
          clearBtn.disabled = false;
          clearBtn.addEventListener('click', () => clearSignature(r.key));
        }
      }
    } else {
      initSignatureCanvas(`canvas-${containerId}-${r.key}`, `btn-clear-canvas-${containerId}-${r.key}`, `btn-stamp-drawn-${containerId}-${r.key}`, r.key);

      document.getElementById(`btn-stamp-typed-${containerId}-${r.key}`)?.addEventListener('click', () => {
        stampSignature(r.key, 'typed', null);
      });

      const tabs = container.querySelectorAll(`button[data-container="${containerId}"][data-role="${r.key}"]`);
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const mode = tab.dataset.sigTab;
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const drawnPanel = document.getElementById(`panel-drawn-${containerId}-${r.key}`);
          const typedPanel = document.getElementById(`panel-typed-${containerId}-${r.key}`);

          if (mode === 'drawn') {
            drawnPanel?.classList.remove('hidden');
            typedPanel?.classList.add('hidden');
            setTimeout(() => {
              const canvas = document.getElementById(`canvas-${containerId}-${r.key}`);
              if (canvas && canvas._resizeFn) canvas._resizeFn();
            }, 50);
          } else {
            drawnPanel?.classList.add('hidden');
            typedPanel?.classList.remove('hidden');
          }
        });
      });
    }
  });
}

// ESTADO DE BLOQUEO UI
function renderLockState() {
  const isLocked = !!contractState.isLocked;
  const sidebar = document.getElementById('form-sidebar');
  const lockBanner = document.getElementById('locked-edition-banner');
  const headerBadge = document.getElementById('header-lock-badge');

  if (isLocked) {
    sidebar?.classList.add('editing-locked');
    lockBanner?.classList.remove('hidden');
    headerBadge?.classList.remove('hidden');
  } else {
    sidebar?.classList.remove('editing-locked');
    lockBanner?.classList.add('hidden');
    headerBadge?.classList.add('hidden');
  }

  const isReviewer = (contractState.role === 'reviewer');
  const allInputs = sidebar?.querySelectorAll('input, textarea, select');
  allInputs?.forEach(inp => {
    if (inp.classList.contains('allow-when-locked')) return;
    if (isLocked) {
      inp.disabled = true;
    } else {
      if (inp.classList.contains('rule-input')) {
        inp.disabled = isReviewer;
      } else {
        inp.disabled = false;
      }
    }
  });
}

// RENDER GENERAL
function renderAll() {
  renderFormValues();
  renderCalculations();
  renderRolePermissions();
  renderLockState();
  renderSignatureCards('signature-cards-step4');
  renderSignatureCards('signature-cards-modal');
  renderPreview();
  renderAuditLog();
  refreshIcons();
}

// POBLAR FORMULARIO
function renderFormValues() {
  const fields = [
    'client_name', 'client_id', 'client_rep', 'client_city', 'client_email',
    'dev_name', 'dev_id', 'dev_city', 'dev_email',
    'contract_scope', 'hours_monthly', 'hourly_rate', 'contract_duration', 'start_date', 'deliverables',
    'vigenciaHoras', 'aprobacionExcedentes', 'slaInsumos',
    'rule_r3_years'
  ];

  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = contractState[f] !== undefined ? contractState[f] : '';
  });

  const r1 = document.getElementById('rule_r1_paid');
  if (r1) r1.checked = !!contractState.rule_r1_paid;

  const r3 = document.getElementById('rule_r3_active');
  if (r3) r3.checked = !!contractState.rule_r3_active;
}

// CÁLCULOS
function renderCalculations() {
  const hours = parseFloat(contractState.hours_monthly) || 0;
  const rate = parseFloat(contractState.hourly_rate) || 0;
  const monthlyTotal = hours * rate;

  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(monthlyTotal);

  const totalEl = document.getElementById('calc-monthly-total');
  if (totalEl) totalEl.textContent = formatted;

  const r1Box = document.getElementById('r1-status-box');
  const bentoR1 = document.getElementById('rule_r1_paid')?.closest('.bento-card');

  if (r1Box) {
    if (contractState.rule_r1_paid) {
      r1Box.className = 'text-[11px] p-2 rounded-lg border mt-1 bg-emerald-50 border-emerald-200 text-emerald-950 font-sans';
      r1Box.innerHTML = '<strong>Cesión Total Acreditada:</strong> El Cliente adquiere la titularidad económica sobre los entregables pagados.';
      if (bentoR1) bentoR1.classList.add('bento-card-active');
    } else {
      r1Box.className = 'text-[11px] p-2 rounded-lg border mt-1 bg-amber-50 border-amber-200 text-amber-950 font-sans';
      r1Box.innerHTML = '<strong>Licencia Uso Limitado:</strong> Pago pendiente. El Desarrollador retiene los derechos patrimoniales.';
      if (bentoR1) bentoR1.classList.remove('bento-card-active');
    }
  }

  // Actualizar badges en Columna 2 (Control de Legalidad)
  const col2BadgeR1 = document.getElementById('col2-badge-r1');
  const col2CardR1 = document.getElementById('col2-card-r1');
  if (col2BadgeR1) {
    if (contractState.rule_r1_paid) {
      col2BadgeR1.className = 'bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1';
      col2BadgeR1.innerHTML = '✓ Cesión Acreditada';
      if (col2CardR1) col2CardR1.className = 'p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1.5 transition-all';
    } else {
      col2BadgeR1.className = 'bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1';
      col2BadgeR1.innerHTML = '⚠️ Licencia Limitada';
      if (col2CardR1) col2CardR1.className = 'p-3 rounded-xl border border-amber-300 bg-amber-50/50 space-y-1.5 transition-all';
    }
  }

  const col2BadgeR3 = document.getElementById('col2-badge-r3');
  const col2CardR3 = document.getElementById('col2-card-r3');
  if (col2BadgeR3) {
    if (contractState.rule_r3_active) {
      col2BadgeR3.className = 'bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1';
      col2BadgeR3.innerHTML = `✓ NDA Activo (${contractState.rule_r3_years}a)`;
      if (col2CardR3) col2CardR3.className = 'p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1.5 transition-all';
    } else {
      col2BadgeR3.className = 'bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1';
      col2BadgeR3.innerHTML = '⚪ Inactivo';
      if (col2CardR3) col2CardR3.className = 'p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 transition-all';
    }
  }
}

// PERMISOS ROL
function renderRolePermissions() {
  const isReviewer = (contractState.role === 'reviewer');
  const lockBadge = document.getElementById('reviewer-lock-badge');

  if (lockBadge) {
    if (isReviewer) lockBadge.classList.remove('hidden');
    else lockBadge.classList.add('hidden');
  }
}

// TABLA DE AUDITORÍA
function renderAuditLog() {
  const tbody = document.getElementById('audit-log-body');
  if (!tbody) return;

  if (!contractState.auditLog || contractState.auditLog.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="p-3 text-center text-slate-400 font-sans italic">No hay registros aún</td></tr>`;
    return;
  }

  tbody.innerHTML = contractState.auditLog.map(entry => `
    <tr class="hover:bg-slate-50">
      <td class="p-2 text-slate-500 font-mono text-[10px] whitespace-nowrap">${entry.timestamp}</td>
      <td class="p-2 font-semibold text-slate-800 text-[10px] whitespace-nowrap">${entry.role}</td>
      <td class="p-2 text-slate-700 text-[10px]">${entry.action}</td>
    </tr>
  `).join('');
}

// CALCULAR HASH SHA-256
async function updateSHA256(contractText) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(contractText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    contractState.currentHash = hashHex;

    const previewHash = document.getElementById('preview-sha256-hash');
    if (previewHash) previewHash.textContent = hashHex;

    const sidebarHash = document.getElementById('sidebar-hash-display');
    if (sidebarHash) sidebarHash.textContent = hashHex;

    const modalHash = document.getElementById('modal-hash-display');
    if (modalHash) modalHash.textContent = hashHex;

    const headerHashBadge = document.getElementById('header-sha256-badge');
    if (headerHashBadge) headerHashBadge.textContent = hashHex.substring(0, 16) + '...';

  } catch (err) {
    console.error('Error calculando SHA-256:', err);
  }
}

// RENDERIZAR DOCUMENTO DE CONTRATO (EDITORIAL CON SERIFA)
function renderPreview() {
  const previewContainer = document.getElementById('contract-preview');
  if (!previewContainer) return;

  const clientName = contractState.client_name || '[NOMBRE / RAZÓN SOCIAL DEL CONTRATANTE]';
  const clientId = contractState.client_id || '[NIT / C.C. CONTRATANTE]';
  const clientRep = contractState.client_rep ? `representado legalmente por <strong>${contractState.client_rep}</strong>,` : '';
  const clientCity = contractState.client_city || '[CIUDAD CONTRATANTE]';

  const devName = contractState.dev_name || '[NOMBRE / RAZÓN SOCIAL DEL CONTRATISTA]';
  const devId = contractState.dev_id || '[C.C. / NIT CONTRATISTA]';
  const devCity = contractState.dev_city || '[CIUDAD CONTRATISTA]';

  const scope = contractState.contract_scope || '[Descripción detallada del objeto y alcance del software]';
  const hours = parseFloat(contractState.hours_monthly) || 0;
  const rate = parseFloat(contractState.hourly_rate) || 0;
  const monthlyTotalVal = hours * rate;

  const formattedRate = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(rate);
  const formattedMonthlyTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monthlyTotalVal);

  const duration = contractState.contract_duration || 1;
  const startDate = contractState.start_date || '[FECHA DE INICIO]';
  const deliverables = contractState.deliverables || '[Definición de entregables e hitos del proyecto]';

  // Actualizar Cuadrícula Resumen Superior en Columna 3
  const gridClient = document.getElementById('summary-grid-client');
  if (gridClient) gridClient.textContent = contractState.client_name || '---';

  const gridDev = document.getElementById('summary-grid-dev');
  if (gridDev) gridDev.textContent = contractState.dev_name || '---';

  const gridVal = document.getElementById('summary-grid-value');
  if (gridVal) gridVal.textContent = formattedMonthlyTotal;

  const gridDur = document.getElementById('summary-grid-duration');
  if (gridDur) gridDur.textContent = `${duration} mes(es)`;

  // Parágrafos Operativos de Bolsa de Horas (Cláusula Segunda)
  const vigenciaHorasVal = contractState.vigenciaHoras || 'vencen';
  const aprobacionExcedentesVal = contractState.aprobacionExcedentes || 'previa';
  const slaInsumosVal = contractState.slaInsumos || '3dias';

  const parágrafoVigenciaText = vigenciaHorasVal === 'rollover'
    ? `PARÁGRAFO PRIMERO — VIGENCIA Y ACUMULACIÓN DE HORAS NO EJECUTADAS: Las horas contratadas dentro de la bolsa mensual que no fueren consumidas al cierre del respectivo período mensual facturado podrán acumularse por una única vez para ser ejecutadas exclusivamente durante el mes calendario inmediatamente siguiente. Vencido dicho mes adicional sin haber sido utilizadas, las horas remanentes caducarán de pleno derecho sin lugar a reembolso, compensación ni prórroga adicional.`
    : `PARÁGRAFO PRIMERO — VIGENCIA DE HORAS NO EJECUTADAS: Las horas contratadas dentro de la bolsa mensual que no fueren consumidas o requeridas por EL CONTRATANTE durante el respectivo período mensual facturado vencerán de pleno derecho al cierre de dicho mes, sin que haya lugar a su acumulación para períodos posteriores, reembolso, descuento ni compensación económica alguna, en razón a la disponibilidad técnica reservada por EL CONTRATISTA.`;

  const parágrafoExcedentesText = aprobacionExcedentesVal === 'bloqueo'
    ? `PARÁGRAFO SEGUNDO — PROTOCOLO ANTE EXCEDENTES Y SUSPENSIÓN AUTOMÁTICA: Agotada la totalidad de la bolsa de horas pactada para el mes en curso, EL CONTRATISTA suspenderá automáticamente la ejecución de nuevas tareas o requerimientos hasta el inicio del siguiente período mensual o hasta que EL CONTRATANTE imparta nueva orden de compra o adición presupuestal expresa mediante mensaje de datos con plena validez probatoria conforme a la Ley 527 de 1999.`
    : `PARÁGRAFO SEGUNDO — PROTOCOLO DE AUTORIZACIÓN DE HORAS EXCEDENTES (LEY 527 DE 1999): Toda hora de servicio adicional que exceda la bolsa mensual pactada requerirá autorización previa, expresa y escrita de EL CONTRATANTE remitida mediante mensaje de datos (correo electrónico o canal digital oficial acordado) en los términos de la Ley 527 de 1999. Las horas excedentes debidamente autorizadas se facturarán a la misma tarifa unitaria de ${formattedRate} COP por hora.`;

  const diasSla = slaInsumosVal === '5dias' ? 'cinco (5) días hábiles' : 'tres (3) días hábiles';
  const parágrafoSLAText = `PARÁGRAFO TERCERO — PLAZO DE INSUMOS, ACUERDOS DE NIVEL DE SERVICIO Y SUSPENSIÓN POR MORA: EL CONTRATANTE se obliga a entregar oportunamente los accesos, credenciales, insumos técnicos, definiciones funcionales y aprobaciones requeridas dentro de un plazo máximo de ${diasSla} contados a partir de la solicitud formal de EL CONTRATISTA. Cualquier retraso o mora por parte de EL CONTRATANTE en la entrega de dichos insumos o aprobaciones suspenderá automáticamente los tiempos de respuesta, hitos y acuerdos de nivel de servicio (SLA) a cargo de EL CONTRATISTA por un término equivalente al de la demora, sin que ello genere incumplimiento contractual ni penalidad alguna.`;

  // Texto R1
  const r1ClauseText = contractState.rule_r1_paid
    ? `Con la acreditación efectiva y verificación total del pago de la mensualidad pactada (${formattedMonthlyTotal}), EL CONTRATISTA cede de manera total, exclusiva y transferible a favor de EL CONTRATANTE los derechos patrimoniales de autor (Ley 23 de 1982 y Decisión Andina 351) sobre los componentes de software desarrollados en dicho periodo.`
    : `Mientras el pago de la mensualidad correspondiente no se encuentre efectivamente acreditado en la cuenta del CONTRATISTA, EL CONTRATANTE únicamente ostenta una Licencia de Uso Limitada, No Exclusiva y Revocable sobre el software. Los derechos patrimoniales de autor continúan en cabeza de EL CONTRATISTA en virtud de la Ley 23 de 1982 hasta la acreditación total del pago.`;

  // Texto R3
  const r3ClauseText = contractState.rule_r3_active
    ? `Las partes se obligan a guardar estricta reserva sobre la información técnica, financiera y estratégica compartida. Esta obligación de confidencialidad y secreto empresarial (Decisión Andina 486 y Ley 256 de 1996) se mantendrá vigente durante la ejecución del contrato y por un período poscontractual de ${contractState.rule_r3_years} año(s) posterior a su terminación, exigiendo el borrado seguro de copias de trabajo no entregadas.`
    : `Las partes acuerdan mantener estricta confidencialidad y reserva sobre la información sensible intercambiada únicamente durante la vigencia de ejecución del presente contrato.`;

  // Firmas Estampadas
  const clientSig = contractState.signatures?.client;
  const devSig = contractState.signatures?.dev;

  const clientSigHtml = clientSig ? `
    <div class="space-y-1.5 text-center">
      <img src="${clientSig.dataUrl}" alt="Firma ${clientSig.name}" class="h-16 mx-auto object-contain">
      <p class="font-bold text-slate-900 text-xs">${clientSig.name}</p>
      <p class="text-[10px] text-slate-600 font-mono">EL CONTRATANTE (NIT/C.C. ${clientSig.id})</p>
      <div class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
        <i data-lucide="shield-check" class="w-3 h-3 text-emerald-600"></i> Firmado Electrónicamente (Ley 527/1999)
      </div>
      <p class="text-[9px] text-slate-500 font-mono">${clientSig.timestamp}</p>
    </div>
  ` : `
    <div class="space-y-1 text-center">
      <div class="border-b-2 border-slate-900 w-4/5 mx-auto mb-2 h-12 flex items-end justify-center">
        <span class="text-[10px] text-slate-400 italic">Pendiente de Firma</span>
      </div>
      <p class="font-bold text-slate-900 text-xs">${clientName}</p>
      <p class="text-[10px] text-slate-600 font-mono">EL CONTRATANTE (NIT/C.C. ${clientId})</p>
    </div>
  `;

  const devSigHtml = devSig ? `
    <div class="space-y-1.5 text-center">
      <img src="${devSig.dataUrl}" alt="Firma ${devSig.name}" class="h-16 mx-auto object-contain">
      <p class="font-bold text-slate-900 text-xs">${devSig.name}</p>
      <p class="text-[10px] text-slate-600 font-mono">EL CONTRATISTA (C.C./NIT ${devSig.id})</p>
      <div class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
        <i data-lucide="shield-check" class="w-3 h-3 text-emerald-600"></i> Firmado Electrónicamente (Ley 527/1999)
      </div>
      <p class="text-[9px] text-slate-500 font-mono">${devSig.timestamp}</p>
    </div>
  ` : `
    <div class="space-y-1 text-center">
      <div class="border-b-2 border-slate-900 w-4/5 mx-auto mb-2 h-12 flex items-end justify-center">
        <span class="text-[10px] text-slate-400 italic">Pendiente de Firma</span>
      </div>
      <p class="font-bold text-slate-900 text-xs">${devName}</p>
      <p class="text-[10px] text-slate-600 font-mono">EL CONTRATISTA (C.C./NIT ${devId})</p>
    </div>
  `;

  const clientSigInfo = clientSig
    ? `FIRMA CONTRATANTE: ELECTRONICAMENTE REGISTRADA POR ${clientSig.name} (${clientSig.id}) FECHA ${clientSig.timestamp} SELLO LEY 527/1999`
    : `FIRMA CONTRATANTE: PENDIENTE`;

  const devSigInfo = devSig
    ? `FIRMA CONTRATISTA: ELECTRONICAMENTE REGISTRADA POR ${devSig.name} (${devSig.id}) FECHA ${devSig.timestamp} SELLO LEY 527/1999`
    : `FIRMA CONTRATISTA: PENDIENTE`;

  const rawContractText = `
CONTRATO DE PRESTACIÓN DE SERVICIOS DE DESARROLLO DE SOFTWARE BAJO BOLSA DE HORAS
REPÚBLICA DE COLOMBIA

Entre los suscritos a saber: Por una parte, ${clientName}, identificado con NIT/C.C. ${clientId}, domiciliado en ${clientCity}, ${clientRep} quien se denominará EL CONTRATANTE; y por la otra, ${devName}, identificado con C.C./NIT ${devId}, domiciliado en ${devCity}, quien se denominará EL CONTRATISTA, han acordado celebrar el presente Contrato de Prestación de Servicios de Desarrollo de Software:

PRIMERA: OBJETO. EL CONTRATISTA se obliga de manera independiente a ejecutar: ${scope}.

SEGUNDA: BOLSA DE HORAS Y CONDICIONES ECONÓMICAS. Modalidad de bolsa de horas: ${hours} horas mensuales, tarifa de ${formattedRate} COP por hora. Valor mensual estimado de ${formattedMonthlyTotal} COP.
${parágrafoVigenciaText}
${parágrafoExcedentesText}
${parágrafoSLAText}

TERCERA: PLAZO Y VIGENCIA. Duración de ${duration} mes(es) a partir del ${startDate}.

CUARTA: ENTREGABLES. EL CONTRATISTA entregará: ${deliverables}.

QUINTA: REGIMEN DE DERECHOS PATRIMONIALES Y ESTADO DE PAGO (R1 - LEY 23/1982 / DECISIÓN ANDINA 351). ${r1ClauseText}

SEXTA: RESERVA DE DERECHOS MORALES Y PORTAFOLIO PROFESIONAL (R2 - LEY 23/1982). Los derechos morales de autor son inalienables e irrenunciables, permaneciendo en cabeza de EL CONTRATISTA. Se autoriza la mención del proyecto en portafolio profesional sin divulgar secretos comerciales.

SÉPTIMA: SECRETO EMPRESARIAL Y CONFIDENCIALIDAD (R3 - DECISIÓN ANDINA 486). ${r3ClauseText}

OCTAVA: MENSAJES DE DATOS Y EQUIVALENCIA PROBATORIA (R4 - LEY 527/1999). Plena validez de mensaje de datos respaldado por sello criptográfico SHA-256.

NOVENA: GARANTÍA TÉCNICA DE CIBERSEGURIDAD Y SANIDAD (R5 - LEY 1273/2009). Entrega libre de código malicioso con saneamiento de fallas por 30 días calendario.

DÉCIMA: INDEPENDENCIA Y AUSENCIA DE SUBORDINACIÓN. Las partes aclaran que la relación es estrictamente comercial e independiente, sin subordinación ni vínculo de carácter laboral.

${clientSigInfo}
${devSigInfo}
  `.trim();

  previewContainer.innerHTML = `
    <!-- ENCABEZADO FORMAL EDITORIAL -->
    <div class="text-center space-y-2 border-b-2 border-slate-900 pb-5 mb-6">
      <div class="text-[10px] font-mono font-bold tracking-widest text-[#0F2E28] uppercase">REPÚBLICA DE COLOMBIA • CONTRATO COMERCIAL DIGITAL</div>
      <h2 class="contract-title-heading uppercase text-slate-900 leading-tight font-serif">CONTRATO DE PRESTACIÓN DE SERVICIOS DE DESARROLLO DE SOFTWARE</h2>
      <div class="inline-block bg-slate-100 text-slate-800 text-[11px] font-mono px-3 py-0.5 rounded-full font-medium border border-slate-300">
        Bolsa de Horas • Legislación Colombiana
      </div>
    </div>

    <!-- CUERPO DEL CONTRATO -->
    <div class="space-y-4 leading-relaxed text-justify font-serif">
      <p class="text-slate-900">
        Entre los suscritos a saber: Por una parte, <strong class="font-bold text-slate-950">${clientName}</strong>, identificado con NIT/C.C. <strong class="font-mono text-xs">${clientId}</strong>, domiciliado en la ciudad de <strong>${clientCity}</strong>, ${clientRep} quien para todos los efectos legales se denominará <strong>EL CONTRATANTE</strong>; y por la otra parte, <strong class="font-bold text-slate-950">${devName}</strong>, identificado con C.C./NIT <strong class="font-mono text-xs">${devId}</strong>, domiciliado en la ciudad de <strong>${devCity}</strong>, quien en adelante se denominará <strong>EL CONTRATISTA</strong>, han acordado celebrar el presente instrumento sujeto a las siguientes cláusulas:
      </p>

      <div class="contract-section">
        <h3 class="clause-heading font-serif">PRIMERA: OBJETO DEL CONTRATO</h3>
        <p>EL CONTRATISTA se obliga de manera independiente a realizar para EL CONTRATANTE los servicios de desarrollo de software descritos a continuación: <em>${scope}</em>.</p>
      </div>

      <div class="contract-section space-y-2">
        <h3 class="clause-heading font-serif">SEGUNDA: BOLSA DE HORAS Y CONDICIONES ECONÓMICAS</h3>
        <p>El servicio se presta bajo el esquema de bolsa de horas. Se pactan <strong>${hours} horas mensuales</strong> a una tarifa unitaria de <strong class="font-mono text-xs">${formattedRate} COP</strong> por hora. El valor mensual estimado asciende a la suma de <strong class="font-mono text-xs bg-emerald-100 text-emerald-950 px-1.5 py-0.5 rounded border border-emerald-300">${formattedMonthlyTotal} COP</strong>.</p>
        <p class="text-[11px] text-slate-800 pl-3 border-l-2 border-slate-200">${parágrafoVigenciaText}</p>
        <p class="text-[11px] text-slate-800 pl-3 border-l-2 border-slate-200">${parágrafoExcedentesText}</p>
        <p class="text-[11px] text-slate-800 pl-3 border-l-2 border-slate-200">${parágrafoSLAText}</p>
      </div>

      <div class="contract-section">
        <h3 class="clause-heading font-serif">TERCERA: PLAZO DE EJECUCIÓN Y VIGENCIA</h3>
        <p>El plazo de ejecución será de <strong>${duration} mes(es)</strong>, contados a partir del día <strong class="font-mono text-xs">${startDate}</strong>.</p>
      </div>

      <div class="contract-section">
        <h3 class="clause-heading font-serif">CUARTA: ENTREGABLES Y COMPONENTES TÉCNICOS</h3>
        <p>EL CONTRATISTA entregará los siguientes componentes: <em>${deliverables}</em>.</p>
      </div>

      <!-- REGLA R1 -->
      <div class="contract-section p-2.5 rounded-lg border ${contractState.rule_r1_paid ? 'bg-emerald-50/40 border-emerald-300' : 'bg-amber-50/40 border-amber-300'}">
        <h3 class="clause-heading font-serif">QUINTA: REGIMEN DE DERECHOS PATRIMONIALES Y ESTADO DE PAGO (REGLA R1 - LEY 23/1982 / DECISIÓN ANDINA 351)</h3>
        <p>${r1ClauseText}</p>
      </div>

      <!-- REGLA R2 -->
      <div class="contract-section">
        <h3 class="clause-heading font-serif">SEXTA: RESERVA DE DERECHOS MORALES Y PORTAFOLIO PROFESIONAL (REGLA R2 - LEY 23/1982)</h3>
        <p>Los derechos morales de autor son inalienables, inembargables e irrenunciables, permaneciendo perpetuamente en cabeza de EL CONTRATISTA. Se autoriza la mención del proyecto en portafolio profesional sin divulgar código fuente ni secretos comerciales.</p>
      </div>

      <!-- REGLA R3 -->
      <div class="contract-section">
        <h3 class="clause-heading font-serif">SÉPTIMA: SECRETO EMPRESARIAL Y CONFIDENCIALIDAD (REGLA R3 - DECISIÓN ANDINA 486 Y LEY 256/1996)</h3>
        <p>${r3ClauseText}</p>
      </div>

      <!-- REGLA R4 -->
      <div class="contract-section">
        <h3 class="clause-heading font-serif">OCTAVA: MENSAJES DE DATOS Y EQUIVALENCIA PROBATORIA (REGLA R4 - LEY 527/1999)</h3>
        <p>De conformidad con la Ley 527 de 1999, el presente contrato digital goza de plena validez probatoria. La integridad de las cláusulas se valida mediante la huella criptográfica SHA-256 en el pie del documento.</p>
      </div>

      <!-- REGLA R5 -->
      <div class="contract-section">
        <h3 class="clause-heading font-serif">NOVENA: GARANTÍA TÉCNICA DE CIBERSEGURIDAD Y SANIDAD (REGLA R5 - LEY 1273/2009)</h3>
        <p>EL CONTRATISTA garantiza la entrega de código libre de código malicioso o puertas traseras. Cobertura de saneamiento de fallas por treinta (30) días calendario tras cada entrega.</p>
      </div>

      <div class="contract-section">
        <h3 class="clause-heading font-serif">DÉCIMA: INDEPENDENCIA Y AUSENCIA DE SUBORDINACIÓN</h3>
        <p>Las partes aclaran que la relación es estrictamente comercial e independiente, sin subordinación ni vínculo de carácter laboral.</p>
      </div>
    </div>

    <!-- FIRMAS CONTRACTUALES -->
    <div class="pt-10 pb-4 grid grid-cols-2 gap-8 border-t border-slate-300 mt-8 font-sans">
      ${clientSigHtml}
      ${devSigHtml}
    </div>

    <!-- PIE DIGITAL CON SELLO Y HASH SHA-256 -->
    <div class="mt-8 pt-3 border-t-2 border-slate-900 text-[10px] space-y-1 text-slate-700 font-sans">
      <div class="flex justify-between items-center font-mono font-bold">
        <span>CERTIFICADO DE VALIDEZ Y FIRMA DIGITAL (LEY 527 DE 1999)</span>
        <span class="text-emerald-900">LEGALDEV 2026</span>
      </div>
      <div class="font-mono bg-slate-100 p-2.5 rounded-lg text-[9px] break-all border border-slate-300 text-slate-900 shadow-inner" id="preview-sha256-hash">
        Calculando sello criptográfico...
      </div>
      <div class="flex justify-between items-center text-[9px] text-slate-500 font-mono">
        <span>Sello criptográfico recalculado en tiempo real.</span>
        <span>República de Colombia</span>
      </div>
    </div>
  `;

  updateSHA256(rawContractText);
}
