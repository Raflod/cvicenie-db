fetch("topbar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Navigáciu sa nepodarilo načítať (${response.status}).`);
    }
    return response.text();
  })
  .then(html => {
    document.body.insertAdjacentHTML("afterbegin", html);
  })
  .catch(error => {
    console.error("Navigáciu sa nepodarilo načítať:", error);
  });
