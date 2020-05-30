import * as DATGUI from './lib/dat.gui.module.js';
import { buildGUI as buildTerrainGui } from './terrain.js';
import { buildGUI as buildSceneGui } from './scene.js';

export let gui; // Can't use export default since this is reassigned :(
export function initialiseGui() {
  gui = new DATGUI.GUI();
  buildTerrainGui();
  buildSceneGui();
}
