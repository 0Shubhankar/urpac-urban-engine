
export const ENGINE_VERSION='1.0.0-rc.1';

const clone=o=>structuredClone(o);

const operations=new Set([

 'place',

 'edit',

 'duplicate',

 'demolish',

 'upgrade',

 'drawRoad',

 'widenRoad',

 'landscapeBrush',

 'groupEdit',

 'expand',

 'undo',

 'redo'
]);

export function createEditorAPI(engine){

 const model=engine.construction;

 if(!model)

  throw Error('Construction model unavailable');

 return Object.freeze({

  version:ENGINE_VERSION,

  getState(){

   return clone(engine.state);
  },

  getObject(id){

   const found=model.find(id);

   return found

    ?clone(found.object)

    :null;
  },

  getInventory(){

   return clone(

    engine.cityManagement.inventory()
   );
  },

  exportCity(){

   return clone(

    engine.cityManagement.exportState()
   );
  },

  importCity(save){

   engine.cityManagement.loadState(

    clone(save)
   );
  },

  execute(action,...args){

   if(!operations.has(action))

    throw Error('Unsupported editor action');

   const result=model[action](

    ...clone(args)
   );

   const success=action==='undo'||

    action==='redo'

     ?result===true

     :result===null;

   if(success){

    engine.rebuildCity();
   }

   return {

    ok:success,

    error:success

     ?null

     :typeof result==='string'

      ?result

      :'No change performed'
   };
  }
 });
}

export function attachReleaseAPI(engine){

 const api=createEditorAPI(engine);

 engine.editorAPI=api;

 // Convenient browser development access.
 // No remote networking or external service.

 window.UUE=api;

 const panel=document.querySelector(

  '#construction-panel'
 );

 if(!panel)return api;

 const footer=document.createElement('div');

 footer.id='editor-file-controls';

 footer.innerHTML=`
 <div class="editor-file-buttons">

  <button data-file="export">
   Export
  </button>

  <button data-file="import">
   Import
  </button>

  <button data-file="reset">
   Reset city
  </button>

 </div>

 <small id="editor-save-status">
  Local autosave
 </small>

 <small class="editor-version">
  UUE 1.0 RC
 </small>`;

 panel.append(footer);

 for(const button of footer.querySelectorAll(

  '[data-file]'

 )){

  button.onclick=()=>{

   const name=button.dataset.file;

   const original=document.querySelector(

    '#city-management [data-manage="'+

    name+'"]'
   );

   original?.click();
  };
 }

 const source=document.querySelector(

  '#save-status'
 );

 const destination=footer.querySelector(

  '#editor-save-status'
 );

 function refreshStatus(){

  if(!source)return;

  destination.textContent=source.textContent;

  destination.dataset.error=

   source.dataset.error||'false';
 }

 let observer=null;

 if(source){

  observer=new MutationObserver(

   refreshStatus
  );

  observer.observe(source,{

   childList:true,

   characterData:true,

   subtree:true,

   attributes:true,

   attributeFilter:['data-error']
  });
 }

 refreshStatus();

 const oldDispose=engine.dispose.bind(engine);

 engine.dispose=()=>{

  observer?.disconnect();

  footer.remove();

  if(window.UUE===api)

   delete window.UUE;

  oldDispose();
 };

 return api;
}
