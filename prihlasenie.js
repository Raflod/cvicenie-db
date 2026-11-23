const prihlasenieForm = document.getElementById("prihlasenieForm");
const vysledokEl = document.getElementById("vysledok");

function zobrazSpravu(text, jeChyba) {
  const p = document.createElement("p");
  p.className = jeChyba ? "message error" : "message";
  p.textContent = text;
  vysledokEl.replaceChildren(p);
}

function zobrazStavPrihlasenia() {
  const ulozeny = sessionStorage.getItem("prihlasenyPouzivatel");
  if (!ulozeny) return;

  const pouzivatel = JSON.parse(ulozeny);

  const info = document.createElement("p");
  info.className = "message";
  info.textContent = `Prihlásený používateľ: ${pouzivatel.meno} (${pouzivatel.email})`;

  const odhlasitBtn = document.createElement("button");
  odhlasitBtn.type = "button";
  odhlasitBtn.textContent = "Odhlásiť sa";
  odhlasitBtn.addEventListener("click", () => {
    sessionStorage.removeItem("prihlasenyPouzivatel");
    zobrazSpravu("Boli ste odhlásený.", false);
  });

  vysledokEl.replaceChildren(info, odhlasitBtn);
}

prihlasenieForm.addEventListener("submit", async event => {
  event.preventDefault();

  const udaje = {
    email: document.getElementById("email").value,
    heslo: document.getElementById("heslo").value
  };

  try {
    const odpoved = await fetch("/api/prihlasenie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(udaje)
    });

    const data = await odpoved.json();

    if (!odpoved.ok) {
      zobrazSpravu(data.sprava, true);
      return;
    }

    sessionStorage.setItem("prihlasenyPouzivatel", JSON.stringify(data.pouzivatel));
    prihlasenieForm.reset();
    zobrazStavPrihlasenia();
  } catch (error) {
    zobrazSpravu("Server nie je dostupný.", true);
  }
});

zobrazStavPrihlasenia();