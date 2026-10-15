const ObjectType = Object.freeze({
  FOLDER: "FOLDER",
  FILE: "FILE",
});

const nodes = new Map();
const rootId = 0;
const currentDirectoryId = 0;

nodes.set(rootId, {
  id: 0,
  name: "Root",
  type: ObjectType.FOLDER,
  parentId: null,
  children: new Map(),
});


