const ObjectType = Object.freeze({
  FOLDER: "FOLDER",
  FILE: "FILE",
});

const nodes = new Map();
const rootId = 0;
let idCounter = 0;

nodes.set(rootId, {
  id: 0,
  name: "Root",
  type: ObjectType.FOLDER,
  parentId: null,
  children: new Map(),
});

export function createFolder(name, parentId) {
  // validation
  if (!nodes.has(parentId) || nodes.get(parentId).type != ObjectType.FOLDER)
    return;

  if (nodes.get(parentId).children.has(name)) return;
  if (name == "") return;

  // creation
  const newId = ++idCounter;
  nodes.set(newId, {
    id: newId,
    name: name,
    type: ObjectType.FOLDER,
    parentId: parentId,
    children: new Map(),
  });

  nodes.get(parentId).children.set(name, newId);
  return newId;
}

export function renameNode(id, newName) {
  const node = nodes.get(Number(id));

  // Validate node
  if (!node || node.id === rootId) return false;

  // Validate name
  if (typeof newName !== "string") return false;
  newName = newName.trim();

  if (!newName) return false;

  const parent = nodes.get(node.parentId);
  if (!parent) return false;

  const oldName = node.name;

  // Same name: nothing to change
  if (oldName === newName) return true;

  // Reject duplicate names in the same parent
  if (parent.children.has(newName)) return false;

  // Update parent map and node
  parent.children.delete(oldName);
  node.name = newName;
  parent.children.set(newName, node.id);

  return true;
}

export function getNodes() {
  return nodes;
}
