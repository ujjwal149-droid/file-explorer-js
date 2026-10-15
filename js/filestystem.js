const ObjectType = Object.freeze({
  FOLDER: "FOLDER",
  FILE: "FILE",
});

const nodes = new Map();
const rootId = 0;
const currentDirectoryId = 0;
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
}

export function getNodes() {
  return nodes;
}
