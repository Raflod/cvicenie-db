const listMessage = document.querySelector("#list-message");
const booksList = document.querySelector("#books-list");

async function loadBooks() {
  listMessage.textContent = "";
  booksList.replaceChildren();

  try {
    const response = await fetch("/api/knihy");
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Chyba servera (${response.status})`);
    }

    const books = await response.json();
    if (!Array.isArray(books)) {
      throw new Error("Server vrátil údaje v neočakávanom formáte.");
    }

    if (books.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.className = "empty";
      cell.colSpan = 4;
      cell.textContent = "V katalógu zatiaľ nie sú žiadne knihy.";
      row.append(cell);
      booksList.append(row);
      return;
    }

    for (const book of books) {
      const row = document.createElement("tr");
      const cena = Number(book.cena ?? 0);
      const cenaText = Number.isFinite(cena) ? cena.toFixed(2) : (book.cena ?? "");

      for (const value of [book.nazov, book.autor, book.rok, cenaText]) {
        const cell = document.createElement("td");
        cell.textContent = value ?? "";
        row.append(cell);
      }
      booksList.append(row);
    }
  } catch (error) {
    listMessage.textContent = `Knihy sa nepodarilo načítať: ${error.message}`;
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "empty";
    cell.colSpan = 4;
    cell.textContent = "Skontrolujte, či sú server a databáza spustené.";
    row.append(cell);
    booksList.append(row);
  }
}

loadBooks();
