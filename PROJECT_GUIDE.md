# File Explorer Project Guide

Use this guide to trace how the project works and review the JavaScript and browser concepts behind it.

## 1. Project at a glance

This is a small browser-based file explorer interface. It stores disks and folders in JavaScript memory, builds the visible grid from that data, and lets you navigate, select, create, and rename folders.

At startup, the root contains `Local Disk (C:)` and `Local Disk (D:)`. The C: disk starts with Recents, Documents, Downloads, Music, Videos, and Pictures folders. The D: disk starts empty.

The project currently has no server or database. Reloading the page resets the tree to these default disks and folders and removes anything created during that session.

## 2. Files and responsibilities

| File | Responsibility |
| --- | --- |
| `index.html` | Defines the explorer layout and the reusable folder template. Loads the JavaScript entry point as an ES module. |
| `style.css` | Styles the page, sidebar, toolbar, folder grid, and inline rename input. |
| `js/script.js` | Starts the UI, tracks the current folder and navigation history, and handles user events. |
| `js/ui.js` | Creates and updates DOM elements for folders, breadcrumbs, empty states, and renaming. |
| `js/filesystem.js` | Holds the in-memory folder model and provides create and rename operations. |
| `images/` | Contains icons and background images referenced by the HTML and CSS. |
| `readme.txt` | Short project structure summary. |

## 3. How the app starts

1. The browser reads `index.html` and loads `style.css`.
2. `<script src="./js/script.js" type="module">` loads the JavaScript entry point. The `type="module"` attribute enables `import` and `export`.
3. `script.js` imports the model accessor from `filesystem.js` and UI functions from `ui.js`.
4. `ui.js` gets references to the path element, folder container, and folder template. It also gets the shared `nodes` map from the model.
5. `script.js` initializes `currentDirectoryId` to `0`, then calls `renderPath`, `renderFolders`, and `renderNav` to draw the root view.

## 4. The folder data model

`filesystem.js` keeps all folders in a `Map` named `nodes`. A map entry uses a numeric ID as its key and a node object as its value. The root node has ID `0`.

Each disk or folder node looks like this:

```js
{
  id: 1,
  name: "Projects",
  type: "FOLDER", // A disk node uses "DISK" here.
  parentId: 0,
  children: new Map()
}
```

The model stores each parent-child relationship in two useful ways:

- A child has a `parentId`, which lets the app walk upward to build the breadcrumb path.
- A folder's `children` map associates each child name with that child's ID, which lets the UI list the folder's contents.

The two maps are related but serve different purposes: `nodes` finds any node by ID; `children` finds the IDs of one folder's immediate children by name. The app relies on names being unique within a single parent folder.

### Creating disks and folders

`createFolder(name, parentId)` looks up the parent and rejects the request if the parent cannot contain folders, is the root, or already has a child with that name. On success, it increments `idCounter`, creates a node, adds the node to `nodes`, adds its name and ID to the parent's `children`, and returns the new ID. `createDisk()` uses the same internal logic with the `DISK` type. Both return `null` when creation fails.

### Renaming a folder

`renameNode(id, newName)` validates the ID and name, trims whitespace, prevents renaming the root, and checks for a duplicate sibling name. On success it removes the old name from the parent's `children` map, updates the node, and inserts the new name and ID. Both the node and parent map must be updated so the model stays consistent.

## 5. How the UI is built

The folder grid in `index.html` contains a `<template class="object-template">`. A template stores markup without displaying it. For every child in the current folder, `renderFolders()`:

1. Clears the old contents of `#folder-container`.
2. Clones the template's first element.
3. Writes the child's name into `.name` using `textContent`.
4. Stores the numeric ID in the element's `data-id` attribute.
5. Appends the cloned folder to the container.

If there are no children, the function inserts a `This folder is empty` message instead.

The model is the source of truth. Rendering clears and rebuilds the visible elements from the model rather than treating the DOM as the stored data. Disk nodes use the local-disk icon; folder nodes use the folder icon.

### Breadcrumbs

`renderPath(currentDirectoryId)` starts at the current folder and follows `parentId` links until it reaches root ID `0`. It prepends each folder name and `>` separator so the final visual order goes from root to the current folder.

### Navigation-button state

`renderNav(currentDirectoryId, canGoForward)` disables the left/back button at root and disables the right/forward button when there is no forward history.

## 6. User interactions and event flow

`script.js` owns the application state and connects UI events to model and rendering functions.

### Create

Clicking the first `.add-folder` button calls `openCreateFolderDialog(currentDirectoryId)` in `ui.js`. This button is disabled at root because root is reserved for drives; create folders after opening a drive. Despite its name, the helper does not open a modal: it tries `New Folder`, then `New Folder (1)`, `New Folder (2)`, and so on until `createFolder()` succeeds. The UI is rendered again and the new folder immediately enters rename mode.

### Select and open

- A single click on a folder adds the `.active` class, after removing it from the previously selected folder.
- A double-click finds the closest ancestor with `data-id`, converts that ID to a number, and calls `openFolder()`.
- `openFolder()` verifies that the ID exists and is a folder, updates the current ID and navigation history, then renders the contents, path, and navigation-button states.

