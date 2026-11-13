
export function mountUUE(

 container,

 options

){

 if(!container||!options?.id)

  throw Error('Container and project ID required');

 if(typeof options.authorize!=='function')

  throw Error('Decision validator required');

 const url=new URL(

  options.engineUrl,

  location.href
 );

 if(url.origin!==location.origin)

  throw Error(
   'UUE requires same-origin embedding'
  );

 url.searchParams.set(

  'project',options.id
 );

 url.searchParams.set(

  'session',options.session||'default'
 );

 const frame=document.createElement(
  'iframe'
 );

 frame.title='URPAC Urban Engine';

 frame.style.cssText=

  'width:100%;height:100%;border:0;display:block';

 frame.allowFullscreen=true;

 let disposed=false;

 const ready=new Promise((resolve,reject)=>{

  const timeout=setTimeout(()=>{

   reject(Error('UUE startup timed out'));

  },30000);

  frame.addEventListener('load',()=>{

   clearTimeout(timeout);

   if(disposed){

    reject(Error('Project disposed'));

    return;
   }

   try{

    const host=frame.contentWindow
     .UUEProjectHost;

    if(!host)

     throw Error('Engine project host unavailable');

    if(options.engineVersion&&

       host.version!==options.engineVersion)

     throw Error(

      'Engine version mismatch: expected '+

      options.engineVersion+

      ', found '+host.version
     );

    host.register({

     id:options.id,

     authorize:options.authorize,

     onDecision:options.onDecision,

     onRejected:options.onRejected,

     initialCity:options.initialCity
    });

    resolve({

     version:host.version,

     getState:()=>host.getState(),

     getObject:id=>host.getObject(id),

     getInventory:()=>host.getInventory(),

     execute:(action,...args)=>

      host.execute(action,...args),

     exportCity:()=>host.exportCity(),

     importCity:save=>host.importCity(save),

     dispose(){

      disposed=true;

      frame.remove();
     }
    });

   }catch(error){

    reject(error);
   }

  },{once:true});

  frame.src=url.href;

  container.append(frame);
 });

 return ready;
}
