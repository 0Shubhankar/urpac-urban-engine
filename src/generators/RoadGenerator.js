export function generateRoads(c) {
 const roads=[];
 for(const x of c.roadCoordinates) roads.push({id:`road-v-${x}`,type:Math.abs(x)===180?'arterial':'local',district:'Citywide',position:{x,y:1,z:0},dimensions:{width:Math.abs(x)===180?22:14,height:1,depth:1100},orientation:0,visual:{color:'#697671'}});
 for(const z of c.rowCoordinates) roads.push({id:`road-h-${z}`,type:z===0?'arterial':'secondary',district:'Citywide',position:{x:0,y:1,z},dimensions:{width:1100,height:1,depth:z===0?24:16},orientation:0,visual:{color:'#697671'}});
 return roads;
}