### Go back and forward

`script.js` uses two `Stack` instances. The back stack (`st1`) starts with root ID `0`; each opened folder is pushed onto it. On Back, the current ID is pushed onto the forward stack (`st2`), removed from the back stack, and the new back-stack top becomes the current ID. On Forward, the current ID is pushed onto the back stack and the forward-stack top is popped to become current. Both actions redraw the folder grid, breadcrumb, and navigation buttons.

Opening a new folder after going back clears the forward stack because the new route branches away from the old one. `Stack.clear()` empties that history.

### Rename

Clicking the rename button or pressing F2 calls `renameActiveFolder()`. If a folder is selected, `startRename()` swaps its name element for a text input, focuses and selects the current name, and listens for keyboard and blur events:

- Enter tries to save through `renameNode()`.
- Escape restores the original visible name without saving.
- Leaving the input (blur) tries to save.
- An invalid or duplicate name leaves the input open so it can be corrected.

## 7. Important current behavior to remember

- The tree is in memory only. A page reload restores the seeded disks and folders and removes anything created during that session.
- The sidebar entries, search field, sort, cut, paste, and copy icons are presentational; they do not currently have working handlers.
- Several toolbar buttons share `.add-folder`, but `script.js` uses `querySelector()`, which attaches the create handler only to the first matching button.
- The root breadcrumb currently has a trailing `>` separator; review `renderPath()` if adjusting breadcrumb formatting.
- `ObjectType.FILE` is declared, but the current model and UI only create and display disks and folders.
- `openCreateFolderDialog()` is a folder-creation helper, not a dialog implementation.

## 8. Topics and concepts worth revising

Keep this section separate from the walkthrough as a quick study checklist.

### JavaScript modules

- `export` makes functions available to other files; `import` brings them in.
- Browser modules use file paths such as `"./filesystem.js"` and need to be loaded with `type="module"`.
- Module-level state such as `nodes` is shared by importers of the same module instance.

### `Map` and references

- A `Map` stores key-value pairs and supports `.get()`, `.set()`, `.has()`, and `.delete()`.
- `Map` preserves insertion order, so children render in the order they were added.
- `getNodes()` returns the map itself, not a copy. Callers receive a reference to the same mutable map.
- The parent-child structure has an invariant: a child's name in `parent.children` must point to that child's ID, and the child's `name` and `parentId` must agree with that entry.

### DOM rendering

- `document.querySelector()` returns the first matching element; `querySelectorAll()` returns all matches.
- `document.createElement()` creates a DOM node; `.appendChild()` inserts it.
- `textContent` writes text safely without parsing it as HTML.
- `innerHTML = ""` clears existing descendants.
- `cloneNode(true)` makes a deep copy of a template element; `template.content` is a `DocumentFragment` containing its inert markup.
- `data-id` is a `data-*` attribute. JavaScript reads it through `element.dataset.id`, which is a string and should be converted to a number for numeric map keys.

### Events and delegation

- Events bubble from the clicked child toward its ancestors.
- Event delegation attaches one handler to a shared parent (here, `#folder-container`) instead of one handler per folder.
- `event.target` is where the event began; `closest()` searches that element and its ancestors for a matching selector.
- `container.contains(element)` verifies that the matched element belongs to the intended container.
- `preventDefault()` cancels a browser default action; it does not stop event bubbling.
- `keydown`, `dblclick`, `click`, and `blur` are separate event types with different timing and use cases.

### State, IDs, and history

- `currentDirectoryId` is application state: it identifies which folder's children should be rendered.
- Numeric IDs remain stable when a folder is renamed; names are labels and sibling lookup keys.
- The back and forward stacks (`st1` and `st2`) support browser-style history. `push()` records a location and `pop()` moves the most recent location between the stacks.
- If multiple UI elements display the same state, every navigation path should update all of them. Here, that means keeping the folder grid, breadcrumb, and back-button state in sync.

### Validation and UI editing

- Validate input at the model boundary so every caller follows the same rules.
- Trimming input before checking it prevents names made only of spaces.
- A boolean or `null` return value communicates whether an operation succeeded.
- `focus()` places the cursor in the rename field; `select()` highlights its text.
- Blur happens when an input loses focus. A `finished` guard prevents Enter and blur from finalizing the same edit twice.
- `Object.freeze()` prevents changing the properties of the `ObjectType` constant object; it does not freeze the folder nodes or maps.

### CSS layout

- Flexbox is used for the main explorer layout and toolbar alignment.
- CSS Grid lays out the folder tiles with auto-filling columns.
- A class such as `.active` connects application state to visual styling.
- The `:hover` and `:disabled` pseudo-classes style interaction states without JavaScript.

## 9. A useful way to trace a change

When adding a feature, follow this path:

1. **Model:** What data changes in `filesystem.js`? What validation keeps it valid?
2. **UI:** Which elements must be rendered or refreshed in `ui.js`?
3. **Events and state:** Which interaction and state updates belong in `script.js`?
4. **Markup and style:** Does the feature need a control in `index.html` or styles in `style.css`?
5. **Consistency:** After the action, do the model, folder grid, breadcrumb, selected item, and navigation controls agree?
