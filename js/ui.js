import { getNodes } from "./filestystem.js";

let path = document.querySelector(".path");

let folderContainer = document.getElementById("folder-container");
const objectTemplate = document.querySelector(".object-template");
let nodes = getNodes();

// -------------- RENDER PATH ----------------------
export function renderPath(currentDirectoryId) {
  path.innerHTML = "";
  let id = currentDirectoryId;
  while (id != 0) {
    let newEle = document.createElement("p");
    newEle.innerText = nodes.get(id).name;
    let newArrow = document.createElement("p");
    newArrow.innerText = ">";
    path.prepend(newEle);
    path.prepend(newArrow);
    id = nodes.get(id).parentId;
  }

  let newEle = document.createElement("p");
  newEle.innerText = nodes.get(id).name;
  path.prepend(newEle);
}

// -------------- RENDER FOLDERS -------------------
export function renderFolders(currentDirectoryId) {
  folderContainer.innerHTML = "";
  nodes.get(currentDirectoryId).children.forEach((id, name) => {
    let newFolder = objectTemplate.content.firstElementChild.cloneNode(true);
    newFolder.querySelector(".name").textContent = name;
    newFolder.dataset.id = id;
    folderContainer.appendChild(newFolder);
  });
}