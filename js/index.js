import { initialiseGui } from './gui.js';
import { initialiseScene } from './scene.js';
import { buildGUI as buildTerrainGui } from './terrain.js';

initialiseGui();
buildTerrainGui();

initialiseScene();
