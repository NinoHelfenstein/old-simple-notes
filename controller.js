const SIMPLE_NOTES_STORAGE_KEY = "simpleNotes";

const controller = (() => {
  function getAndClearInputNoteTitle() {
    const element = document.getElementById("input-add-note-title");
    const value = element.value;
    element.value = "";
    return value;
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const imgElements = document.getElementsByTagName("img");
    for (let i = 0; i < imgElements.length; i++) {
      imgElements[i].classList.toggle("image-dark-mode");
    }
  }

  function getAndClearTextareaNoteText() {
    const element = document.getElementById("textarea-add-note-text");
    const value = element.value;
    element.value = "";
    return value;
  }

  function createNote({ noteId, title, text, time }) {
    const existingNotes = document.getElementById("flex-wrapper");
    const existingNoteTemplate = document.getElementById(
      "existing-note-template"
    );
    const newNode = existingNoteTemplate.cloneNode(true);
    const elementId = `existing-note-${noteId}`;
    newNode.setAttribute("id", elementId);
    existingNotes.appendChild(newNote);
    document.querySelector(`#${elementId} #existing-note-title`).innerText =
      title;
    document.querySelector(`#${elementId} #existing-note-text`).innerText =
      text;
    document.querySelector(`#${elementId} #existing-note-date`).innerText =
      time;
    document
      .querySelector(`#${elementId} #existing-note-delete-button`)
      .setAttribute("onclick", `controller.deleteNote('${noteId}')`);
    document
      .querySelector(`#${elementId} #existing-note-edit-button`)
      .setAttribute("onclick", `controller.editNote('${noteId}')`);
  }

  function createNoteList({ noteId, title, time }) {
    const existingNotes = document.getElementById("note-list-wrapper");
    const existingNoteTemplate = document.getElementById(
      "existing-notes-list-template"
    );
    const newNode = existingNoteTemplate.cloneNode(true);
    const elementId = `existing-note-list-${noteId}`;
    newNote.setAttribute("id", elementId);
    existingNotes.appendChild(newNote);
    document.querySelector(
      `#${elementId} #existing-note-list-title`
    ).innerText = title;
    document.querySelector(`#${elementId} #existing-note-list-date`).innerText =
      time;
    document
      .querySelector(`#${elementId}`)
      .setAttribute(
        "onclick",
        `controller.highlightAndScrollToDiv('existing-note-${noteId}')`
      );
  }

  function addNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    notes.push(note);
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
  }

  function deleteNoteFromLocalStorage(id) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    const foundIndex = notes.findIndex((note) => note.noteId === id);
    notes.splice(foundIndex, 1);
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
  }

  function setInNoteFromLocalStorage(id) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    const foundIndex = notes.findIndex((note) => note.noteId === id);
    const foundNote = notes[foundIndex];
    document.getElementById("input-add-note-title").value = foundNote.title;
    document.getElementById("textarea-add-note-text").value = foundNote.text;
    document.getElementById("edit-note-button").style.display = "block";
    document
      .getElementById("edit-note-button")
      .setAttribute("onclick", `controller.updateNote('${id}')`);
    document.getElementById("add-note-button").style.display = "none";
  }

  function updateNoteToLocalStorage(noteId) {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    const foundIndex = notes.findIndex((note) => note.noteId === noteId);
    const title = getAndClearInputNoteTitle();
    const text = getAndClearTextareaNoteText();
    const time = getFormattedDate();
    const lastUpdated = new Date().getTime().toString();

    if (!title || !text) {
      return;
    }

    notes[foundIndex] = { noteId, title, text, time, lastUpdated };
    localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify(notes));
    document.getElementById("edit-note-button").style.display = "none";
    document.getElementById("add-note-button").style.display = "block";
  }

  function getFormattedDate() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
  }

  function addNote() {
    const title = getAndClearInputNoteTitle();
    const text = getAndClearTextareaNoteText();
    const time = getFormattedDate();

    if (!title || !text) {
      return;
    }
    autoResize();

    const noteId = new Date().getTime().toString();
    const lastUpdated = new Date().getTime().toString();

    addNoteToLocalStorage({ noteId, title, text, time, lastUpdated });
    loadNotes();
  }

  function deleteNote(noteId) {
    deleteNoteFromLocalStorage(noteId);
    loadNotes();
  }
  function editNote(noteId) {
    setInNoteFromLocalStorage(noteId);
    autoResize();
  }

  function updateNote(noteId) {
    updateNoteToLocalStorage(noteId);
    loadNotes();
    autoResize();
  }

  function loadNotes() {
    const elements = document.getElementsByClassName("notes-container");
    const length = elements.length;
    for (let i = length - 1; i > 0; i--) {
      elements[i].remove();
    }
    document.getElementById("note-list-wrapper").innerHTML = "";
    const notesString = localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY);

    if (!notesString) {
      localStorage.setItem(SIMPLE_NOTES_STORAGE_KEY, JSON.stringify([]));
    }

    const notes = JSON.parse(notesString);
    if (notes.length == null) {
      return;
    }
    for (let i = 0; i < notes.length; i++) {
      createNote(notes[i]);
      createNoteList(notes[i]);
    }
  }

  function autoResize() {
    const textarea = document.getElementById("textarea-add-note-text");
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  function highlightAndScrollToDiv(divId) {
    const element = document.getElementById(divId);
    if (element) {
      const leftOffset = element.offsetLeft - 20;
      background = element.style.backgroundColor;
      if (document.body.classList.contains("dark-mode")) {
        element.style.backgroundColor = "#383838";
      } else {
        element.style.backgroundColor = "d4d4d4";
      }
      window.scroll(leftOffset, 0);
      setTimeout(function () {
        element.style.backgroundColor = background;
      }, 1000);
    }
  }
  
  function deleteAll() {
    document.getElementById("delete-confirm").classList.remove("hidden");
    document.getElementById("delete-confirm").classList.add("delete-confirm");
    loadNotes();
  }

  function deleteAllConfirm() {
    document.getElementById("delete-confirm").classList.add("hidden");
    document
      .getElementById("delete-confirm")
      .classList.remove("delete-confirm");
    window.localStorage.clear();
    loadNotes();
  }

  function deleteAllCancel() {
    document.getElementById("delete-confirm").classList.add("hidden");
    document
      .getElementById("delete-confirm")
      .classList.remove("delete-confirm");
  }
  
  function exportFile() {
    toggleExportSelect("exportSelect");
    value = document.getElementById("exportFile").value;
    if (value === "JSON") {
      exportJSON();
    } else {
      exportCSV();
    }
  }

  function exportCSV() {
    const notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    const fields = Object.keys(notes[0]);
    let replacer = function (key, value) {
      return value === null ? "" : value;
    };
    let csv = notes.map(function (note) {
      return fields
      .map(function (fieldName) {
        return JSON.stringify(note[fieldName], replacer).replaceAll('"', "");
      })
      .join(",");
    });
    csv.unshift(fields.join(",")); // add header column
    csv = csv.join("\r\n");
    
    const blob = new Blob([csv], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SimpleNotesExport.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    let notes = JSON.parse(localStorage.getItem(SIMPLE_NOTES_STORAGE_KEY));
    let str = JSON.stringify(notes);

    const blob = new Blob([str], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SimpleNotesExport.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  
  
  function importFile() {
    const fileInput = document.querySelector("input[type=file]");
    const file = fileInput.files[0];
    let reader = new FileReader();

    reader.onload = function (event) {
      const dataURL = event.target.result;
    };

    reader.readAsDataURL(file);
    const name = file.name;
    if (name.search(/\.csv+$/i) !== -1) {
      importCSV();
    } else if (name.search(/\.json+$/i) !== -1) {
      importJSON();
    } else {
      alert("FileType not supported");
    }
  }

  function importCSV() {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        csv = reader.result;

        let lines = csv.split("\n");

        let result = [];

        let headers = lines[0].split(",");

        for (let i = 1; i < lines.length; i++) {
          let obj = {};
          let currentLine = lines[i].split(",");

          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
          }

          result.push(obj);
        }

        //return result; //JavaScript object
        localStorage.setItem(
          SIMPLE_NOTES_STORAGE_KEY,
          JSON.stringify(result)
        );
        location.reload();
      },
      false
    );
    
    if (file) {
      csv = reader.readAsText(file);
    }
  }

  function importJSON() {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        let importedNotes = JSON.parse(reader.result);
        localStorage.setItem(
          SIMPLE_NOTES_STORAGE_KEY,
          JSON.stringify(importedNotes)
          );
        location.reload();
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  }
  
  function showModal(id) {
    document.getElementById(id).click();
  }
  
  function toggleExportSelect(id) {
    ele = document.getElementById(id);
    if (ele.style.display === "none") {
      ele.style.display = "block";
    } else {
      ele.style.display = "none";
    }
  }
  
  return {
    addNote,
    deleteNote,
    loadNotes,
    editNote,
    toggleTheme,
    updateNote,
    autoResize,
    getFormattedDate,
    highlightAndScrollToDiv,
    deleteAll,
    deleteAllConfirm,
    deleteAllCancel,
    exportFile,
    exportCSV,
    exportJSON,
    importFile,
    importCSV,
    importJSON,
    showModal,
    toggleExportSelect,
  };
})();
