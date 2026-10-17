import { getNodes } from "./filesystem.js";
import {
  openCreateFolderDialog,
  renderFolders,
  renderNav,
  renderPath,
  startRename,
} from "./ui.js";

// DOM elements used by the explorer's event handlers.
const folderContainer = document.getElementById("folder-container");
const navControls = document.querySelector(".nav-controls");
const addFolderButton = document.querySelector(".add-folder");
const renameButton = document.querySelector(".rename");

// The current location and the locations visited on the way here.
let currentDirectoryId = 0;
const directoryLog = [currentDirectoryId];

// Draw the initial view.
renderPath(currentDirectoryId);
renderFolders(currentDirectoryId);
renderNav(currentDirectoryId);

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
  if (!backButton || currentDirectoryId === 0) return;

  directoryLog.pop();
  currentDirectoryId = directoryLog[directoryLog.length - 1];
  renderFolders(currentDirectoryId);
});

folderContainer.addEventListener("dblclick", (event) => {
  const folder = event.target.closest("[data-id]");
  if (!folder || !folderContainer.contains(folder)) return;

  openFolder(Number(folder.dataset.id));
});

folderContainer.addEventListener("click", (event) => {
  folderContainer.querySelector(".active")?.classList.remove("active");

  const folder = event.target.closest("[data-id]");
  if (!folder || !folderContainer.contains(folder)) return;

  folder.classList.add("active");
});

function openFolder(id) {
  const node = getNodes().get(id);
  if (!node || node.type !== "FOLDER") return;

  currentDirectoryId = id;
  directoryLog.push(id);
  renderFolders(currentDirectoryId);
  renderPath(currentDirectoryId);
  renderNav(currentDirectoryId);
}

// ------------------------- KEYBOARD SHORTCUTS -----------------------
document.addEventListener("keydown", (event) => {
  if (event.key === "F2") renameActiveFolder(event);
});
