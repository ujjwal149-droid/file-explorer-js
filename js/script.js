import { createFolder } from "./filestystem.js";
import { renderFolders, renderPath } from "./ui.js";
import { getNodes } from "./filestystem.js";

let folderContainer = document.getElementById("folder-container");
let currentDirectoryId = 0;

createFolder("NgEW", currentDirectoryId);
createFolder("NgEsssW", 0);
renderPath(currentDirectoryId);
renderFolders(currentDirectoryId);

createFolder("new1", 1);
createFolder("New2", 1);

folderContainer.addEventListener("dblclick", (e) => {
  const folder = e.target.closest("[data-id]");

  if (!folder || !folderContainer.contains(folder)) return;

  openFolder(Number(folder.dataset.id));
});

function openFolder(id) {
  const node = getNodes().get(id);

  if (!node || node.type !== "FOLDER") return;
  currentDirectoryId = id;
  renderFolders(currentDirectoryId);
  renderPath(currentDirectoryId);
}
