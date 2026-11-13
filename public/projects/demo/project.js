
import {
 mountUUE
} from '../../project-client.js';

const status=document.querySelector('#status');

let engine;

const buttons=document.querySelectorAll(
 'button'
);

try{

 engine=await mountUUE(

  document.querySelector('#engine'),

  {

   id:'demo',

   session:'starter-v1',

   engineUrl:'../../',

   engineVersion:'1.2.0-rc.1',

   // Demonstration research rule:
   // Only allow house construction.
   // The standalone engine is unaffected.

   authorize({action,args}){

    if(action==='place'&&args[0]==='house')

     return true;

    return 'Demo permits house construction only';
   },

   onDecision(event){

    status.textContent=

     'Accepted: '+event.action+

     ' | Buildings: '+

     event.state.buildings.length;
   },

   onRejected(event){

    status.textContent=

     'Rejected: '+event.reason;
   }
  }
 );

 status.textContent=

  'Connected to UUE '+engine.version;

 buttons.forEach(b=>b.disabled=false);

}catch(error){

 status.textContent=error.message;
}

function addBuilding(type){

 const state=engine.getState();

 const n=state.buildings.filter(

  b=>b.id.startsWith('constructed-')

 ).length;

 const x=720+(n%5)*80;

 const z=720+Math.floor(n/5)*80;

 const result=engine.execute(

  'place',type,x,z
 );

 if(!result.ok)

  status.textContent=result.error;
}

document.querySelector('#house').onclick=

 ()=>addBuilding('house');

document.querySelector('#office').onclick=

 ()=>addBuilding('office');

document.querySelector('#export').onclick=()=>{

 const data=engine.exportCity();

 const blob=new Blob(

  [JSON.stringify(data,null,2)],

  {type:'application/json'}
 );

 const url=URL.createObjectURL(blob);

 const link=document.createElement('a');

 link.href=url;

 link.download='demo-city.json';

 link.click();

 setTimeout(()=>URL.revokeObjectURL(url),1000);
};
