
export function buildingMassing(b){
 const {width:w,depth:d,height:h}=b.dimensions;

 const hash=[...b.id].reduce(
  (a,c)=>(Math.imul(a,31)+c.charCodeAt(0))>>>0,0
 );

 const style=hash%3;

 const tier=(bottom,top,scaleX=1,scaleZ=1)=>({
  bottom,top,width:w*scaleX,depth:d*scaleZ
 });

 if(b.type==='office'){

  if(style===0)return [
   tier(0,16),
   tier(16,h,.72,.76)
  ];

  if(style===1)return [
   tier(0,h*.46),
   tier(h*.46,h*.78,.82,.84),
   tier(h*.78,h,.62,.66)
  ];

  return [
   tier(0,12),
   tier(12,h,.9,.62)
  ];
 }

 if(b.type==='midrise'||b.type==='apartment'){

  if(style===0)return [
   tier(0,h*.67),
   tier(h*.67,h,.76,.82)
  ];

  if(style===1)return [
   tier(0,h*.8),
   tier(h*.8,h,.86,.7)
  ];
 }

 return [tier(0,h)];
}
