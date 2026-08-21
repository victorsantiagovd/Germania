/* ============================================================
   registrodoce.js
   Validación en cliente + Simulación Frontend de guardado (localStorage).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos principales del formulario
  const form = document.getElementById('form-docente');
  const submitBtn = form.querySelector('.btn-primary');
  const fileInput = document.getElementById('input-expediente');
  const fileLabel = document.getElementById('upload-filename');

  // --- Modal de confirmación de guardado ---
  const modal = document.getElementById('modal-exito');
  const modalNombre = document.getElementById('modal-exito-nombre');
  const modalOtroBtn = document.getElementById('modal-exito-otro');

  /**
   * Abre el modal de confirmación con el nombre del docente recién guardado.
   * @param {string} nombreDocente - Nombre del docente registrado.
   */
  function abrirModalExito(nombreDocente) {
    modalNombre.textContent = nombreDocente || 'el docente';
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
    if (modalOtroBtn) modalOtroBtn.focus();
  }

  /**
   * Cierra el modal de confirmación con una pequeña transición.
   */
  function cerrarModalExito() {
    modal.classList.remove('modal-visible');
    setTimeout(() => { modal.hidden = true; }, 180);
  }

  // Eventos para interactuar con el modal de éxito
  if (modalOtroBtn) {
    modalOtroBtn.addEventListener('click', () => {
      cerrarModalExito();
      const inputNombre = document.getElementById('nombre-completo');
      if (inputNombre) inputNombre.focus();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModalExito();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) cerrarModalExito();
  });

  // --- Mostrar el nombre del archivo elegido ---
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileLabel.textContent = fileInput.files[0].name;
      } else {
        fileLabel.textContent = 'Adjuntar Documentación';
      }
    });
  }

  // --- Reglas de validación por campo ---
  const validators = {
    'nombre-completo': (v) => v.trim().length >= 3 || 'Ingresa el nombre completo del docente.',
    'numero-id': (v) => /^[0-9.]{6,15}$/.test(v.trim()) || 'Ingresa un número de identificación válido.',
    'fecha-nacimiento': (v) => {
      if (!v) return 'Selecciona la fecha de nacimiento.';
      const edad = calcularEdad(v);
      return edad >= 18 || 'El docente debe ser mayor de edad.';
    },
    'genero': (v) => v !== '' || 'Selecciona una opción.',
    'titulo-academico': (v) => v.trim().length >= 3 || 'Ingresa el título académico.',
    'especialidad': (v) => v.trim().length >= 2 || 'Ingresa la especialidad.',
    'anos-experiencia': (v) => (v !== '' && Number(v) >= 0) || 'Ingresa un número válido de años.',
    'tipo-contrato': (v) => v !== '' || 'Selecciona el tipo de contrato.',
    'fecha-ingreso': (v) => v !== '' || 'Selecciona la fecha de ingreso.',
  };

  /**
   * Calcula la edad exacta en años a partir de una fecha ISO.
   */
  function calcularEdad(fechaISO) {
    const nacimiento = new Date(fechaISO);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }

  /**
   * Muestra u oculta los mensajes de error visuales en la interfaz.
   */
  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = form.querySelector(`[data-error-for="${fieldId}"]`);
    const wrapper = field ? field.closest('.field') : null;
    if (errorEl) errorEl.textContent = message || '';
    if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
  }

  /**
   * Ejecuta el validador asociado a un campo individual por su ID.
   */
  function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field || !validators[fieldId]) return true;
    const result = validators[fieldId](field.value);
    if (result === true) {
      setError(fieldId, '');
      return true;
    }
    setError(fieldId, result);
    return false;
  }

  /**
   * Valida la selección del grupo de opciones de sede.
   */
  function validateSede() {
    const checked = form.querySelector('input[name="sede"]:checked');
    const errorEl = form.querySelector('[data-error-for="sede"]');
    if (!checked) {
      if (errorEl) errorEl.textContent = 'Selecciona la sede asignada.';
      return false;
    }
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  // Activa la validación al perder el foco en cada campo
  Object.keys(validators).forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) field.addEventListener('blur', () => validateField(fieldId));
  });

  form.querySelectorAll('input[name="sede"]').forEach((radio) => {
    radio.addEventListener('change', validateSede);
  });

  // --- Envío del formulario (Simulado en Frontend) ---
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Previene la recarga del archivo local

    // Revisa exhaustivamente todos los campos requeridos
    const fieldIds = Object.keys(validators);
    const results = fieldIds.map(validateField);
    const sedeValida = validateSede();
    const esValido = results.every(Boolean) && sedeValida;

    if (!esValido) {
      const primerError = form.querySelector('.has-error input, .has-error select') ||
        form.querySelector('input[name="sede"]');
      if (primerError) primerError.focus();
      mostrarToast('Revisa los campos marcados en rojo.', true);
      return;
    }

    const nombreDocente = document.getElementById('nombre-completo').value.trim();

    // Cambiar estado visual del botón
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    // Capturar las credenciales marcadas en el checklist
    const credencialesMarcadas = Array.from(
      form.querySelectorAll('input[name="credenciales"]:checked')
    ).map(cb => cb.value);

    // Objeto con la información recolectada
    const nuevoDocente = {
      id: Date.now(),
      nombreCompleto: nombreDocente,
      numeroIdentificacion: document.getElementById('numero-id').value.trim(),
      fechaNacimiento: document.getElementById('fecha-nacimiento').value,
      genero: document.getElementById('genero').value,
      tituloAcademico: document.getElementById('titulo-academico').value.trim(),
      especialidad: document.getElementById('especialidad').value.trim(),
      anosExperiencia: document.getElementById('anos-experiencia').value,
      sede: form.querySelector('input[name="sede"]:checked').value,
      tipoContrato: document.getElementById('tipo-contrato').value,
      fechaIngreso: document.getElementById('fecha-ingreso').value,
      credenciales: credencialesMarcadas
    };

    // SIMULACIÓN DE TIEMPO DE ESPERA (800 ms)
    setTimeout(() => {
      // Guardar localmente en el navegador
      const docentesExistentes = JSON.parse(localStorage.getItem('docentes_demo') || '[]');
      docentesExistentes.push(nuevoDocente);
      localStorage.setItem('docentes_demo', JSON.stringify(docentesExistentes));

      // Restaurar formulario y botón
      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar Docente';
      form.reset();
      if (fileLabel) fileLabel.textContent = 'Adjuntar Documentación';

      // Abrir modal con la confirmación de éxito
      abrirModalExito(nombreDocente);
    }, 800);
  });

  /**
   * Muestra una notificación emergente del tipo Toast.
   */
  function mostrarToast(mensaje, esError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast' + (esError ? ' toast-error' : '');
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-visible'));
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }
});