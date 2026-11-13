import {SeededRandom} from './SeededRandom.js';
import {generateTerrain} from '../generators/TerrainGenerator.js';
import {generateWater} from '../generators/WaterGenerator.js';
import {generateRoads} from '../generators/RoadGenerator.js';
import {generateBuildings} from '../generators/BuildingGenerator.js';
import {generateVegetation} from '../generators/VegetationGenerator.js';
export function createCityState(config) {
 if(!Number.isInteger(config.seed)||config.size!==1200||config.river.centerX!==0||config.river.width!==110) throw new Error('U0.1 supports the documented 1200 m Riverbend layout and an integer seed.');
 const random=new SeededRandom(config.seed), {buildings,parks}=generateBuildings(config,random);
 const roads=generateRoads(config);
 const bridges=config.rowCoordinates.map(z=>({id:`bridge-${z}`,type:'bridge',district:'Citywide',position:{x:0,y:1,z},dimensions:{width:150,depth:z===0?24:16,height:2},orientation:0,visual:{color:'#c7c6ae'}}));
 return {version:'U0.1',name:config.name,seed:config.seed,boundary:config.size,terrain:generateTerrain(config),water:generateWater(config),roads,bridges,buildings,parks,trees:generateVegetation(config,random,parks)};
}
