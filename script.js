const board = document.getElementById("notes-board");
const form = document.getElementById("note-form");
const template = document.getElementById("note-template");
const dropdownToggle = document.getElementById("dropdown-toggle");
const dropdownMenu = document.getElementById("dropdown-menu");
const STORAGE_KEY = "brightmind-notes";

const starterNotes = [
  {
    author: "Maya",
    message: "You do not have to solve everything today. Rest is part of healing too.",
    color: "sun",
    image: "",
  },
  {
    author: "Jordan",
    message: "Talking to my counselor felt scary at first, but it made my week lighter.",
    color: "sky",
    image: "",
  },
  {
    author: "Ari",
    message: "My reset routine is music, deep breaths, and texting one safe person.",
    color: "berry",
    image: "",
  },
];

function readNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return starterNotes;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : starterNotes;
  } catch {
    return starterNotes;
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function createNoteCard(note) {
  const node = template.content.firstElementChild.cloneNode(true);
  const image = node.querySelector(".note-image");

  node.classList.add(note.color);
  node.style.setProperty("--tilt", `${Math.floor(Math.random() * 8) - 4}deg`);
  node.querySelector(".note-message").textContent = note.message;
  node.querySelector(".note-meta").textContent = `Pinned by ${note.author}`;

  if (note.image) {
    image.src = note.image;
  } else {
    image.classList.add("hidden");
  }

  return node;
}

function renderNotes() {
  const notes = readNotes();
  board.innerHTML = "";
  notes.forEach((note) => {
    board.appendChild(createNoteCard(note));
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Image upload failed."));
    reader.readAsDataURL(file);
  });
}

function closeDropdown() {
  dropdownMenu.classList.remove("open");
  dropdownToggle.setAttribute("aria-expanded", "false");
}

dropdownToggle.addEventListener("click", () => {
  const isOpen = dropdownMenu.classList.toggle("open");
  dropdownToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    closeDropdown();
  }
});

dropdownMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeDropdown);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const author = document.getElementById("author").value.trim();
  const message = document.getElementById("message").value.trim();
  const color = document.getElementById("color").value;
  const imageFile = document.getElementById("image").files[0];

  if (!author || !message) return;

  const image = await fileToDataUrl(imageFile);
  const notes = readNotes();

  notes.unshift({ author, message, color, image });
  saveNotes(notes.slice(0, 18));
  renderNotes();
  form.reset();
});

renderNotes();
