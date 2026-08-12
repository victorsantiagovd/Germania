document.addEventListener("DOMContentLoaded", () => {
  const sesion = getCurrentUser();
  const nombreEl = document.getElementById("welcomeName");

  if (sesion && nombreEl) {
    nombreEl.textContent = "Bienvenido de nuevo, " + sesion.nombre;
  }
});