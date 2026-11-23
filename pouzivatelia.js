const form = document.getElementById("registraciaForm");
const spravaEl = document.getElementById("sprava");
const zoznam = document.getElementById("zoznamPouzivatelov");

function riadokSpravy(text) {
  const riadok = document.createElement("tr");
  const bunka = document.createElement("td");
  bunka.className = "empty";
  bunka.colSpan = 4;
  bunka.textContent = text;
  riadok.append(bunka);
  zoznam.append(riadok);
}

async function nacitajPouzivatelov() {
  try {
    const odpoved = await fetch("/api/pouzivatelia");
    if (!odpoved.ok) {
      throw new Error((await odpoved.text()) || `Chyba servera (${odpoved.status})`);
    }
    const pouzivatelia = await odpoved.json();

    zoznam.replaceChildren();

    if (pouzivatelia.length === 0) {
      riadokSpravy("Zatiaľ nie sú zaregistrovaní žiadni používatelia.");
      return;
    }

    pouzivatelia.forEach(pouzivatel => {
      const riadok = document.createElement("tr");

      [pouzivatel.id, pouzivatel.meno, pouzivatel.email].forEach(hodnota => {
        const bunka = document.createElement("td");
        bunka.textContent = hodnota;
        riadok.appendChild(bunka);
      });

      const akciaBunka = document.createElement("td");
      const vymazBtn = document.createElement("button");
      vymazBtn.type = "button";
      vymazBtn.textContent = "Vymazať";
      vymazBtn.addEventListener("click", async () => {
        if (!confirm(`Naozaj vymazať používateľa „${pouzivatel.meno}“?`)) return;
        await fetch("/api/pouzivatelia/" + encodeURIComponent(pouzivatel.id), { method: "DELETE" });
        nacitajPouzivatelov();
      });

      akciaBunka.appendChild(vymazBtn);
      riadok.appendChild(akciaBunka);
      zoznam.appendChild(riadok);
    });
  } catch (error) {
    zoznam.replaceChildren();
    riadokSpravy(`Používateľov sa nepodarilo načítať: ${error.message}`);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const novyPouzivatel = {
    meno: document.getElementById("meno").value,
    email: document.getElementById("email").value,
    heslo: document.getElementById("heslo").value
  };

  try {
    const odpoved = await fetch("/api/pouzivatelia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novyPouzivatel)
    });

    const text = await odpoved.text();
    spravaEl.textContent = text;
    spravaEl.classList.toggle("error", !odpoved.ok);

    if (odpoved.ok) {
      form.reset();
      nacitajPouzivatelov();
    }
  } catch (error) {
    spravaEl.textContent = "Server nie je dostupný.";
    spravaEl.classList.add("error");
  }
});

nacitajPouzivatelov();