
export class ResearchSession{

 constructor(identity,storage=null){

  for(const key of [

   'project','session','engineVersion',

   'scenarioVersion','researchVersion'

  ]){

   if(typeof identity[key]!=='string'||

      !identity[key].length)

    throw Error('Missing research field: '+key);
  }

  if(!/^[a-zA-Z0-9_-]{1,80}$/
      .test(identity.project)||

     !/^[a-zA-Z0-9_-]{1,80}$/
      .test(identity.session))

   throw Error('Invalid project/session identity');

  this.identity=structuredClone(identity);

  this.storage=storage;

  if(!this.storage){

   try{

    this.storage=globalThis.localStorage;

   }catch{

    this.storage=null;
   }
  }

  this.key=

   'uue-research-v1:'+identity.project+

   ':'+identity.session;

  this.events=[];

  this.startedAt=new Date().toISOString();

  this.storageError=null;

  const raw=this.storage?.getItem(this.key);

  if(raw){

   const saved=JSON.parse(raw);

   if(JSON.stringify(saved.identity)!==
      JSON.stringify(this.identity))

    throw Error(

     'Session version changed. Use a new session ID.'
    );

   if(saved.schemaVersion!==1||

      !Array.isArray(saved.events)||

      saved.events.some((e,i)=>

       e.sequence!==i+1
      ))

    throw Error('Invalid saved research log');

   this.events=saved.events;

   this.startedAt=saved.startedAt;
  }
 }

 record(type,data={}){

  if(typeof type!=='string'||!type.length)

   throw Error('Invalid event type');

  // JSON-compatible research records only.

  const payload=JSON.parse(

   JSON.stringify(data)
  );

  const event={

   sequence:this.events.length+1,

   time:new Date().toISOString(),

   type,

   data:payload
  };

  this.events.push(event);

  try{

   this.storage?.setItem(

    this.key,

    JSON.stringify(this.snapshot())
   );

   this.storageError=this.storage
    ?null
    :'Browser storage unavailable';

  }catch(error){

   this.storageError=error.message;

   console.warn(

    'Research log not persisted:',

    error.message
   );
  }

  return structuredClone(event);
 }

 snapshot(){

  return structuredClone({

   schemaVersion:1,

   identity:this.identity,

   startedAt:this.startedAt,

   events:this.events
  });
 }
}

export function downloadJSON(

 value,filename='experiment.json'

){

 const blob=new Blob(

  [JSON.stringify(value,null,2)],

  {type:'application/json'}
 );

 const url=URL.createObjectURL(blob);

 const link=document.createElement('a');

 link.href=url;

 link.download=filename;

 link.click();

 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
