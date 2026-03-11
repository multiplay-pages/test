// ==========================================
// STAN APLIKACJI (STATE)
// ==========================================
const state = {
  commitment: 24,
  building: "SFH",
  status: "Nowy",
  tariff: "600/100",
  efaktura: true,
  marketing: true,
  phone: "off",
  symmetric: false,
  internetPlus: false,
  
  // Nowe pola dla promocji GigaBox
  promo: "none", 
  externalMonths: 1,
  bannerPromo: false
};

// Zapasowy cennik (zostanie nadpisany przez prices.json w kolejnym kroku)
let priceConfig = {
  basePrices: {
    12: {
      SFH: { "600/100": 90, "800/200": 95, "1000/300": 105, "2000/2000": 165 },
      MFH: { "600/100": 70, "800/200": 75, "1000/300": 85, "2000/2000": 145 }
    },
    24: {
      SFH: { "600/100": 85, "800/200": 90, "1000/300": 100, "2000/2000": 160 },
      MFH: { "600/100": 65, "800/200": 70, "1000/300": 80, "2000/2000": 140 }
    }
  },
  phonePrices: { "off": 0, "UE60": 9.99, "UE300": 14.99, "NoLimit": 19.99 },
  activationBase: 99 // domyślna opłata instalacyjna
};

// ==========================================
// INICJALIZACJA I POBIERANIE DANYCH
// ==========================================
async function loadPriceConfig() {
  try {
    const response = await fetch("prices.json");
    if (!response.ok) throw new Error("Błąd pobierania prices.json");
    priceConfig = await response.json();
  } catch (error) {
    console.warn("Nie udało się pobrać prices.json. Używam cennika domyślnego.", error);
  }
}

// ==========================================
// BINDOWANIE ZDARZEŃ (EVENT LISTENERS)
// ==========================================
function bindEvents() {
  // 1. Karty jednokrotnego wyboru (Radio-podobne)
  document.querySelectorAll(".select-card").forEach(card => {
    card.addEventListener("click", (e) => {
      const input = card.querySelector("input[type='radio']");
      if (!input) return;

      const name = input.name;
      const value = input.value;
      state[name] = isNaN(value) ? value : Number(value);

      // Logika widoczności promocji przy zmianie statusu Klienta
      if (name === "status") {
        handleStatusChange();
      }

      // Aktualizacja klas "active"
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.closest(".select-card").classList.remove("active");
      });
      card.classList.add("active");
      input.checked = true;

      render();
    });
  });

  // 2. Checkboxy (Przełączniki)
  document.getElementById("symmetric-checkbox").addEventListener("change", (e) => { state.symmetric = e.target.checked; render(); });
  document.getElementById("ip-checkbox").addEventListener("change", (e) => { state.internetPlus = e.target.checked; render(); });
  document.getElementById("efaktura-checkbox").addEventListener("change", (e) => { state.efaktura = e.target.checked; render(); });
  document.getElementById("marketing-checkbox").addEventListener("change", (e) => { state.marketing = e.target.checked; render(); });
  document.getElementById("banner-combined-checkbox").addEventListener("change", (e) => { state.bannerPromo = e.target.checked; render(); });

  // 3. Select dla telefonu
  document.getElementById("phone-select").addEventListener("change", (e) => { state.phone = e.target.value; render(); });

  // 4. Suwak miesięcy u innego operatora
  const externalMonthsInput = document.getElementById("external-remaining-months");
  externalMonthsInput.addEventListener("input", (e) => {
    state.externalMonths = Number(e.target.value);
    document.getElementById("external-months-display").textContent = `${state.externalMonths} mies.`;
    render();
  });
}

function handleStatusChange() {
  const promo6za1 = document.getElementById("promo-6za1");
  const promoZtr = document.getElementById("promo-ztr2026");
  const promoPowrot = document.getElementById("promo-powrot");
  const promoPrezent = document.getElementById("promo-prezent");

  if (state.status === "Obecny") {
    // Ukryj promocje dla nowych, pokaż dla obecnych
    promo6za1.style.display = "none";
    promoZtr.style.display = "none";
    promoPowrot.style.display = "none";
    promoPrezent.style.display = "flex";

    // Jeśli miał wybraną niedozwoloną promocję, zresetuj
    if (["6za1", "ztr2026", "powrot"].includes(state.promo)) {
      document.querySelector('input[name="promo"][value="none"]').click();
    }
  } else {
    // Odwrotnie dla nowego klienta
    promo6za1.style.display = "flex";
    promoZtr.style.display = "flex";
    promoPowrot.style.display = "flex";
    promoPrezent.style.display = "none";

    if (state.promo === "prezent") {
      document.querySelector('input[name="promo"][value="none"]').click();
    }
  }
}

