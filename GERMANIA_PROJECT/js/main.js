/* =========================================================
   EDULEDGER — main.js
   Lógica compartida: sidebar responsive + interacciones
   por página (matrículas, institución, docentes).
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initSalonFilter();
  initWizard();
  initDocentes();
});

/* ---------------------------------------------------------
   1. SIDEBAR RESPONSIVE (off-canvas en móvil/tablet)
--------------------------------------------------------- */
/**
 * Inicializa el comportamiento del menú lateral móvil y su superposición (overlay).
 */
function initSidebar(){
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('menuToggle');
  if(!sidebar || !overlay || !toggleBtn) return;

  const open  = () => { sidebar.classList.add('open'); overlay.classList.add('open'); toggleBtn.setAttribute('aria-expanded','true'); };
  const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); toggleBtn.setAttribute('aria-expanded','false'); };

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? close() : open();
  });
  overlay.addEventListener('click', close);

  // Cierra automáticamente al pasar a pantalla de escritorio
  window.addEventListener('resize', () => { if(window.innerWidth > 900) close(); });

  // Cierra el menú al seleccionar una sección en pantallas móviles
  sidebar.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', close));
}

/* ---------------------------------------------------------
   2. GESTIÓN DE INSTITUCIÓN — filtro del inventario de salones
--------------------------------------------------------- */
/**
 * Aplica un filtro de búsqueda en tiempo real sobre la tabla del inventario de salones.
 */
function initSalonFilter(){
  const input = document.getElementById('salonSearch');
  const rows  = document.querySelectorAll('#salonesTableBody tr');
  if(!input || !rows.length) return;

  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    let visible = 0;
    rows.forEach(row => {
      const match = row.dataset.search.includes(term);
      row.style.display = match ? '' : 'none';
      if(match) visible++;
    });
    const emptyState = document.getElementById('salonesEmpty');
    if(emptyState) emptyState.style.display = visible ? 'none' : 'block';
  });
}

/* ---------------------------------------------------------
   3. REGISTRO DE ESTUDIANTE — wizard de 4 pasos
--------------------------------------------------------- */
/**
 * Administra la navegación paso a paso (wizard), validaciones y resumen del registro de matrícula.
 */
