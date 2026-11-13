
import {
 authorize
} from './experiments/rules.js';

const config=await fetch(
 './project.config.json'
).then(r=>r.json());

const scenario=await fetch(
 './scenario.json'
).then(r=>r.json());

const engineUrl=new URL(
 config.engineUrl,location.href
);

const {
 mountUUE
}=await import(
 new URL('project-client.js',engineUrl)
);

const {
 ResearchSession,
 downloadJSON
}=await import(
 new URL('research-toolkit.js',engineUrl)
);

const sessionId=
 new URLSearchParams(location.search)
  .get('session')||'development';

const research=new ResearchSession({

 project:config.id,

 session:sessionId,

 engineVersion:config.engineVersion,

 scenarioVersion:config.scenarioVersion,

 researchVersion:config.researchVersion
});

const status=document.querySelector('#status');

try{

 const engine=await mountUUE(

  document.querySelector('#engine'),

  {

   id:config.id,

   session:sessionId,

   engineUrl:engineUrl.href,

   engineVersion:config.engineVersion,

   initialCity:scenario||undefined,

   authorize,

   onDecision(event){

    research.record(

     'decision-accepted',

     {

      action:event.action,

      args:event.args
     }
    );

    status.textContent=

     'Accepted: '+event.action;
   },

   onRejected(event){

    research.record(

     'decision-rejected',

     {

      action:event.action,

      args:event.args,

      reason:event.reason
     }
    );

    status.textContent=event.reason;
   }
  }
 );

 status.textContent=

  'Connected to UUE '+engine.version;

 const exportButton=
  document.querySelector('#export');

 exportButton.disabled=false;

 exportButton.onclick=()=>{

  downloadJSON(

   {

    research:research.snapshot(),

    city:engine.exportCity()
   },

   'project-'+config.id+

    '-'+sessionId+'.json'
  );
 };

}catch(error){

 status.textContent=

  'Startup failed: '+error.message;
}
