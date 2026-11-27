(() => {
  document.querySelectorAll("[data-filter-root]").forEach((root) => {
    const rows = Array.from(root.querySelectorAll("[data-filter-item]"));
    const btns = Array.from(root.querySelectorAll("[data-filter-btn]"));
    const search = root.querySelector("[data-filter-search]");
    const empty = root.querySelector("[data-filter-empty]");

    let activeCat = "all";

    const runFilter = () => {
      const q = (search?.value || "").trim().toLowerCase();
      let shown = 0;

      rows.forEach((row) => {
        const cat = row.getAttribute("data-filter-cat") || "";
        const text = (row.getAttribute("data-filter-text") || row.textContent || "").toLowerCase();
        const okCat = activeCat === "all" || cat === activeCat;
        const okQ = !q || text.includes(q);
        const visible = okCat && okQ;
        row.classList.toggle("hidden", !visible);
        if (visible) shown += 1;
      });

      if (empty) {
        empty.classList.toggle("hidden", shown > 0);
      }
    };

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCat = btn.getAttribute("data-filter-btn") || "all";
        btns.forEach((b) => b.classList.toggle("active", b === btn));
        runFilter();
      });
    });

    if (search) {
      search.addEventListener("input", runFilter);
    }

    runFilter();
  });
})();
