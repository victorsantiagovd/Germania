document.addEventListener('DOMContentLoaded', () => {
    // --- Mostrar / ocultar contraseña ---
    const toggleBtn = document.getElementById('toggle-password');
    const toggleIcon = document.getElementById('toggle-password-icon');
    const passwordInput = document.getElementById('password');

    toggleBtn.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        toggleIcon.textContent = isHidden ? 'visibility_off' : 'visibility';
        toggleBtn.setAttribute('aria-pressed', String(isHidden));
        toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    // --- Texto del botón según el rol elegido ---
    const roleLabels = { admin: 'Administrador', teacher: 'Profesor', student: 'Estudiante' };
    const submitLabel = document.getElementById('submit-label');

    document.querySelectorAll('input[name="role"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            submitLabel.textContent = `Iniciar sesión como ${roleLabels[e.target.value]}`;
        });
    });

    // --- Validación del formulario ---
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const emailField = document.getElementById('email-field');
    const passwordField = document.getElementById('password-field');
    const formStatus = document.getElementById('form-status');

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasError = false;

        if (!isValidEmail(emailInput.value.trim())) {
            emailField.classList.add('field-invalid');
            hasError = true;
        } else {
            emailField.classList.remove('field-invalid');
        }

        if (passwordInput.value.length < 8) {
            passwordField.classList.add('field-invalid');
            hasError = true;
        } else {
            passwordField.classList.remove('field-invalid');
        }

        if (hasError) {
            formStatus.textContent = 'Revisa los campos marcados en rojo antes de continuar.';
            formStatus.classList.add('is-visible');
            return;
        }

        formStatus.classList.remove('is-visible');

        // Rol seleccionado, listo para enviar al backend (por ejemplo /login en app.js)
        const selectedRole = document.querySelector('input[name="role"]:checked').value;
        const payload = {
            role: selectedRole,
            email: emailInput.value.trim(),
            password: passwordInput.value,
            remember: document.getElementById('remember').checked,
        };

        console.log('Formulario válido, listo para enviar al backend:', payload);
        // TODO: conectar con el endpoint real, ej:
        // fetch('/api/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) })
    });
});

document.addEventListener("DOMContentLoaded", () => {
  // Lógica para el formulario de recuperación de contraseña
  const recoveryForm = document.getElementById("recoveryForm");
  
  if (recoveryForm) {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const btnIcon = document.getElementById("btnIcon");
    const successMessage = document.getElementById("successMessage");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    recoveryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const value = emailInput.value.trim();

      if (!emailRegex.test(value)) {
        emailError.classList.remove("hidden");
        emailInput.classList.add("input-error");
        return;
      }

      emailError.classList.add("hidden");
      emailInput.classList.remove("input-error");

      // Simular estado de carga
      submitBtn.disabled = true;
      btnText.textContent = "Enviando...";
      btnIcon.className = "spinner";

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = "Enviar Instrucciones";
        btnIcon.className = "material-symbols-outlined";
        btnIcon.textContent = "arrow_forward";

        successMessage.classList.remove("hidden");
        recoveryForm.reset();

        setTimeout(() => {
          successMessage.classList.add("hidden");
        }, 6000);
      }, 1500);
    });

    emailInput.addEventListener("input", () => {
      if (!emailError.classList.contains("hidden")) {
        emailError.classList.add("hidden");
        emailInput.classList.remove("input-error");
      }
    });
  }
});