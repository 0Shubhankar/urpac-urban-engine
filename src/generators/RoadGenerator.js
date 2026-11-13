export function generateRoads(c) {
 const roads=[];
 for(const x of c.roadCoordinates) roads.push({id:`road-v-${x}`,type:Math.abs(x)===180?'arterial':'local',district:'Citywide',position:{x,y:1,z:0},dimensions:{width:Math.abs(x)===180?22:14,height:1,depth:1100},orientation:0,visual:{color:'#697671'}});
 for(const z of c.rowCoordinates) roads.push({id:`road-h-${z}`,type:z===0?'arterial':'secondary',district:'Citywide',position:{x:0,y:1,z},dimensions:{width:1100,height:1,depth:z===0?24:16},orientation:0,visual:{color:'#697671'}});

 for(const x of c.roadNetwork?.collectors ?? []) {
  const inner=c.roadCoordinates
   .filter(v=>Math.sign(v)===Math.sign(x))
   .sort((a,b)=>Math.abs(a)-Math.abs(b))[0];

  if(!Number.isFinite(inner) ||
     Math.abs(x)<100 ||
     Math.abs(x)>=Math.abs(inner)-25)
   throw new Error('Invalid riverside collector');

  roads.push({
   id:`collector-${x}`,
   type:'collector',
   axis:'z',
   district:'Citywide',
   position:{x,y:1,z:0},
   dimensions:{width:12,height:1,depth:1100},
   orientation:0,
   visual:{color:'#697671'}
  });

  for(const z of c.roadNetwork.linksAt ?? []) {
   if(Math.abs(z)>530 ||
      c.rowCoordinates.some(v=>Math.abs(v-z)<35))
    throw new Error('Invalid local connector');

   roads.push({
    id:`link-${x}-${z}`,
    type:'local',
    axis:'x',
    district:'Citywide',
    position:{x:(x+inner)/2,y:1,z},
    dimensions:{
     width:Math.abs(inner-x),
     height:1,
     depth:10
    },
    orientation:0,
    visual:{color:'#697671'}
   });
  }
 }
 return roads;
}
