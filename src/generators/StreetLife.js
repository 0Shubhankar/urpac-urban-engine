
const axis=r=>
 r.axis??(r.dimensions.width<100?'z':'x');

const near=(x,z,o,pad=0)=>
 Math.abs(x-o.position.x)<
 o.dimensions.width/2+pad &&
 Math.abs(z-o.position.z)<
 (o.type==='tree'
 ?o.dimensions.width
 :o.dimensions.depth)/2+pad;

export function streetLamps(s){

 const lamps=[];

 for(const r of s.roads){

  const v=axis(r)==='z';

  const len=v
   ?r.dimensions.depth:r.dimensions.width;

  const half=(v
   ?r.dimensions.width:r.dimensions.depth)/2;

  for(let k=-len/2+24;k<len/2-20;k+=64){

   for(const side of [-1,1]){

    const offset=side*(half+3);

    const x=r.position.x+(v?offset:k);
    const z=r.position.z+(v?k:offset);

    if(Math.abs(x-s.water.position.x)<
       s.water.dimensions.width/2+32)continue;

    if(s.roads.some(q=>
     q!==r&&near(x,z,q,10)))continue;

    if([...s.buildings,...s.trees,...s.parks]
     .some(q=>near(x,z,q,6)))continue;

    lamps.push({
     x,z,
     dx:v?-side:0,
     dz:v?0:-side,
     roadId:r.id
    });
   }
  }
 }

 return lamps;
}

export function activityRoutes(s){

 const xs=s.roads
  .filter(r=>r.id.startsWith('road-v-'))
  .map(r=>r.position.x)
  .sort((a,b)=>a-b);

 const zs=s.roads
  .filter(r=>r.id.startsWith('road-h-'))
  .map(r=>r.position.z)
  .sort((a,b)=>a-b);

 const cars=[],walkers=[];

 for(let i=0;i+1<xs.length;i+=2){

  for(let j=0;j+1<zs.length;j+=2){

   const a=xs[i]+3,b=xs[i+1]-3;
   const c=zs[j]+3,d=zs[j+1]-3;

   cars.push([
    [a,c],[b,c],[b,d],[a,d]
   ]);
  }
 }

 for(const p of s.parks){

  const {x,z}=p.position;
  const {width:w,depth:d}=p.dimensions;

  for(const side of [-1,1]){

   walkers.push([
    [x,z+side*13],
    [x,z+side*(d/2-8)]
   ]);

   walkers.push([
    [x+side*13,z],
    [x+side*(w/2-8),z]
   ]);
  }
 }

 return {cars,walkers};
}

export function routeLength(route){

 return route.reduce((sum,p,i)=>{

  const q=route[(i+1)%route.length];

  return sum+
   Math.hypot(p[0]-q[0],p[1]-q[1]);

 },0);
}

export function routePosition(route,distance){

 const total=routeLength(route);

 if(total<=0)
  throw new Error('Invalid activity route');

 let d=((distance%total)+total)%total;

 for(let i=0;i<route.length;i++){

  const p=route[i];
  const q=route[(i+1)%route.length];

  const dx=q[0]-p[0],dz=q[1]-p[1];
  const len=Math.hypot(dx,dz);

  if(!len)continue;

  if(d<len||i===route.length-1){

   return {
    x:p[0]+dx*d/len,
    z:p[1]+dz*d/len,
    angle:Math.atan2(dx,dz)
   };
  }

  d-=len;
 }
}
