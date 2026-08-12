document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".period-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      // Los datos mostrados son de ejemplo; al conectar el backend,
      // aquí se debe recargar la tabla según tab.dataset.periodo.
    });
  });
});