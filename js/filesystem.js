// In-memory model for the folders shown by the explorer.
const ObjectType = Object.freeze({
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

// ------------------------- FOLDER OPERATIONS ------------------------
export function createFolder(name, parentId) {
  const parent = nodes.get(parentId);

  // A folder name must be non-empty and unique within its parent.
  if (!parent || parent.type !== ObjectType.FOLDER) return null;
  if (name === "" || parent.children.has(name)) return null;

  const newId = ++idCounter;
  nodes.set(newId, {
    id: newId,
    name,
    type: ObjectType.FOLDER,
    parentId,
    children: new Map(),
  });

  parent.children.set(name, newId);
  return newId;
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
