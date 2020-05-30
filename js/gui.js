import * as DATGUI from './lib/dat.gui.module.js';

export let gui; // Can't use export default since this is reassigned :(
export function initialiseGui() {
  gui = new DATGUI.GUI();
}
