import { createFolder } from "./filestystem.js";
import { renderFolders, renderPath } from "./ui.js";

let folderContainer = document.getElementById("folder-container");
let currentDirectoryId = 0;

createFolder("NgEW", currentDirectoryId);
createFolder("NgEsssW", 0);
renderPath(currentDirectoryId);
renderFolders(currentDirectoryId);

createFolder("new1", 1);
createFolder("New2", 1);

folderContainer.addEventListener("click", (e) => {
  openFolder(Number(e.target.dataset.id));
});

function openFolder(id) {
  currentDirectoryId = id;
  renderFolders(currentDirectoryId);
  renderPath(currentDirectoryId);
}
