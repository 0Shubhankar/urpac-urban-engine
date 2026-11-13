import {createBlocks} from './BlockLayout.js';
export function generateBuildings(c,random) {
 const buildings=[], parks=[];
 if(c.layout) return generateConfiguredBuildings(c,random);
 const columns=[-450,-270,270,450], rows=[-450,-270,-90,90,270,450];
 for(const x of columns) for(const z of rows) {
   const district=x<0?(z<0?'Garden Quarter':x===-450?'Westbank Living':'Civic Commons'):(z<0?'Central Business District':'Market Quarter');
   if((x===270&&z===270)||(x===-270&&z===90)){parks.push({id:`park-${x}-${z}`,type:'park',district:'Riverside Park',position:{x,y:1,z},dimensions:{width:140,depth:140,height:1},orientation:0,visual:{color:'#96b77d'}});continue;}
   for(let dx of [-48,0,48]) for(let dz of [-46,46]) {
    let type=district==='Garden Quarter'?'house':district==='Westbank Living'?'apartment':district==='Central Business District'?(random.next()>.4?'office':'commercial'):district==='Civic Commons'?'midrise':'commercial';
    if(x===-270&&dx===0&&dz===-46) type=z===270?'hospital':z===450?'school':'civic';
    const width=random.range(26,36),depth=random.range(27,38);
    const height={house:random.range(10,16),apartment:random.range(22,32),midrise:random.range(40,58),commercial:random.range(18,32),office:random.range(65,132),hospital:30,school:18,civic:30}[type];
    const palette=type==='office'?['#b7c9c4','#8faeb0','#d8dfd2']:type==='house'?['#ead6b4','#d8d7bc','#f0e2cc']:['#e2dfcc','#d5c5af','#c0cec0','#ede4d3'];
    buildings.push({id:`building-${String(buildings.length+1).padStart(3,'0')}`,type,district,position:{x:x+dx,y:2,z:z+dz},dimensions:{width,depth,height},orientation:0,visual:{color:random.pick(palette),roof:random.pick(['#937565','#76877e','#b2927d']),roofForm:type==='house'?'gable':'flat'}});
   }
 }
 return {buildings,parks};
}

function generateConfiguredBuildings(c,random) {
 const buildings=[],parks=[];
 let civicIndex=0;
 for(const block of createBlocks(c)) {
  const {x,z,width,depth,district}=block;
  if(block.park){parks.push({id:`park-${block.id}`,type:'park',district:'Riverside Park',position:{x,y:1,z},dimensions:{width:width-48,depth:depth-48,height:1},orientation:0,visual:{color:'#96b77d'}});continue;}
  const cols=width>=180?3:2;
  const stepX=(width-54)/cols,stepZ=(depth-54)/2;
  for(let i=0;i<cols;i++)for(let j=0;j<2;j++){
   let type=district==='Garden Quarter'?'house':district==='Westbank Living'?'apartment':district==='Central Business District'?(random.next()>.4?'office':'commercial'):district==='Civic Commons'?'midrise':'commercial';
   if(district==='Civic Commons'&&civicIndex<3)type=['civic','hospital','school'][civicIndex++];
   const w=random.range(24,Math.min(36,stepX-10)),d=random.range(27,Math.min(38,stepZ-10));
   const height={house:random.range(10,16),apartment:random.range(22,32),midrise:random.range(40,58),commercial:random.range(18,32),office:random.range(65,132),hospital:30,school:18,civic:30}[type];
   const palette=type==='office'?['#b7c9c4','#8faeb0','#d8dfd2']:type==='house'?['#ead6b4','#d8d7bc','#f0e2cc']:['#e2dfcc','#d5c5af','#c0cec0','#ede4d3'];
   buildings.push({id:`building-${block.id}-${i}-${j}`,type,district,position:{x:x+(i-(cols-1)/2)*stepX,y:2,z:z+(j-.5)*stepZ},dimensions:{width:w,depth:d,height},orientation:0,visual:{color:random.pick(palette),roof:random.pick(['#937565','#76877e','#b2927d']),roofForm:type==='house'?'gable':'flat'}});
  }
 }
 return {buildings,parks};
}
