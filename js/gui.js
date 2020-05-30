import * as DATGUI from './lib/dat.gui.module.js';

const buildFunctions = [];

let gui, folders;

export function buildGUI(buildFunction) {
  buildFunctions.push(buildFunction);
}

export function initialiseGui() {
  gui = new DATGUI.GUI();

  // Create folders
  folders = {
    terrain: gui.addFolder('Terrain'),
    lighting: gui.addFolder('Lighting'),
    particles: gui.addFolder('Particles')
  };

  // Open all the folders on startup
  Object.values(folders).forEach((folder) => {
    folder.open();
  });

  // Run all the GUI build functions
  buildFunctions.forEach((buildFunction) => buildFunction(gui, folders));
}
