
import {

 projectIdentity

} from './ProjectIdentity.js';

import {

 installProjectPolicy

} from './ProjectPolicy.js';

export function attachProjectHost(engine){

 const identity=projectIdentity(
  location.search
 );

 if(!identity)return null;

 const policy=installProjectPolicy(

  engine,identity
 );

 const api=engine.editorAPI;

 const host=Object.freeze({

  version:api.version,

  identity:Object.freeze(identity),

  register:options=>policy.register(options),

  getState:()=>api.getState(),

  getObject:id=>api.getObject(id),

  getInventory:()=>api.getInventory(),

  execute:(action,...args)=>

   api.execute(action,...args),

  exportCity:()=>api.exportCity(),

  importCity:save=>api.importCity(save)
 });

 window.UUEProjectHost=host;

 const dispose=engine.dispose.bind(engine);

 engine.dispose=()=>{

  if(window.UUEProjectHost===host)

   delete window.UUEProjectHost;

  dispose();
 };

 return host;
}
