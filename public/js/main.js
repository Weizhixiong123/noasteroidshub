(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav-links]");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Copy-to-clipboard utility for save file paths
  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-target");
      const codeEl = targetId ? document.getElementById(targetId) : null;
      if (!codeEl) return;
      const text = codeEl.textContent.trim();
      const original = btn.textContent;

      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied!";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(codeEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = "Selected";
      }

      setTimeout(() => {
        btn.textContent = original;
      }, 1600);
    });
  });
})();
