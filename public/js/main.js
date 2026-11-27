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

  // Ad slots: load only the banner size that fits this screen, when it nears the viewport.
  const adBoxes = Array.from(document.querySelectorAll("[data-ad-sizes]"));
  const pickSize = (spec) => {
    for (const part of spec.split(",")) {
      const [size, min] = part.trim().split("@");
      if (!min || window.matchMedia(`(min-width: ${min}px)`).matches) return size;
    }
    return null;
  };
  const loadAd = (box) => {
    if (box.dataset.adLoaded) return;
    const size = pickSize(box.dataset.adSizes || "");
    if (!size) return;
    const [w, h] = size.split("x");
    const frame = document.createElement("iframe");
    frame.className = "ad-frame";
    frame.title = "Advertisement";
    frame.width = w;
    frame.height = h;
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("loading", "lazy");
    frame.src = `/ads/${size}.html`;
    box.style.setProperty("--ad-w", `${w}px`);
    box.style.setProperty("--ad-h", `${h}px`);
    box.appendChild(frame);
    box.dataset.adLoaded = "1";
  };
  if (adBoxes.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadAd(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "300px 0px" }
      );
      adBoxes.forEach((box) => io.observe(box));
    } else {
      adBoxes.forEach(loadAd);
    }
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
