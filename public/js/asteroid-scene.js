(() => {
  const TOTAL_VOLUME = 5000000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-asteroid-scene]").forEach((container) => {
    const canvas = container.querySelector("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interactive = container.getAttribute("data-scene-interactive") === "true";
    const chippedEl = container.querySelector("[data-scene-chipped]");
    const volumeEl = container.querySelector("[data-scene-volume]");
    const layerEl = container.querySelector("[data-scene-layer]");

    let remaining = Number(container.getAttribute("data-initial-volume")) || 4400000;
    let chippedPreview = 0;
    let shipX = 0.25;
    let shipDir = 1;
    let laserTimer = 0;
    let laserActive = 0;
    let hitAngle = -1.1;
    let shake = 0;

    const particles = [];
    const stars = Array.from({ length: 42 }, (_, i) => ({
      x: ((i * 73) % 100) / 100,
      y: ((i * 41 + 17) % 88) / 100,
      size: i % 5 === 0 ? 2 : 1,
      alpha: 0.28 + (i % 4) * 0.16
    }));

    const baseVertices = [
      { a: -2.7, r: 0.92 },
      { a: -2.15, r: 1.04 },
      { a: -1.55, r: 0.96 },
      { a: -0.95, r: 1.06 },
      { a: -0.35, r: 0.95 },
      { a: 0.25, r: 1.05 },
      { a: 0.85, r: 0.93 },
      { a: 1.45, r: 1.02 },
      { a: 2.05, r: 0.91 },
      { a: 2.65, r: 1.01 }
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(280, Math.round(rect.width));
      const h = Math.max(210, Math.round(rect.height));
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      return { w, h };
    };

    const getLayerInfo = (pctCleared) => {
      if (pctCleared >= 85) return { name: "Asteroid Core (Antimatter & Dark Matter)", color: "#ef4444" };
      if (pctCleared >= 55) return { name: "Deep Mantle (Plasmite & Neutronium)", color: "#c084fc" };
      if (pctCleared >= 25) return { name: "Mid Crust (Star Gold & Titanium)", color: "#f0c446" };
      return { name: "Outer Crust (Space Ice & Meteoric Iron)", color: "#7dd3fc" };
    };

    const updateReadouts = () => {
      const effectiveRem = Math.max(0, remaining - chippedPreview);
      const pct = ((TOTAL_VOLUME - effectiveRem) / TOTAL_VOLUME) * 100;
      const layer = getLayerInfo(pct);

      if (volumeEl) {
        volumeEl.textContent = `${Math.round(effectiveRem).toLocaleString("en-US")} m³ remaining`;
      }
      if (chippedEl) {
        chippedEl.textContent = `Test-mined: ${chippedPreview.toLocaleString("en-US")} m³`;
      }
      if (layerEl) {
        layerEl.textContent = layer.name;
      }
    };

    const spawnChips = (x, y, color, count = 10) => {
      if (reducedMotion) return;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 4,
          life: 1,
          color
        });
      }
    };

    const drawFrame = () => {
      const { w, h } = resize();
      ctx.clearRect(0, 0, w, h);

      // Void backdrop
      ctx.fillStyle = "#0b0c0f";
      ctx.fillRect(0, 0, w, h);

      // Faint stars
      for (const s of stars) {
        ctx.fillStyle = `rgba(235, 230, 218, ${s.alpha})`;
        ctx.fillRect(s.x * w, s.y * h, s.size, s.size);
      }

      // Distant Earth limb at bottom right
      const earthGrad = ctx.createRadialGradient(w * 0.5, h * 1.48, h * 0.35, w * 0.5, h * 1.48, h * 0.65);
      earthGrad.addColorStop(0, "rgba(59, 130, 246, 0.25)");
      earthGrad.addColorStop(0.75, "rgba(30, 64, 175, 0.14)");
      earthGrad.addColorStop(1, "rgba(11, 12, 15, 0)");
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 1.48, h * 0.65, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(125, 211, 252, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 1.48, h * 0.57, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      const effectiveRem = Math.max(0, remaining - chippedPreview);
      const frac = effectiveRem / TOTAL_VOLUME;
      const pctCleared = (1 - frac) * 100;
      const layer = getLayerInfo(pctCleared);

      // Asteroid geometry scales smoothly with cube-root-like volume feel, clamped visibly
      const minRadius = 18;
      const maxRadius = Math.min(w, h) * 0.31;
      const radius = effectiveRem === 0 ? 0 : minRadius + (maxRadius - minRadius) * Math.pow(frac, 0.42);

      const jitterX = shake > 0 ? (Math.random() - 0.5) * shake : 0;
      const jitterY = shake > 0 ? (Math.random() - 0.5) * shake : 0;
      const cx = w * 0.52 + jitterX;
      const cy = h * 0.56 + jitterY;

      // Orbiting contractor ship
      const sx = w * shipX;
      const sy = h * 0.16;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.fillStyle = "#262b35";
      ctx.strokeStyle = "#e8b325";
      ctx.lineWidth = 1.5;
      ctx.fillRect(-24, -8, 48, 15);
      ctx.strokeRect(-24, -8, 48, 15);
      // Turret mount underneath
      ctx.fillStyle = "#e8b325";
      ctx.fillRect(-6, 7, 12, 5);
      // Thruster glow
      ctx.fillStyle = "#d94832";
      ctx.fillRect(shipDir > 0 ? -28 : 24, -4, 4, 8);
      ctx.restore();

      // Automated ship turret laser pulse
      if (effectiveRem > 0 && (laserActive > 0 || reducedMotion)) {
        const targetX = cx + Math.cos(hitAngle) * (radius * 0.72);
        const targetY = cy + Math.sin(hitAngle) * (radius * 0.72);
        ctx.strokeStyle = reducedMotion ? "rgba(232, 179, 37, 0.45)" : "rgba(245, 200, 76, 0.85)";
        ctx.lineWidth = reducedMotion ? 1.5 : 2.5;
        ctx.setLineDash([7, 5]);
        ctx.beginPath();
        ctx.moveTo(sx, sy + 12);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f5c84c";
        ctx.fillRect(targetX - 3, targetY - 3, 6, 6);
      }

      if (effectiveRem > 0) {
        // Asteroid polygon
        ctx.beginPath();
        baseVertices.forEach((v, idx) => {
          const px = cx + Math.cos(v.a) * radius * v.r;
          const py = cy + Math.sin(v.a) * radius * v.r;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();

        ctx.fillStyle = "#1c1f26";
        ctx.fill();
        ctx.strokeStyle = "#4d5361";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Facet shadow
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let i = 4; i <= 8; i += 1) {
          const v = baseVertices[i];
          ctx.lineTo(cx + Math.cos(v.a) * radius * v.r, cy + Math.sin(v.a) * radius * v.r);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(11, 12, 15, 0.46)";
        ctx.fill();

        // Mineral veins revealed by depth
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.42, cy - radius * 0.18);
        ctx.lineTo(cx - radius * 0.12, cy + radius * 0.06);
        ctx.lineTo(cx + radius * 0.25, cy - radius * 0.28);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + radius * 0.08, cy + radius * 0.36);
        ctx.lineTo(cx + radius * 0.44, cy + radius * 0.14);
        ctx.stroke();

        // Core hotspot when > 45% cleared
        if (pctCleared > 45) {
          ctx.fillStyle = pctCleared > 80 ? "#ef4444" : "#c084fc";
          ctx.fillRect(cx - 5, cy - 5, 10, 10);
        }
      } else {
        // Earth Saved state
        ctx.fillStyle = "#3fa36c";
        ctx.font = '700 14px "IBM Plex Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText("0 m³ REMAINING — EARTH SAVED", w / 2, h * 0.52);
      }

      // Debris chips
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;
      }

      if (!reducedMotion) {
        shipX += 0.0014 * shipDir;
        if (shipX > 0.78) shipDir = -1;
        if (shipX < 0.22) shipDir = 1;

        laserTimer += 1;
        if (laserTimer > 75) {
          laserTimer = 0;
          laserActive = 18;
          hitAngle = -2.2 + Math.random() * 1.4;
          if (effectiveRem > 0) {
            const tx = cx + Math.cos(hitAngle) * (radius * 0.72);
            const ty = cy + Math.sin(hitAngle) * (radius * 0.72);
            spawnChips(tx, ty, "#e8b325", 5);
          }
        }
        if (laserActive > 0) laserActive -= 1;
        if (shake > 0) shake *= 0.8;
        if (shake < 0.2) shake = 0;

        requestAnimationFrame(drawFrame);
      }
    };

    if (interactive) {
      canvas.style.cursor = "crosshair";
      canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const effectiveRem = Math.max(0, remaining - chippedPreview);
        if (effectiveRem <= 0) return;

        chippedPreview = Math.min(remaining, chippedPreview + 12500);
        shake = 4;
        const pct = ((TOTAL_VOLUME - Math.max(0, remaining - chippedPreview)) / TOTAL_VOLUME) * 100;
        const layer = getLayerInfo(pct);
        spawnChips(x, y, layer.color, 12);
        updateReadouts();
        if (reducedMotion) drawFrame();
      });
    }

    window.addEventListener("asteroid:volumeChange", (event) => {
      const nextRem = Number(event.detail?.remaining);
      if (!Number.isNaN(nextRem)) {
        remaining = Math.max(0, Math.min(TOTAL_VOLUME, nextRem));
        chippedPreview = 0;
        updateReadouts();
        if (reducedMotion) drawFrame();
      }
    });

    updateReadouts();
    drawFrame();
  });
})();
