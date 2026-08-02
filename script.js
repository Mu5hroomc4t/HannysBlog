const menuButton = document.getElementById("menu-open");
const sidebar = document.getElementById("sidebar");

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

function loadContent(selectedFile) {
  const selector = document.getElementById("contentSelector");

  const contentDisplay = document.getElementById("contentDisplay");

  if (selectedFile) {
    contentDisplay.style.opacity = "0.3";

    fetch(selectedFile)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        setTimeout(() => {
          contentDisplay.innerHTML = html;
          contentDisplay.style.opacity = "1";
        }, 300);
      })
      .catch((error) => {
        console.error("T_T Fehler beim Laden:", error);
        contentDisplay.innerHTML = `<p style="color: red;">Error loading content: ${error.message}</p>`;
        contentDisplay.style.opacity = "1";
      });
  }
}

/////////////////////////////////* GUESTBOOK *////////////////////////////////////////////////////////

const guestbookForm = document.getElementById("guestbook-form");

guestbookForm.addEventListener("submit", async function (event) {
  console.log("Submit wurde ausgelöst!");
  event.preventDefault();
  const status = document.getElementById("guestbook-status");

  const data = {
    name: guestbookForm.name.value,
    message: guestbookForm.message.value,
  };

  try {
    const response = await fetch(getBackendUrl() + "/guestbook/new-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      guestbookForm.reset();
      status.innerText = "Vielen Dank für deine Post!";
      status.style.opacity = "1";

      loadGuestbook();
    } else {
      status.innerText = "Das hat leider nicht geklappt!";
    }
  } catch (error) {
    status.innerText = "Server nicht erreichbar.";
  }
});

function loadGuestbook() {
  const guestbookEntries = document.getElementById("guestbook-entries");
  guestbookEntries.querySelectorAll("section").forEach((section) => {
    section.remove();
  });
  const header = guestbookEntries.querySelector("h3.guestbook-header");

  console.log("Those are the entries: ", guestbookEntries);
  fetch(getBackendUrl() + "/guestbook")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((entries) => {
      // const entries = JSON.parse(json);
      entries.sort((a, b) => b.date - a.date);
      console.log(entries);
      /*Eintrag in Objekt umwandeln wie bei app.js  */

      for (let entry of entries) {
        console.log("those are entries: ", entry);

        let entrySection = document.createElement("section");
        entrySection.className = "guestbook-entry";

        let entryDate = document.createElement("div");
        entryDate.className = "guestbook-date";
        let d = new Date(entry.date);

        const formattedDate = d.toLocaleString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        entryDate.innerHTML = formattedDate;
        let entryName = document.createElement("div");
        entryName.className = "guestbook-name";
        entryName.innerText = entry.name;

        let entryMessage = document.createElement("div");
        entryMessage.className = "guestbook-message";
        entryMessage.innerText = entry.message;

        let entryHeader = document.createElement("div");
        entryHeader.classList.add("guestbook-entry-header");

        entrySection.appendChild(entryHeader);
        entryHeader.appendChild(entryName);
        entryHeader.appendChild(entryDate);

        entrySection.appendChild(entryMessage);
        /*sagt, dass die Daten im HTML unter der Section Entry angezeigt werden */

        guestbookEntries.appendChild(entrySection);

        console.log("this is a section: ", guestbookEntries);
      }

      console.log(document.createElement("button"));
    })
    .catch((error) => {
      console.error("T_T Fehler beim Laden:", error);
    });
}
