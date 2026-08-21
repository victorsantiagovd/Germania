/**
 * Módulo de Autenticación, Recuperación de Contraseña y Gestión de Sesión
 * Administra las interacciones del login, validación de formularios y persistencia de sesión local.
 */

// ==================== LÓGICA DE INICIO DE SESIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM para la interacción con la contraseña
    const toggleBtn = document.getElementById('toggle-password');
    const toggleIcon = document.getElementById('toggle-password-icon');
    const passwordInput = document.getElementById('password');

    // Muestra u oculta la contraseña y actualiza accesibilidad (ARIA)
    toggleBtn?.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        toggleIcon.textContent = isHidden ? 'visibility_off' : 'visibility';
        toggleBtn.setAttribute('aria-pressed', String(isHidden));
        toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    // Actualiza dinámicamente el texto del botón según el rol seleccionado
    const roleLabels = { admin: 'Administrador', teacher: 'Profesor', student: 'Estudiante' };
    const submitLabel = document.getElementById('submit-label');

    document.querySelectorAll('input[name="role"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            if (submitLabel) {
                submitLabel.textContent = `Iniciar sesión como ${roleLabels[e.target.value]}`;
            }
        });
    });

    // Validaciones e interacción del formulario de inicio de sesión
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const emailField = document.getElementById('email-field');
    const passwordField = document.getElementById('password-field');
    const formStatus = document.getElementById('form-status');

    /**
     * Valida la estructura de una dirección de correo electrónico.
     */
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasError = false;

        // Validación del campo de correo
        if (!isValidEmail(emailInput.value.trim())) {
            emailField.classList.add('field-invalid');
            hasError = true;
        } else {
            emailField.classList.remove('field-invalid');
        }

        // Validación del campo de contraseña (mínimo 8 caracteres)
        if (passwordInput.value.length < 8) {
            passwordField.classList.add('field-invalid');
            hasError = true;
        } else {
            passwordField.classList.remove('field-invalid');
        }

        // Muestra mensaje global si existen errores
        if (hasError) {
            formStatus.textContent = 'Revisa los campos marcados en rojo antes de continuar.';
            formStatus.classList.add('is-visible');
            return;
        }

        formStatus.classList.remove('is-visible');

        // Construcción del objeto de envío de datos
        const selectedRole = document.querySelector('input[name="role"]:checked').value;
        const payload = {
            role: selectedRole,
            email: emailInput.value.trim(),
            password: passwordInput.value,
            remember: document.getElementById('remember')?.checked || false,
        };

        console.log('Formulario válido, listo para enviar al backend:', payload);
        // TODO: Reemplazar con integración a API real mediante fetch()
    });
});

// ==================== LÓGICA DE RECUPERACIÓN DE CONTRASEÑA ====================
document.addEventListener("DOMContentLoaded", () => {
    const recoveryForm = document.getElementById("recoveryForm");
    
    if (recoveryForm) {
        const emailInput = document.getElementById("email");
        const emailError = document.getElementById("emailError");
        const submitBtn = document.getElementById("submitBtn");
        const btnText = document.getElementById("btnText");
        const btnIcon = document.getElementById("btnIcon");
        const successMessage = document.getElementById("successMessage");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Procesa el envío del formulario de recuperación
        recoveryForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const value = emailInput.value.trim();

            // Valida el formato del correo
            if (!emailRegex.test(value)) {
                emailError.classList.remove("hidden");
                emailInput.classList.add("input-error");
                return;
            }

            emailError.classList.add("hidden");
            emailInput.classList.remove("input-error");

            // Simulación del estado de carga durante el envío
            submitBtn.disabled = true;
            btnText.textContent = "Enviando...";
            btnIcon.className = "spinner";

            setTimeout(() => {
                // Restablece el estado del botón
                submitBtn.disabled = false;
                btnText.textContent = "Enviar Instrucciones";
                btnIcon.className = "material-symbols-outlined";
                btnIcon.textContent = "arrow_forward";

                // Muestra la alerta de éxito y limpia el formulario
                successMessage.classList.remove("hidden");
                recoveryForm.reset();

                // Oculta el mensaje de éxito tras 6 segundos
                setTimeout(() => {
                    successMessage.classList.add("hidden");
                }, 6000);
            }, 1500);
        });

        // Limpia las alertas de error mientras el usuario escribe
        emailInput.addEventListener("input", () => {
            if (!emailError.classList.contains("hidden")) {
                emailError.classList.add("hidden");
                emailInput.classList.remove("input-error");
            }
        });
    }
});

// ==================== GESTIÓN DE SESIÓN DE USUARIO ====================
// Clave para el almacenamiento de datos de sesión en localStorage.
const SESSION_KEY = "germania_session";

/**
 * Guarda la sesión activa en el almacenamiento local y redirige al dashboard.
 * @param {Object} param0 - Contiene las propiedades usuario y rol.
 */
function login({ usuario, rol }) {
    const session = {
        usuario,
        rol,
        nombre: usuario,
        iniciadoEn: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.location.href = "index.html";
}

/**
 * Elimina la sesión guardada y redirige a la pantalla de login.
 */
function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}

/**
 * Recupera la información de la sesión activa desde localStorage.
 * @returns {Object|null} Datos de la sesión o null si no existe.
 */
function getCurrentUser() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

/**
 * Verifica la existencia de una sesión activa; si no existe, redirige al login.
 * Debe ejecutarse al cargar páginas protegidas.
 */
function requireSession() {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
    }
}

// Vincula automáticamente el evento de cierre de sesión al elemento #logoutBtn si existe
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
    });
});