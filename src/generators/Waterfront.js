
export function waterfrontParts(state){

 const parts=[];
 const {position,dimensions}=state.water;
 const half=dimensions.width/2;
 const length=dimensions.depth;

 const add=(kind,color,x,y,z,width,height,depth)=>{

  const p={kind,color,x,y,z,width,height,depth};

  const blocked=state.roads.some(r=>
   Math.abs(x-r.position.x)<
    (width+r.dimensions.width)/2+5 &&
   Math.abs(z-r.position.z)<
    (depth+r.dimensions.depth)/2+5
  );

  if(!blocked)parts.push(p);
 };

 for(const side of [-1,1]){

  const rail=position.x+side*(half+10);
  const furniture=position.x+side*(half+25);

  // Protective waterfront railings.

  for(let z=-length/2+12;
      z<=length/2-12;z+=12){

   add('rail','#647674',
    rail,7,z,.65,.65,12);

   add('rail-post','#647674',
    rail,5.5,z,.8,3,.8);
  }

  // Public benches overlooking the river.

  for(let z=-length/2+30;
      z<length/2-20;z+=60){

   add('bench','#947557',
    furniture,5.6,z,2.5,.55,6);

   add('bench','#947557',
    furniture+side*1.1,7,z,.45,2.2,6);

   for(const dz of [-2,2])
    add('bench-leg','#586460',
     furniture,4.7,z+dz,2,.95,.6);
  }

  // Riverside street lighting.

  for(let z=-length/2+48;
      z<length/2-20;z+=72){

   add('lamp','#596863',
    furniture,8,z,.65,8,.65);

   add('lamp','#596863',
    furniture-side*1.3,12,z,3.2,.55,.65);

   add('lamp-head','#f0dfaf',
    furniture-side*2.5,11.5,z,1.6,.65,1.4);
  }
 }

 // Architectural caps on existing bridge parapets.

 for(const b of state.bridges){

  const {x,z}=b.position;
  const {width,depth}=b.dimensions;

  for(const side of [-1,1])
   parts.push({
    kind:'bridge-cap',
    color:'#9baba5',
    x,
    y:8.7,
    z:z+side*(depth/2+2),
    width:width+2,
    height:.45,
    depth:2.2
   });
 }

 return parts;
}
