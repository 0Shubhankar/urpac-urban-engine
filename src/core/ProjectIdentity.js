
export function projectIdentity(search=''){

 const params=new URLSearchParams(search);

 const project=params.get('project');

 if(!project)return null;

 const session=params.get('session')||'default';

 const valid=v=>
  /^[a-zA-Z0-9_-]{1,80}$/.test(v);

 if(!valid(project)||!valid(session))

  throw Error('Invalid project or session identifier');

 return {

  project,

  session
 };
}

export function projectStorageKey(
 identity,defaultKey
){

 if(!identity)return defaultKey;

 return defaultKey+

  ':project:'+identity.project+

  ':session:'+identity.session;
}