// ==========================================
// GŁÓWNY SILNIK OBLICZENIOWY
// ==========================================
function calculatePrice() {
  // 1. Cena bazowa internetu
  let basePrice = priceConfig.basePrices[state.commitment]?.[state.building]?.[state.tariff] || 0;

  // 2. Dodatki stałe
  const symmetricPrice = (state.symmetric && state.tariff !== "2000/2000") ? 10 : 0;
  const ipPrice = state.internetPlus ? 10 : 0;
  const phonePrice = priceConfig.phonePrices[state.phone] || 0;
  
  // 3. Standardowa kwota (z uwzględnieniem "kar" za brak zgód)
  let penalty = 0;
  if (!state.efaktura) penalty += 10;
  if (!state.marketing) penalty += 5;

  const regularMonthly = basePrice + symmetricPrice + ipPrice + phonePrice + penalty;

  // 4. Logika miesięcy za 1 zł
  let oneZlotyMonths = 0;

  if (state.promo === "6za1") {
    oneZlotyMonths = state.commitment === 24 ? 6 : 3;
  } else if (state.promo === "ztr2026") {
    oneZlotyMonths = Math.min(state.externalMonths, 12);
  } else if (state.promo === "powrot") {
    oneZlotyMonths = Math.min(state.externalMonths + 3, 24);
  }

  // Promocja banerowa dodaje 3 miesiące za 1 zł niezależnie od innej promocji
  if (state.bannerPromo) {
    oneZlotyMonths += 3;
  }

  // Ograniczenie - miesiące promocyjne nie mogą przekroczyć długości umowy
  oneZlotyMonths = Math.min(oneZlotyMonths, state.commitment);

  const regularMonths = state.commitment - oneZlotyMonths;

  // 5. Średnia cena
  // Uwaga: W miesiącach za 1 zł klient nie płaci kar za zgody, cena wynosi równe 1 zł.
  const totalCost = (oneZlotyMonths * 1) + (regularMonths * regularMonthly);
  const averagePrice = totalCost / state.commitment;

  // 6. Opłata instalacyjna
  let activationFee = priceConfig.activationBase || 99;
  if (state.promo === "powrot") {
    activationFee = 1; // Obniżenie do 1 zł według regulaminu "Powrót do Multiplay"
  }

  return {
    regularMonthly,
    oneZlotyMonths,
    regularMonths,
    averagePrice,
    activationFee,
    baseCostWithoutPromo: regularMonthly * state.commitment,
    totalCost
  };
}

// ==========================================
// RENDEROWANIE INTERFEJSU (DOM)
// ==========================================
function render() {
  const calc = calculatePrice();

  // Widoczność suwaka dla zewnętrznych miesięcy
  const externalContainer = document.getElementById("external-months-container");
  if (state.promo === "ztr2026" || state.promo === "powrot") {
    externalContainer.style.display = "block";
  } else {
    externalContainer.style.display = "none";
  }

  // Aktualizacja statusu
  const badge = document.getElementById("summary-status-badge");
  badge.textContent = state.status === "Nowy" ? "Nowy Klient" : "Obecny Klient";
  badge.style.background = state.status === "Nowy" ? "var(--brand-d)" : "var(--brand-a)";
  badge.style.color = state.status === "Nowy" ? "#000" : "#fff";

  document.getElementById("summary-commitment").textContent = `${state.commitment} miesiące`;
  document.getElementById("summary-tariff-building").textContent = `${state.tariff} Mb/s (${state.building})`;
  document.getElementById("avg-monthly").textContent = `${calc.averagePrice.toFixed(2).replace('.', ',')} zł / mies.`;
  document.getElementById("summary-activation-price").textContent = `${calc.activationFee} zł`;

  // Oszczędność
  const savings = calc.baseCostWithoutPromo - calc.totalCost;
  const savingEl = document.getElementById("total-promo-saving");
  if (savings > 0) {
    savingEl.textContent = `${savings.toFixed(2).replace('.', ',')} zł w skali umowy`;
    savingEl.style.color = "var(--brand-b)";
  } else {
    savingEl.textContent = "0 zł";
    savingEl.style.color = "var(--text)";
  }

  // Podsumowanie okresów
  const periodsList = document.getElementById("promo-periods-list");
  periodsList.innerHTML = "";
  if (calc.oneZlotyMonths > 0) {
    periodsList.innerHTML += `
      <div class="promo-period-row">
        <span class="promo-period-range">Miesiące 1 - ${calc.oneZlotyMonths}:</span>
        <span class="promo-period-price">1,00 zł / mies.</span>
      </div>
    `;
  }
  if (calc.regularMonths > 0) {
    const startMonth = calc.oneZlotyMonths + 1;
    const endMonth = state.commitment;
    const label = startMonth === endMonth ? `Miesiąc ${startMonth}:` : `Miesiące ${startMonth} - ${endMonth}:`;
    
    periodsList.innerHTML += `
      <div class="promo-period-row">
        <span class="promo-period-range">${label}</span>
        <span class="promo-period-price">${calc.regularMonthly.toFixed(2).replace('.', ',')} zł / mies.</span>
      </div>
    `;
  }

  // Aktywna promocja - opis tekstem
  let promoText = "Brak";
  if (state.promo === "6za1") promoText = "6 za 1";
  if (state.promo === "ztr2026") promoText = `ZTR 2026 (${calc.oneZlotyMonths} mies. za 1 zł)`;
  if (state.promo === "powrot") promoText = `Powrót do Multiplay (${calc.oneZlotyMonths} mies. za 1 zł)`;
  if (state.promo === "prezent") promoText = "Wybierz swój prezent (gadżet do odebrania)";
  
  if (state.bannerPromo) {
    promoText += " + Promocja Banerowa (+3 mies. za 1 zł)";
  }

  document.getElementById("active-promotion-summary").textContent = promoText;
}

// START
document.addEventListener("DOMContentLoaded", async () => {
  await loadPriceConfig();
  bindEvents();
  handleStatusChange(); // Inicjalne ukrycie/pokazanie opcji
  render();
});
