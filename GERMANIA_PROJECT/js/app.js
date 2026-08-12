/* Mis cursos */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("courseSearch");
  const chips = document.querySelectorAll(".chip[data-area]");
  const cards = document.querySelectorAll(".course-card");

  let activeArea = "todas";

  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const area = card.dataset.area;

      const matchesText = title.includes(term);
      const matchesArea = activeArea === "todas" || area === activeArea;

      card.style.display = matchesText && matchesArea ? "" : "none";
    });
  }

  searchInput?.addEventListener("input", applyFilters);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeArea = chip.dataset.area;
      applyFilters();
    });
  });
});
