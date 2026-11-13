
export const EDIT_ACTIONS=Object.freeze([

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

const clone=o=>structuredClone(o);

export function installProjectPolicy(
 engine,identity
){

 let registration=null;

 let initializing=false;

 let busy=false;

 const model=engine.construction;

 function notify(name,event){

  try{

   registration?.[name]?.(

    clone(event)
   );

  }catch(error){

   console.error(
    'UUE project callback failed:',
    error
   );
  }
 }

 function authorize(action,args){

  if(initializing)return null;

  if(!registration)

   return 'Project is not initialized';

  if(busy)

   return 'Recursive project decision rejected';

  busy=true;

  try{

   const result=registration.authorize({

    action,

    args:clone(args),

    state:clone(engine.state),

    identity:clone(identity)
   });

   if(result===true)return null;

   return typeof result==='string'

    ?result

    :'Decision not permitted by project';

  }catch(error){

   return 'Project validation failed: '+

    error.message;

  }finally{

   busy=false;
  }
 }

 function register(options){

  if(registration)

   throw Error('Project already registered');

  if(!options||

     options.id!==identity.project||

     typeof options.authorize!=='function')

   throw Error('Invalid project registration');

  registration=options;

  try{

   // Only initialize a scenario for
   // a session with no previous city save.

   if(options.initialCity&&

      !engine.projectHadSave){

    initializing=true;

    engine.cityManagement.loadState(

     clone(options.initialCity)
    );
   }

  }catch(error){

   registration=null;

   throw error;

  }finally{

   initializing=false;
  }

  return true;
 }

 for(const action of EDIT_ACTIONS){

  const original=model[action];

  if(typeof original!=='function')

   throw Error(
    'Missing editor operation: '+action
   );

  model[action]=function(...args){

   const booleanResult=

    action==='undo'||action==='redo';

   const denial=authorize(action,args);

   if(denial){

    notify('onRejected',{

     action,

     args,

     reason:denial
    });

    return booleanResult?false:denial;
   }

   busy=true;

   try{

    const result=original.apply(

     this,args
    );

    const success=booleanResult

     ?result===true

     :result===null;

    if(success){

     notify('onDecision',{

      action,

      args,

      state:engine.state,

      identity
     });

    }else{

     notify('onRejected',{

      action,

      args,

      reason:result||
       'No change performed'
     });
    }

    return result;

   }finally{

    busy=false;
   }
  };
 }

 const policy={

  register,

  authorizeRestore(save){

   return authorize('restore',[save]);
  },

  restored(){

   if(!initializing){

    notify('onDecision',{

     action:'restore',

     args:[],

     state:engine.state,

     identity
    });
   }
  }
 };

 engine.projectPolicy=policy;

 return policy;
}
