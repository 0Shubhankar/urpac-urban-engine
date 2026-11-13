import {

 projectIdentity,

 projectStorageKey

} from '../core/ProjectIdentity.js';

import {
 STORAGE_KEY
} from '../core/CityPersistence.js';


import {
 makeSave,
 validateSave,
 inventory,
 CityStorage
} from '../core/CityPersistence.js';

export function attachCityManagement(engine){

 const model=engine.construction;

 const baseline=model.snapshot();

 let history=[];
 let restoring=false;
 let storage=null;
 let storageError=null;

 try{

  storage=new CityStorage(

   window.localStorage,

   projectStorageKey(

    projectIdentity(location.search),

    STORAGE_KEY
   )
  );

  engine.projectHadSave=
   !!storage.read().autosave;

  storage.read();

 }catch(error){

  storageError=error.message;
  storage=null;
 }

 const panel=document.createElement('details');

 panel.id='city-management';

 panel.innerHTML=`
 <summary>
  CITY MANAGEMENT
 </summary>

 <div class="management-content">

  <div id="city-inventory"></div>

  <div class="management-status"
   id="save-status" role="status">
   Autosave ready
  </div>

  <input id="snapshot-name"
   maxlength="80"
   placeholder="Snapshot name"
   aria-label="Snapshot name">

  <div class="management-actions">

   <button data-manage="save">
    Save snapshot
   </button>

   <button data-manage="export">
    Export JSON
   </button>

  </div>

  <select id="saved-cities"
   aria-label="Saved city snapshots">
  </select>

  <div class="management-actions">

   <button data-manage="load">
    Load
   </button>

   <button data-manage="delete">
    Delete save
   </button>

   <button data-manage="import">
    Import JSON
   </button>

   <button data-manage="reset">
    Reset city
   </button>

  </div>

  <input type="file"
   accept=".json,application/json"
   id="city-import-file" hidden>

  <details class="management-subsection">

   <summary>Land-use inventory</summary>

   <div id="land-use-inventory"></div>

  </details>

  <details class="management-subsection">

   <summary>Decision history</summary>

   <div id="city-decision-history"></div>

  </details>

 </div>`;

 const construction=document.querySelector(
  '#construction-panel'
 );

 construction.append(panel);

 const get=id=>panel.querySelector(
  '#'+id
 );

 const status=get('save-status');
 const saves=get('saved-cities');

 function tell(message,error=false){

  status.textContent=message;

  status.dataset.error=String(error);
 }

 function refresh(){

  const i=inventory(engine.state);

  get('city-inventory').innerHTML=`
   <div><small>Buildings</small>
    <strong>${i.buildings}</strong></div>
   <div><small>Roads</small>
    <strong>${i.roads}</strong></div>
   <div><small>Bridges</small>
    <strong>${i.bridges}</strong></div>
   <div><small>Parks</small>
    <strong>${i.parks}</strong></div>
   <div><small>Trees</small>
    <strong>${i.trees}</strong></div>
   <div><small>Decisions</small>
    <strong>${history.length}</strong></div>
  `;

  const land=get('land-use-inventory');

  land.replaceChildren();

  for(const [type,count] of Object.entries(
   i.types
  ).sort()){

   const row=document.createElement('div');

   row.textContent=type+' — '+count;

   land.append(row);
  }

  for(const [label,value] of [

   ['Estimated floor area',
    i.estimatedFloorArea+' m²'],

   ['Park footprint',
    i.parkArea+' m²'],

   ['Road segment length',
    i.estimatedRoadLength+' m']

  ]){

   const row=document.createElement('div');

   row.textContent=
    label+': '+value;

   land.append(row);
  }

  const log=get('city-decision-history');

  log.replaceChildren();

  if(!history.length){

   log.textContent='No decisions recorded.';

  }else{

   for(const item of history.slice(-30)
    .reverse()){

    const row=document.createElement('div');

    row.textContent=
     item.action+' · '+
     new Date(item.time)
      .toLocaleTimeString();

    log.append(row);
   }
  }
 }

 function refreshSaves(){

  saves.replaceChildren();

  const empty=document.createElement(
   'option'
  );

  empty.value='';
  empty.textContent='Select saved city';

  saves.append(empty);

  if(!storage)return;

  try{

   for(const item of storage.read()
    .snapshots){

    const o=document.createElement(
     'option'
    );

    o.value=item.id;

    o.textContent=
     item.save.name+' · '+
     new Date(item.save.savedAt)
      .toLocaleString();

    saves.append(o);
   }

  }catch(error){

   tell(error.message,true);
  }
 }

 function currentSave(name){

  const save=makeSave(
   engine.state,
   model,
   history,
   name
  );

  if(engine.simulation){

   save.simulation=
    engine.simulation.snapshot();
  }

  return save;
 }

 function autosave(){

  refresh();

  if(!storage){

   tell('Autosave unavailable. Use Export JSON.',true);

   return;
  }

  try{

   storage.autosave(currentSave('Autosave'));

   tell(
    'Autosaved at '+
    new Date().toLocaleTimeString()
   );

  }catch(error){

   tell(
    'Autosave failed: '+error.message,
    true
   );
  }
 }

 // Capture only successful model decisions.

 for(const method of [
  'place','demolish','upgrade',
  'edit','duplicate','expand',

  'drawRoad','widenRoad',

  'landscapeBrush','groupEdit',
  'undo','redo'
 ]){

  const original=model[method].bind(model);

  model[method]=(...args)=>{

   const result=original(...args);

   const success=
    method==='undo'||method==='redo'
     ?result===true
     :result===null;

   if(success&&!restoring){

    history.push({
     action:method,
     arguments:args,
     time:new Date().toISOString()
    });

    if(history.length>10000)
     history.shift();
   }

   return result;
  };
 }

 const previousChanged=engine.onCityChanged;

 engine.onCityChanged=()=>{

  previousChanged?.();

  if(!restoring)autosave();
 };

 function applySave(raw){

  const save=validateSave(raw,baseline);

  const denied=engine.projectPolicy
   ?.authorizeRestore(save);

  if(denied)throw Error(denied);

  const previous=model.snapshot();

  const previousHistory=history;
  const previousSequence=model.sequence;

  const previousSimulation=
   engine.simulation?.snapshot();

  const oldUndo=model.undoStack;
  const oldRedo=model.redoStack;

  restoring=true;

  try{

   model.restore(save.state);

   // Never reuse an ID after restoring a save.

   model.sequence=Math.max(
    model.sequence,
    save.sequence
   );

   model.undoStack=[];
   model.redoStack=[];

   history=save.history;

   engine.rebuildCity();

   engine.restoreSimulation?.(
    save.simulation??null
   );

  }catch(error){

   model.restore(previous);

   model.sequence=previousSequence;

   model.undoStack=oldUndo;
   model.redoStack=oldRedo;

   history=previousHistory;

   engine.rebuildCity();

   engine.restoreSimulation?.(
    previousSimulation??null
   );

   throw error;

  }finally{

   restoring=false;
  }

  autosave();

  engine.projectPolicy?.restored();
 }

 engine.saveSimulation=autosave;

 function namedSave(){

  if(!storage){

   tell('Browser storage unavailable.',true);

   return;
  }

  const name=get('snapshot-name')
   .value.trim()||
   'Riverbend '+new Date()
    .toLocaleString();

  const id=storage.saveNamed(
   currentSave(name)
  );

  refreshSaves();

  saves.value=id;

  tell('Snapshot saved: '+name);
 }

 function loadNamed(){

  if(!storage||!saves.value)
   throw new Error('Select a saved city');

  const item=storage.read().snapshots.find(
   s=>s.id===saves.value
  );

  if(!item)
   throw new Error('Snapshot not found');

  if(!window.confirm(
   'Load this snapshot and replace the current city?'
  ))return;

  applySave(item.save);

  tell('Loaded: '+item.save.name);
 }

 function exportCity(){

  const json=JSON.stringify(
   currentSave('Riverbend export'),
   null,2
  );

  const blob=new Blob(
   [json],
   {type:'application/json'}
  );

  const url=URL.createObjectURL(blob);

  const link=document.createElement('a');

  link.href=url;

  link.download=
   'Riverbend-'+
   new Date().toISOString().slice(0,10)+
   '.json';

  link.click();

  setTimeout(
   ()=>URL.revokeObjectURL(url),
   1000
  );

  tell('City exported.');
 }

 function resetCity(){

  if(!window.confirm(
   'Reset Riverbend to its original state? Save a snapshot first if you want to keep your changes.'
  ))return;

  const save=currentSave('Original Riverbend');

  save.state=baseline;
  save.history=[];

  delete save.simulation;

  applySave(save);

  tell('Original Riverbend restored.');
 }

 const actions={
  save:namedSave,
  load:loadNamed,
  export:exportCity,
  reset:resetCity,

  import:()=>{
   get('city-import-file').click();
  },

  delete:()=>{

   if(!storage||!saves.value)
    throw new Error('Select a snapshot');

   if(!window.confirm(
    'Delete this saved snapshot?'
   ))return;

   storage.deleteNamed(saves.value);

   refreshSaves();

   tell('Snapshot deleted.');
  }
 };

 for(const [name,action] of Object.entries(
  actions
 )){

  panel.querySelector(
   '[data-manage="'+name+'"]'
  ).onclick=()=>{

   try{

    action();

   }catch(error){

    tell(error.message,true);
   }
  };
 }

 get('city-import-file').onchange=
  async event=>{

   const file=event.target.files[0];

   if(!file)return;

   try{

    if(file.size>20*1024*1024)
     throw new Error('Save file too large');

    const save=validateSave(
     JSON.parse(await file.text()),
     baseline
    );

    if(window.confirm(
     'Import this city and replace current changes?'
    )){

     applySave(save);

     tell('City imported.');
    }

   }catch(error){

    tell(error.message,true);

   }finally{

    event.target.value='';
   }
  };

 engine.cityManagement={
  inventory:()=>inventory(engine.state),
  exportState:()=>currentSave('Riverbend'),
  loadState:applySave
 };

 refreshSaves();

 // Restore the autosaved city on startup.

 if(storage){

  try{

   const saved=storage.read().autosave;

   if(saved){

    applySave(saved);

    tell('Previous city restored.');

   }else{

    autosave();
   }

  }catch(error){

   tell(
    'Saved city could not be restored: '+
    error.message,
    true
   );
  }

 }else{

  tell(
   'Storage unavailable: '+storageError,
   true
  );
 }

 refresh();
}
