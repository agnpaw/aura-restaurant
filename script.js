const sheetId = "1JHh2gN8C-9hdv7JMP66kXLo6SOIz17egdRVSmDSb8Pw";

const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

const menuContainer = document.getElementById("menu");
const langButtons = document.querySelectorAll(".lang-btn");

let language = "PL";

function loadMenu() {
  fetch(csvUrl)
    .then((response) => response.text())
    .then((csvText) => {
      const parsed = Papa.parse(csvText, { header: true });
      const data = parsed.data;

      const menuByCategory = {};

      data.forEach((row) => {
        if (!row.Kategoria) return;

        const category = row.Kategoria;
        const name = row[`Nazwa_${language}`];
        const description = row[`Opis_${language}`];
        const price = row.Cena;
        const image = row.Zdjęcie;

        if (!menuByCategory[category]) menuByCategory[category] = [];

        menuByCategory[category].push({ name, description, price, image });
      });

      let html = "";
      for (const category in menuByCategory) {
        html += `<div class="category">${category}</div>`;
        menuByCategory[category].forEach((dish) => {
          console.log("Zdjęcie:", dish.image);
          console.log(
            "HTML img:",
            `${
              dish.image ? `<img src="${dish.image}" alt="${dish.name}" />` : ""
            }`
          );

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

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    language = button.getAttribute("data-lang");

    langButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    loadMenu();
  });
});

loadMenu();

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
});

document.addEventListener("DOMContentLoaded", () => {
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
