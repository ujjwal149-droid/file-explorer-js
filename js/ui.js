import { createFolder, getNodes, renameNode } from "./filesystem.js";

// Shared elements and data used by the rendering helpers.
const path = document.querySelector(".path");
const folderContainer = document.getElementById("folder-container");
const objectTemplate = document.querySelector(".object-template");
const nodes = getNodes();

// ------------------------- FOLDER CREATION --------------------------
export function openCreateFolderDialog(currentDirectoryId) {
  // Root is reserved for disks; folders are created inside a disk or folder.
  if (currentDirectoryId === 0) return;

  // Pick the first available default name in this directory.
  let suffix = 0;
  let newId = null;

  while (newId === null) {
    const name = suffix === 0 ? "New Folder" : `New Folder (${suffix})`;
    newId = createFolder(name, currentDirectoryId);
    suffix++;
  }

  renderFolders(currentDirectoryId);

  const folderElement = folderContainer.querySelector(`[data-id="${newId}"]`);
  if (folderElement) startRename(folderElement, newId);
}

// ------------------------- FOLDER RENAMING --------------------------
export function startRename(folderElement, id) {
  folderElement.classList.add("active");

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
        // Keep editing when the name is empty or already used by a sibling.
        finished = false;
        input.focus();
        input.select();
        return;
      }
    }

    const newNameElement = document.createElement("div");
    newNameElement.className = "name";
    newNameElement.textContent = save ? input.value.trim() : oldName;
    input.replaceWith(newNameElement);
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finishRename(true);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      finishRename(false);
    }
  });

  // Clicking away saves the edited name, matching Enter.
  input.addEventListener("blur", () => finishRename(true));
}

// ------------------------- PATH AND NAVIGATION ----------------------
export function renderPath(currentDirectoryId) {
  path.innerHTML = "";
  let id = currentDirectoryId;
  // Walk from the current folder to the root, prepending each breadcrumb.
  while (id !== 0) {
    const folder = nodes.get(id);
    const folderName = document.createElement("p");
    folderName.textContent = folder.name;

    const arrow = document.createElement("p");
    arrow.textContent = ">";
    path.prepend(arrow);
    path.prepend(folderName);

    id = folder.parentId;
  }

  const rootName = document.createElement("p");
  rootName.textContent = nodes.get(id).name;
  const arrow = document.createElement("p");
  arrow.textContent = ">";
  path.prepend(arrow);
  path.prepend(rootName);
}

export function renderNav(currentDirectoryId, canGoForward = false) {
  const backButton = document.querySelector(".nav-controls .left");
  const forwardButton = document.querySelector(".nav-controls .right");

  backButton.disabled = currentDirectoryId === 0;
  forwardButton.disabled = !canGoForward;
}

// ------------------------- FOLDER CONTENTS --------------------------
export function renderFolders(currentDirectoryId) {
  folderContainer.innerHTML = "";

  nodes.get(currentDirectoryId).children.forEach((id, name) => {
    const folder = objectTemplate.content.firstElementChild.cloneNode(true);
    const node = nodes.get(id);
    const icon = folder.querySelector("img");

    folder.querySelector(".name").textContent = name;
    folder.dataset.id = id;
    folder.classList.toggle("disk", node.type === "DISK");
    icon.src = node.type === "DISK" ? "./images/local-disk.png" : "./images/folder.png";
    icon.alt = node.type === "DISK" ? "Disk" : "Folder";
    folderContainer.appendChild(folder);
  });

  if (folderContainer.childElementCount === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "This folder is empty";
    folderContainer.appendChild(emptyMessage);
  }
}