function initWizard(){
  const steps = document.querySelectorAll('.step');
  const panels = document.querySelectorAll('.wizard-panel');
  if(!steps.length || !panels.length) return;

  let current = 1;
  const total = panels.length;

  /**
   * Actualiza el estado visual de las pestañas de los pasos y del panel activo.
   */
  const render = () => {
    steps.forEach(step => {
      const n = Number(step.dataset.step);
      step.classList.toggle('active', n === current);
      step.classList.toggle('done', n < current);
    });
    panels.forEach(panel => {
      panel.classList.toggle('active', Number(panel.dataset.panel) === current);
    });
    if(current === total) buildSummary();
    window.scrollTo({top:0, behavior:'smooth'});
  };

  // Asignación de navegación hacia adelante
  document.querySelectorAll('[data-action="next"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if(!validateStep(current)) return;
      if(current < total){ current++; render(); }
    });
  });

  // Asignación de navegación hacia atrás
  document.querySelectorAll('[data-action="back"]').forEach(btn => {
    btn.addEventListener('click', () => { if(current > 1){ current--; render(); } });
  });

  // Permitir clic directo en los pasos completados
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const n = Number(step.dataset.step);
      if(n < current){ current = n; render(); }
    });
  });

  // Selección de sede en formato de tarjeta interactiva
  document.querySelectorAll('.choice-card').forEach(card => {
    card.addEventListener('click', () => {
      card.closest('.choice-grid').querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Manejo del evento de confirmación de la matrícula
  const submitBtn = document.getElementById('submitMatricula');
  if(submitBtn){
    submitBtn.addEventListener('click', () => {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Matrícula registrada ✓';
    });
  }

  /**
   * Valida la información requerida del paso actual antes de avanzar.
   * @param {number} n - Número de paso a validar.
   * @returns {boolean}
   */
  function validateStep(n){
    if(n === 1){
      const nombre = document.getElementById('nombreEstudiante');
      const doc = document.getElementById('numeroDocumento');
      if(nombre && !nombre.value.trim()){ nombre.focus(); return false; }
      if(doc && !doc.value.trim()){ doc.focus(); return false; }
    }
    return true;
  }

  /**
   * Construye dinámicamente la vista previa de resumen con los datos recopilados.
   */
  function buildSummary(){
    const summary = document.getElementById('summaryList');
    if(!summary) return;
    const nombre = val('nombreEstudiante') || 'Sin especificar';
    const doc = val('numeroDocumento') || 'Sin especificar';
    const tipoDoc = val('tipoDocumento');
    const grado = val('gradoMatricular');
    const genero = document.querySelector('input[name="genero"]:checked');
    const sede = document.querySelector('.choice-card.selected strong');

    summary.innerHTML = `
      <div class="summary-row"><span class="k">Estudiante</span><span class="v">${nombre}</span></div>
      <div class="summary-row"><span class="k">Documento</span><span class="v">${tipoDoc ? tipoDoc + ' · ' : ''}${doc}</span></div>
      <div class="summary-row"><span class="k">Grado a matricular</span><span class="v">${grado || 'Sin especificar'}</span></div>
      <div class="summary-row"><span class="k">Género</span><span class="v">${genero ? genero.value : 'Sin especificar'}</span></div>
      <div class="summary-row"><span class="k">Sede asignada</span><span class="v">${sede ? sede.textContent : 'Sin especificar'}</span></div>
    `;
  }

  /**
   * Extrae y limpia el valor de un campo de entrada o elemento de selección por ID.
   * @param {string} id - ID del elemento en el DOM.
   * @returns {string}
   */
  function val(id){
    const el = document.getElementById(id);
    if(!el) return '';
    if(el.tagName === 'SELECT') return el.options[el.selectedIndex]?.text.trim() !== 'Seleccione' ? el.options[el.selectedIndex]?.text.trim() : '';
    return el.value;
  }
}

/* ---------------------------------------------------------
   4. DIRECTORIO DOCENTE — datos, búsqueda, filtro y paginación
--------------------------------------------------------- */
// Fuente de datos estática de docentes registrados
const DOCENTES_DATA = [
  {nombre:'Adriana Morales', correo:'amorales@germania.edu.co', doc:'1.023.456.789', especialidad:'Matemáticas Puras', horas:18, max:22, estado:'ACTIVO'},
  {nombre:'Ricardo Castro', correo:'rcastro@germania.edu.co', doc:'1.145.234.001', especialidad:'Filosofía e Historia', horas:24, max:22, estado:'ACTIVO'},
  {nombre:'Lucía Villalba', correo:'lvillalba@germania.edu.co', doc:'1.099.122.333', especialidad:'Artes Plásticas', horas:0, max:22, estado:'LICENCIA'},
  {nombre:'Julian Paredes', correo:'jparedes@germania.edu.co', doc:'1.055.888.111', especialidad:'Biología Marina', horas:20, max:22, estado:'ACTIVO'},
  {nombre:'Camila Restrepo', correo:'crestrepo@germania.edu.co', doc:'1.032.556.221', especialidad:'Lengua Castellana', horas:16, max:22, estado:'ACTIVO'},
  {nombre:'Esteban Rojas', correo:'erojas@germania.edu.co', doc:'1.081.334.556', especialidad:'Educación Física', horas:22, max:22, estado:'ACTIVO'},
  {nombre:'Natalia Gómez', correo:'ngomez@germania.edu.co', doc:'1.067.221.998', especialidad:'Química', horas:9, max:22, estado:'LICENCIA'},
  {nombre:'David Herrera', correo:'dherrera@germania.edu.co', doc:'1.045.667.223', especialidad:'Inglés', horas:21, max:22, estado:'ACTIVO'},
  {nombre:'Paula Jiménez', correo:'pjimenez@germania.edu.co', doc:'1.078.990.114', especialidad:'Física', horas:25, max:22, estado:'ACTIVO'},
  {nombre:'Andrés Salazar', correo:'asalazar@germania.edu.co', doc:'1.012.774.883', especialidad:'Tecnología e Informática', horas:14, max:22, estado:'ACTIVO'},
  {nombre:'Marcela Ortiz', correo:'mortiz@germania.edu.co', doc:'1.090.445.667', especialidad:'Música', horas:12, max:22, estado:'ACTIVO'},
  {nombre:'Felipe Cárdenas', correo:'fcardenas@germania.edu.co', doc:'1.088.223.109', especialidad:'Matemáticas Puras', horas:0, max:22, estado:'LICENCIA'},
];

/**
 * Inicializa los filtros, renderizado de la tabla y paginación del directorio de docentes.
 */
function initDocentes(){
  const tbody = document.getElementById('docentesTableBody');
  if(!tbody) return;

  const searchInput = document.getElementById('docenteSearch');
  const specialtySelect = document.getElementById('specialtyFilter');
  const statusSelect = document.getElementById('statusFilter');
  const resultsCount = document.getElementById('resultsCount');
  const pagination = document.getElementById('pagination');

  const PER_PAGE = 4;
  let page = 1;

  // Rellena el select de especialidades dinámicamente con valores únicos
  if(specialtySelect){
    const specs = [...new Set(DOCENTES_DATA.map(d => d.especialidad))].sort();
    specs.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      specialtySelect.appendChild(opt);
    });
  }

  /**
   * Obtiene la lista filtrada de docentes según los campos activos.
   */
  function getFiltered(){
    const term = (searchInput?.value || '').trim().toLowerCase();
    const spec = specialtySelect?.value || 'all';
    const status = statusSelect?.value || 'all';
    return DOCENTES_DATA.filter(d => {
      const matchesTerm = !term || d.nombre.toLowerCase().includes(term) || d.doc.includes(term) || d.especialidad.toLowerCase().includes(term);
      const matchesSpec = spec === 'all' || d.especialidad === spec;
      const matchesStatus = status === 'all' || d.estado === status;
      return matchesTerm && matchesSpec && matchesStatus;
    });
  }

  /**
   * Genera las iniciales a partir del nombre completo de un docente.
   */
  function initials(name){
    return name.split(' ').filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase();
  }

  /**
   * Devuelve la clase CSS adecuada según el estado del docente.
   */
  function statusClass(estado){
    return estado === 'ACTIVO' ? 'status-activo' : 'status-licencia';
  }

  /**
   * Renderiza las filas de la tabla correspondientes a la página actual.
   */
  function render(){
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if(page > totalPages) page = totalPages;
    const start = (page - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    if(resultsCount) resultsCount.innerHTML = `RESULTADOS: <strong>${filtered.length}</strong>`;

    if(!pageItems.length){
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>No se encontraron docentes con esos criterios.</p></div></td></tr>`;
    } else {
      tbody.innerHTML = pageItems.map(d => {
        const pct = Math.round((d.horas / d.max) * 100);
        const over = d.horas > d.max;
        const barClass = over ? 'danger' : pct >= 85 ? 'warn' : '';
        return `
        <tr>
          <td>
            <div class="person-cell">
              <div class="mini-avatar">${initials(d.nombre)}</div>
              <div>
                <div style="font-weight:700;">${d.nombre}</div>
                <div style="color:var(--text-faint);font-size:.78rem;">${d.correo}</div>
              </div>
            </div>
          </td>
          <td>${d.doc}</td>
          <td><span class="tag" style="color:var(--navy-700);border-color:var(--navy-100);background:var(--blue-tint);">${d.especialidad}</span></td>
          <td>
            <div class="load-cell">
              <div class="load-top"><span>${d.horas} / ${d.max} hrs</span><span class="${over ? 'over' : ''}">${over ? 'OVER' : pct + '%'}</span></div>
              <div class="progress ${barClass}"><span style="width:${Math.min(pct,100)}%"></span></div>
            </div>
          </td>
          <td><span class="status-pill ${statusClass(d.estado)}">${d.estado === 'ACTIVO' ? '● ACTIVO' : '● LICENCIA'}</span></td>
          <td>
            <div class="row-actions">
              <button class="row-icon-btn" title="Ver desempeño" type="button">${ICONS.trend}</button>
              <button class="row-icon-btn" title="Editar" type="button">${ICONS.edit}</button>
            </div>
          </td>
        </tr>`;
      }).join('');
    }

    renderPagination(totalPages, filtered.length, start, pageItems.length);
  }

  /**
   * Construye y vincula los controles numéricos de la paginación.
   */
  function renderPagination(totalPages, totalItems, start, shown){
    if(!pagination) return;
    if(totalPages <= 1){ pagination.innerHTML = ''; return; }
    let html = `<button class="page-btn" data-page="prev" ${page===1?'disabled':''} aria-label="Anterior">${ICONS.chevronLeft}</button>`;
    for(let i=1;i<=totalPages;i++){
      html += `<button class="page-btn ${i===page?'active':''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" data-page="next" ${page===totalPages?'disabled':''} aria-label="Siguiente">${ICONS.chevronRight}</button>`;
    pagination.innerHTML = html;

    pagination.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.page;
        if(target === 'prev') page = Math.max(1, page - 1);
        else if(target === 'next') page = Math.min(totalPages, page + 1);
        else page = Number(target);
        render();
      });
    });
  }

  // Eventos para reiniciar la paginación a la página 1 al interactuar con los filtros
  [searchInput, specialtySelect, statusSelect].forEach(el => {
    if(!el) return;
    el.addEventListener('input', () => { page = 1; render(); });
    el.addEventListener('change', () => { page = 1; render(); });
  });

  render();
}

/* Íconos SVG reutilizados dentro del JS (misma familia que el HTML) */
const ICONS = {
  trend:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>`,
  edit:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  chevronLeft:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  chevronRight:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
};

/*js reporte*/
document.addEventListener('DOMContentLoaded', () => {
  // Datos iniciales para la tabla de Logs de actividad
  const initialLogs = [
    {
      timestamp: '2024-10-25 14:22:10',
      adminName: 'Juan Delgado',
      adminInitials: 'JD',
      module: 'Matrículas',
      action: 'Modificación de estatus: Alumno #99281 a "Activo"',
      status: 'AUDITADO'
    },
    {
      timestamp: '2024-10-25 13:45:02',
      adminName: 'María Rojas',
      adminInitials: 'MR',
      module: 'Docentes',
      action: 'Carga masiva de calificaciones 3er Lapso - Curso 4-B',
      status: 'AUDITADO'
    },
    {
      timestamp: '2024-10-25 11:10:55',
      adminName: 'System Admin',
      adminInitials: 'SA',
      module: 'Seguridad',
      action: 'Intento de acceso fallido desde IP 192.168.1.104',
      status: 'ALERTA'
    },
    {
      timestamp: '2024-10-25 09:30:15',
      adminName: 'Juan Delgado',
      adminInitials: 'JD',
      module: 'Reportes',
      action: 'Generación de Certificado Legal PDF Alumno #10223',
      status: 'AUDITADO'
    }
  ];

  const logsTableBody = document.getElementById('logsTableBody');
  const logSearch = document.getElementById('logSearch');
  const paginationContainer = document.getElementById('logsPagination');

  // Renderizado de Filas de la Tabla
  const renderLogs = (logs) => {
    if (!logsTableBody) return;
    logsTableBody.innerHTML = '';

    logs.forEach(log => {
      const row = document.createElement('tr');
      const isAlert = log.status === 'ALERTA';

      row.innerHTML = `
        <td class="timestamp">${log.timestamp}</td>
        <td>
          <div class="admin-cell">
            <span class="avatar-initials">${log.adminInitials}</span>
            <span>${log.adminName}</span>
          </div>
        </td>
        <td>${log.module}</td>
        <td>${log.action}</td>
        <td class="text-right">
          <span class="status-badge ${isAlert ? 'status-alerta' : 'status-auditado'}">
            ${log.status}
          </span>
        </td>
      `;
      logsTableBody.appendChild(row);
    });
  };

  // Renderizado de Paginación Simulado
  const renderPagination = () => {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = `
      <button>&lt;</button>
      <button class="active">1</button>
      <button>2</button>
      <button>&gt;</button>
    `;
  };

  // Buscador de Actividad en Tiempo Real
  if (logSearch) {
    logSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filteredLogs = initialLogs.filter(log => 
        log.adminName.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.module.toLowerCase().includes(query)
      );
      renderLogs(filteredLogs);
    });
  }

  // Interacción en Botones de Generación
  document.getElementById('btnBoletines')?.addEventListener('click', () => {
    alert('Iniciando procesamiento y generación masiva de boletines...');
  });

  document.getElementById('btnConstancia')?.addEventListener('click', () => {
    alert('Generando documento: Constancia de Estudio...');
  });

  document.getElementById('btnNotas')?.addEventListener('click', () => {
    alert('Generando documento: Notas Certificadas...');
  });

  // Carga inicial
  renderLogs(initialLogs);
  renderPagination();
});
