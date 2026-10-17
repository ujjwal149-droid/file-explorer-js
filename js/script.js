import { getNodes } from "./filesystem.js";
import {
  openCreateFolderDialog,
  renderFolders,
  renderNav,
  renderPath,
  startRename,
} from "./ui.js";
import { Stack } from "./Stack.js";

// DOM elements used by the explorer's event handlers.
const folderContainer = document.getElementById("folder-container");
const navControls = document.querySelector(".nav-controls");
const addFolderButton = document.querySelector(".add-folder");
const renameButton = document.querySelector(".rename");

// The current location
let currentDirectoryId = 0;

// Stacks for navigation
let st1 = new Stack();
let st2 = new Stack();

st1.push(currentDirectoryId);

// Draw the initial view.
renderPath(currentDirectoryId);
renderFolders(currentDirectoryId);
renderNav(currentDirectoryId, !st2.isEmpty());

// ------------------------- EXPLORER ACTIONS -------------------------
addFolderButton.addEventListener("click", () => {
  openCreateFolderDialog(currentDirectoryId);
});

function renameActiveFolder(event) {
  const activeFolder = folderContainer.querySelector(".active");
  if (!activeFolder) return;

  event.preventDefault();
  startRename(activeFolder, Number(activeFolder.dataset.id));
}

renameButton.addEventListener("click", renameActiveFolder);

// ------------------------- FOLDER NAVIGATION ------------------------
navControls.addEventListener("click", (event) => {
  const backButton = event.target.closest(".left");
  if (backButton) {
    // Keep the current location for Forward, then move back one history entry.
    if (st1.size() <= 1) return;

    st2.push(currentDirectoryId);
    st1.pop();
    currentDirectoryId = st1.peek();

    renderCurrentDirectory();
    return;
  }

  const forwardButton = event.target.closest(".right");
  if (!forwardButton || st2.isEmpty()) return;

  // Restore the most recently visited location from the Forward history.
  st1.push(st2.pop());
  currentDirectoryId = st1.peek();
  renderCurrentDirectory();
});

// OPEN FOLDER
folderContainer.addEventListener("dblclick", (event) => {
  const folder = event.target.closest("[data-id]");
  if (!folder || !folderContainer.contains(folder)) return;

  openFolder(Number(folder.dataset.id));
});

// CLICK FOLDER
folderContainer.addEventListener("click", (event) => {
  folderContainer.querySelector(".active")?.classList.remove("active");

  const folder = event.target.closest("[data-id]");
  if (!folder || !folderContainer.contains(folder)) return;

  folder.classList.add("active");
});

function openFolder(id) {
  const node = getNodes().get(id);
  if (!node || node.type !== "FOLDER") return;

  // A new route invalidates any locations saved by going Back.
  st2.clear();
  currentDirectoryId = id;
  st1.push(currentDirectoryId);
  renderCurrentDirectory();
}

function renderCurrentDirectory() {
  renderFolders(currentDirectoryId);
  renderPath(currentDirectoryId);
  renderNav(currentDirectoryId, !st2.isEmpty());
}

// ------------------------- KEYBOARD SHORTCUTS -----------------------
document.addEventListener("keydown", (event) => {
  if (event.key === "F2") renameActiveFolder(event);
});
