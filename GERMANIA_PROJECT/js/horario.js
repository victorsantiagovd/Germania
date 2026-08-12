document.addEventListener("DOMContentLoaded", () => {
  const label = document.getElementById("weekLabel");
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");

  // Semana de referencia mostrada por defecto (datos estáticos de ejemplo).
  let weekOffset = 0;
  const baseLabel = "20 - 24 Oct, 2026";

  function render() {
    if (weekOffset === 0) {
      label.textContent = baseLabel;
    } else {
      label.textContent = `Semana ${weekOffset > 0 ? "+" : ""}${weekOffset}`;
    }
  }

  prevBtn?.addEventListener("click", () => {
    weekOffset -= 1;
    render();
  });

  nextBtn?.addEventListener("click", () => {
    weekOffset += 1;
    render();
  });

  render();
});