import { getNodes } from "./filestystem.js";

let path = document.querySelector(".path");

let folderContainer = document.getElementById("folder-container");
const objectTemplate = document.querySelector(".object-template");
let nodes = getNodes();

// -------------- DIALOGS / MODALS -----------------
export function openCreateFolderDialog() {
  
}

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

export function renderNav(currentDirectoryId) {
  let navControls = document.querySelector(".nav-controls");
  if (currentDirectoryId == 0) {
    navControls.querySelector(".left").disabled = true;
  } else {
    navControls.querySelector(".left").disabled = false;
  }
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
