import * as DATGUI from './lib/dat.gui.module.js';
import { buildGUI as buildTerrainGUI } from './terrain.js';
import { buildGUI as buildSceneGUI } from './scene.js';

export let gui; // Can't use export default since this is reassigned :(

export let guiFolders;

export function initialiseGui() {
  gui = new DATGUI.GUI();

  // Create folders
  guiFolders = {
    lighting: gui.addFolder('Lighting'),
    terrain: gui.addFolder('Terrain'),
    particles: gui.addFolder('Particles')
  };

  // Open all the folders on startup
  Object.values(guiFolders).forEach((folder) => {
    folder.open();
  });

  // Call buildGUI functions of different components
  // (TODO: Maybe change this to not be a violation of the open/closed principle, using some kind of priority system)
  buildTerrainGUI();
  buildSceneGUI();
}
