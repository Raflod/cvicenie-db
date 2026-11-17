const formular = document.querySelector("#formular");
const zoznamKnih = document.querySelector("#zoznam-knih");
const sprava = document.querySelector("#sprava");
const chyba = document.querySelector("#chyba");

function pridajBunku(riadok, hodnota) {
  const bunka = document.createElement("td");
  bunka.textContent = hodnota ?? "";
  riadok.append(bunka);
}

async function textChyby(odpoved) {
  const text = await odpoved.text();
  return text || `Chyba servera (${odpoved.status})`;
}

async function nacitajKnihy() {
  chyba.textContent = "";
  zoznamKnih.replaceChildren();

  try {
    const odpoved = await fetch("/api/knihy");
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }

    const knihy = await odpoved.json();
    if (!Array.isArray(knihy)) {
      throw new Error("Server vrátil neočakávaný formát údajov.");
    }

    if (knihy.length === 0) {
      const riadok = document.createElement("tr");
      const bunka = document.createElement("td");
      bunka.className = "empty";
      bunka.colSpan = 6;
      bunka.textContent = "V databáze zatiaľ nie sú žiadne knihy.";
      riadok.append(bunka);
      zoznamKnih.append(riadok);
      return;
    }

    for (const kniha of knihy) {
      const riadok = document.createElement("tr");
      pridajBunku(riadok, kniha.id);
      pridajBunku(riadok, kniha.nazov);
      pridajBunku(riadok, kniha.autor);
      pridajBunku(riadok, kniha.rok);
      pridajBunku(riadok, kniha.cena);

      const akcia = document.createElement("td");

      const tlacidla = document.createElement("div");
      tlacidla.className = "book-actions";

      const tlacidloNazov = vytvorTlacidlo("Zmeniť názov", `Zmeniť názov knihy ${kniha.nazov}`);
      tlacidloNazov.addEventListener("click", () => zmenitUdajeKnihy(kniha, "nazov"));

      const tlacidloAutor = vytvorTlacidlo("Zmeniť autora", `Zmeniť autora knihy ${kniha.nazov}`);
      tlacidloAutor.addEventListener("click", () => zmenitUdajeKnihy(kniha, "autor"));

      const tlacidloRok = vytvorTlacidlo("Zmeniť rok", `Zmeniť rok vydania knihy ${kniha.nazov}`);
      tlacidloRok.addEventListener("click", () => zmenitUdajeKnihy(kniha, "rok"));

      const tlacidloCena = vytvorTlacidlo("Zmeniť cenu", `Zmeniť cenu knihy ${kniha.nazov}`);
      tlacidloCena.addEventListener("click", () => zmenitCenu(kniha.id, kniha.nazov, kniha.cena));

      const tlacidloVymazat = document.createElement("button");
      tlacidloVymazat.type = "button";
      tlacidloVymazat.className = "delete-button";
      tlacidloVymazat.textContent = "Vymazať";
      tlacidloVymazat.setAttribute("aria-label", `Vymazať knihu ${kniha.nazov}`);
      tlacidloVymazat.addEventListener("click", () => vymazKnihu(kniha.id, kniha.nazov));

      tlacidla.append(tlacidloNazov, tlacidloAutor, tlacidloRok, tlacidloCena, tlacidloVymazat);
      akcia.append(tlacidla);
      riadok.append(akcia);
      zoznamKnih.append(riadok);
    }
  } catch (error) {
    chyba.textContent = `Knihy sa nepodarilo načítať: ${error.message}`;
    const riadok = document.createElement("tr");
    const bunka = document.createElement("td");
    bunka.className = "empty";
    bunka.colSpan = 6;
    bunka.textContent = "Skontrolujte, či je spustený server a databáza.";
    riadok.append(bunka);
    zoznamKnih.append(riadok);
  }
}

async function vymazKnihu(id, nazov) {
  if (!window.confirm(`Naozaj chcete vymazať knihu „${nazov}“?`)) {
    return;
  }

  chyba.textContent = "";
  try {
    const odpoved = await fetch(`/api/knihy/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }
    await nacitajKnihy();
  } catch (error) {
    chyba.textContent = `Knihu sa nepodarilo vymazať: ${error.message}`;
  }
}

function vytvorTlacidlo(text, popis) {
  const tlacidlo = document.createElement("button");
  tlacidlo.type = "button";
  tlacidlo.className = "edit-button";
  tlacidlo.textContent = text;
  tlacidlo.setAttribute("aria-label", popis);
  return tlacidlo;
}

async function zmenitUdajeKnihy(kniha, pole) {
  const popisy = {
    nazov: "nový názov",
    autor: "nového autora",
    rok: "nový rok vydania"
  };
  const vstup = prompt(`Zadaj ${popisy[pole]} pre knihu "${kniha.nazov}"`, kniha[pole]);

  if (vstup === null) {
    return;
  }

  const hodnota = vstup.trim();
  if (!hodnota) {
    alert("Hodnota nesmie byť prázdna.");
    return;
  }
  if (pole === "rok" && !Number.isInteger(Number(hodnota))) {
    alert("Rok musí byť celé číslo.");
    return;
  }

  const udaje = {
    nazov: kniha.nazov,
    autor: kniha.autor,
    rok: Number(kniha.rok)
  };
  udaje[pole] = pole === "rok" ? Number(hodnota) : hodnota;

  chyba.textContent = "";
  try {
    const odpoved = await fetch(`/api/knihy/${encodeURIComponent(kniha.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(udaje)
    });

    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }

    await nacitajKnihy();
  } catch (error) {
    chyba.textContent = `Údaje knihy sa nepodarilo zmeniť: ${error.message}`;
  }
}

async function zmenitCenu(id, nazov, aktualnaCena) {
  const vstup = prompt(`Zadaj novú cenu pre knihu "${nazov}"`, aktualnaCena);

  if (vstup === null) {
    return;
  }

  const cenaText = vstup.trim().replace(",", ".");
  if (cenaText === "") {
    return;
  }

  const novaCena = Number(cenaText);
  if (!Number.isFinite(novaCena) || novaCena < 0) {
    alert("Cena musí byť kladné číslo.");
    return;
  }

  chyba.textContent = "";
  try {
    const odpoved = await fetch(`/api/knihy/${encodeURIComponent(id)}/cena`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cena: novaCena })
    });

    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }

    await nacitajKnihy();
  } catch (error) {
    chyba.textContent = `Cenu sa nepodarilo zmeniť: ${error.message}`;
  }
}

formular.addEventListener("submit", async udalost => {
  udalost.preventDefault();
  sprava.textContent = "";
  chyba.textContent = "";

  const data = new FormData(formular);
  const kniha = {
    nazov: String(data.get("nazov")).trim(),
    autor: String(data.get("autor")).trim(),
    rok: Number(data.get("rok")),
    cena: Number(data.get("cena"))
  };

  if (!kniha.nazov || !kniha.autor || !Number.isInteger(kniha.rok)
    || !Number.isFinite(kniha.cena) || kniha.cena < 0) {
    chyba.textContent = "Vyplňte správne všetky polia.";
    return;
  }

  const odoslat = formular.querySelector('button[type="submit"]');
  odoslat.disabled = true;

  try {
    const odpoved = await fetch("/api/knihy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kniha)
    });
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }

    formular.reset();
    sprava.textContent = "Kniha bola pridaná.";
    await nacitajKnihy();
  } catch (error) {
    chyba.textContent = `Knihu sa nepodarilo pridať: ${error.message}`;
  } finally {
    odoslat.disabled = false;
  }
});

nacitajKnihy();
