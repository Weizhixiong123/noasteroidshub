(() => {
  const TOTAL_VOLUME = 5000000;
  const TOTAL_DAYS = 90;

  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  document.querySelectorAll("[data-pace-calc]").forEach((root) => {
    const dayInput = root.querySelector("[data-input-day]");
    const remRange = root.querySelector("[data-input-rem-range]");
    const remNumber = root.querySelector("[data-input-rem-number]");
    const avgInput = root.querySelector("[data-input-avg]");
    const crewInput = root.querySelector("[data-input-crew]");

    const outDestroyedPct = root.querySelector("[data-out-pct]");
    const outMined = root.querySelector("[data-out-mined]");
    const outDaysLeft = root.querySelector("[data-out-days-left]");
    const outReqDaily = root.querySelector("[data-out-req-daily]");
    const outPerPlayer = root.querySelector("[data-out-per-player]");
    const outProjDay = root.querySelector("[data-out-proj-day]");
    const outStatus = root.querySelector("[data-out-status]");
    const progressBar = root.querySelector("[data-progress-fill]");
    const tickEls = root.querySelectorAll("[data-milestone]");

    const syncRemaining = (val) => {
      const clean = clamp(Number(val) || 0, 0, TOTAL_VOLUME);
      if (remRange) remRange.value = String(clean);
      if (remNumber) remNumber.value = String(clean);
      return clean;
    };

    const update = (source) => {
      const day = clamp(Number(dayInput?.value) || 1, 1, TOTAL_DAYS);
      if (dayInput && source === dayInput) dayInput.value = String(day);

      let remaining = TOTAL_VOLUME;
      if (source === remRange && remRange) {
        remaining = syncRemaining(remRange.value);
      } else if (remNumber) {
        remaining = syncRemaining(remNumber.value);
      }

      const crew = clamp(Number(crewInput?.value) || 1, 1, 8);
      const customAvg = avgInput && avgInput.value !== "" ? Math.max(0, Number(avgInput.value) || 0) : null;

      const mined = TOTAL_VOLUME - remaining;
      const pct = (mined / TOTAL_VOLUME) * 100;
      const daysRemaining = Math.max(1, TOTAL_DAYS - day + 1);
      const reqDaily = remaining / daysRemaining;
      const reqPerPlayer = reqDaily / crew;

      const effectiveAvg = customAvg !== null ? customAvg : day > 1 ? mined / (day - 1) : mined;

      if (outDestroyedPct) outDestroyedPct.textContent = `${pct.toFixed(1)}%`;
      if (outMined) outMined.textContent = `${fmt(mined)} m³`;
      if (outDaysLeft) outDaysLeft.textContent = `${daysRemaining} days`;
      if (outReqDaily) outReqDaily.textContent = `${fmt(reqDaily)} m³/day`;
      if (outPerPlayer) outPerPlayer.textContent = `${fmt(reqPerPlayer)} m³/player`;
      if (progressBar) progressBar.style.width = `${pct.toFixed(2)}%`;

      tickEls.forEach((el) => {
        const threshold = Number(el.getAttribute("data-milestone")) || 0;
        el.classList.toggle("reached", pct >= threshold);
      });

      if (outProjDay) {
        if (remaining === 0) {
          outProjDay.textContent = "Cleared (Earth saved)";
        } else if (effectiveAvg <= 0) {
          outProjDay.textContent = "No pace entered";
        } else {
          const daysNeeded = Math.ceil(remaining / effectiveAvg);
          const finishDay = day + daysNeeded - 1;
          outProjDay.textContent =
            finishDay <= TOTAL_DAYS
              ? `Day ${finishDay} (on pace)`
              : `Day ${finishDay} (${finishDay - TOTAL_DAYS}d late)`;
        }
      }

      if (outStatus) {
        outStatus.className = "callout";
        if (remaining === 0) {
          outStatus.classList.add("safe");
          outStatus.innerHTML =
            "<strong>Earth saved (0 m³ remaining):</strong> Asteroid cleared. Finish without blacking out to unlock <em>Wide awake</em>.";
        } else if (day <= 15) {
          outStatus.classList.add("yellow");
          outStatus.innerHTML =
            "<strong>Early shift window (Days 1–15):</strong> Buy the Sledgehammer and Drill, then a first ship gun and the Tractor Beam once guns go on sale on Day 15, before judging pace.";
        } else if (reqDaily > 180000 && pct < 50) {
          outStatus.classList.add("impact");
          outStatus.innerHTML =
            "<strong>Behind linear pace:</strong> Handheld tools alone cannot cover " +
            fmt(reqDaily) +
            " m³/day. Unlock ship weapon slots, Mass Driver, and work toward the Collapsar black hole cannon.";
        } else if (pct >= 90) {
          outStatus.classList.add("safe");
          outStatus.innerHTML =
            "<strong>Home stretch (90%+ cleared):</strong> Let automated ship guns and Collapsar sweep remaining chunks while you finish Museum finds.";
        } else {
          outStatus.classList.add("yellow");
          outStatus.innerHTML =
            "<strong>Mid-game scaling:</strong> Push output toward " +
            fmt(reqDaily) +
            " m³/day by pairing Plasma Cutter upgrades with ship turrets and mixed-ore terminal sales.";
        }
      }

      window.dispatchEvent(
        new CustomEvent("asteroid:volumeChange", {
          detail: { remaining, pct }
        })
      );
    };

    [dayInput, remRange, remNumber, avgInput, crewInput].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", () => update(el));
      el.addEventListener("change", () => update(el));
    });

    update(remNumber);
  });

  // Ore Sell-Split Strategy Simulator (Illustrative Planning Model)
  const simRoot = document.querySelector("[data-sell-sim]");
  if (simRoot) {
    const haulInput = simRoot.querySelector("[data-sim-haul]");
    const typesInput = simRoot.querySelector("[data-sim-types]");
    const outSplit = simRoot.querySelector("[data-sim-split]");
    const outAdvice = simRoot.querySelector("[data-sim-advice]");

    const renderSim = () => {
      const units = clamp(Number(haulInput?.value) || 120, 10, 5000);
      const types = clamp(Number(typesInput?.value) || 3, 1, 8);
      const perType = Math.round(units / types);

      if (outSplit) {
        outSplit.textContent = `${fmt(perType)} units per ore (${types} ore types)`;
      }
      if (outAdvice) {
        if (types === 1) {
          outAdvice.textContent =
            "High market decay risk: selling 100% of a single mineral drops terminal payout. Spread sales across 2 to 4 ore types per shift.";
        } else if (types >= 3) {
          outAdvice.textContent =
            "Balanced rotation: splitting cargo across " +
            types +
            " ore types reduces terminal decay and helps finish daily Order of the Day bonuses.";
        } else {
          outAdvice.textContent =
            "Moderate split: solid early mix of Space Ice and Meteoric Iron. Add Nickel or Star Gold once deeper tunnels open.";
        }
      }
    };

    [haulInput, typesInput].forEach((el) => {
      if (el) el.addEventListener("input", renderSim);
    });
    renderSim();
  }
})();
