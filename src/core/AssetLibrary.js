
export const ASSETS={

 station:[70,45,18,'#bdc4c0'],

 busTerminal:[65,45,14,'#c4c5ae'],

 parking:[55,45,16,'#89958e'],

 fireStation:[45,38,18,'#b67661'],

 policeStation:[45,38,22,'#819da9'],

 library:[50,42,25,'#dac8a6'],

 powerStation:[70,60,28,'#a6ada8'],

 waterFacility:[65,65,15,'#a9bbc1'],

 solarFarm:[100,80,8,'#54738c'],

 warehouse:[85,60,18,'#9ea9a4'],

 factory:[80,65,24,'#a9a298'],

 stadium:[110,85,22,'#d2d1bc'],

 playground:[45,45,8,'#a5bd83'],

 sportsCourt:[55,40,8,'#8bab8f']
};

export const ASSET_GROUPS={

 Transportation:[

  ['station','Railway station'],

  ['busTerminal','Bus terminal'],

  ['parking','Parking facility']
 ],

 'Public services':[

  ['fireStation','Fire station'],

  ['policeStation','Police station'],

  ['library','Library']
 ],

 Utilities:[

  ['powerStation','Power station'],

  ['waterFacility','Water facility'],

  ['solarFarm','Solar farm']
 ],

 Industrial:[

  ['warehouse','Warehouse'],

  ['factory','Factory']
 ],

 Recreation:[

  ['stadium','Stadium'],

  ['playground','Playground'],

  ['sportsCourt','Sports court']
 ]
};

export function renderAsset(view,b){

 const {x,z}=b.position;

 const {

  width:w,

  depth:d,

  height:h

 }=b.dimensions;

 const id=b.id;

 const color=b.visual.color;

 const box=(color,dx,y,dz,w,h,d)=>

  view.box(
   color,x+dx,y,z+dz,w,h,d,id
  );

 const cylinder=(color,dx,y,dz,r,h)=>

  view.part(

   'cylinder',color,

   x+dx,y,z+dz,

   r,h,r,id
  );

 // Common foundation.

 box('#c8c9b4',0,3,0,w+4,1,d+4);

 switch(b.type){

  case 'station':

   box(color,0,4+h*.35,0,w,h*.7,d*.55);

   box('#748b91',0,4+h*.8,0,w+2,2,d*.7);

   for(const side of [-1,1]){

    box('#6c7777',0,4,side*d*.37,w,.5,6);

    box('#d9ddd6',0,4.5,side*d*.37,w,.3,1);
   }

   break;

  case 'busTerminal':

   box(color,0,4+h*.25,-d*.3,w,h*.5,d*.3);

   box('#8a9697',0,5,0,w,1,d);

   for(let i=-2;i<=2;i++){

    box('#d7bb68',i*w/6,7,d*.15,w/9,5,d*.4);
   }

   break;

  case 'parking':

   box(color,0,4+h/2,0,w,h,d);

   for(let y=8;y<4+h;y+=4){

    box('#dce1d7',0,y,0,w+1,.8,d+1);
   }

   box('#666f6a',0,4+h+.5,0,w-2,1,d-2);

   for(let i=-2;i<=2;i++){

    box('#dddcc6',i*w/6,5+h,0,.5,.2,d*.7);
   }

   break;

  case 'solarFarm':

   box('#9cae83',0,3.7,0,w,1,d);

   for(let row=-2;row<=2;row++){

    for(let col=-3;col<=3;col++){

     const dx=col*w/7;

     const dz=row*d/5;

     box('#a6ada5',dx,4+h*.2,dz,1,h*.4,1);

     box(color,dx,4+h*.45,dz,w/8,.8,d/7);

     box('#c4d5d7',dx,4+h*.45+.5,dz,.3,.15,d/7);
    }
   }

   break;

  case 'waterFacility':

   box('#bdc8bc',0,4,0,w,2,d);

   for(const side of [-1,1]){

    cylinder('#dce0d9',side*w*.23,4+h*.2,0,

     Math.min(w,d)*.19,h*.4);

    cylinder('#77acb7',side*w*.23,4+h*.4+.2,0,

     Math.min(w,d)*.15,.4);
   }

   break;

  case 'powerStation':

  case 'factory':

   box(color,0,4+h*.35,0,w,h*.7,d);

   box('#89968f',0,4+h*.7,0,w+2,2,d+2);

   for(const side of [-1,1]){

    cylinder('#c6c5ba',side*w*.3,4+h*.65,-d*.3,

     Math.min(w,d)*.06,h*1.3);
   }

   break;

  case 'warehouse':

   box(color,0,4+h*.45,0,w,h*.9,d);

   view.part(

    'roof','#778780',

    x,4+h*.9,z,

    w+3,h*.2,d+3,id
   );

   for(let i=-2;i<=2;i++){

    box('#667875',i*w/6,8,d/2+.3,w/9,7,.6);
   }

   break;

  case 'stadium':

   box('#7eae76',0,4,0,w*.72,1,d*.72);

   for(const side of [-1,1]){

    box(color,side*w*.42,4+h*.25,0,w*.16,h*.5,d);

    box(color,0,4+h*.25,side*d*.42,w,h*.5,d*.16);

    box('#e2e0d5',side*w*.42,4+h*.5,0,w*.18,1,d);
   }

   box('#e0ead8',0,4.7,0,.8,.1,d*.65);

   break;

  case 'sportsCourt':

  case 'playground':

   box(color,0,3.8,0,w,1,d);

   box('#e6e6ce',0,4.5,0,.6,.2,d*.8);

   if(b.type==='sportsCourt'){

    for(const side of [-1,1]){

     box('#dbddd1',0,4+h*.3,side*d*.4,4,h*.6,.5);
    }

   }else{

    for(const side of [-1,1]){

     box('#d6ad6a',side*w*.22,4+h*.3,0,

      w*.22,h*.6,d*.25);
    }
   }

   break;

  default:

   // Public service buildings.

   box(color,0,4+h/2,0,w,h,d);

   box('#e2dfd2',0,4+h,0,w+2,1.5,d+2);

   for(let i=-2;i<=2;i++){

    box('#6b858b',i*w/6,4+h*.65,d/2+.3,

     w/10,h*.24,.6);
   }

   if(b.type==='fireStation'){

    for(let i=-1;i<=1;i++){

     box('#693e35',i*w/4,8,d/2+.5,w/5,7,.8);
    }

   }else{

    box('#667a79',0,8,d/2+.5,w*.15,7,.8);
   }
 }
}
