
export function parkDetails(state){

 const parts=[];

 for(const park of state.parks){

  const {x,z}=park.position;
  const {width:w,depth:d}=park.dimensions;

  const clear=(px,pz,pw,pd)=>{

   const objects=[
    ...state.trees,
    ...state.roads,
    ...state.buildings
   ];

   return !objects.some(o=>
    Math.abs(px-o.position.x)<
     (pw+o.dimensions.width)/2+3 &&
    Math.abs(pz-o.position.z)<
     (pd+(o.type==='tree'
       ?o.dimensions.width
       :o.dimensions.depth))/2+3
   );
  };

  const add=(kind,color,dx,y,dz,
             width,height,depth)=>{

   parts.push({
    kind,color,
    parkId:park.id,
    x:x+dx,y,z:z+dz,
    width,height,depth
   });
  };

  // Benches placed beside existing central paths.

  for(const side of [-1,1]){

   for(const dz of [-46,-28,28,46]){

    const dx=side*8;

    if(Math.abs(dz)+4>d/2)continue;
    if(Math.abs(dx)+3>w/2)continue;

    if(!clear(x+dx,z+dz,4,7))continue;

    add('bench','#a18160',
     dx,5.5,dz,2.5,.65,6);

    add('bench-back','#a18160',
     dx+side*1.1,7,dz,.45,2,6);

    for(const offset of [-2,2])
     add('bench-leg','#626c65',
      dx,4.7,dz+offset,1.8,1.5,.6);
   }
  }

  // Lamps beside paths, clear of their walking surface.

  for(const side of [-1,1]){

   for(const dz of [-53,53]){

    const dx=side*6;

    if(Math.abs(dz)+3>d/2)continue;
    if(Math.abs(dx)+2>w/2)continue;

    if(!clear(x+dx,z+dz,3,3))continue;

    add('lamp','#596863',
     dx,8,dz,.7,8,.7);

    add('lamp-head','#f0dfaf',
     dx,12,dz,1.8,1,1.8);
   }
  }
 }

 return parts;
}
