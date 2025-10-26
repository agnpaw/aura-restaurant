const sheetId = "1JHh2gN8C-9hdv7JMP66kXLo6SOIz17egdRVSmDSb8Pw";
const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

const menuContainer = document.getElementById("menu");
const langButtons = document.querySelectorAll(".lang-btn");

let language = "PL";

function loadMenu() {
  fetch(csvUrl)
    .then((response) => response.text())
    .then((csvText) => {
      // Wczytanie CSV bez automatycznych nagłówków
      const parsed = Papa.parse(csvText, { header: false, skipEmptyLines: true });
      const rows = parsed.data;

      if (rows.length === 0) {
        menuContainer.innerHTML = "<p>Brak pozycji w menu.</p>";
        return;
      }

      const headers = rows[0]; // pierwszy wiersz jako nagłówki
      const data = rows.slice(1); // reszta to pozycje menu

      const menuByCategory = {};

      data.forEach((row) => {
        // Mapowanie wiersza do obiektu
        const rowObj = {};
        headers.forEach((header, i) => {
          rowObj[header] = row[i] ? row[i].trim() : "";
        });

        // Jeśli cały wiersz jest pusty, pomiń
        if (!Object.values(rowObj).some((val) => val !== "")) return;

        const category = rowObj.Kategoria || "Brak kategorii";
        const name = rowObj[`Nazwa_${language}`] || "";
        const description = rowObj[`Opis_${language}`] || "";
        const price = rowObj.Cena || "";
        const image = rowObj.Zdjęcie || "";

        if (!menuByCategory[category]) menuByCategory[category] = [];
        menuByCategory[category].push({ name, description, price, image });
      });

      // Tworzenie HTML
      let html = "";
      for (const category in menuByCategory) {
        html += `<div class="category">${category}</div>`;
        menuByCategory[category].forEach((dish) => {
          html += `
          <div class="dish">
            <h3 data-price="${dish.price}">${dish.name}</h3>
            <p>${dish.description}</p>
            ${dish.image ? `<img src="${dish.image}" alt="${dish.name}" />` : ""}
          </div>
        `;
        });
      }

      menuContainer.innerHTML = html;
    })
    .catch((err) => {
      console.error("Błąd:", err);
      menuContainer.innerHTML = "<p>Błąd wczytywania menu.</p>";
    });
}

// Obsługa przycisków językowych
langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    language = button.getAttribute("data-lang");
    langButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    loadMenu();
  });
});

// Cookie banner i popup (bez zmian)
document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "flex";
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
  });

  const showPolicy = document.getElementById("show-policy");
  const cookiePopup = document.getElementById("cookie-popup");
  const closePopup = document.getElementById("close-popup");
  const closePopupBtn = document.getElementById("close-popup-btn");

  showPolicy.addEventListener("click", (e) => {
    e.preventDefault();
    cookiePopup.style.display = "flex";
  });

  [closePopup, closePopupBtn].forEach((el) => {
    el.addEventListener("click", () => {
      cookiePopup.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === cookiePopup) {
      cookiePopup.style.display = "none";
    }
  });
});

// Pierwsze wczytanie menu
loadMenu();
