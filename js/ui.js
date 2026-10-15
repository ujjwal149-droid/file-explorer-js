import { getNodes, createFolder, renameNode } from "./filestystem.js";
let path = document.querySelector(".path");

let folderContainer = document.getElementById("folder-container");
const objectTemplate = document.querySelector(".object-template");
let nodes = getNodes();

// -------------- DIALOGS / MODALS -----------------
export function openCreateFolderDialog(currentDirectoryId) {
  let ctr = 0;
  let newId = null;

  while (newId === null) {
    const name = ctr === 0 ? "New Folder" : `New Folder (${ctr})`;

    newId = createFolder(name, currentDirectoryId);
    ctr++;
  }

  renderFolders(currentDirectoryId);

  const folderElement = folderContainer.querySelector(`[data-id="${newId}"]`);

  if (folderElement) {
    startRename(folderElement, newId);
  }
}

// -------------- RENAME -----------------
export function startRename(folderElement, id) {
  const nameElement = folderElement.querySelector(".name");
  if (!nameElement) return;

  const oldName = nameElement.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldName;
  input.className = "rename-input";

  nameElement.replaceWith(input);

  input.focus();
  input.select();

  let finished = false;

  function finishRename(save) {
    if (finished) return;
    finished = true;

    if (save) {
      const success = renameNode(id, input.value);

      if (!success) {
        finished = false;
        input.focus();
        input.select();
        return;
      }
    }

    const newNameElement = document.createElement("p");
    newNameElement.className = "name";
    newNameElement.textContent = save ? input.value.trim() : oldName;

    input.replaceWith(newNameElement);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishRename(true);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      finishRename(false);
    }
  });

  input.addEventListener("blur", () => {
    finishRename(true);
  });
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
