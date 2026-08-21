/**
 * Módulo de Personalización de Bienvenida
 * Actualiza dinámicamente el mensaje de la interfaz con el nombre del usuario autenticado.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene los datos de la sesión activa desde el módulo de autenticación
  const sesion = getCurrentUser();
  const nombreEl = document.getElementById("welcomeName");

  // Si existe una sesión activa y el elemento contenedor está presente en el DOM,
  // inserta el nombre del usuario en el mensaje de bienvenida
  if (sesion && nombreEl) {
    nombreEl.textContent = "Bienvenido de nuevo, " + sesion.nombre;
  }
});