document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("globalSearch");

  if (!input) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = input.value.trim();
      if (!query) return;

      // redirige al inventario con el texto
      window.location.href = `Inventory Page.html?search=${encodeURIComponent(query)}`;
    }
  });
});


if (window.location.pathname.includes("Inventory")) {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("search");

  if (search) {
    const cards = document.querySelectorAll("[data-vehicle]");
    const term = search.toLowerCase();

    cards.forEach(card => {
      const text = card.dataset.vehicle.toLowerCase();
      card.style.display = text.includes(term) ? "" : "none";
    });
  }
}
