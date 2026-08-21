/**
 * Módulo de Filtro de Cursos
 * Gestiona el filtrado dinámico de tarjetas de cursos por texto de búsqueda y áreas temáticas.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Elementos de la interfaz de usuario
  const searchInput = document.getElementById("courseSearch");
  const chips = document.querySelectorAll(".chip[data-area]");
  const cards = document.querySelectorAll(".course-card");

  // Estado del filtro de área (Por defecto muestra todas)
  let activeArea = "todas";

  /**
   * Aplica los filtros de búsqueda por texto y por área temática sobre las tarjetas.
   */
  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      // Obtiene la información del curso a partir de los atributos data-*
      const title = card.dataset.title.toLowerCase();
      const area = card.dataset.area;

      // Evalúa la correspondencia con el término introducido y el área seleccionada
      const matchesText = title.includes(term);
      const matchesArea = activeArea === "todas" || area === activeArea;

      // Muestra u oculta la tarjeta según el resultado de las condiciones
      card.style.display = matchesText && matchesArea ? "" : "none";
    });
  }

  // Listener para la búsqueda en tiempo real mediante el campo de texto
  searchInput?.addEventListener("input", applyFilters);

  // Listeners para los botones de selección por área (chips)
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      // Actualiza el estado visual del chip seleccionado
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      // Establece el área activa y ejecuta el filtrado
      activeArea = chip.dataset.area;
      applyFilters();
    });
  });
});
