/**
 * Módulo de Navegación Semanal
 * Permite alternar entre semanas anteriores y futuras en la interfaz del horario o agenda.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a los elementos del DOM para la etiqueta y los botones de navegación
  const label = document.getElementById("weekLabel");
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");

  // Offset para controlar la semana actual (0 representa la semana base de referencia)
  let weekOffset = 0;
  const baseLabel = "20 - 24 Oct, 2026";

  /**
   * Actualiza el texto visible en la etiqueta del selector de semana
   * según el offset acumulado.
   */
  function render() {
    if (weekOffset === 0) {
      label.textContent = baseLabel;
    } else {
      label.textContent = `Semana ${weekOffset > 0 ? "+" : ""}${weekOffset}`;
    }
  }

  // Evento para retroceder a la semana anterior
  prevBtn?.addEventListener("click", () => {
    weekOffset -= 1;
    render();
  });

  // Evento para avanzar a la semana siguiente
  nextBtn?.addEventListener("click", () => {
    weekOffset += 1;
    render();
  });

  // Renderizado inicial
  render();
});