/**
 * Módulo de Navegación por Periodos Académicos
 * Gestiona el cambio de pestañas para filtrar las calificaciones e informes por periodo.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene todas las pestañas de selección de periodo
  const tabs = document.querySelectorAll(".period-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remueve el estado activo de todas las pestañas
      tabs.forEach((t) => t.classList.remove("is-active"));
      
      // Activa la pestaña seleccionada por el usuario
      tab.classList.add("is-active");

      // NOTA: Los datos mostrados son de ejemplo.
      // Al conectar con el backend real, aquí se debe invocar la función de carga
      // enviando el identificador del periodo: tab.dataset.periodo
    });
  });
});