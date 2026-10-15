import { getNodes } from "./filestystem.js";

let folderContainer = document.getElementById("folder-container");
const objectTemplate = document.querySelector(".object-template");
let nodes = getNodes();

// -------------- RENDER PATH ----------------------


// -------------- RENDER FOLDERS -------------------
export function renderFolders(currentDirectoryId) {
  folderContainer.innerHTML = "";
  nodes.get(currentDirectoryId).children.forEach((id, name) => {
    let newFolder = objectTemplate.content.firstElementChild.cloneNode(true);
    newFolder.querySelector(".name").textContent = name;
    folderContainer.appendChild(newFolder);
  });
}
