/**
 * Módulo de Gestión de Biblioteca y Reserva de Libros
 * Permite filtrar tarjetas de libros por texto de búsqueda y categorías, 
 * además de gestionar el estado de reserva de los ejemplares disponibles.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a los elementos del DOM para la interfaz de búsqueda y filtros
  const searchInput = document.getElementById("bookSearch");
  const chips = document.querySelectorAll(".chip[data-cat]");
  const cards = document.querySelectorAll(".book-card");

  // Estado inicial de la categoría activa ("todas" por defecto)
  let activeCat = "todas";

  /**
   * Filtra las tarjetas de libros evaluando simultáneamente 
   * el texto ingresado en el buscador y la categoría seleccionada.
   */
  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      // Extrae la información del libro desde los atributos de datos (data-attributes)
      const title = card.dataset.title.toLowerCase();
      const cat = card.dataset.cat;

      // Condicionales de coincidencia
      const matchesText = title.includes(term);
      const matchesCat = activeCat === "todas" || cat === activeCat;

      // Alterna la visibilidad de la tarjeta según los filtros
      card.style.display = matchesText && matchesCat ? "" : "none";
    });
  }

  // Evento de escucha para el campo de búsqueda de libros
  searchInput?.addEventListener("input", applyFilters);

  // Asignación de eventos de clic a los botones de categoría (chips)
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      // Actualiza las clases visuales del grupo de fichas
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      // Establece la categoría seleccionada y aplica el filtro
      activeCat = chip.dataset.cat;
      applyFilters();
    });
  });

  // Acciones para la interacción con los botones "Reservar" habilitados
  document.querySelectorAll(".book-card__btn:not(:disabled)").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Cambia la apariencia y desactiva el botón tras la acción del usuario
      btn.textContent = "Reservado";
      btn.disabled = true;
    });
  });
});