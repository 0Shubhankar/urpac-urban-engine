
export function buildingDetails(b,tiers){

 const {width:w,depth:d,height:h}=b.dimensions;

 const style=[...b.id].reduce(
  (a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,0
 )%3;

 const parts=[];

 const box=(color,x,y,z,width,height,depth)=>
  parts.push({color,x,y,z,width,height,depth});

 const top=tiers.at(-1);

 // Residential balconies and railings.
 if(b.type==='apartment'||b.type==='midrise'){

  for(const t of tiers){

   for(let floor=t.bottom+3;
       floor+4<t.top;floor+=8){

    for(const side of [-1,1]){

     const z=side*(t.depth/2+1.25);

     box('#ded8c7',0,floor,z,
      t.width*.65,.65,2.5);

     box('#81928c',0,floor+1.1,
      side*(t.depth/2+2.3),
      t.width*.65,1.5,.25);
    }
   }
  }
 }

 // Vertical office facade accents.
 if(b.type==='office'){

  for(const t of tiers){

   const ht=t.top-t.bottom;

   for(const side of [-1,1]){

    for(const x of [-t.width*.37,t.width*.37]){

     box('#aabbb8',x,t.bottom+ht/2,
      side*(t.depth/2+.32),
      .7,ht,.3);
    }
   }
  }
 }

 // Rooftop parapets and terrace details.
 if(['office','apartment','midrise'].includes(b.type)){

  for(const side of [-1,1]){

   box('#ded8c7',0,h+2,
    side*(top.depth/2-.6),
    top.width,2,.5);

   box('#ded8c7',
    side*(top.width/2-.6),
    h+2,0,.5,2,top.depth);
  }

  if(style===0){

   box('#81928c',
    -top.width*.2,h+2.2,0,
    3,1.4,3);
  }
 }

 // Commercial storefront glazing.
 if(b.type==='commercial'){

  for(const side of [-1,1]){

   box('#526e70',side*w*.27,
    4.5,d/2+.35,w*.3,5,.35);
  }
 }

 return {
  parts,

  roofRotation:
   b.type==='house'&&style===1?Math.PI/2:0,

  roofHeight:style===2?7:9,

  officeGlass:
   style===0?'#42636b':
   style===1?'#526e70':'#597c80'
 };
}
