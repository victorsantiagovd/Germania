document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item[data-nav]");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      navItems.forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");
    });
  });

  // Toggle del menú en vista móvil (requiere un botón con id="menuToggle")
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");

  menuToggle?.addEventListener("click", () => {
    sidebar?.classList.toggle("is-open");
  });
});