document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("bookSearch");
  const chips = document.querySelectorAll(".chip[data-cat]");
  const cards = document.querySelectorAll(".book-card");

  let activeCat = "todas";

  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const cat = card.dataset.cat;

      const matchesText = title.includes(term);
      const matchesCat = activeCat === "todas" || cat === activeCat;

      card.style.display = matchesText && matchesCat ? "" : "none";
    });
  }

  searchInput?.addEventListener("input", applyFilters);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeCat = chip.dataset.cat;
      applyFilters();
    });
  });

  // Botones "Reservar" en libros disponibles
  document.querySelectorAll(".book-card__btn:not(:disabled)").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.textContent = "Reservado";
      btn.disabled = true;
    });
  });
});