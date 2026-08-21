/**
 * Módulo de Navegación e Interacción de Menú
 * Controla la selección de elementos de navegación y la apertura/cierre de la barra lateral en dispositivos móviles.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Selección de los elementos del menú de navegación
  const navItems = document.querySelectorAll(".nav-item[data-nav]");

  // Gestiona el cambio de estado activo al hacer clic en un elemento de navegación
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      navItems.forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");
    });
  });

  // Referencias para el menú colapsable/desplegable en vista móvil
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

  // Alterna la clase "is-open" para mostrar u ocultar la barra lateral
  menuToggle?.addEventListener("click", () => {
    sidebar?.classList.toggle("is-open");
  });
});