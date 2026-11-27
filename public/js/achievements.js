(() => {
  const root = document.querySelector("[data-ach-tracker]");
  if (!root) return;

  const STORAGE_KEY = "noasteroidshub_achievements_v1";

  const items = Array.from(root.querySelectorAll("[data-ach-item]"));
  const filterBtns = Array.from(root.querySelectorAll("[data-ach-filter]"));
  const searchInput = root.querySelector("[data-ach-search]");
  const countEl = root.querySelector("[data-ach-count]");
  const fillEl = root.querySelector("[data-ach-fill]");
  const resetBtn = root.querySelector("[data-ach-reset]");
  const exportBtn = root.querySelector("[data-ach-export]");
  const emptyState = root.querySelector("[data-ach-empty]");

  let activeCategory = "all";

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  };

  let checkedSet = loadState();

  const saveState = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checkedSet)));
    } catch {
      // Ignore storage quota errors in restricted browsing modes
    }
  };

  const updateSummary = () => {
    const done = items.filter((item) => checkedSet.has(item.getAttribute("data-ach-id"))).length;
    const totalTracked = items.length;
    const pct = totalTracked > 0 ? (done / totalTracked) * 100 : 0;
    if (countEl) {
      countEl.textContent = `${done} / ${totalTracked} unlocked`;
    }
    if (fillEl) {
      fillEl.style.width = `${pct.toFixed(1)}%`;
    }
  };

  const applyFilters = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const cat = item.getAttribute("data-ach-cat") || "";
      const text = (item.getAttribute("data-ach-text") || "").toLowerCase();
      const matchesCat = activeCategory === "all" || cat === activeCategory;
      const matchesQuery = !query || text.includes(query);
      const show = matchesCat && matchesQuery;
      item.classList.toggle("hidden", !show);
      if (show) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle("hidden", visibleCount > 0);
    }
  };

  items.forEach((item) => {
    const id = item.getAttribute("data-ach-id");
    const box = item.querySelector('input[type="checkbox"]');
    if (!id || !box) return;

    const isChecked = checkedSet.has(id);
    box.checked = isChecked;
    item.classList.toggle("checked", isChecked);

    box.addEventListener("change", () => {
      if (box.checked) {
        checkedSet.add(id);
      } else {
        checkedSet.delete(id);
      }
      item.classList.toggle("checked", box.checked);
      saveState();
      updateSummary();
    });
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.getAttribute("data-ach-filter") || "all";
      filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      checkedSet.clear();
      items.forEach((item) => {
        const box = item.querySelector('input[type="checkbox"]');
        if (box) box.checked = false;
        item.classList.remove("checked");
      });
      saveState();
      updateSummary();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const payload = {
        game: "No Asteroids (Steam App ID 5527800)",
        exportedAt: new Date().toISOString(),
        checkedCount: checkedSet.size,
        totalCount: items.length,
        checkedIds: Array.from(checkedSet)
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "no-asteroids-achievements-progress.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  updateSummary();
  applyFilters();
})();
