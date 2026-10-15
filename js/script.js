import { createFolder } from "./filestystem.js";
import {
  openCreateFolderDialog,
  renderFolders,
  renderNav,
  renderPath,
} from "./ui.js";
import { getNodes } from "./filestystem.js";

let folderContainer = document.getElementById("folder-container");
let navControls = document.querySelector(".nav-controls");
let addFolderButton = document.querySelector(".add-folder");
let currentDirectoryId = 0;
let directoryLog = [0];

createFolder("NgEW", currentDirectoryId);
createFolder("NgEsssW", 0);
renderPath(currentDirectoryId);
renderFolders(currentDirectoryId);
renderNav(currentDirectoryId);

createFolder("new1", 1);
createFolder("New2", 1);

addFolderButton.addEventListener("click", (e) => {
  openCreateFolderDialog(currentDirectoryId);
});

navControls.addEventListener("click", (e) => {
  const leftButton = e.target.closest(".left");
  if (leftButton && currentDirectoryId != 0) {
    currentDirectoryId = directoryLog[directoryLog.length - 2];
    directoryLog.pop();
    renderFolders(currentDirectoryId);
  }
});

folderContainer.addEventListener("dblclick", (e) => {
  const folder = e.target.closest("[data-id]");

  if (!folder || !folderContainer.contains(folder)) return;

  openFolder(Number(folder.dataset.id));
});

folderContainer.addEventListener("click", (e) => {
  const lastActive = folderContainer.querySelector(".active");

  if (lastActive) lastActive.classList.remove("active");
  const folder = e.target.closest("[data-id]");

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
