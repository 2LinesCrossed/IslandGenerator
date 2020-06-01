import * as DATGUI from './lib/dat.gui.module.js';

const pendingBuildFunctions = [];

let gui, folders;

// Helper function to safely bind stuff to the GUI.
// Calls the provided function immediately if loaded.
// Otherwise, it will just add it to the list for later execution.
export function buildGUI(buildFunction) {
  if (gui) {
    buildFunction(gui, folders);
  } else {
    pendingBuildFunctions.push(buildFunction);
  }
}

export function initialiseGui() {
  gui = new DATGUI.GUI();

  // Create folders
  folders = {
    rendering: gui.addFolder('Rendering'),
    terrain: gui.addFolder('Terrain'),
    water: gui.addFolder('Water'),
    lighting: gui.addFolder('Lighting'),
    particles: gui.addFolder('Particles')
  };

  // Expand all of the folders
  Object.values(folders).forEach((folder) => {
    folder.open();
  });

  // Run all the functions passed to buildGUI
  pendingBuildFunctions.forEach((buildFunction) => buildFunction(gui, folders));
}
