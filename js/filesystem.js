// In-memory model for the disks and folders shown by the explorer.
const ObjectType = Object.freeze({
  DISK: "DISK",
  FOLDER: "FOLDER",
  FILE: "FILE",
});

const rootId = 0;
const nodes = new Map([
  [rootId, {
    id: rootId,
    name: "Root",
    type: ObjectType.FOLDER,
    parentId: null,
    children: new Map(),
  }],
]);

let idCounter = rootId;

// Disks and folders can contain folders; files cannot.
function canContainFolders(node) {
  return node?.type === ObjectType.DISK || node?.type === ObjectType.FOLDER;
}

function createContainer(name, parentId, type) {
  const parent = nodes.get(parentId);

  // Names must be non-empty and unique within their parent.
  if (!canContainFolders(parent)) return null;
  if (name === "" || parent.children.has(name)) return null;

  const newId = ++idCounter;
  nodes.set(newId, {
    id: newId,
    name,
    type,
    parentId,
    children: new Map(),
  });

  parent.children.set(name, newId);
  return newId;
}

// ------------------------- DISK AND FOLDER OPERATIONS ---------------
export function createFolder(name, parentId) {
  const parent = nodes.get(parentId);
  if (parent?.id === rootId) return null;

  return createContainer(name, parentId, ObjectType.FOLDER);
}

export function createDisk(name, parentId) {
  return createContainer(name, parentId, ObjectType.DISK);
}

export function renameNode(id, newName) {
  const node = nodes.get(Number(id));

  // The root has no parent and cannot be renamed.
  if (!node || node.id === rootId || typeof newName !== "string") return false;

  newName = newName.trim();
  if (!newName) return false;

  const parent = nodes.get(node.parentId);
  if (!parent) return false;

  // Preserve the existing entry for an unchanged name.
  if (node.name === newName) return true;

  // Sibling names must remain unique, so update both sides of the relationship.
  if (parent.children.has(newName)) return false;

  parent.children.delete(node.name);
  node.name = newName;
  parent.children.set(newName, node.id);
  return true;
}

// Expose the shared map so navigation and rendering can read the model.
export function getNodes() {
  return nodes;
}

// ------------------------- INITIAL EXPLORER CONTENTS -----------------
const mainDiskId = createDisk("Local Disk (C:)", rootId);
createDisk("Local Disk (D:)", rootId);

["Recents", "Documents", "Downloads", "Music", "Videos", "Pictures"].forEach(
  (name) => createFolder(name, mainDiskId),
);
