(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Sl="modulepreload",bl=function(i,t){return new URL(i,t).href},ea={},El=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let o=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const a=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));s=o(e.map(h=>{if(h=bl(h,n),h in ea)return;ea[h]=!0;const d=h.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(!!n)for(let _=a.length-1;_>=0;_--){const m=a[_];if(m.href===h&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${u}`))return;const g=document.createElement("link");if(g.rel=d?"stylesheet":Sl,d||(g.as="script"),g.crossOrigin="",g.href=h,l&&g.setAttribute("nonce",l),document.head.appendChild(g),d)return new Promise((_,m)=>{g.addEventListener("load",_),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};function bc(i=""){const t=new URLSearchParams(i),e=t.get("project");if(!e)return null;const n=t.get("session")||"default",s=r=>/^[a-zA-Z0-9_-]{1,80}$/.test(r);if(!s(e)||!s(n))throw Error("Invalid project or session identifier");return{project:e,session:n}}function Tl(i,t){return i?t+":project:"+i.project+":session:"+i.session:t}const wl=Object.freeze(["place","edit","duplicate","demolish","upgrade","drawRoad","widenRoad","landscapeBrush","groupEdit","expand","undo","redo"]),Ci=i=>structuredClone(i);function Al(i,t){let e=null,n=!1,s=!1;const r=i.construction;function o(h,d){var u;try{(u=e==null?void 0:e[h])==null||u.call(e,Ci(d))}catch(p){console.error("UUE project callback failed:",p)}}function a(h,d){if(n)return null;if(!e)return"Project is not initialized";if(s)return"Recursive project decision rejected";s=!0;try{const u=e.authorize({action:h,args:Ci(d),state:Ci(i.state),identity:Ci(t)});return u===!0?null:typeof u=="string"?u:"Decision not permitted by project"}catch(u){return"Project validation failed: "+u.message}finally{s=!1}}function c(h){if(e)throw Error("Project already registered");if(!h||h.id!==t.project||typeof h.authorize!="function")throw Error("Invalid project registration");e=h;try{h.initialCity&&!i.projectHadSave&&(n=!0,i.cityManagement.loadState(Ci(h.initialCity)))}catch(d){throw e=null,d}finally{n=!1}return!0}for(const h of wl){const d=r[h];if(typeof d!="function")throw Error("Missing editor operation: "+h);r[h]=function(...u){const p=h==="undo"||h==="redo",g=a(h,u);if(g)return o("onRejected",{action:h,args:u,reason:g}),p?!1:g;s=!0;try{const _=d.apply(this,u);return(p?_===!0:_===null)?o("onDecision",{action:h,args:u,state:i.state,identity:t}):o("onRejected",{action:h,args:u,reason:_||"No change performed"}),_}finally{s=!1}}}const l={register:c,authorizeRestore(h){return a("restore",[h])},restored(){n||o("onDecision",{action:"restore",args:[],state:i.state,identity:t})}};return i.projectPolicy=l,l}function Rl(i){const t=bc(location.search);if(!t)return null;const e=Al(i,t),n=i.editorAPI,s=Object.freeze({version:n.version,identity:Object.freeze(t),register:o=>e.register(o),getState:()=>n.getState(),getObject:o=>n.getObject(o),getInventory:()=>n.getInventory(),execute:(o,...a)=>n.execute(o,...a),exportCity:()=>n.exportCity(),importCity:o=>n.importCity(o)});window.UUEProjectHost=s;const r=i.dispose.bind(i);return i.dispose=()=>{window.UUEProjectHost===s&&delete window.UUEProjectHost,r()},s}const Cl="1.2.0-rc.1",Wn=i=>structuredClone(i),Pl=new Set(["place","edit","duplicate","demolish","upgrade","drawRoad","widenRoad","landscapeBrush","groupEdit","expand","undo","redo"]);function Dl(i){const t=i.construction;if(!t)throw Error("Construction model unavailable");return Object.freeze({version:Cl,getState(){return Wn(i.state)},getObject(e){const n=t.find(e);return n?Wn(n.object):null},getInventory(){return Wn(i.cityManagement.inventory())},exportCity(){return Wn(i.cityManagement.exportState())},importCity(e){i.cityManagement.loadState(Wn(e))},execute(e,...n){if(!Pl.has(e))throw Error("Unsupported editor action");const s=t[e](...Wn(n)),r=e==="undo"||e==="redo"?s===!0:s===null;return r&&i.rebuildCity(),{ok:r,error:r?null:typeof s=="string"?s:"No change performed"}}})}function Ll(i){const t=Dl(i);i.editorAPI=t,window.UUE=t;const e=document.querySelector("#construction-panel");if(!e)return t;const n=document.createElement("div");n.id="editor-file-controls",n.innerHTML=`
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
  UUE 1.2 RC
 </small>`,e.append(n);for(const l of n.querySelectorAll("[data-file]"))l.onclick=()=>{const h=l.dataset.file,d=document.querySelector('#city-management [data-manage="'+h+'"]');d==null||d.click()};const s=document.querySelector("#save-status"),r=n.querySelector("#editor-save-status");function o(){s&&(r.textContent=s.textContent,r.dataset.error=s.dataset.error||"false")}let a=null;s&&(a=new MutationObserver(o),a.observe(s,{childList:!0,characterData:!0,subtree:!0,attributes:!0,attributeFilter:["data-error"]})),o();const c=i.dispose.bind(i);return i.dispose=()=>{a==null||a.disconnect(),n.remove(),window.UUE===t&&delete window.UUE,c()},t}const Eo={station:[70,45,18,"#bdc4c0"],busTerminal:[65,45,14,"#c4c5ae"],parking:[55,45,16,"#89958e"],fireStation:[45,38,18,"#b67661"],policeStation:[45,38,22,"#819da9"],library:[50,42,25,"#dac8a6"],powerStation:[70,60,28,"#a6ada8"],waterFacility:[65,65,15,"#a9bbc1"],solarFarm:[100,80,8,"#54738c"],warehouse:[85,60,18,"#9ea9a4"],factory:[80,65,24,"#a9a298"],stadium:[110,85,22,"#d2d1bc"],playground:[45,45,8,"#a5bd83"],sportsCourt:[55,40,8,"#8bab8f"]},Il={Transportation:[["station","Railway station"],["busTerminal","Bus terminal"],["parking","Parking facility"]],"Public services":[["fireStation","Fire station"],["policeStation","Police station"],["library","Library"]],Utilities:[["powerStation","Power station"],["waterFacility","Water facility"],["solarFarm","Solar farm"]],Industrial:[["warehouse","Warehouse"],["factory","Factory"]],Recreation:[["stadium","Stadium"],["playground","Playground"],["sportsCourt","Sports court"]]};function Ul(i,t){const{x:e,z:n}=t.position,{width:s,depth:r,height:o}=t.dimensions,a=t.id,c=t.visual.color,l=(d,u,p,g,_,m,f)=>i.box(d,e+u,p,n+g,_,m,f,a),h=(d,u,p,g,_,m)=>i.part("cylinder",d,e+u,p,n+g,_,m,_,a);switch(l("#c8c9b4",0,3,0,s+4,1,r+4),t.type){case"station":l(c,0,4+o*.35,0,s,o*.7,r*.55),l("#748b91",0,4+o*.8,0,s+2,2,r*.7);for(const d of[-1,1])l("#6c7777",0,4,d*r*.37,s,.5,6),l("#d9ddd6",0,4.5,d*r*.37,s,.3,1);break;case"busTerminal":l(c,0,4+o*.25,-r*.3,s,o*.5,r*.3),l("#8a9697",0,5,0,s,1,r);for(let d=-2;d<=2;d++)l("#d7bb68",d*s/6,7,r*.15,s/9,5,r*.4);break;case"parking":l(c,0,4+o/2,0,s,o,r);for(let d=8;d<4+o;d+=4)l("#dce1d7",0,d,0,s+1,.8,r+1);l("#666f6a",0,4+o+.5,0,s-2,1,r-2);for(let d=-2;d<=2;d++)l("#dddcc6",d*s/6,5+o,0,.5,.2,r*.7);break;case"solarFarm":l("#9cae83",0,3.7,0,s,1,r);for(let d=-2;d<=2;d++)for(let u=-3;u<=3;u++){const p=u*s/7,g=d*r/5;l("#a6ada5",p,4+o*.2,g,1,o*.4,1),l(c,p,4+o*.45,g,s/8,.8,r/7),l("#c4d5d7",p,4+o*.45+.5,g,.3,.15,r/7)}break;case"waterFacility":l("#bdc8bc",0,4,0,s,2,r);for(const d of[-1,1])h("#dce0d9",d*s*.23,4+o*.2,0,Math.min(s,r)*.19,o*.4),h("#77acb7",d*s*.23,4+o*.4+.2,0,Math.min(s,r)*.15,.4);break;case"powerStation":case"factory":l(c,0,4+o*.35,0,s,o*.7,r),l("#89968f",0,4+o*.7,0,s+2,2,r+2);for(const d of[-1,1])h("#c6c5ba",d*s*.3,4+o*.65,-r*.3,Math.min(s,r)*.06,o*1.3);break;case"warehouse":l(c,0,4+o*.45,0,s,o*.9,r),i.part("roof","#778780",e,4+o*.9,n,s+3,o*.2,r+3,a);for(let d=-2;d<=2;d++)l("#667875",d*s/6,8,r/2+.3,s/9,7,.6);break;case"stadium":l("#7eae76",0,4,0,s*.72,1,r*.72);for(const d of[-1,1])l(c,d*s*.42,4+o*.25,0,s*.16,o*.5,r),l(c,0,4+o*.25,d*r*.42,s,o*.5,r*.16),l("#e2e0d5",d*s*.42,4+o*.5,0,s*.18,1,r);l("#e0ead8",0,4.7,0,.8,.1,r*.65);break;case"sportsCourt":case"playground":if(l(c,0,3.8,0,s,1,r),l("#e6e6ce",0,4.5,0,.6,.2,r*.8),t.type==="sportsCourt")for(const d of[-1,1])l("#dbddd1",0,4+o*.3,d*r*.4,4,o*.6,.5);else for(const d of[-1,1])l("#d6ad6a",d*s*.22,4+o*.3,0,s*.22,o*.6,r*.25);break;default:l(c,0,4+o/2,0,s,o,r),l("#e2dfd2",0,4+o,0,s+2,1.5,r+2);for(let d=-2;d<=2;d++)l("#6b858b",d*s/6,4+o*.65,r/2+.3,s/10,o*.24,.6);if(t.type==="fireStation")for(let d=-1;d<=1;d++)l("#693e35",d*s/4,8,r/2+.5,s/5,7,.8);else l("#667a79",0,8,r/2+.5,s*.15,7,.8)}}const Ec=(i,t,e)=>Math.max(t,Math.min(e,i)),Nl=i=>JSON.parse(JSON.stringify(i)),To=[10,14,20,28];function Tc(i,t,e=14,n=null){const s=[i,t];if(n&&s.push(n),!s.every(l=>Array.isArray(l)&&l.length===2&&l.every(Number.isFinite)))throw Error("Invalid road coordinates");if(!To.includes(e))throw Error("Unsupported road width");const r=Math.hypot(t[0]-i[0],t[1]-i[1]);if(r<15)throw Error("Road must be at least 15 m");if(n&&Math.hypot(n[0]-i[0],n[1]-i[1])<5)throw Error("Invalid curve control point");const o=n?Math.hypot(n[0]-i[0],n[1]-i[1])+Math.hypot(t[0]-n[0],t[1]-n[1]):r,a=Ec(Math.ceil(o/15),1,200),c=[];for(let l=0;l<=a;l++){const h=l/a,d=1-h;n?c.push([d*d*i[0]+2*d*h*n[0]+h*h*t[0],d*d*i[1]+2*d*h*n[1]+h*h*t[1]]):c.push([i[0]+h*(t[0]-i[0]),i[1]+h*(t[1]-i[1])])}return c}function wo(i,t){const e=i.map(c=>c[0]),n=i.map(c=>c[1]),s=Math.min(...e)-t/2,r=Math.max(...e)+t/2,o=Math.min(...n)-t/2,a=Math.max(...n)+t/2;return{position:{x:(s+r)/2,y:2,z:(o+a)/2},dimensions:{width:r-s,depth:a-o,height:1}}}function ai(i,t,e){const n=e[0]-t[0],s=e[1]-t[1],r=n*n+s*s,o=r?Ec(((i[0]-t[0])*n+(i[1]-t[1])*s)/r,0,1):0;return Math.hypot(i[0]-t[0]-o*n,i[1]-t[1]-o*s)}function ji(i,t,e){return(t[0]-i[0])*(e[1]-i[1])-(t[1]-i[1])*(e[0]-i[0])}function Fl(i,t,e,n){const s=ji(i,t,e),r=ji(i,t,n),o=ji(e,n,i),a=ji(e,n,t);return s*r<0&&o*a<0}function wc(i,t,e,n){return Fl(i,t,e,n)?0:Math.min(ai(i,e,n),ai(t,e,n),ai(e,i,t),ai(n,i,t))}function Ps(i){if(i.path)return{points:i.path.points,width:i.path.width};const{x:t,z:e}=i.position,{width:n,depth:s}=i.dimensions,r=i.axis==="z"||!i.axis&&s>n;return{points:r?[[t,e-s/2],[t,e+s/2]]:[[t-n/2,e],[t+n/2,e]],width:r?n:s}}function Ao(i,t){const e=Ps(i),n=Ps(t);for(let s=1;s<e.points.length;s++)for(let r=1;r<n.points.length;r++)if(wc(e.points[s-1],e.points[s],n.points[r-1],n.points[r])<=(e.width+n.width)/2+.01)return!0;return!1}function Sn(i,t,e,n=0){const{x:s,z:r}=e.position,o=e.dimensions,a=o.width/2+t/2+n,c=o.depth/2+t/2+n,l=[[s-a,r-c],[s+a,r-c],[s+a,r+c],[s-a,r+c]];for(const h of i)if(Math.abs(h[0]-s)<=a&&Math.abs(h[1]-r)<=c)return!0;for(let h=1;h<i.length;h++)for(let d=0;d<4;d++)if(wc(i[h-1],i[h],l[d],l[(d+1)%4])<.001)return!0;return!1}function Ac(i,t,e=!1){return{id:"preview",type:"local",district:"New Development",...wo(i,t),axis:"path",orientation:0,visual:{color:"#697671"},path:{points:Nl(i),width:t,bridge:e}}}function Bs(i,t,e=null){const n=t.path;if(!n||!Array.isArray(n.points)||n.points.length<2||n.points.length>201||!To.includes(n.width)||typeof n.bridge!="boolean")return"Invalid road geometry";if(!n.points.every(a=>Array.isArray(a)&&a.length===2&&a.every(Number.isFinite)))return"Invalid path coordinates";for(let a=1;a<n.points.length;a++){const c=n.points[a-1],l=n.points[a];if(Math.hypot(l[0]-c[0],l[1]-c[1])<.01)return"Duplicate road points"}const s=i.boundary/2;for(const a of n.points)if(Math.abs(a[0])+n.width/2+6>s||Math.abs(a[1])+n.width/2+6>s)return"Outside editable workspace";if(Hl(i,n.points,n.width))return"Flatten terrain before drawing roads";if(Sn(n.points,n.width,i.water,20)&&!n.bridge)return"Use Bridge to cross the river";if(n.bridge){const a=n.points[0],c=n.points.at(-1),l=i.water.position.x,h=i.water.dimensions.width/2+40;if(!(a[0]<l-h&&c[0]>l+h||c[0]<l-h&&a[0]>l+h))return"Bridge must connect opposite banks"}for(const a of[...i.buildings,...i.parks])if(Sn(n.points,n.width,a,6))return"Road intersects a building or park";const o=i.roads.filter(a=>a.id!==e);if(!o.some(a=>Ao(t,a)))return"Connect to an existing road";for(const a of o){if(!a.path)continue;const c=Ps(a),l=n.points,h=d=>c.points.slice(1).some((u,p)=>ai(d,c.points[p],u)<2);if(l.every(h))return"Road already exists"}return null}function Ol(i,t,e,n,s,r){let o;try{const c=Tc(t,e,n,s);o=Ac(c,n,r)}catch(c){return c.message}const a=Bs(i.state,o);return a||(i.checkpoint(),o.id=i.nextId(),i.state.roads.push(o),i.state.trees=i.state.trees.filter(c=>!Sn(o.path.points,n,{...c,dimensions:{...c.dimensions,width:c.dimensions.width*2,depth:c.dimensions.width*2}},5)),null)}function Bl(i,t,e){const n=i.find(t);if(!n||!n.object.path)return"Select a drawn road";if(!To.includes(e))return"Unsupported width";const s=n.object,r={...s,...wo(s.path.points,e),path:{...s.path,width:e}},o=Bs(i.state,r,t);if(o)return o;const a=i.state.roads.map(c=>c.id===t?r:c);return i.networkConnected(a)?(i.checkpoint(),i.state.roads=a,i.state.trees=i.state.trees.filter(c=>!Sn(r.path.points,e,c,8)),null):"Network would disconnect"}const qt=40,Rc={residential:"#a7c59b",commercial:"#a0b7c7",public:"#d2c49b"},Ss=["raise-land","lower-land","flatten-land","pond","paint-trees","clear-trees","residential-land","commercial-land","public-land","clear-parcel"],zl=i=>JSON.parse(JSON.stringify(i));function na(i,t){return Math.floor(i/qt)+":"+Math.floor(t/qt)}function zs(i){const[t,e]=i.split(":").map(Number);return{x:t*qt+qt/2,z:e*qt+qt/2}}function wr(i,t){var e;return((e=i.landscape)==null?void 0:e[t])??{height:0,pond:!1,parcel:null}}function Vi(i){const{x:t,z:e}=zs(i);return{position:{x:t,y:2,z:e},dimensions:{width:qt,depth:qt,height:1}}}function zi(i,t,e=0){return Math.abs(i.position.x-t.position.x)<(i.dimensions.width+t.dimensions.width)/2+e&&Math.abs(i.position.z-t.position.z)<(i.dimensions.depth+t.dimensions.depth)/2+e}function kl(i,t,e,n=40){const s=[],r=i.boundary/2;for(let o=Math.floor((t-n)/qt);o<=Math.floor((t+n)/qt);o++)for(let a=Math.floor((e-n)/qt);a<=Math.floor((e+n)/qt);a++){const c=o+":"+a,l=zs(c);Math.abs(l.x)+qt/2>r||Math.abs(l.z)+qt/2>r||Math.hypot(l.x-t,l.z-e)<=n+qt/2&&s.push(c)}return s}function Cc(i,t){const e=Vi(t),{x:n,z:s}=e.position;if(Math.abs(n)<600&&Math.abs(s)<600||zi(e,i.water,35))return!0;for(const r of[...i.buildings,...i.parks,...i.bridges,...i.trees])if(zi(e,r,8))return!0;for(const r of i.roads)if(r.path){if(Sn(r.path.points,r.path.width,e,8))return!0}else if(zi(e,r,8))return!0;return!1}function Ro(i,t){for(const[e,n]of Object.entries(i.landscape??{}))if(!(!n.height&&!n.pond)&&zi(Vi(e),t,2))return!0;return!1}function Hl(i,t,e){for(const[n,s]of Object.entries(i.landscape??{}))if(!(!s.height&&!s.pond)&&Sn(t,e,Vi(n),2))return!0;return!1}function Gl(i,t){if(i==null)return{};if(typeof i!="object"||Array.isArray(i))throw Error("Invalid landscape data");const e=Object.keys(i);if(e.length>1e4)throw Error("Landscape too large");const n={};for(const s of e){if(!/^-?\d{1,3}:-?\d{1,3}$/.test(s))throw Error("Invalid terrain cell");const r=Vi(s),{x:o,z:a}=r.position;if(Math.abs(o)+qt/2>t.boundary/2||Math.abs(a)+qt/2>t.boundary/2)throw Error("Terrain outside workspace");const c=i[s];if(!c||!Number.isInteger(c.height)||c.height<-12||c.height>30||typeof c.pond!="boolean"||!(c.parcel===null||Object.hasOwn(Rc,c.parcel)))throw Error("Invalid terrain properties");if(c.pond&&c.height!==-8)throw Error("Invalid pond depth");if((c.height||c.pond)&&Cc(t,s))throw Error("Terrain conflicts with city infrastructure");n[s]={height:c.height,pond:c.pond,parcel:c.parcel}}return n}function Vl(i,t,e,n,s,r,o){const a=i.state;if(!Ss.includes(t))return"Unknown landscape tool";if(![e,n,s].every(Number.isFinite)||s<20||s>120)return"Invalid brush";const c=kl(a,e,n,s);if(!c.length)return"Outside editable workspace";if(t==="clear-trees"){const u=a.trees.filter(p=>Math.hypot(p.position.x-e,p.position.z-n)>s);return u.length===a.trees.length?"No trees in brush area":(i.checkpoint(),a.trees=u,null)}if(t==="paint-trees"){const u=[];for(const p of c){const g=zs(p),_=r("tree",g.x,g.z);if(Ro(a,_))continue;const m={...a,trees:[...a.trees,...u]};o(m,"tree",_)||u.push(_)}if(!u.length)return"No suitable planting locations";i.checkpoint();for(const p of u)p.id=i.nextId(),a.trees.push(p);return null}const l=zl(a.landscape??{});let h=0;const d=["raise-land","lower-land","flatten-land","pond"].includes(t);for(const u of c){if(d&&Cc(a,u))continue;const p={...wr(a,u)},g=JSON.stringify(p);if(t==="raise-land")p.height=Math.min(30,p.height+3),p.pond=!1;else if(t==="lower-land")p.height=Math.max(-12,p.height-3),p.pond=!1;else if(t==="flatten-land")p.height=0,p.pond=!1;else if(t==="pond")p.height=-8,p.pond=!0,p.parcel=null;else if(t==="clear-parcel")p.parcel=null;else{if(p.pond||zi(Vi(u),a.water,25))continue;p.parcel=t.replace("-land","")}g!==JSON.stringify(p)&&(h++,!p.height&&!p.pond&&!p.parcel?delete l[u]:l[u]=p)}return h?(i.checkpoint(),a.landscape=l,null):"No editable land in brush area"}function Wl(i,t){const e=t.boundary,n=e/2,s=t.landscape??{};if(i.box("#8d9c7f",0,-36,0,e+10,26,e+10),!Object.values(s).some(r=>r.height||r.pond))i.box("#b2c497",0,-1,0,e,8,e);else{let o=function(a,c,l,h){const u=3+h- -23,p=h>0?"#aabd8e":h<0?"#9aab84":"#b2c497";i.box(p,a,-23+u/2,c,l,u,qt)};for(let a=-n;a<n;a+=qt){let c=-n,l=wr(t,na(c,a)).height;for(let h=-n+qt;h<=n;h+=qt){const d=h===n?null:wr(t,na(h,a)).height;d!==l&&(o((c+h)/2,a+qt/2,h-c,l),c=h,l=d)}}}for(const[r,o]of Object.entries(s)){const{x:a,z:c}=zs(r);if(o.pond&&i.box("#78b2bb",a,.1,c,qt,.2,qt),o.parcel&&!o.pond){i.box(Rc[o.parcel],a,3+o.height+.03,c,qt-1,.06,qt-1);for(const l of[-1,1])i.box("#e5e1cc",a+l*(qt/2-.7),3+o.height+.1,c,.7,.15,qt-1),i.box("#e5e1cc",a,3+o.height+.1,c+l*(qt/2-.7),qt-1,.15,.7)}}}const Xl=Object.freeze({floorHeight:3.2,usableShare:.8,residentialSpace:40,officeSpace:25,commercialSpace:40,publicJobSpace:60,initialOccupancy:.75,labourShare:.55,schoolShare:.18,greenTarget:10,migrationRate:.01,birthRate:.012,deathRate:.008,healthSpace:12,schoolSpace:10,accessDistance:100,parkDistance:250});function ql(i={}){const t={...Xl};for(const s of Object.keys(t))if(Object.hasOwn(i,s)){const r=i[s];if(typeof r!="number"||!Number.isFinite(r)||r<0||r>1e6)throw Error("Invalid assumption: "+s);t[s]=r}const e=["floorHeight","residentialSpace","officeSpace","commercialSpace","publicJobSpace","greenTarget","healthSpace","schoolSpace","accessDistance","parkDistance"];for(const s of e)if(t[s]<.01)throw Error("Positive value required: "+s);const n=["usableShare","initialOccupancy","labourShare","schoolShare","migrationRate","birthRate","deathRate"];for(const s of n)if(t[s]>1)throw Error("Fraction exceeds one: "+s);return t}function jl(i){if(!i||!Number.isSafeInteger(i.month)||i.month<0||i.month>12e4||!Number.isFinite(i.population)||i.population<0||i.population>1e9)throw Error("Invalid simulation state");const t=i.last??{births:0,deaths:0,migration:0};for(const e of["births","deaths","migration"])if(!Number.isFinite(t[e])||Math.abs(t[e])>1e9)throw Error("Invalid population flow");if(t.births<0||t.deaths<0)throw Error("Invalid birth or death count");return{month:i.month,population:i.population,parameters:ql(i.parameters??{}),last:{births:t.births,deaths:t.deaths,migration:t.migration}}}const Yl=[2400,3600];function Ar(i,t){if(![1200,...Yl].includes(t))throw Error("Unsupported workspace size");i.boundary=t,i.terrain.dimensions.width=t,i.terrain.dimensions.depth=t,i.water.dimensions.depth=t}function Rr(i){const t=i.dimensions;return i.type==="tree"?{...i,dimensions:{...t,width:t.width*2,depth:t.width*2}}:i}function vn(i,t,e=0){const n=Rr(i),s=Rr(t);return Math.abs(n.position.x-s.position.x)<(n.dimensions.width+s.dimensions.width)/2+e&&Math.abs(n.position.z-s.position.z)<(n.dimensions.depth+s.dimensions.depth)/2+e}function ks(i,t,e,n=null){const{x:s,z:r}=e.position,{width:o,depth:a,height:c}=e.dimensions;if(![s,r,o,a,c].every(Number.isFinite))return"Invalid dimensions or position";if(o<=0||a<=0||c<=0)return"Dimensions must be positive";if(Ro(i,e))return"Flatten terrain before construction";const l=Rr(e),h=i.boundary/2;if(Math.abs(s)+l.dimensions.width/2+6>h||Math.abs(r)+l.dimensions.depth/2+6>h)return"Outside editable workspace";if(vn(e,i.water,32))return"River and waterfront protected";if(t==="trees"){if(o<2||o>20||a!==o||c<4||c>50)return"Invalid tree dimensions"}else if(t==="buildings"){if(o<12||a<12||o>180||a>180||c<8||c>180)return"Building dimensions outside limits"}else if(t==="parks"&&(o<30||a<30||o>500||a>500))return"Park dimensions outside limits";return i.buildings.some(d=>d.id!==n&&vn(e,d,10))?"Too close to another building":t!=="trees"&&i.parks.some(d=>d.id!==n&&vn(e,d,8))?"Overlaps a public park":t!=="roads"&&i.roads.some(d=>d.path?Sn(d.path.points,d.path.width,e,10):vn(e,d,10))?"Too close to a road":t==="trees"&&i.trees.some(d=>d.id!==n&&vn(e,d,2))?"Too close to another tree":null}function $l(i,t,e){const n=i.find(t);if(!n)return"Object not found";const{key:s,object:r}=n;if(r.path)return"Use road tools to edit this alignment";if(s==="roads"&&i.originalRoads.has(t))return"Original roads are protected";const o=structuredClone(r);e.x!==void 0&&(o.position.x=e.x),e.z!==void 0&&(o.position.z=e.z);for(const c of["width","depth","height"])e[c]!==void 0&&(o.dimensions[c]=e[c]);if(s==="trees"&&(o.dimensions.depth=o.dimensions.width),e.rotate&&s!=="trees"){const c=o.dimensions;[c.width,c.depth]=[c.depth,c.width],o.orientation=((o.orientation||0)+Math.PI/2)%(Math.PI*2),s==="roads"&&(o.axis=o.axis==="z"?"x":"z")}if(e.color!==void 0){if(!/^#[0-9a-f]{6}$/i.test(e.color))return"Invalid colour";o.visual.color=e.color}e.district!==void 0&&(o.district=String(e.district).trim().slice(0,80)||"New Development"),(s==="parks"||s==="roads")&&(o.dimensions.height=r.dimensions.height);const a=ks(i.state,s,o,t);if(a)return a;if(s==="roads"){const c=o.dimensions,l=o.axis==="z"?c.width:c.depth,h=o.axis==="z"?c.depth:c.width;if(l<10||l>40||h<20||h>500)return"Invalid road dimensions";const d=i.state.roads.filter(p=>p.id!==t);if(d.some(p=>vn(o,p)&&(p.axis??(p.dimensions.width<p.dimensions.depth?"z":"x"))===o.axis))return"Overlapping parallel road";const u=[...d,o];if(!i.networkConnected(u))return"Road network would disconnect"}return i.checkpoint(),i.state[s]=i.state[s].map(c=>c.id===t?o:c),s!=="trees"&&(i.state.trees=i.state.trees.filter(c=>!vn(o,c,5))),null}function Kl(i,t,e,n){const s=i.find(t);if(!s)return"Object not found";const{key:r,object:o}=s;if(r==="roads")return"Use road construction instead";const a=structuredClone(o);a.position.x=e,a.position.z=n;const c=ks(i.state,r,a);return c||(i.checkpoint(),a.id=i.nextId(),i.state[r].push(a),r!=="trees"&&(i.state.trees=i.state.trees.filter(l=>!vn(a,l,5))),null)}function Zl(i,t,e,n=0,s=0){if(!["move","delete"].includes(e))return"Unknown group action";const r=[...new Set(t)];if(!r.length)return"Select objects first";if(![n,s].every(Number.isFinite))return"Invalid displacement";const o=r.map(l=>i.find(l));if(o.some(l=>!l||l.key==="roads"))return"Group editing supports buildings, parks and trees";const a=new Set(r),c={...i.state};for(const l of["buildings","parks","trees"])c[l]=i.state[l].filter(h=>!a.has(h.id));if(e==="move")for(const{key:l,object:h}of o){const d=structuredClone(h);d.position.x+=n,d.position.z+=s;const u=ks(c,l,d);if(u)return u;c[l].push(d)}i.checkpoint();for(const l of["buildings","parks","trees"])i.state[l]=c[l];return null}function Jl(i){let t=0;for(let e=1;e<i.length;e++)t+=Math.hypot(i[e][0]-i[e-1][0],i[e][1]-i[e-1][1]);return t}function Ql(i){if(i.length<3)return 0;let t=0;for(let e=0;e<i.length;e++){const n=i[e],s=i[(e+1)%i.length];t+=n[0]*s[1]-s[0]*n[1]}return Math.abs(t)/2}function th(i,t){const e={...i};for(const n of["buildings","roads","bridges","parks","trees"])t[n]===!1&&(e[n]=[]);return t.parcels===!1&&(e.landscape=Object.fromEntries(Object.entries(i.landscape??{}).map(([n,s])=>[n,{...s,parcel:null}]))),e}const Ds={...Eo,house:[30,32,14,"#ead6b4"],apartment:[32,34,30,"#d8d7bc"],commercial:[34,36,24,"#d5c5af"],office:[34,36,84,"#8faeb0"],hospital:[38,38,30,"#e2dfcc"],school:[36,38,18,"#ede4d3"],civic:[36,38,28,"#e8dfca"],park:[60,60,1,"#96b77d"],tree:[8,8,18,"#577c54"],road:[60,14,1,"#697671"]},ia=i=>JSON.parse(JSON.stringify(i)),sa=i=>Math.round(i/5)*5;function Ln(i,t,e=0){return Math.abs(i.position.x-t.position.x)<(i.dimensions.width+t.dimensions.width)/2+e&&Math.abs(i.position.z-t.position.z)<(i.dimensions.depth+t.dimensions.depth)/2+e}const ra=i=>i.axis??(i.dimensions.width<i.dimensions.depth?"z":"x");function Cr(i){if(!i.length)return!1;const t=new Set([0]),e=[0];for(;e.length;){const n=e.shift();i.forEach((s,r)=>{!t.has(r)&&Ao(i[n],s)&&(t.add(r),e.push(r))})}return t.size===i.length}function Pr(i,t,e,n=!1,s=60){if(!Object.hasOwn(Ds,i))throw new Error("Unknown construction tool");let[r,o,a,c]=Ds[i];return i==="road"&&(r=[40,60,100].includes(s)?s:60,n&&([r,o]=[o,r])),{id:"preview",type:i==="road"?"local":i,district:"New Development",position:{x:sa(t),y:2,z:sa(e)},dimensions:{width:r,depth:o,height:a},orientation:0,...i==="road"?{axis:n?"z":"x"}:{},visual:{color:c,roof:"#76877e",roofForm:i==="house"?"gable":"flat"}}}function Dr(i,t,e){const{x:n,z:s}=e.position,{width:r,depth:o}=e.dimensions;if(![n,s,r,o].every(Number.isFinite))return"Invalid coordinates";if(Ro(i,e))return"Flatten terrain before construction";if(t==="tree")return ks(i,"trees",e);const a=i.boundary/2;if(Math.abs(n)+r/2+6>a||Math.abs(s)+o/2+6>a)return"Outside city boundary";if(Ln(e,i.water,32))return"River and waterfront protected";if(i.buildings.some(c=>Ln(e,c,10)))return"Too close to an existing building";if(i.parks.some(c=>Ln(e,c,8)))return"Too close to a public park";if(t==="road"){if(!i.roads.some(c=>Ao(e,c)))return"Connect road to existing network";if(i.roads.some(c=>Ln(e,c)&&ra(e)===ra(c)))return"Overlapping parallel road"}else if(i.roads.some(c=>c.path?Sn(c.path.points,c.path.width,e,12):Ln(e,c,12)))return"Too close to an existing road";return null}class eh{constructor(t){this.state=t,this.originalRoads=new Set(t.roads.map(e=>e.id)),this.undoStack=[],this.redoStack=[],this.sequence=1}snapshot(){const{buildings:t,parks:e,roads:n,trees:s}=this.state;return ia({buildings:t,parks:e,roads:n,trees:s,boundary:this.state.boundary,landscape:this.state.landscape??{}})}restore(t){const e=ia(t),n=e.boundary??this.state.boundary;delete e.boundary,this.state.landscape={},Object.assign(this.state,e),Ar(this.state,n)}checkpoint(){this.undoStack.push(this.snapshot()),this.undoStack.length>50&&this.undoStack.shift(),this.redoStack=[]}nextId(){const t=[...this.state.buildings,...this.state.roads,...this.state.parks,...this.state.trees];let e;do e="constructed-"+this.sequence++;while(t.some(n=>n.id===e));return e}place(t,e,n,s=!1,r=60){const o=Pr(t,e,n,s,r),a=Dr(this.state,t,o);if(a)return a;this.checkpoint(),o.id=this.nextId();const c=t==="road"?"roads":t==="park"?"parks":t==="tree"?"trees":"buildings";return this.state[c].push(o),c!=="trees"&&(this.state.trees=this.state.trees.filter(l=>{const h={...l,dimensions:{...l.dimensions,width:l.dimensions.width*2,depth:l.dimensions.width*2}};return!Ln(o,h,5)})),null}find(t){for(const e of["buildings","parks","roads","trees"]){const n=this.state[e].find(s=>s.id===t);if(n)return{key:e,object:n}}return null}demolish(t){const e=this.find(t);if(!e)return"No structure selected";const{key:n,object:s}=e;if(n==="roads"){if(this.originalRoads.has(t))return"Original road network is protected";if(!s.path&&Ln(s,this.state.water))return"Bridge crossings are protected";const r=this.state.roads.filter(o=>o.id!==t);if(!Cr(r))return"Removal disconnects road network"}return this.checkpoint(),this.state[n]=this.state[n].filter(r=>r.id!==t),null}upgrade(t){const e=this.find(t);if(!e||e.key!=="buildings")return"Select a building";const n=e.object;return n.dimensions.height>=180?"Maximum height reached":(this.checkpoint(),n.dimensions.height=Math.min(180,n.dimensions.height+8),null)}drawRoad(t,e,n=14,s=null,r=!1){return Ol(this,t,e,n,s,r)}widenRoad(t,e){return Bl(this,t,e)}edit(t,e){return $l(this,t,e)}duplicate(t,e,n){return Kl(this,t,e,n)}networkConnected(t){return Cr(t)}groupEdit(t,e,n=0,s=0){return Zl(this,t,e,n,s)}landscapeBrush(t,e,n,s=40){return Vl(this,t,e,n,s,Pr,Dr)}expand(){const t=this.state.boundary;return t>=3600?"Maximum workspace reached":(this.checkpoint(),Ar(this.state,t<2400?2400:3600),null)}undo(){return this.undoStack.length?(this.redoStack.push(this.snapshot()),this.restore(this.undoStack.pop()),!0):!1}redo(){return this.redoStack.length?(this.undoStack.push(this.snapshot()),this.restore(this.redoStack.pop()),!0):!1}}const Pc=1,Dc="urpac-uue-riverbend-v1",Lr=i=>JSON.parse(JSON.stringify(i)),nh=["buildings","roads","parks","trees"],ih=(i,t)=>JSON.stringify(i)===JSON.stringify(t);function sh(i,t,e=[],n="Autosave"){return{format:"URPAC Urban Engine",schemaVersion:Pc,city:"Riverbend",name:String(n).slice(0,80),savedAt:new Date().toISOString(),sequence:t.sequence,state:Lr(t.snapshot()),history:Lr(e)}}function oa(i,t){const e=c=>{throw new Error(c)};(!i||typeof i!="object")&&e("Invalid save file"),i.format!=="URPAC Urban Engine"&&e("Not a UUE save file"),i.schemaVersion!==Pc&&e("Unsupported save version"),i.city!=="Riverbend"&&e("Save belongs to another city"),(!Number.isSafeInteger(i.sequence)||i.sequence<1)&&e("Invalid construction sequence"),i.state||e("Missing city state");const n=new Set,s=i.state,r=s.boundary??2400;[1200,2400,3600].includes(r)||e("Invalid workspace size");const o=new Set([...Object.keys(Eo),...t.buildings.map(c=>c.type),...t.roads.map(c=>c.type),...t.parks.map(c=>c.type),...t.trees.map(c=>c.type),"house","apartment","commercial","office","hospital","school","civic","park","local"]);for(const c of nh){Array.isArray(s[c])||e("Missing collection: "+c),s[c].length>1e4&&e("City exceeds supported size");for(const l of s[c]){(!l||typeof l.id!="string"||!l.id.length||n.has(l.id))&&e("Invalid or duplicate object ID"),n.add(l.id),o.has(l.type)||e("Unknown object type"),(!l.position||!l.dimensions||!l.visual||typeof l.district!="string")&&e("Incomplete city object");const{x:h,y:d,z:u}=l.position,{width:p,depth:g,height:_}=l.dimensions;[h,d,u,p,g,_].every(Number.isFinite)||e("Invalid object geometry"),(p<=0||g<=0||_<=0)&&e("Invalid object dimensions"),(Math.abs(h)+p/2>r/2||Math.abs(u)+g/2>r/2)&&e("Object outside Riverbend"),c==="buildings"&&_>250&&e("Building exceeds supported height")}}for(const c of t.roads){const l=s.roads.find(h=>h.id===c.id);(!l||!ih(c,l))&&e("Original road network modified")}for(const c of s.roads){if(!c.path)continue;const l=Bs({...s,boundary:r,water:{position:{x:0,y:2,z:0},dimensions:{width:110,depth:r,height:1}}},c,c.id);l&&e(l);const h=wo(c.path.points,c.path.width);for(const d of["width","depth"])Math.abs(c.dimensions[d]-h.dimensions[d])>.001&&e("Invalid path bounds");for(const d of["x","z"])Math.abs(c.position[d]-h.position[d])>.001&&e("Invalid path position")}s.landscape=Gl(s.landscape,{...s,boundary:r,bridges:[],water:{position:{x:0,y:2,z:0},dimensions:{width:110,depth:r,height:1}}}),Cr(s.roads)||e("Disconnected road network"),(!Array.isArray(i.history)||i.history.length>1e4)&&e("Invalid decision history");for(const c of i.history)(!c||typeof c.action!="string"||typeof c.time!="string")&&e("Invalid decision record");const a=Lr(i);return a.simulation!=null&&(a.simulation=jl(a.simulation)),a}function aa(i){const t={};let e=0,n=0,s=0;for(const r of i.buildings){t[r.type]=(t[r.type]||0)+1;const{width:o,depth:a,height:c}=r.dimensions;e+=o*a*Math.max(1,Math.floor(c/3.2))}for(const r of i.parks)n+=r.dimensions.width*r.dimensions.depth;for(const r of i.roads)if(r.path){const{points:o}=Ps(r);for(let a=1;a<o.length;a++)s+=Math.hypot(o[a][0]-o[a-1][0],o[a][1]-o[a-1][1])}else s+=Math.max(r.dimensions.width,r.dimensions.depth);return{buildings:i.buildings.length,roads:i.roads.length,bridges:i.bridges.length,parks:i.parks.length,trees:i.trees.length,types:t,estimatedFloorArea:Math.round(e),parkArea:Math.round(n),estimatedRoadLength:Math.round(s)}}class rh{constructor(t,e=Dc){this.storage=t,this.key=e}read(){const t=this.storage.getItem(this.key);if(!t)return{autosave:null,snapshots:[]};const e=JSON.parse(t);if(!Array.isArray(e.snapshots))throw new Error("Invalid storage data");return e}write(t){this.storage.setItem(this.key,JSON.stringify(t))}autosave(t){const e=this.read();e.autosave=t,this.write(e)}saveNamed(t){const e=this.read(),n=Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);return e.snapshots.push({id:n,save:t}),this.write(e),n}deleteNamed(t){const e=this.read();e.snapshots=e.snapshots.filter(n=>n.id!==t),this.write(e)}}function oh(i){const t=i.construction,e=t.snapshot();let n=[],s=!1,r=null,o=null;try{r=new rh(window.localStorage,Tl(bc(location.search),Dc)),i.projectHadSave=!!r.read().autosave,r.read()}catch(T){o=T.message,r=null}const a=document.createElement("details");a.id="city-management",a.innerHTML=`
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

 </div>`,document.querySelector("#construction-panel").append(a);const l=T=>a.querySelector("#"+T),h=l("save-status"),d=l("saved-cities");function u(T,x=!1){h.textContent=T,h.dataset.error=String(x)}function p(){const T=aa(i.state);l("city-inventory").innerHTML=`
   <div><small>Buildings</small>
    <strong>${T.buildings}</strong></div>
   <div><small>Roads</small>
    <strong>${T.roads}</strong></div>
   <div><small>Bridges</small>
    <strong>${T.bridges}</strong></div>
   <div><small>Parks</small>
    <strong>${T.parks}</strong></div>
   <div><small>Trees</small>
    <strong>${T.trees}</strong></div>
   <div><small>Decisions</small>
    <strong>${n.length}</strong></div>
  `;const x=l("land-use-inventory");x.replaceChildren();for(const[R,I]of Object.entries(T.types).sort()){const k=document.createElement("div");k.textContent=R+" — "+I,x.append(k)}for(const[R,I]of[["Estimated floor area",T.estimatedFloorArea+" m²"],["Park footprint",T.parkArea+" m²"],["Road segment length",T.estimatedRoadLength+" m"]]){const k=document.createElement("div");k.textContent=R+": "+I,x.append(k)}const v=l("city-decision-history");if(v.replaceChildren(),!n.length)v.textContent="No decisions recorded.";else for(const R of n.slice(-30).reverse()){const I=document.createElement("div");I.textContent=R.action+" · "+new Date(R.time).toLocaleTimeString(),v.append(I)}}function g(){d.replaceChildren();const T=document.createElement("option");if(T.value="",T.textContent="Select saved city",d.append(T),!!r)try{for(const x of r.read().snapshots){const v=document.createElement("option");v.value=x.id,v.textContent=x.save.name+" · "+new Date(x.save.savedAt).toLocaleString(),d.append(v)}}catch(x){u(x.message,!0)}}function _(T){const x=sh(i.state,t,n,T);return i.simulation&&(x.simulation=i.simulation.snapshot()),x}function m(){if(p(),!r){u("Autosave unavailable. Use Export JSON.",!0);return}try{r.autosave(_("Autosave")),u("Autosaved at "+new Date().toLocaleTimeString())}catch(T){u("Autosave failed: "+T.message,!0)}}for(const T of["place","demolish","upgrade","edit","duplicate","expand","drawRoad","widenRoad","landscapeBrush","groupEdit","undo","redo"]){const x=t[T].bind(t);t[T]=(...v)=>{const R=x(...v);return(T==="undo"||T==="redo"?R===!0:R===null)&&!s&&(n.push({action:T,arguments:v,time:new Date().toISOString()}),n.length>1e4&&n.shift()),R}}const f=i.onCityChanged;i.onCityChanged=()=>{f==null||f(),s||m()};function E(T){var tt,q,st,dt,pt;const x=oa(T,e),v=(tt=i.projectPolicy)==null?void 0:tt.authorizeRestore(x);if(v)throw Error(v);const R=t.snapshot(),I=n,k=t.sequence,G=(q=i.simulation)==null?void 0:q.snapshot(),K=t.undoStack,X=t.redoStack;s=!0;try{t.restore(x.state),t.sequence=Math.max(t.sequence,x.sequence),t.undoStack=[],t.redoStack=[],n=x.history,i.rebuildCity(),(st=i.restoreSimulation)==null||st.call(i,x.simulation??null)}catch(Pt){throw t.restore(R),t.sequence=k,t.undoStack=K,t.redoStack=X,n=I,i.rebuildCity(),(dt=i.restoreSimulation)==null||dt.call(i,G??null),Pt}finally{s=!1}m(),(pt=i.projectPolicy)==null||pt.restored()}i.saveSimulation=m;function b(){if(!r){u("Browser storage unavailable.",!0);return}const T=l("snapshot-name").value.trim()||"Riverbend "+new Date().toLocaleString(),x=r.saveNamed(_(T));g(),d.value=x,u("Snapshot saved: "+T)}function y(){if(!r||!d.value)throw new Error("Select a saved city");const T=r.read().snapshots.find(x=>x.id===d.value);if(!T)throw new Error("Snapshot not found");window.confirm("Load this snapshot and replace the current city?")&&(E(T.save),u("Loaded: "+T.save.name))}function D(){const T=JSON.stringify(_("Riverbend export"),null,2),x=new Blob([T],{type:"application/json"}),v=URL.createObjectURL(x),R=document.createElement("a");R.href=v,R.download="Riverbend-"+new Date().toISOString().slice(0,10)+".json",R.click(),setTimeout(()=>URL.revokeObjectURL(v),1e3),u("City exported.")}function C(){if(!window.confirm("Reset Riverbend to its original state? Save a snapshot first if you want to keep your changes."))return;const T=_("Original Riverbend");T.state=e,T.history=[],delete T.simulation,E(T),u("Original Riverbend restored.")}const A={save:b,load:y,export:D,reset:C,import:()=>{l("city-import-file").click()},delete:()=>{if(!r||!d.value)throw new Error("Select a snapshot");window.confirm("Delete this saved snapshot?")&&(r.deleteNamed(d.value),g(),u("Snapshot deleted."))}};for(const[T,x]of Object.entries(A))a.querySelector('[data-manage="'+T+'"]').onclick=()=>{try{x()}catch(v){u(v.message,!0)}};if(l("city-import-file").onchange=async T=>{const x=T.target.files[0];if(x)try{if(x.size>20*1024*1024)throw new Error("Save file too large");const v=oa(JSON.parse(await x.text()),e);window.confirm("Import this city and replace current changes?")&&(E(v),u("City imported."))}catch(v){u(v.message,!0)}finally{T.target.value=""}},i.cityManagement={inventory:()=>aa(i.state),exportState:()=>_("Riverbend"),loadState:E},g(),r)try{const T=r.read().autosave;T?(E(T),u("Previous city restored.")):m()}catch(T){u("Saved city could not be restored: "+T.message,!0)}else u("Storage unavailable: "+o,!0);p()}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Co="170",di={ROTATE:0,DOLLY:1,PAN:2},ci={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ah=0,ca=1,ch=2,Lc=1,Ic=2,nn=3,an=0,Ee=1,He=2,Mn=0,ui=1,Ls=2,la=3,ha=4,lh=5,In=100,hh=101,dh=102,uh=103,fh=104,ph=200,mh=201,gh=202,_h=203,Ir=204,Ur=205,vh=206,xh=207,Mh=208,yh=209,Sh=210,bh=211,Eh=212,Th=213,wh=214,Nr=0,Fr=1,Or=2,gi=3,Br=4,zr=5,kr=6,Hr=7,Uc=0,Ah=1,Rh=2,yn=0,Ch=1,Ph=2,Dh=3,Nc=4,Lh=5,Ih=6,Uh=7,Fc=300,_i=301,vi=302,Gr=303,Vr=304,Hs=306,Wr=1e3,Nn=1001,Xr=1002,Pe=1003,Nh=1004,Yi=1005,Ne=1006,js=1007,Fn=1008,cn=1009,Oc=1010,Bc=1011,Hi=1012,Po=1013,Bn=1014,qe=1015,Wi=1016,Do=1017,Lo=1018,xi=1020,zc=35902,kc=1021,Hc=1022,Ge=1023,Gc=1024,Vc=1025,fi=1026,Mi=1027,Io=1028,Uo=1029,Wc=1030,No=1031,Fo=1033,bs=33776,Es=33777,Ts=33778,ws=33779,qr=35840,jr=35841,Yr=35842,$r=35843,Kr=36196,Zr=37492,Jr=37496,Qr=37808,to=37809,eo=37810,no=37811,io=37812,so=37813,ro=37814,oo=37815,ao=37816,co=37817,lo=37818,ho=37819,uo=37820,fo=37821,As=36492,po=36494,mo=36495,Xc=36283,go=36284,_o=36285,vo=36286,Fh=3200,Oh=3201,qc=0,Bh=1,xn="",Ce="srgb",Si="srgb-linear",Gs="linear",Kt="srgb",Xn=7680,da=519,zh=512,kh=513,Hh=514,jc=515,Gh=516,Vh=517,Wh=518,Xh=519,ua=35044,qh=35048,fa="300 es",rn=2e3,Is=2001;class Gn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pa=1234567;const pi=Math.PI/180,Gi=180/Math.PI;function bi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(pe[i&255]+pe[i>>8&255]+pe[i>>16&255]+pe[i>>24&255]+"-"+pe[t&255]+pe[t>>8&255]+"-"+pe[t>>16&15|64]+pe[t>>24&255]+"-"+pe[e&63|128]+pe[e>>8&255]+"-"+pe[e>>16&255]+pe[e>>24&255]+pe[n&255]+pe[n>>8&255]+pe[n>>16&255]+pe[n>>24&255]).toLowerCase()}function ge(i,t,e){return Math.max(t,Math.min(e,i))}function Oo(i,t){return(i%t+t)%t}function jh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Yh(i,t,e){return i!==t?(e-i)/(t-i):0}function ki(i,t,e){return(1-e)*i+e*t}function $h(i,t,e,n){return ki(i,t,1-Math.exp(-e*n))}function Kh(i,t=1){return t-Math.abs(Oo(i,t*2)-t)}function Zh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Jh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Qh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function td(i,t){return i+Math.random()*(t-i)}function ed(i){return i*(.5-Math.random())}function nd(i){i!==void 0&&(pa=i);let t=pa+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function id(i){return i*pi}function sd(i){return i*Gi}function rd(i){return(i&i-1)===0&&i!==0}function od(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ad(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function cd(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*d,c*u,a*l);break;case"YZY":i.set(c*u,a*h,c*d,a*l);break;case"ZXZ":i.set(c*d,c*u,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*p,a*l);break;case"YXY":i.set(c*p,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function oi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _e(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Rs={DEG2RAD:pi,RAD2DEG:Gi,generateUUID:bi,clamp:ge,euclideanModulo:Oo,mapLinear:jh,inverseLerp:Yh,lerp:ki,damp:$h,pingpong:Kh,smoothstep:Zh,smootherstep:Jh,randInt:Qh,randFloat:td,randFloatSpread:ed,seededRandom:nd,degToRad:id,radToDeg:sd,isPowerOfTwo:rd,ceilPowerOfTwo:od,floorPowerOfTwo:ad,setQuaternionFromProperEuler:cd,normalize:_e,denormalize:oi};class wt{constructor(t=0,e=0){wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ut{constructor(t,e,n,s,r,o,a,c,l){Ut.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],E=s[1],b=s[4],y=s[7],D=s[2],C=s[5],A=s[8];return r[0]=o*_+a*E+c*D,r[3]=o*m+a*b+c*C,r[6]=o*f+a*y+c*A,r[1]=l*_+h*E+d*D,r[4]=l*m+h*b+d*C,r[7]=l*f+h*y+d*A,r[2]=u*_+p*E+g*D,r[5]=u*m+p*b+g*C,r[8]=u*f+p*y+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=h*o-a*l,u=a*c-h*r,p=l*r-o*c,g=e*d+n*u+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=d*_,t[1]=(s*l-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=u*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ys.makeScale(t,e)),this}rotate(t){return this.premultiply(Ys.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ys.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ys=new Ut;function Yc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Us(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ld(){const i=Us("canvas");return i.style.display="block",i}const ma={};function Oi(i){i in ma||(ma[i]=!0,console.warn(i))}function hd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function dd(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function ud(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Gt={enabled:!0,workingColorSpace:Si,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Kt&&(i.r=on(i.r),i.g=on(i.g),i.b=on(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Kt&&(i.r=mi(i.r),i.g=mi(i.g),i.b=mi(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===xn?Gs:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function on(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function mi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const ga=[.64,.33,.3,.6,.15,.06],_a=[.2126,.7152,.0722],va=[.3127,.329],xa=new Ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ma=new Ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Gt.define({[Si]:{primaries:ga,whitePoint:va,transfer:Gs,toXYZ:xa,fromXYZ:Ma,luminanceCoefficients:_a,workingColorSpaceConfig:{unpackColorSpace:Ce},outputColorSpaceConfig:{drawingBufferColorSpace:Ce}},[Ce]:{primaries:ga,whitePoint:va,transfer:Kt,toXYZ:xa,fromXYZ:Ma,luminanceCoefficients:_a,outputColorSpaceConfig:{drawingBufferColorSpace:Ce}}});let qn;class fd{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qn===void 0&&(qn=Us("canvas")),qn.width=t.width,qn.height=t.height;const n=qn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=qn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Us("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=on(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(on(e[n]/255)*255):e[n]=on(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let pd=0;class $c{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:pd++}),this.uuid=bi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push($s(s[o].image)):r.push($s(s[o]))}else r=$s(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function $s(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?fd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let md=0;class xe extends Gn{constructor(t=xe.DEFAULT_IMAGE,e=xe.DEFAULT_MAPPING,n=Nn,s=Nn,r=Ne,o=Fn,a=Ge,c=cn,l=xe.DEFAULT_ANISOTROPY,h=xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:md++}),this.uuid=bi(),this.name="",this.source=new $c(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new wt(0,0),this.repeat=new wt(1,1),this.center=new wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wr:t.x=t.x-Math.floor(t.x);break;case Nn:t.x=t.x<0?0:1;break;case Xr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wr:t.y=t.y-Math.floor(t.y);break;case Nn:t.y=t.y<0?0:1;break;case Xr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}xe.DEFAULT_IMAGE=null;xe.DEFAULT_MAPPING=Fc;xe.DEFAULT_ANISOTROPY=1;class re{constructor(t=0,e=0,n=0,s=1){re.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],d=c[8],u=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(l+1)/2,y=(p+1)/2,D=(f+1)/2,C=(h+u)/4,A=(d+_)/4,T=(g+m)/4;return b>y&&b>D?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=C/n,r=A/n):y>D?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=C/s,r=T/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=A/r,s=T/r),this.set(n,s,r,e),this}let E=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-_)/E,this.z=(u-h)/E,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class gd extends Gn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new re(0,0,t,e),this.scissorTest=!1,this.viewport=new re(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ne,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new xe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new $c(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zn extends gd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Kc extends xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class _d extends xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3];const u=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(d!==_||c!==u||l!==p||h!==g){let m=1-a;const f=c*u+l*p+h*g+d*_,E=f>=0?1:-1,b=1-f*f;if(b>Number.EPSILON){const D=Math.sqrt(b),C=Math.atan2(D,f*E);m=Math.sin(m*C)/D,a=Math.sin(a*C)/D}const y=a*E;if(c=c*m+u*y,l=l*m+p*y,h=h*m+g*y,d=d*m+_*y,m===1-a){const D=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=D,l*=D,h*=D,d*=D}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],u=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*d+c*p-l*u,t[e+1]=c*g+h*u+l*d-a*p,t[e+2]=l*g+h*p+a*u-c*d,t[e+3]=h*g-a*d-c*u-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),u=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=u*h*d+l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d+u*p*g;break;case"YZX":this._x=u*h*d+l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d-u*p*g;break;case"XZY":this._x=u*h*d-l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>d){const p=2*Math.sqrt(1+n-a-d);this._w=(h-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>d){const p=2*Math.sqrt(1+a-n-d);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+d-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ge(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ya.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ya.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ks.copy(this).projectOnVector(t),this.sub(Ks)}reflect(t){return this.sub(Ks.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ks=new N,ya=new kn;class ln{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Be.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Be.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Be.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Be):Be.fromBufferAttribute(r,o),Be.applyMatrix4(t.matrixWorld),this.expandByPoint(Be);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$i.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$i.copy(n.boundingBox)),$i.applyMatrix4(t.matrixWorld),this.union($i)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Be),Be.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Pi),Ki.subVectors(this.max,Pi),jn.subVectors(t.a,Pi),Yn.subVectors(t.b,Pi),$n.subVectors(t.c,Pi),un.subVectors(Yn,jn),fn.subVectors($n,Yn),Tn.subVectors(jn,$n);let e=[0,-un.z,un.y,0,-fn.z,fn.y,0,-Tn.z,Tn.y,un.z,0,-un.x,fn.z,0,-fn.x,Tn.z,0,-Tn.x,-un.y,un.x,0,-fn.y,fn.x,0,-Tn.y,Tn.x,0];return!Zs(e,jn,Yn,$n,Ki)||(e=[1,0,0,0,1,0,0,0,1],!Zs(e,jn,Yn,$n,Ki))?!1:(Zi.crossVectors(un,fn),e=[Zi.x,Zi.y,Zi.z],Zs(e,jn,Yn,$n,Ki))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Be).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Be).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ze[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ze[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ze[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ze[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ze[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ze[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ze[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ze[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ze),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ze=[new N,new N,new N,new N,new N,new N,new N,new N],Be=new N,$i=new ln,jn=new N,Yn=new N,$n=new N,un=new N,fn=new N,Tn=new N,Pi=new N,Ki=new N,Zi=new N,wn=new N;function Zs(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){wn.fromArray(i,r);const a=s.x*Math.abs(wn.x)+s.y*Math.abs(wn.y)+s.z*Math.abs(wn.z),c=t.dot(wn),l=e.dot(wn),h=n.dot(wn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const vd=new ln,Di=new N,Js=new N;class Ei{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):vd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Di.subVectors(t,this.center);const e=Di.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Di,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Js.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Di.copy(t.center).add(Js)),this.expandByPoint(Di.copy(t.center).sub(Js))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Je=new N,Qs=new N,Ji=new N,pn=new N,tr=new N,Qi=new N,er=new N;class Vs{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Je)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Je.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Je.copy(this.origin).addScaledVector(this.direction,e),Je.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Qs.copy(t).add(e).multiplyScalar(.5),Ji.copy(e).sub(t).normalize(),pn.copy(this.origin).sub(Qs);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ji),a=pn.dot(this.direction),c=-pn.dot(Ji),l=pn.lengthSq(),h=Math.abs(1-o*o);let d,u,p,g;if(h>0)if(d=o*c-a,u=o*a-c,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,p=d*(d+o*u+2*a)+u*(o*d+u+2*c)+l}else u=r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-c),r),p=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),p=u*(u+2*c)+l):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-c),r),p=-d*d+u*(u+2*c)+l);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Qs).addScaledVector(Ji,u),p}intersectSphere(t,e){Je.subVectors(t.center,this.origin);const n=Je.dot(this.direction),s=Je.dot(Je)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,s=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,s=(t.min.x-u.x)*l),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,c=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,c=(t.min.z-u.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Je)!==null}intersectTriangle(t,e,n,s,r){tr.subVectors(e,t),Qi.subVectors(n,t),er.crossVectors(tr,Qi);let o=this.direction.dot(er),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;pn.subVectors(this.origin,t);const c=a*this.direction.dot(Qi.crossVectors(pn,Qi));if(c<0)return null;const l=a*this.direction.dot(tr.cross(pn));if(l<0||c+l>o)return null;const h=-a*pn.dot(er);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Qt{constructor(t,e,n,s,r,o,a,c,l,h,d,u,p,g,_,m){Qt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,d,u,p,g,_,m)}set(t,e,n,s,r,o,a,c,l,h,d,u,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Kn.setFromMatrixColumn(t,0).length(),r=1/Kn.setFromMatrixColumn(t,1).length(),o=1/Kn.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=p+g*l,e[5]=u-_*l,e[9]=-a*c,e[2]=_-u*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){const u=c*h,p=c*d,g=l*h,_=l*d;e[0]=u+_*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+u*a,e[10]=o*c}else if(t.order==="ZXY"){const u=c*h,p=c*d,g=l*h,_=l*d;e[0]=u-_*a,e[4]=-o*d,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-u*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=c*h,e[4]=g*l-p,e[8]=u*l+_,e[1]=c*d,e[5]=_*l+u,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const u=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-u*d,e[8]=g*d+p,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=p*d+g,e[10]=u-_*d}else if(t.order==="XZY"){const u=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=u*d+_,e[5]=o*h,e[9]=p*d-g,e[2]=g*d-p,e[6]=a*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(xd,t,Md)}lookAt(t,e,n){const s=this.elements;return Ae.subVectors(t,e),Ae.lengthSq()===0&&(Ae.z=1),Ae.normalize(),mn.crossVectors(n,Ae),mn.lengthSq()===0&&(Math.abs(n.z)===1?Ae.x+=1e-4:Ae.z+=1e-4,Ae.normalize(),mn.crossVectors(n,Ae)),mn.normalize(),ts.crossVectors(Ae,mn),s[0]=mn.x,s[4]=ts.x,s[8]=Ae.x,s[1]=mn.y,s[5]=ts.y,s[9]=Ae.y,s[2]=mn.z,s[6]=ts.z,s[10]=Ae.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],E=n[3],b=n[7],y=n[11],D=n[15],C=s[0],A=s[4],T=s[8],x=s[12],v=s[1],R=s[5],I=s[9],k=s[13],G=s[2],K=s[6],X=s[10],tt=s[14],q=s[3],st=s[7],dt=s[11],pt=s[15];return r[0]=o*C+a*v+c*G+l*q,r[4]=o*A+a*R+c*K+l*st,r[8]=o*T+a*I+c*X+l*dt,r[12]=o*x+a*k+c*tt+l*pt,r[1]=h*C+d*v+u*G+p*q,r[5]=h*A+d*R+u*K+p*st,r[9]=h*T+d*I+u*X+p*dt,r[13]=h*x+d*k+u*tt+p*pt,r[2]=g*C+_*v+m*G+f*q,r[6]=g*A+_*R+m*K+f*st,r[10]=g*T+_*I+m*X+f*dt,r[14]=g*x+_*k+m*tt+f*pt,r[3]=E*C+b*v+y*G+D*q,r[7]=E*A+b*R+y*K+D*st,r[11]=E*T+b*I+y*X+D*dt,r[15]=E*x+b*k+y*tt+D*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],d=t[6],u=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*c*d-s*l*d-r*a*u+n*l*u+s*a*p-n*c*p)+_*(+e*c*p-e*l*u+r*o*u-s*o*p+s*l*h-r*c*h)+m*(+e*l*d-e*a*p-r*o*d+n*o*p+r*a*h-n*l*h)+f*(-s*a*h-e*c*d+e*a*u+s*o*d-n*o*u+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=t[9],u=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],E=d*m*l-_*u*l+_*c*p-a*m*p-d*c*f+a*u*f,b=g*u*l-h*m*l-g*c*p+o*m*p+h*c*f-o*u*f,y=h*_*l-g*d*l+g*a*p-o*_*p-h*a*f+o*d*f,D=g*d*c-h*_*c-g*a*u+o*_*u+h*a*m-o*d*m,C=e*E+n*b+s*y+r*D;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return t[0]=E*A,t[1]=(_*u*r-d*m*r-_*s*p+n*m*p+d*s*f-n*u*f)*A,t[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*f+n*c*f)*A,t[3]=(d*c*r-a*u*r-d*s*l+n*u*l+a*s*p-n*c*p)*A,t[4]=b*A,t[5]=(h*m*r-g*u*r+g*s*p-e*m*p-h*s*f+e*u*f)*A,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*f-e*c*f)*A,t[7]=(o*u*r-h*c*r+h*s*l-e*u*l-o*s*p+e*c*p)*A,t[8]=y*A,t[9]=(g*d*r-h*_*r-g*n*p+e*_*p+h*n*f-e*d*f)*A,t[10]=(o*_*r-g*a*r+g*n*l-e*_*l-o*n*f+e*a*f)*A,t[11]=(h*a*r-o*d*r-h*n*l+e*d*l+o*n*p-e*a*p)*A,t[12]=D*A,t[13]=(h*_*s-g*d*s+g*n*u-e*_*u-h*n*m+e*d*m)*A,t[14]=(g*a*s-o*_*s-g*n*c+e*_*c+o*n*m-e*a*m)*A,t[15]=(o*d*s-h*a*s+h*n*c-e*d*c-o*n*u+e*a*u)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,d=a+a,u=r*l,p=r*h,g=r*d,_=o*h,m=o*d,f=a*d,E=c*l,b=c*h,y=c*d,D=n.x,C=n.y,A=n.z;return s[0]=(1-(_+f))*D,s[1]=(p+y)*D,s[2]=(g-b)*D,s[3]=0,s[4]=(p-y)*C,s[5]=(1-(u+f))*C,s[6]=(m+E)*C,s[7]=0,s[8]=(g+b)*A,s[9]=(m-E)*A,s[10]=(1-(u+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Kn.set(s[0],s[1],s[2]).length();const o=Kn.set(s[4],s[5],s[6]).length(),a=Kn.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],ze.copy(this);const l=1/r,h=1/o,d=1/a;return ze.elements[0]*=l,ze.elements[1]*=l,ze.elements[2]*=l,ze.elements[4]*=h,ze.elements[5]*=h,ze.elements[6]*=h,ze.elements[8]*=d,ze.elements[9]*=d,ze.elements[10]*=d,e.setFromRotationMatrix(ze),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=rn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let p,g;if(a===rn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Is)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=rn){const c=this.elements,l=1/(e-t),h=1/(n-s),d=1/(o-r),u=(e+t)*l,p=(n+s)*h;let g,_;if(a===rn)g=(o+r)*d,_=-2*d;else if(a===Is)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Kn=new N,ze=new Qt,xd=new N(0,0,0),Md=new N(1,1,1),mn=new N,ts=new N,Ae=new N,Sa=new Qt,ba=new kn;class je{constructor(t=0,e=0,n=0,s=je.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ge(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ge(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ge(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Sa.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Sa,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ba.setFromEuler(this),this.setFromQuaternion(ba,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}je.DEFAULT_ORDER="XYZ";class Bo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let yd=0;const Ea=new N,Zn=new kn,Qe=new Qt,es=new N,Li=new N,Sd=new N,bd=new kn,Ta=new N(1,0,0),wa=new N(0,1,0),Aa=new N(0,0,1),Ra={type:"added"},Ed={type:"removed"},Jn={type:"childadded",child:null},nr={type:"childremoved",child:null};class ae extends Gn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yd++}),this.uuid=bi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ae.DEFAULT_UP.clone();const t=new N,e=new je,n=new kn,s=new N(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Qt},normalMatrix:{value:new Ut}}),this.matrix=new Qt,this.matrixWorld=new Qt,this.matrixAutoUpdate=ae.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Zn.setFromAxisAngle(t,e),this.quaternion.multiply(Zn),this}rotateOnWorldAxis(t,e){return Zn.setFromAxisAngle(t,e),this.quaternion.premultiply(Zn),this}rotateX(t){return this.rotateOnAxis(Ta,t)}rotateY(t){return this.rotateOnAxis(wa,t)}rotateZ(t){return this.rotateOnAxis(Aa,t)}translateOnAxis(t,e){return Ea.copy(t).applyQuaternion(this.quaternion),this.position.add(Ea.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ta,t)}translateY(t){return this.translateOnAxis(wa,t)}translateZ(t){return this.translateOnAxis(Aa,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Qe.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?es.copy(t):es.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Li.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qe.lookAt(Li,es,this.up):Qe.lookAt(es,Li,this.up),this.quaternion.setFromRotationMatrix(Qe),s&&(Qe.extractRotation(s.matrixWorld),Zn.setFromRotationMatrix(Qe),this.quaternion.premultiply(Zn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ra),Jn.child=t,this.dispatchEvent(Jn),Jn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ed),nr.child=t,this.dispatchEvent(nr),nr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Qe.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Qe.multiply(t.parent.matrixWorld)),t.applyMatrix4(Qe),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ra),Jn.child=t,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,t,Sd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,bd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ae.DEFAULT_UP=new N(0,1,0);ae.DEFAULT_MATRIX_AUTO_UPDATE=!0;ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ke=new N,tn=new N,ir=new N,en=new N,Qn=new N,ti=new N,Ca=new N,sr=new N,rr=new N,or=new N,ar=new re,cr=new re,lr=new re;class Ue{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ke.subVectors(t,e),s.cross(ke);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ke.subVectors(s,e),tn.subVectors(n,e),ir.subVectors(t,e);const o=ke.dot(ke),a=ke.dot(tn),c=ke.dot(ir),l=tn.dot(tn),h=tn.dot(ir),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,p=(l*c-a*h)*u,g=(o*h-a*c)*u;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,en)===null?!1:en.x>=0&&en.y>=0&&en.x+en.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,en)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,en.x),c.addScaledVector(o,en.y),c.addScaledVector(a,en.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return ar.setScalar(0),cr.setScalar(0),lr.setScalar(0),ar.fromBufferAttribute(t,e),cr.fromBufferAttribute(t,n),lr.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ar,r.x),o.addScaledVector(cr,r.y),o.addScaledVector(lr,r.z),o}static isFrontFacing(t,e,n,s){return ke.subVectors(n,e),tn.subVectors(t,e),ke.cross(tn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ke.subVectors(this.c,this.b),tn.subVectors(this.a,this.b),ke.cross(tn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ue.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ue.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Ue.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Ue.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ue.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Qn.subVectors(s,n),ti.subVectors(r,n),sr.subVectors(t,n);const c=Qn.dot(sr),l=ti.dot(sr);if(c<=0&&l<=0)return e.copy(n);rr.subVectors(t,s);const h=Qn.dot(rr),d=ti.dot(rr);if(h>=0&&d<=h)return e.copy(s);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Qn,o);or.subVectors(t,r);const p=Qn.dot(or),g=ti.dot(or);if(g>=0&&p<=g)return e.copy(r);const _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(ti,a);const m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return Ca.subVectors(r,s),a=(d-h)/(d-h+(p-g)),e.copy(s).addScaledVector(Ca,a);const f=1/(m+_+u);return o=_*f,a=u*f,e.copy(n).addScaledVector(Qn,o).addScaledVector(ti,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Zc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gn={h:0,s:0,l:0},ns={h:0,s:0,l:0};function hr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Gt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Gt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Gt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Gt.workingColorSpace){if(t=Oo(t,1),e=ge(e,0,1),n=ge(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=hr(o,r,t+1/3),this.g=hr(o,r,t),this.b=hr(o,r,t-1/3)}return Gt.toWorkingColorSpace(this,s),this}setStyle(t,e=Ce){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ce){const n=Zc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=on(t.r),this.g=on(t.g),this.b=on(t.b),this}copyLinearToSRGB(t){return this.r=mi(t.r),this.g=mi(t.g),this.b=mi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ce){return Gt.fromWorkingColorSpace(me.copy(this),t),Math.round(ge(me.r*255,0,255))*65536+Math.round(ge(me.g*255,0,255))*256+Math.round(ge(me.b*255,0,255))}getHexString(t=Ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Gt.workingColorSpace){Gt.fromWorkingColorSpace(me.copy(this),e);const n=me.r,s=me.g,r=me.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Gt.workingColorSpace){return Gt.fromWorkingColorSpace(me.copy(this),e),t.r=me.r,t.g=me.g,t.b=me.b,t}getStyle(t=Ce){Gt.fromWorkingColorSpace(me.copy(this),t);const e=me.r,n=me.g,s=me.b;return t!==Ce?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(gn),this.setHSL(gn.h+t,gn.s+e,gn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(gn),t.getHSL(ns);const n=ki(gn.h,ns.h,e),s=ki(gn.s,ns.s,e),r=ki(gn.l,ns.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const me=new Ht;Ht.NAMES=Zc;let Td=0;class Ti extends Gn{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=bi(),this.name="",this.blending=ui,this.side=an,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ir,this.blendDst=Ur,this.blendEquation=In,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=gi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=da,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xn,this.stencilZFail=Xn,this.stencilZPass=Xn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ui&&(n.blending=this.blending),this.side!==an&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ir&&(n.blendSrc=this.blendSrc),this.blendDst!==Ur&&(n.blendDst=this.blendDst),this.blendEquation!==In&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==da&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class On extends Ti{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new je,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const oe=new N,is=new wt;class Ve{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ua,this.updateRanges=[],this.gpuType=qe,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyMatrix3(t),this.setXY(e,is.x,is.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.applyMatrix3(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.applyMatrix4(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.applyNormalMatrix(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.transformDirection(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=oi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=oi(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=oi(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=oi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=oi(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),s=_e(s,this.array),r=_e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ua&&(t.usage=this.usage),t}}class Jc extends Ve{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Qc extends Ve{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ce extends Ve{constructor(t,e,n){super(new Float32Array(t),e,n)}}let wd=0;const Le=new Qt,dr=new ae,ei=new N,Re=new ln,Ii=new ln,ue=new N;class Te extends Gn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wd++}),this.uuid=bi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Yc(t)?Qc:Jc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ut().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Le.makeRotationFromQuaternion(t),this.applyMatrix4(Le),this}rotateX(t){return Le.makeRotationX(t),this.applyMatrix4(Le),this}rotateY(t){return Le.makeRotationY(t),this.applyMatrix4(Le),this}rotateZ(t){return Le.makeRotationZ(t),this.applyMatrix4(Le),this}translate(t,e,n){return Le.makeTranslation(t,e,n),this.applyMatrix4(Le),this}scale(t,e,n){return Le.makeScale(t,e,n),this.applyMatrix4(Le),this}lookAt(t){return dr.lookAt(t),dr.updateMatrix(),this.applyMatrix4(dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ei).negate(),this.translate(ei.x,ei.y,ei.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ce(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ln);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Re.setFromBufferAttribute(r),this.morphTargetsRelative?(ue.addVectors(this.boundingBox.min,Re.min),this.boundingBox.expandByPoint(ue),ue.addVectors(this.boundingBox.max,Re.max),this.boundingBox.expandByPoint(ue)):(this.boundingBox.expandByPoint(Re.min),this.boundingBox.expandByPoint(Re.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ei);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(Re.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Ii.setFromBufferAttribute(a),this.morphTargetsRelative?(ue.addVectors(Re.min,Ii.min),Re.expandByPoint(ue),ue.addVectors(Re.max,Ii.max),Re.expandByPoint(ue)):(Re.expandByPoint(Ii.min),Re.expandByPoint(Ii.max))}Re.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ue.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ue));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)ue.fromBufferAttribute(a,l),c&&(ei.fromBufferAttribute(t,l),ue.add(ei)),s=Math.max(s,n.distanceToSquared(ue))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ve(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let T=0;T<n.count;T++)a[T]=new N,c[T]=new N;const l=new N,h=new N,d=new N,u=new wt,p=new wt,g=new wt,_=new N,m=new N;function f(T,x,v){l.fromBufferAttribute(n,T),h.fromBufferAttribute(n,x),d.fromBufferAttribute(n,v),u.fromBufferAttribute(r,T),p.fromBufferAttribute(r,x),g.fromBufferAttribute(r,v),h.sub(l),d.sub(l),p.sub(u),g.sub(u);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(R),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(R),a[T].add(_),a[x].add(_),a[v].add(_),c[T].add(m),c[x].add(m),c[v].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let T=0,x=E.length;T<x;++T){const v=E[T],R=v.start,I=v.count;for(let k=R,G=R+I;k<G;k+=3)f(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const b=new N,y=new N,D=new N,C=new N;function A(T){D.fromBufferAttribute(s,T),C.copy(D);const x=a[T];b.copy(x),b.sub(D.multiplyScalar(D.dot(x))).normalize(),y.crossVectors(C,x);const R=y.dot(c[T])<0?-1:1;o.setXYZW(T,b.x,b.y,b.z,R)}for(let T=0,x=E.length;T<x;++T){const v=E[T],R=v.start,I=v.count;for(let k=R,G=R+I;k<G;k+=3)A(t.getX(k+0)),A(t.getX(k+1)),A(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ve(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const s=new N,r=new N,o=new N,a=new N,c=new N,l=new N,h=new N,d=new N;if(t)for(let u=0,p=t.count;u<p;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,p=e.count;u<p;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ue.fromBufferAttribute(t,e),ue.normalize(),t.setXYZ(e,ue.x,ue.y,ue.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,d=a.normalized,u=new l.constructor(c.length*h);let p=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*h;for(let f=0;f<h;f++)u[g++]=l[p++]}return new Ve(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Te,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){const u=l[h],p=t(u,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const p=l[d];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pa=new Qt,An=new Vs,ss=new Ei,Da=new N,rs=new N,os=new N,as=new N,ur=new N,cs=new N,La=new N,ls=new N;class be extends ae{constructor(t=new Te,e=new On){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){cs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],d=r[c];h!==0&&(ur.fromBufferAttribute(d,t),o?cs.addScaledVector(ur,h):cs.addScaledVector(ur.sub(e),h))}e.add(cs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ss.copy(n.boundingSphere),ss.applyMatrix4(r),An.copy(t.ray).recast(t.near),!(ss.containsPoint(An.origin)===!1&&(An.intersectSphere(ss,Da)===null||An.origin.distanceToSquared(Da)>(t.far-t.near)**2))&&(Pa.copy(r).invert(),An.copy(t.ray).applyMatrix4(Pa),!(n.boundingBox!==null&&An.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,An)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],E=Math.max(m.start,p.start),b=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=E,D=b;y<D;y+=3){const C=a.getX(y),A=a.getX(y+1),T=a.getX(y+2);s=hs(this,f,t,n,l,h,d,C,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const E=a.getX(m),b=a.getX(m+1),y=a.getX(m+2);s=hs(this,o,t,n,l,h,d,E,b,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],E=Math.max(m.start,p.start),b=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let y=E,D=b;y<D;y+=3){const C=y,A=y+1,T=y+2;s=hs(this,f,t,n,l,h,d,C,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const E=m,b=m+1,y=m+2;s=hs(this,o,t,n,l,h,d,E,b,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Ad(i,t,e,n,s,r,o,a){let c;if(t.side===Ee?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===an,a),c===null)return null;ls.copy(a),ls.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ls);return l<e.near||l>e.far?null:{distance:l,point:ls.clone(),object:i}}function hs(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,rs),i.getVertexPosition(c,os),i.getVertexPosition(l,as);const h=Ad(i,t,e,n,rs,os,as,La);if(h){const d=new N;Ue.getBarycoord(La,rs,os,as,d),s&&(h.uv=Ue.getInterpolatedAttribute(s,a,c,l,d,new wt)),r&&(h.uv1=Ue.getInterpolatedAttribute(r,a,c,l,d,new wt)),o&&(h.normal=Ue.getInterpolatedAttribute(o,a,c,l,d,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new N,materialIndex:0};Ue.getNormal(rs,os,as,u.normal),h.face=u,h.barycoord=d}return h}class Ye extends Te{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],d=[];let u=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ce(l,3)),this.setAttribute("normal",new ce(h,3)),this.setAttribute("uv",new ce(d,2));function g(_,m,f,E,b,y,D,C,A,T,x){const v=y/A,R=D/T,I=y/2,k=D/2,G=C/2,K=A+1,X=T+1;let tt=0,q=0;const st=new N;for(let dt=0;dt<X;dt++){const pt=dt*R-k;for(let Pt=0;Pt<K;Pt++){const Ft=Pt*v-I;st[_]=Ft*E,st[m]=pt*b,st[f]=G,l.push(st.x,st.y,st.z),st[_]=0,st[m]=0,st[f]=C>0?1:-1,h.push(st.x,st.y,st.z),d.push(Pt/A),d.push(1-dt/T),tt+=1}}for(let dt=0;dt<T;dt++)for(let pt=0;pt<A;pt++){const Pt=u+pt+K*dt,Ft=u+pt+K*(dt+1),Y=u+(pt+1)+K*(dt+1),et=u+(pt+1)+K*dt;c.push(Pt,Ft,et),c.push(Ft,Y,et),q+=6}a.addGroup(p,q,x),p+=q,u+=tt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ye(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function yi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ve(i){const t={};for(let e=0;e<i.length;e++){const n=yi(i[e]);for(const s in n)t[s]=n[s]}return t}function Rd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function tl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Gt.workingColorSpace}const Cd={clone:yi,merge:ve};var Pd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Dd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bn extends Ti{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pd,this.fragmentShader=Dd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=yi(t.uniforms),this.uniformsGroups=Rd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class el extends ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qt,this.projectionMatrix=new Qt,this.projectionMatrixInverse=new Qt,this.coordinateSystem=rn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const _n=new N,Ia=new wt,Ua=new wt;class Ie extends el{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Gi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(pi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Gi*2*Math.atan(Math.tan(pi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){_n.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(_n.x,_n.y).multiplyScalar(-t/_n.z),_n.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_n.x,_n.y).multiplyScalar(-t/_n.z)}getViewSize(t,e){return this.getViewBounds(t,Ia,Ua),e.subVectors(Ua,Ia)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(pi*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ni=-90,ii=1;class Ld extends ae{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ie(ni,ii,t,e);s.layers=this.layers,this.add(s);const r=new Ie(ni,ii,t,e);r.layers=this.layers,this.add(r);const o=new Ie(ni,ii,t,e);o.layers=this.layers,this.add(o);const a=new Ie(ni,ii,t,e);a.layers=this.layers,this.add(a);const c=new Ie(ni,ii,t,e);c.layers=this.layers,this.add(c);const l=new Ie(ni,ii,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Is)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class nl extends xe{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:_i,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Id extends zn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new nl(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ne}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ye(5,5,5),r=new bn({name:"CubemapFromEquirect",uniforms:yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ee,blending:Mn});r.uniforms.tEquirect.value=e;const o=new be(s,r),a=e.minFilter;return e.minFilter===Fn&&(e.minFilter=Ne),new Ld(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const fr=new N,Ud=new N,Nd=new Ut;class sn{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=fr.subVectors(n,e).cross(Ud.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(fr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Nd.getNormalMatrix(t),s=this.coplanarPoint(fr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Rn=new Ei,ds=new N;class zo{constructor(t=new sn,e=new sn,n=new sn,s=new sn,r=new sn,o=new sn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=rn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],d=s[6],u=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],E=s[13],b=s[14],y=s[15];if(n[0].setComponents(c-r,u-l,m-p,y-f).normalize(),n[1].setComponents(c+r,u+l,m+p,y+f).normalize(),n[2].setComponents(c+o,u+h,m+g,y+E).normalize(),n[3].setComponents(c-o,u-h,m-g,y-E).normalize(),n[4].setComponents(c-a,u-d,m-_,y-b).normalize(),e===rn)n[5].setComponents(c+a,u+d,m+_,y+b).normalize();else if(e===Is)n[5].setComponents(a,d,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Rn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Rn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Rn)}intersectsSprite(t){return Rn.center.set(0,0,0),Rn.radius=.7071067811865476,Rn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Rn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ds.x=s.normal.x>0?t.max.x:t.min.x,ds.y=s.normal.y>0?t.max.y:t.min.y,ds.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ds)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function il(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Fd(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,a),d.length===0)i.bufferSubData(l,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){const g=d[u],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){const _=d[p];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class Hn extends Te{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=t/a,u=e/c,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){const E=f*u-o;for(let b=0;b<l;b++){const y=b*d-r;g.push(y,-E,0),_.push(0,0,1),m.push(b/a),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let E=0;E<a;E++){const b=E+l*f,y=E+l*(f+1),D=E+1+l*(f+1),C=E+1+l*f;p.push(b,y,C),p.push(y,D,C)}this.setIndex(p),this.setAttribute("position",new ce(g,3)),this.setAttribute("normal",new ce(_,3)),this.setAttribute("uv",new ce(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Od=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,zd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Gd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Wd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,qd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,jd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$d=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Kd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Zd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Jd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Qd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,eu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,iu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,su=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ru=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ou=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,au=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,cu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,lu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,du=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,uu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fu="gl_FragColor = linearToOutputTexel( gl_FragColor );",pu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,gu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,_u=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Mu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Su=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Eu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Tu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,wu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Au=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ru=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Cu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Du=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Iu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Uu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Nu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Fu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ou=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Bu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ku=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hu=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qu=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ju=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$u=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ku=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ju=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Qu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ef=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,of=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,af=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,hf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,df=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,uf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ff=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,gf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_f=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Mf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,yf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Sf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ef=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Tf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,wf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Af=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Rf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Cf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Pf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Df=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Lf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,If=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Uf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Nf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ff=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Of=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Bf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Wf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Xf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,qf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,jf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$f=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Kf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Jf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ep=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,np=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ip=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,sp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,rp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,op=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ap=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,cp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,up=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,fp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,mp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,gp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Nt={alphahash_fragment:Od,alphahash_pars_fragment:Bd,alphamap_fragment:zd,alphamap_pars_fragment:kd,alphatest_fragment:Hd,alphatest_pars_fragment:Gd,aomap_fragment:Vd,aomap_pars_fragment:Wd,batching_pars_vertex:Xd,batching_vertex:qd,begin_vertex:jd,beginnormal_vertex:Yd,bsdfs:$d,iridescence_fragment:Kd,bumpmap_pars_fragment:Zd,clipping_planes_fragment:Jd,clipping_planes_pars_fragment:Qd,clipping_planes_pars_vertex:tu,clipping_planes_vertex:eu,color_fragment:nu,color_pars_fragment:iu,color_pars_vertex:su,color_vertex:ru,common:ou,cube_uv_reflection_fragment:au,defaultnormal_vertex:cu,displacementmap_pars_vertex:lu,displacementmap_vertex:hu,emissivemap_fragment:du,emissivemap_pars_fragment:uu,colorspace_fragment:fu,colorspace_pars_fragment:pu,envmap_fragment:mu,envmap_common_pars_fragment:gu,envmap_pars_fragment:_u,envmap_pars_vertex:vu,envmap_physical_pars_fragment:Cu,envmap_vertex:xu,fog_vertex:Mu,fog_pars_vertex:yu,fog_fragment:Su,fog_pars_fragment:bu,gradientmap_pars_fragment:Eu,lightmap_pars_fragment:Tu,lights_lambert_fragment:wu,lights_lambert_pars_fragment:Au,lights_pars_begin:Ru,lights_toon_fragment:Pu,lights_toon_pars_fragment:Du,lights_phong_fragment:Lu,lights_phong_pars_fragment:Iu,lights_physical_fragment:Uu,lights_physical_pars_fragment:Nu,lights_fragment_begin:Fu,lights_fragment_maps:Ou,lights_fragment_end:Bu,logdepthbuf_fragment:zu,logdepthbuf_pars_fragment:ku,logdepthbuf_pars_vertex:Hu,logdepthbuf_vertex:Gu,map_fragment:Vu,map_pars_fragment:Wu,map_particle_fragment:Xu,map_particle_pars_fragment:qu,metalnessmap_fragment:ju,metalnessmap_pars_fragment:Yu,morphinstance_vertex:$u,morphcolor_vertex:Ku,morphnormal_vertex:Zu,morphtarget_pars_vertex:Ju,morphtarget_vertex:Qu,normal_fragment_begin:tf,normal_fragment_maps:ef,normal_pars_fragment:nf,normal_pars_vertex:sf,normal_vertex:rf,normalmap_pars_fragment:of,clearcoat_normal_fragment_begin:af,clearcoat_normal_fragment_maps:cf,clearcoat_pars_fragment:lf,iridescence_pars_fragment:hf,opaque_fragment:df,packing:uf,premultiplied_alpha_fragment:ff,project_vertex:pf,dithering_fragment:mf,dithering_pars_fragment:gf,roughnessmap_fragment:_f,roughnessmap_pars_fragment:vf,shadowmap_pars_fragment:xf,shadowmap_pars_vertex:Mf,shadowmap_vertex:yf,shadowmask_pars_fragment:Sf,skinbase_vertex:bf,skinning_pars_vertex:Ef,skinning_vertex:Tf,skinnormal_vertex:wf,specularmap_fragment:Af,specularmap_pars_fragment:Rf,tonemapping_fragment:Cf,tonemapping_pars_fragment:Pf,transmission_fragment:Df,transmission_pars_fragment:Lf,uv_pars_fragment:If,uv_pars_vertex:Uf,uv_vertex:Nf,worldpos_vertex:Ff,background_vert:Of,background_frag:Bf,backgroundCube_vert:zf,backgroundCube_frag:kf,cube_vert:Hf,cube_frag:Gf,depth_vert:Vf,depth_frag:Wf,distanceRGBA_vert:Xf,distanceRGBA_frag:qf,equirect_vert:jf,equirect_frag:Yf,linedashed_vert:$f,linedashed_frag:Kf,meshbasic_vert:Zf,meshbasic_frag:Jf,meshlambert_vert:Qf,meshlambert_frag:tp,meshmatcap_vert:ep,meshmatcap_frag:np,meshnormal_vert:ip,meshnormal_frag:sp,meshphong_vert:rp,meshphong_frag:op,meshphysical_vert:ap,meshphysical_frag:cp,meshtoon_vert:lp,meshtoon_frag:hp,points_vert:dp,points_frag:up,shadow_vert:fp,shadow_frag:pp,sprite_vert:mp,sprite_frag:gp},ot={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ut}},envmap:{envMap:{value:null},envMapRotation:{value:new Ut},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ut},normalScale:{value:new wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0},uvTransform:{value:new Ut}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}}},Xe={basic:{uniforms:ve([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:ve([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:ve([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:ve([ot.common,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.roughnessmap,ot.metalnessmap,ot.fog,ot.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:ve([ot.common,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.gradientmap,ot.fog,ot.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:ve([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:ve([ot.points,ot.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:ve([ot.common,ot.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:ve([ot.common,ot.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:ve([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:ve([ot.sprite,ot.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ut}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:ve([ot.common,ot.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:ve([ot.lights,ot.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};Xe.physical={uniforms:ve([Xe.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ut},clearcoatNormalScale:{value:new wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ut},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ut},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ut},transmissionSamplerSize:{value:new wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ut},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ut},anisotropyVector:{value:new wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ut}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const us={r:0,b:0,g:0},Cn=new je,_p=new Qt;function vp(i,t,e,n,s,r,o){const a=new Ht(0);let c=r===!0?0:1,l,h,d=null,u=0,p=null;function g(E){let b=E.isScene===!0?E.background:null;return b&&b.isTexture&&(b=(E.backgroundBlurriness>0?e:t).get(b)),b}function _(E){let b=!1;const y=g(E);y===null?f(a,c):y&&y.isColor&&(f(y,1),b=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,o):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,b){const y=g(b);y&&(y.isCubeTexture||y.mapping===Hs)?(h===void 0&&(h=new be(new Ye(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:yi(Xe.backgroundCube.uniforms),vertexShader:Xe.backgroundCube.vertexShader,fragmentShader:Xe.backgroundCube.fragmentShader,side:Ee,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Cn.copy(b.backgroundRotation),Cn.x*=-1,Cn.y*=-1,Cn.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Cn.y*=-1,Cn.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(_p.makeRotationFromEuler(Cn)),h.material.toneMapped=Gt.getTransfer(y.colorSpace)!==Kt,(d!==y||u!==y.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,d=y,u=y.version,p=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new be(new Hn(2,2),new bn({name:"BackgroundMaterial",uniforms:yi(Xe.background.uniforms),vertexShader:Xe.background.vertexShader,fragmentShader:Xe.background.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=Gt.getTransfer(y.colorSpace)!==Kt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||u!==y.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,d=y,u=y.version,p=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function f(E,b){E.getRGB(us,tl(i)),n.buffers.color.setClear(us.r,us.g,us.b,b,o)}return{getClearColor:function(){return a},setClearColor:function(E,b=1){a.set(E),c=b,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(E){c=E,f(a,c)},render:_,addToRenderList:m}}function xp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(v,R,I,k,G){let K=!1;const X=d(k,I,R);r!==X&&(r=X,l(r.object)),K=p(v,k,I,G),K&&g(v,k,I,G),G!==null&&t.update(G,i.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,y(v,R,I,k),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function d(v,R,I){const k=I.wireframe===!0;let G=n[v.id];G===void 0&&(G={},n[v.id]=G);let K=G[R.id];K===void 0&&(K={},G[R.id]=K);let X=K[k];return X===void 0&&(X=u(c()),K[k]=X),X}function u(v){const R=[],I=[],k=[];for(let G=0;G<e;G++)R[G]=0,I[G]=0,k[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:k,object:v,attributes:{},index:null}}function p(v,R,I,k){const G=r.attributes,K=R.attributes;let X=0;const tt=I.getAttributes();for(const q in tt)if(tt[q].location>=0){const dt=G[q];let pt=K[q];if(pt===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(pt=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(pt=v.instanceColor)),dt===void 0||dt.attribute!==pt||pt&&dt.data!==pt.data)return!0;X++}return r.attributesNum!==X||r.index!==k}function g(v,R,I,k){const G={},K=R.attributes;let X=0;const tt=I.getAttributes();for(const q in tt)if(tt[q].location>=0){let dt=K[q];dt===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(dt=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(dt=v.instanceColor));const pt={};pt.attribute=dt,dt&&dt.data&&(pt.data=dt.data),G[q]=pt,X++}r.attributes=G,r.attributesNum=X,r.index=k}function _(){const v=r.newAttributes;for(let R=0,I=v.length;R<I;R++)v[R]=0}function m(v){f(v,0)}function f(v,R){const I=r.newAttributes,k=r.enabledAttributes,G=r.attributeDivisors;I[v]=1,k[v]===0&&(i.enableVertexAttribArray(v),k[v]=1),G[v]!==R&&(i.vertexAttribDivisor(v,R),G[v]=R)}function E(){const v=r.newAttributes,R=r.enabledAttributes;for(let I=0,k=R.length;I<k;I++)R[I]!==v[I]&&(i.disableVertexAttribArray(I),R[I]=0)}function b(v,R,I,k,G,K,X){X===!0?i.vertexAttribIPointer(v,R,I,G,K):i.vertexAttribPointer(v,R,I,k,G,K)}function y(v,R,I,k){_();const G=k.attributes,K=I.getAttributes(),X=R.defaultAttributeValues;for(const tt in K){const q=K[tt];if(q.location>=0){let st=G[tt];if(st===void 0&&(tt==="instanceMatrix"&&v.instanceMatrix&&(st=v.instanceMatrix),tt==="instanceColor"&&v.instanceColor&&(st=v.instanceColor)),st!==void 0){const dt=st.normalized,pt=st.itemSize,Pt=t.get(st);if(Pt===void 0)continue;const Ft=Pt.buffer,Y=Pt.type,et=Pt.bytesPerElement,gt=Y===i.INT||Y===i.UNSIGNED_INT||st.gpuType===Po;if(st.isInterleavedBufferAttribute){const at=st.data,bt=at.stride,At=st.offset;if(at.isInstancedInterleavedBuffer){for(let Et=0;Et<q.locationSize;Et++)f(q.location+Et,at.meshPerAttribute);v.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Et=0;Et<q.locationSize;Et++)m(q.location+Et);i.bindBuffer(i.ARRAY_BUFFER,Ft);for(let Et=0;Et<q.locationSize;Et++)b(q.location+Et,pt/q.locationSize,Y,dt,bt*et,(At+pt/q.locationSize*Et)*et,gt)}else{if(st.isInstancedBufferAttribute){for(let at=0;at<q.locationSize;at++)f(q.location+at,st.meshPerAttribute);v.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let at=0;at<q.locationSize;at++)m(q.location+at);i.bindBuffer(i.ARRAY_BUFFER,Ft);for(let at=0;at<q.locationSize;at++)b(q.location+at,pt/q.locationSize,Y,dt,pt*et,pt/q.locationSize*at*et,gt)}}else if(X!==void 0){const dt=X[tt];if(dt!==void 0)switch(dt.length){case 2:i.vertexAttrib2fv(q.location,dt);break;case 3:i.vertexAttrib3fv(q.location,dt);break;case 4:i.vertexAttrib4fv(q.location,dt);break;default:i.vertexAttrib1fv(q.location,dt)}}}}E()}function D(){T();for(const v in n){const R=n[v];for(const I in R){const k=R[I];for(const G in k)h(k[G].object),delete k[G];delete R[I]}delete n[v]}}function C(v){if(n[v.id]===void 0)return;const R=n[v.id];for(const I in R){const k=R[I];for(const G in k)h(k[G].object),delete k[G];delete R[I]}delete n[v.id]}function A(v){for(const R in n){const I=n[R];if(I[v.id]===void 0)continue;const k=I[v.id];for(const G in k)h(k[G].object),delete k[G];delete I[v.id]}}function T(){x(),o=!0,r!==s&&(r=s,l(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:x,dispose:D,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function Mp(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),e.update(h,n,d))}function a(l,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];e.update(p,n,1)}function c(l,h,d,u){if(d===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function yp(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Ge&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const T=A===Wi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==cn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==qe&&!T)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:E,maxVaryings:b,maxFragmentUniforms:y,vertexTextures:D,maxSamples:C}}function Sp(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new sn,a=new Ut,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||n!==0||s;return s=u,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,p){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const E=r?0:n,b=E*4;let y=f.clippingState||null;c.value=y,y=h(g,u,b,p);for(let D=0;D!==b;++D)y[D]=e[D];f.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,p,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const f=p+_*4,E=u.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<f)&&(m=new Float32Array(f));for(let b=0,y=p;b!==_;++b,y+=4)o.copy(d[b]).applyMatrix4(E,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function bp(i){let t=new WeakMap;function e(o,a){return a===Gr?o.mapping=_i:a===Vr&&(o.mapping=vi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Gr||a===Vr)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Id(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class sl extends el{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const li=4,Na=[.125,.215,.35,.446,.526,.582],Un=20,pr=new sl,Fa=new Ht;let mr=null,gr=0,_r=0,vr=!1;const Dn=(1+Math.sqrt(5))/2,si=1/Dn,Oa=[new N(-Dn,si,0),new N(Dn,si,0),new N(-si,0,Dn),new N(si,0,Dn),new N(0,Dn,-si),new N(0,Dn,si),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class Ba{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),_r=this._renderer.getActiveMipmapLevel(),vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ha(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ka(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(mr,gr,_r),this._renderer.xr.enabled=vr,t.scissorTest=!1,fs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_i||t.mapping===vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),_r=this._renderer.getActiveMipmapLevel(),vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ne,minFilter:Ne,generateMipmaps:!1,type:Wi,format:Ge,colorSpace:Si,depthBuffer:!1},s=za(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=za(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ep(r)),this._blurMaterial=Tp(r,t,e)}return s}_compileMaterial(t){const e=new be(this._lodPlanes[0],t);this._renderer.compile(e,pr)}_sceneToCubeUV(t,e,n,s){const a=new Ie(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(Fa),h.toneMapping=yn,h.autoClear=!1;const p=new On({name:"PMREM.Background",side:Ee,depthWrite:!1,depthTest:!1}),g=new be(new Ye,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Fa),_=!0);for(let f=0;f<6;f++){const E=f%3;E===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):E===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const b=this._cubeSize;fs(s,E*b,f>2?b:0,b,b),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===_i||t.mapping===vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ha()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ka());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new be(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;fs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,pr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Oa[(s-r-1)%Oa.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new be(this._lodPlanes[s],l),u=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Un-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Un;m>Un&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Un}`);const f=[];let E=0;for(let A=0;A<Un;++A){const T=A/_,x=Math.exp(-T*T/2);f.push(x),A===0?E+=x:A<m&&(E+=2*x)}for(let A=0;A<f.length;A++)f[A]=f[A]/E;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:b}=this;u.dTheta.value=g,u.mipInt.value=b-n;const y=this._sizeLods[s],D=3*y*(s>b-li?s-b+li:0),C=4*(this._cubeSize-y);fs(e,D,C,3*y,2*y),c.setRenderTarget(e),c.render(d,pr)}}function Ep(i){const t=[],e=[],n=[];let s=i;const r=i-li+1+Na.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-li?c=Na[o-i+li-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,_=3,m=2,f=1,E=new Float32Array(_*g*p),b=new Float32Array(m*g*p),y=new Float32Array(f*g*p);for(let C=0;C<p;C++){const A=C%3*2/3-1,T=C>2?0:-1,x=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];E.set(x,_*g*C),b.set(u,m*g*C);const v=[C,C,C,C,C,C];y.set(v,f*g*C)}const D=new Te;D.setAttribute("position",new Ve(E,_)),D.setAttribute("uv",new Ve(b,m)),D.setAttribute("faceIndex",new Ve(y,f)),t.push(D),s>li&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function za(i,t,e){const n=new zn(i,t,e);return n.texture.mapping=Hs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Tp(i,t,e){const n=new Float32Array(Un),s=new N(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:Un,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function ka(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function Ha(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mn,depthTest:!1,depthWrite:!1})}function ko(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function wp(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Gr||c===Vr,h=c===_i||c===vi;if(l||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new Ba(i)),d=l?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return l&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new Ba(i)),d=l?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Ap(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Oi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Rp(i,t,e,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}u.removeEventListener("dispose",o),delete s[u.id];const p=r.get(u);p&&(t.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function c(d){const u=d.attributes;for(const g in u)t.update(u[g],i.ARRAY_BUFFER);const p=d.morphAttributes;for(const g in p){const _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(d){const u=[],p=d.index,g=d.attributes.position;let _=0;if(p!==null){const E=p.array;_=p.version;for(let b=0,y=E.length;b<y;b+=3){const D=E[b+0],C=E[b+1],A=E[b+2];u.push(D,C,C,A,A,D)}}else if(g!==void 0){const E=g.array;_=g.version;for(let b=0,y=E.length/3-1;b<y;b+=3){const D=b+0,C=b+1,A=b+2;u.push(D,C,C,A,A,D)}}else return;const m=new(Yc(u)?Qc:Jc)(u,1);m.version=_;const f=r.get(d);f&&t.remove(f),r.set(d,m)}function h(d){const u=r.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function Cp(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function c(u,p){i.drawElements(n,p,r,u*o),e.update(p,n,1)}function l(u,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,u*o,g),e.update(p,n,g))}function h(u,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function d(u,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)l(u[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,u,0,_,0,g);let f=0;for(let E=0;E<g;E++)f+=p[E]*_[E];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Pp(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Dp(i,t,e){const n=new WeakMap,s=new re;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let x=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",x)};u!==void 0&&u.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],E=a.morphAttributes.color||[];let b=0;p===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let y=a.attributes.position.count*b,D=1;y>t.maxTextureSize&&(D=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const C=new Float32Array(y*D*4*d),A=new Kc(C,y,D,d);A.type=qe,A.needsUpdate=!0;const T=b*4;for(let v=0;v<d;v++){const R=m[v],I=f[v],k=E[v],G=y*D*4*v;for(let K=0;K<R.count;K++){const X=K*T;p===!0&&(s.fromBufferAttribute(R,K),C[G+X+0]=s.x,C[G+X+1]=s.y,C[G+X+2]=s.z,C[G+X+3]=0),g===!0&&(s.fromBufferAttribute(I,K),C[G+X+4]=s.x,C[G+X+5]=s.y,C[G+X+6]=s.z,C[G+X+7]=0),_===!0&&(s.fromBufferAttribute(k,K),C[G+X+8]=s.x,C[G+X+9]=s.y,C[G+X+10]=s.z,C[G+X+11]=k.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new wt(y,D)},n.set(a,u),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let _=0;_<l.length;_++)p+=l[_];const g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Lp(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,d=t.get(c,h);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return d}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class rl extends xe{constructor(t,e,n,s,r,o,a,c,l,h=fi){if(h!==fi&&h!==Mi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===fi&&(n=Bn),n===void 0&&h===Mi&&(n=xi),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Pe,this.minFilter=c!==void 0?c:Pe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ol=new xe,Ga=new rl(1,1),al=new Kc,cl=new _d,ll=new nl,Va=[],Wa=[],Xa=new Float32Array(16),qa=new Float32Array(9),ja=new Float32Array(4);function wi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Va[s];if(r===void 0&&(r=new Float32Array(s),Va[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function he(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function de(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ws(i,t){let e=Wa[t];e===void 0&&(e=new Int32Array(t),Wa[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ip(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Up(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(he(e,t))return;i.uniform2fv(this.addr,t),de(e,t)}}function Np(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(he(e,t))return;i.uniform3fv(this.addr,t),de(e,t)}}function Fp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(he(e,t))return;i.uniform4fv(this.addr,t),de(e,t)}}function Op(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(he(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),de(e,t)}else{if(he(e,n))return;ja.set(n),i.uniformMatrix2fv(this.addr,!1,ja),de(e,n)}}function Bp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(he(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),de(e,t)}else{if(he(e,n))return;qa.set(n),i.uniformMatrix3fv(this.addr,!1,qa),de(e,n)}}function zp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(he(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),de(e,t)}else{if(he(e,n))return;Xa.set(n),i.uniformMatrix4fv(this.addr,!1,Xa),de(e,n)}}function kp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Hp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(he(e,t))return;i.uniform2iv(this.addr,t),de(e,t)}}function Gp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(he(e,t))return;i.uniform3iv(this.addr,t),de(e,t)}}function Vp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(he(e,t))return;i.uniform4iv(this.addr,t),de(e,t)}}function Wp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Xp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(he(e,t))return;i.uniform2uiv(this.addr,t),de(e,t)}}function qp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(he(e,t))return;i.uniform3uiv(this.addr,t),de(e,t)}}function jp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(he(e,t))return;i.uniform4uiv(this.addr,t),de(e,t)}}function Yp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ga.compareFunction=jc,r=Ga):r=ol,e.setTexture2D(t||r,s)}function $p(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||cl,s)}function Kp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ll,s)}function Zp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||al,s)}function Jp(i){switch(i){case 5126:return Ip;case 35664:return Up;case 35665:return Np;case 35666:return Fp;case 35674:return Op;case 35675:return Bp;case 35676:return zp;case 5124:case 35670:return kp;case 35667:case 35671:return Hp;case 35668:case 35672:return Gp;case 35669:case 35673:return Vp;case 5125:return Wp;case 36294:return Xp;case 36295:return qp;case 36296:return jp;case 35678:case 36198:case 36298:case 36306:case 35682:return Yp;case 35679:case 36299:case 36307:return $p;case 35680:case 36300:case 36308:case 36293:return Kp;case 36289:case 36303:case 36311:case 36292:return Zp}}function Qp(i,t){i.uniform1fv(this.addr,t)}function tm(i,t){const e=wi(t,this.size,2);i.uniform2fv(this.addr,e)}function em(i,t){const e=wi(t,this.size,3);i.uniform3fv(this.addr,e)}function nm(i,t){const e=wi(t,this.size,4);i.uniform4fv(this.addr,e)}function im(i,t){const e=wi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function sm(i,t){const e=wi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function rm(i,t){const e=wi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function om(i,t){i.uniform1iv(this.addr,t)}function am(i,t){i.uniform2iv(this.addr,t)}function cm(i,t){i.uniform3iv(this.addr,t)}function lm(i,t){i.uniform4iv(this.addr,t)}function hm(i,t){i.uniform1uiv(this.addr,t)}function dm(i,t){i.uniform2uiv(this.addr,t)}function um(i,t){i.uniform3uiv(this.addr,t)}function fm(i,t){i.uniform4uiv(this.addr,t)}function pm(i,t,e){const n=this.cache,s=t.length,r=Ws(e,s);he(n,r)||(i.uniform1iv(this.addr,r),de(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ol,r[o])}function mm(i,t,e){const n=this.cache,s=t.length,r=Ws(e,s);he(n,r)||(i.uniform1iv(this.addr,r),de(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||cl,r[o])}function gm(i,t,e){const n=this.cache,s=t.length,r=Ws(e,s);he(n,r)||(i.uniform1iv(this.addr,r),de(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ll,r[o])}function _m(i,t,e){const n=this.cache,s=t.length,r=Ws(e,s);he(n,r)||(i.uniform1iv(this.addr,r),de(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||al,r[o])}function vm(i){switch(i){case 5126:return Qp;case 35664:return tm;case 35665:return em;case 35666:return nm;case 35674:return im;case 35675:return sm;case 35676:return rm;case 5124:case 35670:return om;case 35667:case 35671:return am;case 35668:case 35672:return cm;case 35669:case 35673:return lm;case 5125:return hm;case 36294:return dm;case 36295:return um;case 36296:return fm;case 35678:case 36198:case 36298:case 36306:case 35682:return pm;case 35679:case 36299:case 36307:return mm;case 35680:case 36300:case 36308:case 36293:return gm;case 36289:case 36303:case 36311:case 36292:return _m}}class xm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Jp(e.type)}}class Mm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=vm(e.type)}}class ym{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const xr=/(\w+)(\])?(\[|\.)?/g;function Ya(i,t){i.seq.push(t),i.map[t.id]=t}function Sm(i,t,e){const n=i.name,s=n.length;for(xr.lastIndex=0;;){const r=xr.exec(n),o=xr.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Ya(e,l===void 0?new xm(a,i,t):new Mm(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new ym(a),Ya(e,d)),e=d}}}class Cs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Sm(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function $a(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const bm=37297;let Em=0;function Tm(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Ka=new Ut;function wm(i){Gt._getMatrix(Ka,Gt.workingColorSpace,i);const t=`mat3( ${Ka.elements.map(e=>e.toFixed(4))} )`;switch(Gt.getTransfer(i)){case Gs:return[t,"LinearTransferOETF"];case Kt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Za(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Tm(i.getShaderSource(t),o)}else return s}function Am(i,t){const e=wm(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Rm(i,t){let e;switch(t){case Ch:e="Linear";break;case Ph:e="Reinhard";break;case Dh:e="Cineon";break;case Nc:e="ACESFilmic";break;case Ih:e="AgX";break;case Uh:e="Neutral";break;case Lh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ps=new N;function Cm(){Gt.getLuminanceCoefficients(ps);const i=ps.x.toFixed(4),t=ps.y.toFixed(4),e=ps.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Bi).join(`
`)}function Dm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Lm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Bi(i){return i!==""}function Ja(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Qa(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Im=/^[ \t]*#include +<([\w\d./]+)>/gm;function xo(i){return i.replace(Im,Nm)}const Um=new Map;function Nm(i,t){let e=Nt[t];if(e===void 0){const n=Um.get(t);if(n!==void 0)e=Nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return xo(e)}const Fm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tc(i){return i.replace(Fm,Om)}function Om(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ec(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Bm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Lc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ic?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===nn&&(t="SHADOWMAP_TYPE_VSM"),t}function zm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case _i:case vi:t="ENVMAP_TYPE_CUBE";break;case Hs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function km(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case vi:t="ENVMAP_MODE_REFRACTION";break}return t}function Hm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Uc:t="ENVMAP_BLENDING_MULTIPLY";break;case Ah:t="ENVMAP_BLENDING_MIX";break;case Rh:t="ENVMAP_BLENDING_ADD";break}return t}function Gm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Vm(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Bm(e),l=zm(e),h=km(e),d=Hm(e),u=Gm(e),p=Pm(e),g=Dm(r),_=s.createProgram();let m,f,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Bi).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Bi).join(`
`),f.length>0&&(f+=`
`)):(m=[ec(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Bi).join(`
`),f=[ec(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==yn?"#define TONE_MAPPING":"",e.toneMapping!==yn?Nt.tonemapping_pars_fragment:"",e.toneMapping!==yn?Rm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,Am("linearToOutputTexel",e.outputColorSpace),Cm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Bi).join(`
`)),o=xo(o),o=Ja(o,e),o=Qa(o,e),a=xo(a),a=Ja(a,e),a=Qa(a,e),o=tc(o),a=tc(a),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===fa?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const b=E+m+o,y=E+f+a,D=$a(s,s.VERTEX_SHADER,b),C=$a(s,s.FRAGMENT_SHADER,y);s.attachShader(_,D),s.attachShader(_,C),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(R){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(_).trim(),k=s.getShaderInfoLog(D).trim(),G=s.getShaderInfoLog(C).trim();let K=!0,X=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,D,C);else{const tt=Za(s,D,"vertex"),q=Za(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+tt+`
`+q)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(k===""||G==="")&&(X=!1);X&&(R.diagnostics={runnable:K,programLog:I,vertexShader:{log:k,prefix:m},fragmentShader:{log:G,prefix:f}})}s.deleteShader(D),s.deleteShader(C),T=new Cs(s,_),x=Lm(s,_)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let x;this.getAttributes=function(){return x===void 0&&A(this),x};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,bm)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Em++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=C,this}let Wm=0;class Xm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new qm(t),e.set(t,n)),n}}class qm{constructor(t){this.id=Wm++,this.code=t,this.usedTimes=0}}function jm(i,t,e,n,s,r,o){const a=new Bo,c=new Xm,l=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,v,R,I,k){const G=I.fog,K=k.geometry,X=x.isMeshStandardMaterial?I.environment:null,tt=(x.isMeshStandardMaterial?e:t).get(x.envMap||X),q=tt&&tt.mapping===Hs?tt.image.height:null,st=g[x.type];x.precision!==null&&(p=s.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const dt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,pt=dt!==void 0?dt.length:0;let Pt=0;K.morphAttributes.position!==void 0&&(Pt=1),K.morphAttributes.normal!==void 0&&(Pt=2),K.morphAttributes.color!==void 0&&(Pt=3);let Ft,Y,et,gt;if(st){const Yt=Xe[st];Ft=Yt.vertexShader,Y=Yt.fragmentShader}else Ft=x.vertexShader,Y=x.fragmentShader,c.update(x),et=c.getVertexShaderID(x),gt=c.getFragmentShaderID(x);const at=i.getRenderTarget(),bt=i.state.buffers.depth.getReversed(),At=k.isInstancedMesh===!0,Et=k.isBatchedMesh===!0,Jt=!!x.map,Ot=!!x.matcap,ee=!!tt,O=!!x.aoMap,Me=!!x.lightMap,Bt=!!x.bumpMap,zt=!!x.normalMap,yt=!!x.displacementMap,$t=!!x.emissiveMap,St=!!x.metalnessMap,w=!!x.roughnessMap,M=x.anisotropy>0,H=x.clearcoat>0,P=x.dispersion>0,U=x.iridescence>0,z=x.sheen>0,Q=x.transmission>0,J=M&&!!x.anisotropyMap,nt=H&&!!x.clearcoatMap,Rt=H&&!!x.clearcoatNormalMap,Z=H&&!!x.clearcoatRoughnessMap,rt=U&&!!x.iridescenceMap,mt=U&&!!x.iridescenceThicknessMap,Tt=z&&!!x.sheenColorMap,ft=z&&!!x.sheenRoughnessMap,kt=!!x.specularMap,Dt=!!x.specularColorMap,jt=!!x.specularIntensityMap,L=Q&&!!x.transmissionMap,ct=Q&&!!x.thicknessMap,j=!!x.gradientMap,$=!!x.alphaMap,ht=x.alphaTest>0,lt=!!x.alphaHash,Lt=!!x.extensions;let se=yn;x.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(se=i.toneMapping);const fe={shaderID:st,shaderType:x.type,shaderName:x.name,vertexShader:Ft,fragmentShader:Y,defines:x.defines,customVertexShaderID:et,customFragmentShaderID:gt,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:Et,batchingColor:Et&&k._colorsTexture!==null,instancing:At,instancingColor:At&&k.instanceColor!==null,instancingMorph:At&&k.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:at===null?i.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:Si,alphaToCoverage:!!x.alphaToCoverage,map:Jt,matcap:Ot,envMap:ee,envMapMode:ee&&tt.mapping,envMapCubeUVHeight:q,aoMap:O,lightMap:Me,bumpMap:Bt,normalMap:zt,displacementMap:u&&yt,emissiveMap:$t,normalMapObjectSpace:zt&&x.normalMapType===Bh,normalMapTangentSpace:zt&&x.normalMapType===qc,metalnessMap:St,roughnessMap:w,anisotropy:M,anisotropyMap:J,clearcoat:H,clearcoatMap:nt,clearcoatNormalMap:Rt,clearcoatRoughnessMap:Z,dispersion:P,iridescence:U,iridescenceMap:rt,iridescenceThicknessMap:mt,sheen:z,sheenColorMap:Tt,sheenRoughnessMap:ft,specularMap:kt,specularColorMap:Dt,specularIntensityMap:jt,transmission:Q,transmissionMap:L,thicknessMap:ct,gradientMap:j,opaque:x.transparent===!1&&x.blending===ui&&x.alphaToCoverage===!1,alphaMap:$,alphaTest:ht,alphaHash:lt,combine:x.combine,mapUv:Jt&&_(x.map.channel),aoMapUv:O&&_(x.aoMap.channel),lightMapUv:Me&&_(x.lightMap.channel),bumpMapUv:Bt&&_(x.bumpMap.channel),normalMapUv:zt&&_(x.normalMap.channel),displacementMapUv:yt&&_(x.displacementMap.channel),emissiveMapUv:$t&&_(x.emissiveMap.channel),metalnessMapUv:St&&_(x.metalnessMap.channel),roughnessMapUv:w&&_(x.roughnessMap.channel),anisotropyMapUv:J&&_(x.anisotropyMap.channel),clearcoatMapUv:nt&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:Rt&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:rt&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:mt&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:ft&&_(x.sheenRoughnessMap.channel),specularMapUv:kt&&_(x.specularMap.channel),specularColorMapUv:Dt&&_(x.specularColorMap.channel),specularIntensityMapUv:jt&&_(x.specularIntensityMap.channel),transmissionMapUv:L&&_(x.transmissionMap.channel),thicknessMapUv:ct&&_(x.thicknessMap.channel),alphaMapUv:$&&_(x.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(zt||M),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!K.attributes.uv&&(Jt||$),fog:!!G,useFog:x.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:bt,skinning:k.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:Pt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:se,decodeVideoTexture:Jt&&x.map.isVideoTexture===!0&&Gt.getTransfer(x.map.colorSpace)===Kt,decodeVideoTextureEmissive:$t&&x.emissiveMap.isVideoTexture===!0&&Gt.getTransfer(x.emissiveMap.colorSpace)===Kt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===He,flipSided:x.side===Ee,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Lt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&x.extensions.multiDraw===!0||Et)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return fe.vertexUv1s=l.has(1),fe.vertexUv2s=l.has(2),fe.vertexUv3s=l.has(3),l.clear(),fe}function f(x){const v=[];if(x.shaderID?v.push(x.shaderID):(v.push(x.customVertexShaderID),v.push(x.customFragmentShaderID)),x.defines!==void 0)for(const R in x.defines)v.push(R),v.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(E(v,x),b(v,x),v.push(i.outputColorSpace)),v.push(x.customProgramCacheKey),v.join()}function E(x,v){x.push(v.precision),x.push(v.outputColorSpace),x.push(v.envMapMode),x.push(v.envMapCubeUVHeight),x.push(v.mapUv),x.push(v.alphaMapUv),x.push(v.lightMapUv),x.push(v.aoMapUv),x.push(v.bumpMapUv),x.push(v.normalMapUv),x.push(v.displacementMapUv),x.push(v.emissiveMapUv),x.push(v.metalnessMapUv),x.push(v.roughnessMapUv),x.push(v.anisotropyMapUv),x.push(v.clearcoatMapUv),x.push(v.clearcoatNormalMapUv),x.push(v.clearcoatRoughnessMapUv),x.push(v.iridescenceMapUv),x.push(v.iridescenceThicknessMapUv),x.push(v.sheenColorMapUv),x.push(v.sheenRoughnessMapUv),x.push(v.specularMapUv),x.push(v.specularColorMapUv),x.push(v.specularIntensityMapUv),x.push(v.transmissionMapUv),x.push(v.thicknessMapUv),x.push(v.combine),x.push(v.fogExp2),x.push(v.sizeAttenuation),x.push(v.morphTargetsCount),x.push(v.morphAttributeCount),x.push(v.numDirLights),x.push(v.numPointLights),x.push(v.numSpotLights),x.push(v.numSpotLightMaps),x.push(v.numHemiLights),x.push(v.numRectAreaLights),x.push(v.numDirLightShadows),x.push(v.numPointLightShadows),x.push(v.numSpotLightShadows),x.push(v.numSpotLightShadowsWithMaps),x.push(v.numLightProbes),x.push(v.shadowMapType),x.push(v.toneMapping),x.push(v.numClippingPlanes),x.push(v.numClipIntersection),x.push(v.depthPacking)}function b(x,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),x.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reverseDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),x.push(a.mask)}function y(x){const v=g[x.type];let R;if(v){const I=Xe[v];R=Cd.clone(I.uniforms)}else R=x.uniforms;return R}function D(x,v){let R;for(let I=0,k=h.length;I<k;I++){const G=h[I];if(G.cacheKey===v){R=G,++R.usedTimes;break}}return R===void 0&&(R=new Vm(i,v,x,r),h.push(R)),R}function C(x){if(--x.usedTimes===0){const v=h.indexOf(x);h[v]=h[h.length-1],h.pop(),x.destroy()}}function A(x){c.remove(x)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:y,acquireProgram:D,releaseProgram:C,releaseShaderCache:A,programs:h,dispose:T}}function Ym(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function $m(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function nc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ic(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,u,p,g,_,m){let f=i[t];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},i[t]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=_,f.group=m),t++,f}function a(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(d,u){e.length>1&&e.sort(d||$m),n.length>1&&n.sort(u||nc),s.length>1&&s.sort(u||nc)}function h(){for(let d=t,u=i.length;d<u;d++){const p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Km(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new ic,i.set(n,[o])):s>=r.length?(o=new ic,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Zm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new Ht};break;case"SpotLight":e={position:new N,direction:new N,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new N,halfWidth:new N,halfHeight:new N};break}return i[t.id]=e,e}}}function Jm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Qm=0;function tg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function eg(i){const t=new Zm,e=Jm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new N);const s=new N,r=new Qt,o=new Qt;function a(l){let h=0,d=0,u=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,E=0,b=0,y=0,D=0,C=0,A=0;l.sort(tg);for(let x=0,v=l.length;x<v;x++){const R=l[x],I=R.color,k=R.intensity,G=R.distance,K=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=I.r*k,d+=I.g*k,u+=I.b*k;else if(R.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(R.sh.coefficients[X],k);A++}else if(R.isDirectionalLight){const X=t.get(R);if(X.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const tt=R.shadow,q=e.get(R);q.shadowIntensity=tt.intensity,q.shadowBias=tt.bias,q.shadowNormalBias=tt.normalBias,q.shadowRadius=tt.radius,q.shadowMapSize=tt.mapSize,n.directionalShadow[p]=q,n.directionalShadowMap[p]=K,n.directionalShadowMatrix[p]=R.shadow.matrix,E++}n.directional[p]=X,p++}else if(R.isSpotLight){const X=t.get(R);X.position.setFromMatrixPosition(R.matrixWorld),X.color.copy(I).multiplyScalar(k),X.distance=G,X.coneCos=Math.cos(R.angle),X.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),X.decay=R.decay,n.spot[_]=X;const tt=R.shadow;if(R.map&&(n.spotLightMap[D]=R.map,D++,tt.updateMatrices(R),R.castShadow&&C++),n.spotLightMatrix[_]=tt.matrix,R.castShadow){const q=e.get(R);q.shadowIntensity=tt.intensity,q.shadowBias=tt.bias,q.shadowNormalBias=tt.normalBias,q.shadowRadius=tt.radius,q.shadowMapSize=tt.mapSize,n.spotShadow[_]=q,n.spotShadowMap[_]=K,y++}_++}else if(R.isRectAreaLight){const X=t.get(R);X.color.copy(I).multiplyScalar(k),X.halfWidth.set(R.width*.5,0,0),X.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=X,m++}else if(R.isPointLight){const X=t.get(R);if(X.color.copy(R.color).multiplyScalar(R.intensity),X.distance=R.distance,X.decay=R.decay,R.castShadow){const tt=R.shadow,q=e.get(R);q.shadowIntensity=tt.intensity,q.shadowBias=tt.bias,q.shadowNormalBias=tt.normalBias,q.shadowRadius=tt.radius,q.shadowMapSize=tt.mapSize,q.shadowCameraNear=tt.camera.near,q.shadowCameraFar=tt.camera.far,n.pointShadow[g]=q,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=R.shadow.matrix,b++}n.point[g]=X,g++}else if(R.isHemisphereLight){const X=t.get(R);X.skyColor.copy(R.color).multiplyScalar(k),X.groundColor.copy(R.groundColor).multiplyScalar(k),n.hemi[f]=X,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ot.LTC_FLOAT_1,n.rectAreaLTC2=ot.LTC_FLOAT_2):(n.rectAreaLTC1=ot.LTC_HALF_1,n.rectAreaLTC2=ot.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const T=n.hash;(T.directionalLength!==p||T.pointLength!==g||T.spotLength!==_||T.rectAreaLength!==m||T.hemiLength!==f||T.numDirectionalShadows!==E||T.numPointShadows!==b||T.numSpotShadows!==y||T.numSpotMaps!==D||T.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=y+D-C,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=A,T.directionalLength=p,T.pointLength=g,T.spotLength=_,T.rectAreaLength=m,T.hemiLength=f,T.numDirectionalShadows=E,T.numPointShadows=b,T.numSpotShadows=y,T.numSpotMaps=D,T.numLightProbes=A,n.version=Qm++)}function c(l,h){let d=0,u=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let f=0,E=l.length;f<E;f++){const b=l[f];if(b.isDirectionalLight){const y=n.directional[d];y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),d++}else if(b.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const y=n.point[u];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),u++}else if(b.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function sc(i){const t=new eg(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function ng(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new sc(i),t.set(s,[a])):r>=o.length?(a=new sc(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class ig extends Ti{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Fh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class sg extends Ti{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const rg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,og=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ag(i,t,e){let n=new zo;const s=new wt,r=new wt,o=new re,a=new ig({depthPacking:Oh}),c=new sg,l={},h=e.maxTextureSize,d={[an]:Ee,[Ee]:an,[He]:He},u=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new wt},radius:{value:4}},vertexShader:rg,fragmentShader:og}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const g=new Te;g.setAttribute("position",new Ve(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new be(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lc;let f=this.type;this.render=function(C,A,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const x=i.getRenderTarget(),v=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Mn),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const k=f!==nn&&this.type===nn,G=f===nn&&this.type!==nn;for(let K=0,X=C.length;K<X;K++){const tt=C[K],q=tt.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",tt,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const st=q.getFrameExtents();if(s.multiply(st),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/st.x),s.x=r.x*st.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/st.y),s.y=r.y*st.y,q.mapSize.y=r.y)),q.map===null||k===!0||G===!0){const pt=this.type!==nn?{minFilter:Pe,magFilter:Pe}:{};q.map!==null&&q.map.dispose(),q.map=new zn(s.x,s.y,pt),q.map.texture.name=tt.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const dt=q.getViewportCount();for(let pt=0;pt<dt;pt++){const Pt=q.getViewport(pt);o.set(r.x*Pt.x,r.y*Pt.y,r.x*Pt.z,r.y*Pt.w),I.viewport(o),q.updateMatrices(tt,pt),n=q.getFrustum(),y(A,T,q.camera,tt,this.type)}q.isPointLightShadow!==!0&&this.type===nn&&E(q,T),q.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(x,v,R)};function E(C,A){const T=t.update(_);u.defines.VSM_SAMPLES!==C.blurSamples&&(u.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new zn(s.x,s.y)),u.uniforms.shadow_pass.value=C.map.texture,u.uniforms.resolution.value=C.mapSize,u.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(A,null,T,u,_,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(A,null,T,p,_,null)}function b(C,A,T,x){let v=null;const R=T.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(R!==void 0)v=R;else if(v=T.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const I=v.uuid,k=A.uuid;let G=l[I];G===void 0&&(G={},l[I]=G);let K=G[k];K===void 0&&(K=v.clone(),G[k]=K,A.addEventListener("dispose",D)),v=K}if(v.visible=A.visible,v.wireframe=A.wireframe,x===nn?v.side=A.shadowSide!==null?A.shadowSide:A.side:v.side=A.shadowSide!==null?A.shadowSide:d[A.side],v.alphaMap=A.alphaMap,v.alphaTest=A.alphaTest,v.map=A.map,v.clipShadows=A.clipShadows,v.clippingPlanes=A.clippingPlanes,v.clipIntersection=A.clipIntersection,v.displacementMap=A.displacementMap,v.displacementScale=A.displacementScale,v.displacementBias=A.displacementBias,v.wireframeLinewidth=A.wireframeLinewidth,v.linewidth=A.linewidth,T.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const I=i.properties.get(v);I.light=T}return v}function y(C,A,T,x,v){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&v===nn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,C.matrixWorld);const k=t.update(C),G=C.material;if(Array.isArray(G)){const K=k.groups;for(let X=0,tt=K.length;X<tt;X++){const q=K[X],st=G[q.materialIndex];if(st&&st.visible){const dt=b(C,st,x,v);C.onBeforeShadow(i,C,A,T,k,dt,q),i.renderBufferDirect(T,null,k,dt,C,q),C.onAfterShadow(i,C,A,T,k,dt,q)}}}else if(G.visible){const K=b(C,G,x,v);C.onBeforeShadow(i,C,A,T,k,K,null),i.renderBufferDirect(T,null,k,K,C,null),C.onAfterShadow(i,C,A,T,k,K,null)}}const I=C.children;for(let k=0,G=I.length;k<G;k++)y(I[k],A,T,x,v)}function D(C){C.target.removeEventListener("dispose",D);for(const T in l){const x=l[T],v=C.target.uuid;v in x&&(x[v].dispose(),delete x[v])}}}const cg={[Nr]:Fr,[Or]:kr,[Br]:Hr,[gi]:zr,[Fr]:Nr,[kr]:Or,[Hr]:Br,[zr]:gi};function lg(i,t){function e(){let L=!1;const ct=new re;let j=null;const $=new re(0,0,0,0);return{setMask:function(ht){j!==ht&&!L&&(i.colorMask(ht,ht,ht,ht),j=ht)},setLocked:function(ht){L=ht},setClear:function(ht,lt,Lt,se,fe){fe===!0&&(ht*=se,lt*=se,Lt*=se),ct.set(ht,lt,Lt,se),$.equals(ct)===!1&&(i.clearColor(ht,lt,Lt,se),$.copy(ct))},reset:function(){L=!1,j=null,$.set(-1,0,0,0)}}}function n(){let L=!1,ct=!1,j=null,$=null,ht=null;return{setReversed:function(lt){if(ct!==lt){const Lt=t.get("EXT_clip_control");ct?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT);const se=ht;ht=null,this.setClear(se)}ct=lt},getReversed:function(){return ct},setTest:function(lt){lt?at(i.DEPTH_TEST):bt(i.DEPTH_TEST)},setMask:function(lt){j!==lt&&!L&&(i.depthMask(lt),j=lt)},setFunc:function(lt){if(ct&&(lt=cg[lt]),$!==lt){switch(lt){case Nr:i.depthFunc(i.NEVER);break;case Fr:i.depthFunc(i.ALWAYS);break;case Or:i.depthFunc(i.LESS);break;case gi:i.depthFunc(i.LEQUAL);break;case Br:i.depthFunc(i.EQUAL);break;case zr:i.depthFunc(i.GEQUAL);break;case kr:i.depthFunc(i.GREATER);break;case Hr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}$=lt}},setLocked:function(lt){L=lt},setClear:function(lt){ht!==lt&&(ct&&(lt=1-lt),i.clearDepth(lt),ht=lt)},reset:function(){L=!1,j=null,$=null,ht=null,ct=!1}}}function s(){let L=!1,ct=null,j=null,$=null,ht=null,lt=null,Lt=null,se=null,fe=null;return{setTest:function(Yt){L||(Yt?at(i.STENCIL_TEST):bt(i.STENCIL_TEST))},setMask:function(Yt){ct!==Yt&&!L&&(i.stencilMask(Yt),ct=Yt)},setFunc:function(Yt,Fe,$e){(j!==Yt||$!==Fe||ht!==$e)&&(i.stencilFunc(Yt,Fe,$e),j=Yt,$=Fe,ht=$e)},setOp:function(Yt,Fe,$e){(lt!==Yt||Lt!==Fe||se!==$e)&&(i.stencilOp(Yt,Fe,$e),lt=Yt,Lt=Fe,se=$e)},setLocked:function(Yt){L=Yt},setClear:function(Yt){fe!==Yt&&(i.clearStencil(Yt),fe=Yt)},reset:function(){L=!1,ct=null,j=null,$=null,ht=null,lt=null,Lt=null,se=null,fe=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,b=null,y=null,D=null,C=null,A=new Ht(0,0,0),T=0,x=!1,v=null,R=null,I=null,k=null,G=null;const K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,tt=0;const q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(tt=parseFloat(/^WebGL (\d)/.exec(q)[1]),X=tt>=1):q.indexOf("OpenGL ES")!==-1&&(tt=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),X=tt>=2);let st=null,dt={};const pt=i.getParameter(i.SCISSOR_BOX),Pt=i.getParameter(i.VIEWPORT),Ft=new re().fromArray(pt),Y=new re().fromArray(Pt);function et(L,ct,j,$){const ht=new Uint8Array(4),lt=i.createTexture();i.bindTexture(L,lt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Lt=0;Lt<j;Lt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(ct,0,i.RGBA,1,1,$,0,i.RGBA,i.UNSIGNED_BYTE,ht):i.texImage2D(ct+Lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ht);return lt}const gt={};gt[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),gt[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),gt[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),at(i.DEPTH_TEST),o.setFunc(gi),Bt(!1),zt(ca),at(i.CULL_FACE),O(Mn);function at(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function bt(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function At(L,ct){return d[L]!==ct?(i.bindFramebuffer(L,ct),d[L]=ct,L===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ct),L===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ct),!0):!1}function Et(L,ct){let j=p,$=!1;if(L){j=u.get(ct),j===void 0&&(j=[],u.set(ct,j));const ht=L.textures;if(j.length!==ht.length||j[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Lt=ht.length;lt<Lt;lt++)j[lt]=i.COLOR_ATTACHMENT0+lt;j.length=ht.length,$=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,$=!0);$&&i.drawBuffers(j)}function Jt(L){return g!==L?(i.useProgram(L),g=L,!0):!1}const Ot={[In]:i.FUNC_ADD,[hh]:i.FUNC_SUBTRACT,[dh]:i.FUNC_REVERSE_SUBTRACT};Ot[uh]=i.MIN,Ot[fh]=i.MAX;const ee={[ph]:i.ZERO,[mh]:i.ONE,[gh]:i.SRC_COLOR,[Ir]:i.SRC_ALPHA,[Sh]:i.SRC_ALPHA_SATURATE,[Mh]:i.DST_COLOR,[vh]:i.DST_ALPHA,[_h]:i.ONE_MINUS_SRC_COLOR,[Ur]:i.ONE_MINUS_SRC_ALPHA,[yh]:i.ONE_MINUS_DST_COLOR,[xh]:i.ONE_MINUS_DST_ALPHA,[bh]:i.CONSTANT_COLOR,[Eh]:i.ONE_MINUS_CONSTANT_COLOR,[Th]:i.CONSTANT_ALPHA,[wh]:i.ONE_MINUS_CONSTANT_ALPHA};function O(L,ct,j,$,ht,lt,Lt,se,fe,Yt){if(L===Mn){_===!0&&(bt(i.BLEND),_=!1);return}if(_===!1&&(at(i.BLEND),_=!0),L!==lh){if(L!==m||Yt!==x){if((f!==In||y!==In)&&(i.blendEquation(i.FUNC_ADD),f=In,y=In),Yt)switch(L){case ui:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ls:i.blendFunc(i.ONE,i.ONE);break;case la:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ha:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case ui:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ls:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case la:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ha:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}E=null,b=null,D=null,C=null,A.set(0,0,0),T=0,m=L,x=Yt}return}ht=ht||ct,lt=lt||j,Lt=Lt||$,(ct!==f||ht!==y)&&(i.blendEquationSeparate(Ot[ct],Ot[ht]),f=ct,y=ht),(j!==E||$!==b||lt!==D||Lt!==C)&&(i.blendFuncSeparate(ee[j],ee[$],ee[lt],ee[Lt]),E=j,b=$,D=lt,C=Lt),(se.equals(A)===!1||fe!==T)&&(i.blendColor(se.r,se.g,se.b,fe),A.copy(se),T=fe),m=L,x=!1}function Me(L,ct){L.side===He?bt(i.CULL_FACE):at(i.CULL_FACE);let j=L.side===Ee;ct&&(j=!j),Bt(j),L.blending===ui&&L.transparent===!1?O(Mn):O(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);const $=L.stencilWrite;a.setTest($),$&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),$t(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?at(i.SAMPLE_ALPHA_TO_COVERAGE):bt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(L){v!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),v=L)}function zt(L){L!==ah?(at(i.CULL_FACE),L!==R&&(L===ca?i.cullFace(i.BACK):L===ch?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):bt(i.CULL_FACE),R=L}function yt(L){L!==I&&(X&&i.lineWidth(L),I=L)}function $t(L,ct,j){L?(at(i.POLYGON_OFFSET_FILL),(k!==ct||G!==j)&&(i.polygonOffset(ct,j),k=ct,G=j)):bt(i.POLYGON_OFFSET_FILL)}function St(L){L?at(i.SCISSOR_TEST):bt(i.SCISSOR_TEST)}function w(L){L===void 0&&(L=i.TEXTURE0+K-1),st!==L&&(i.activeTexture(L),st=L)}function M(L,ct,j){j===void 0&&(st===null?j=i.TEXTURE0+K-1:j=st);let $=dt[j];$===void 0&&($={type:void 0,texture:void 0},dt[j]=$),($.type!==L||$.texture!==ct)&&(st!==j&&(i.activeTexture(j),st=j),i.bindTexture(L,ct||gt[L]),$.type=L,$.texture=ct)}function H(){const L=dt[st];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function P(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function U(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function z(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Q(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function nt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Rt(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function rt(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function mt(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Tt(L){Ft.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),Ft.copy(L))}function ft(L){Y.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function kt(L,ct){let j=l.get(ct);j===void 0&&(j=new WeakMap,l.set(ct,j));let $=j.get(L);$===void 0&&($=i.getUniformBlockIndex(ct,L.name),j.set(L,$))}function Dt(L,ct){const $=l.get(ct).get(L);c.get(ct)!==$&&(i.uniformBlockBinding(ct,$,L.__bindingPointIndex),c.set(ct,$))}function jt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},st=null,dt={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,E=null,b=null,y=null,D=null,C=null,A=new Ht(0,0,0),T=0,x=!1,v=null,R=null,I=null,k=null,G=null,Ft.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:at,disable:bt,bindFramebuffer:At,drawBuffers:Et,useProgram:Jt,setBlending:O,setMaterial:Me,setFlipSided:Bt,setCullFace:zt,setLineWidth:yt,setPolygonOffset:$t,setScissorTest:St,activeTexture:w,bindTexture:M,unbindTexture:H,compressedTexImage2D:P,compressedTexImage3D:U,texImage2D:rt,texImage3D:mt,updateUBOMapping:kt,uniformBlockBinding:Dt,texStorage2D:Rt,texStorage3D:Z,texSubImage2D:z,texSubImage3D:Q,compressedTexSubImage2D:J,compressedTexSubImage3D:nt,scissor:Tt,viewport:ft,reset:jt}}function rc(i,t,e,n){const s=hg(n);switch(e){case kc:return i*t;case Gc:return i*t;case Vc:return i*t*2;case Io:return i*t/s.components*s.byteLength;case Uo:return i*t/s.components*s.byteLength;case Wc:return i*t*2/s.components*s.byteLength;case No:return i*t*2/s.components*s.byteLength;case Hc:return i*t*3/s.components*s.byteLength;case Ge:return i*t*4/s.components*s.byteLength;case Fo:return i*t*4/s.components*s.byteLength;case bs:case Es:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ts:case ws:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case jr:case $r:return Math.max(i,16)*Math.max(t,8)/4;case qr:case Yr:return Math.max(i,8)*Math.max(t,8)/2;case Kr:case Zr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Jr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case to:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case eo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case no:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case io:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case so:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ro:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case oo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ao:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case co:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case lo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ho:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case uo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case fo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case As:case po:case mo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Xc:case go:return Math.ceil(i/4)*Math.ceil(t/4)*8;case _o:case vo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function hg(i){switch(i){case cn:case Oc:return{byteLength:1,components:1};case Hi:case Bc:case Wi:return{byteLength:2,components:1};case Do:case Lo:return{byteLength:2,components:4};case Bn:case Po:case qe:return{byteLength:4,components:1};case zc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function dg(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new wt,h=new WeakMap;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,M){return p?new OffscreenCanvas(w,M):Us("canvas")}function _(w,M,H){let P=1;const U=St(w);if((U.width>H||U.height>H)&&(P=H/Math.max(U.width,U.height)),P<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const z=Math.floor(P*U.width),Q=Math.floor(P*U.height);d===void 0&&(d=g(z,Q));const J=M?g(z,Q):d;return J.width=z,J.height=Q,J.getContext("2d").drawImage(w,0,0,z,Q),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+U.width+"x"+U.height+") to ("+z+"x"+Q+")."),J}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+U.width+"x"+U.height+")."),w;return w}function m(w){return w.generateMipmaps}function f(w){i.generateMipmap(w)}function E(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(w,M,H,P,U=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let z=M;if(M===i.RED&&(H===i.FLOAT&&(z=i.R32F),H===i.HALF_FLOAT&&(z=i.R16F),H===i.UNSIGNED_BYTE&&(z=i.R8)),M===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(z=i.R8UI),H===i.UNSIGNED_SHORT&&(z=i.R16UI),H===i.UNSIGNED_INT&&(z=i.R32UI),H===i.BYTE&&(z=i.R8I),H===i.SHORT&&(z=i.R16I),H===i.INT&&(z=i.R32I)),M===i.RG&&(H===i.FLOAT&&(z=i.RG32F),H===i.HALF_FLOAT&&(z=i.RG16F),H===i.UNSIGNED_BYTE&&(z=i.RG8)),M===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(z=i.RG8UI),H===i.UNSIGNED_SHORT&&(z=i.RG16UI),H===i.UNSIGNED_INT&&(z=i.RG32UI),H===i.BYTE&&(z=i.RG8I),H===i.SHORT&&(z=i.RG16I),H===i.INT&&(z=i.RG32I)),M===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(z=i.RGB8UI),H===i.UNSIGNED_SHORT&&(z=i.RGB16UI),H===i.UNSIGNED_INT&&(z=i.RGB32UI),H===i.BYTE&&(z=i.RGB8I),H===i.SHORT&&(z=i.RGB16I),H===i.INT&&(z=i.RGB32I)),M===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(z=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(z=i.RGBA16UI),H===i.UNSIGNED_INT&&(z=i.RGBA32UI),H===i.BYTE&&(z=i.RGBA8I),H===i.SHORT&&(z=i.RGBA16I),H===i.INT&&(z=i.RGBA32I)),M===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(z=i.RGB9_E5),M===i.RGBA){const Q=U?Gs:Gt.getTransfer(P);H===i.FLOAT&&(z=i.RGBA32F),H===i.HALF_FLOAT&&(z=i.RGBA16F),H===i.UNSIGNED_BYTE&&(z=Q===Kt?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(z=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(z=i.RGB5_A1)}return(z===i.R16F||z===i.R32F||z===i.RG16F||z===i.RG32F||z===i.RGBA16F||z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),z}function y(w,M){let H;return w?M===null||M===Bn||M===xi?H=i.DEPTH24_STENCIL8:M===qe?H=i.DEPTH32F_STENCIL8:M===Hi&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Bn||M===xi?H=i.DEPTH_COMPONENT24:M===qe?H=i.DEPTH_COMPONENT32F:M===Hi&&(H=i.DEPTH_COMPONENT16),H}function D(w,M){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Pe&&w.minFilter!==Ne?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function C(w){const M=w.target;M.removeEventListener("dispose",C),T(M),M.isVideoTexture&&h.delete(M)}function A(w){const M=w.target;M.removeEventListener("dispose",A),v(M)}function T(w){const M=n.get(w);if(M.__webglInit===void 0)return;const H=w.source,P=u.get(H);if(P){const U=P[M.__cacheKey];U.usedTimes--,U.usedTimes===0&&x(w),Object.keys(P).length===0&&u.delete(H)}n.remove(w)}function x(w){const M=n.get(w);i.deleteTexture(M.__webglTexture);const H=w.source,P=u.get(H);delete P[M.__cacheKey],o.memory.textures--}function v(w){const M=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let P=0;P<6;P++){if(Array.isArray(M.__webglFramebuffer[P]))for(let U=0;U<M.__webglFramebuffer[P].length;U++)i.deleteFramebuffer(M.__webglFramebuffer[P][U]);else i.deleteFramebuffer(M.__webglFramebuffer[P]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[P])}else{if(Array.isArray(M.__webglFramebuffer))for(let P=0;P<M.__webglFramebuffer.length;P++)i.deleteFramebuffer(M.__webglFramebuffer[P]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let P=0;P<M.__webglColorRenderbuffer.length;P++)M.__webglColorRenderbuffer[P]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[P]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const H=w.textures;for(let P=0,U=H.length;P<U;P++){const z=n.get(H[P]);z.__webglTexture&&(i.deleteTexture(z.__webglTexture),o.memory.textures--),n.remove(H[P])}n.remove(w)}let R=0;function I(){R=0}function k(){const w=R;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),R+=1,w}function G(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function K(w,M){const H=n.get(w);if(w.isVideoTexture&&yt(w),w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){const P=w.image;if(P===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(P.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(H,w,M);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+M)}function X(w,M){const H=n.get(w);if(w.version>0&&H.__version!==w.version){Y(H,w,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+M)}function tt(w,M){const H=n.get(w);if(w.version>0&&H.__version!==w.version){Y(H,w,M);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+M)}function q(w,M){const H=n.get(w);if(w.version>0&&H.__version!==w.version){et(H,w,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+M)}const st={[Wr]:i.REPEAT,[Nn]:i.CLAMP_TO_EDGE,[Xr]:i.MIRRORED_REPEAT},dt={[Pe]:i.NEAREST,[Nh]:i.NEAREST_MIPMAP_NEAREST,[Yi]:i.NEAREST_MIPMAP_LINEAR,[Ne]:i.LINEAR,[js]:i.LINEAR_MIPMAP_NEAREST,[Fn]:i.LINEAR_MIPMAP_LINEAR},pt={[zh]:i.NEVER,[Xh]:i.ALWAYS,[kh]:i.LESS,[jc]:i.LEQUAL,[Hh]:i.EQUAL,[Wh]:i.GEQUAL,[Gh]:i.GREATER,[Vh]:i.NOTEQUAL};function Pt(w,M){if(M.type===qe&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Ne||M.magFilter===js||M.magFilter===Yi||M.magFilter===Fn||M.minFilter===Ne||M.minFilter===js||M.minFilter===Yi||M.minFilter===Fn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,st[M.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,st[M.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,st[M.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,dt[M.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,dt[M.minFilter]),M.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,pt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Pe||M.minFilter!==Yi&&M.minFilter!==Fn||M.type===qe&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Ft(w,M){let H=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",C));const P=M.source;let U=u.get(P);U===void 0&&(U={},u.set(P,U));const z=G(M);if(z!==w.__cacheKey){U[z]===void 0&&(U[z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),U[z].usedTimes++;const Q=U[w.__cacheKey];Q!==void 0&&(U[w.__cacheKey].usedTimes--,Q.usedTimes===0&&x(M)),w.__cacheKey=z,w.__webglTexture=U[z].texture}return H}function Y(w,M,H){let P=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(P=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(P=i.TEXTURE_3D);const U=Ft(w,M),z=M.source;e.bindTexture(P,w.__webglTexture,i.TEXTURE0+H);const Q=n.get(z);if(z.version!==Q.__version||U===!0){e.activeTexture(i.TEXTURE0+H);const J=Gt.getPrimaries(Gt.workingColorSpace),nt=M.colorSpace===xn?null:Gt.getPrimaries(M.colorSpace),Rt=M.colorSpace===xn||J===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);let Z=_(M.image,!1,s.maxTextureSize);Z=$t(M,Z);const rt=r.convert(M.format,M.colorSpace),mt=r.convert(M.type);let Tt=b(M.internalFormat,rt,mt,M.colorSpace,M.isVideoTexture);Pt(P,M);let ft;const kt=M.mipmaps,Dt=M.isVideoTexture!==!0,jt=Q.__version===void 0||U===!0,L=z.dataReady,ct=D(M,Z);if(M.isDepthTexture)Tt=y(M.format===Mi,M.type),jt&&(Dt?e.texStorage2D(i.TEXTURE_2D,1,Tt,Z.width,Z.height):e.texImage2D(i.TEXTURE_2D,0,Tt,Z.width,Z.height,0,rt,mt,null));else if(M.isDataTexture)if(kt.length>0){Dt&&jt&&e.texStorage2D(i.TEXTURE_2D,ct,Tt,kt[0].width,kt[0].height);for(let j=0,$=kt.length;j<$;j++)ft=kt[j],Dt?L&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ft.width,ft.height,rt,mt,ft.data):e.texImage2D(i.TEXTURE_2D,j,Tt,ft.width,ft.height,0,rt,mt,ft.data);M.generateMipmaps=!1}else Dt?(jt&&e.texStorage2D(i.TEXTURE_2D,ct,Tt,Z.width,Z.height),L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Z.width,Z.height,rt,mt,Z.data)):e.texImage2D(i.TEXTURE_2D,0,Tt,Z.width,Z.height,0,rt,mt,Z.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Dt&&jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,Tt,kt[0].width,kt[0].height,Z.depth);for(let j=0,$=kt.length;j<$;j++)if(ft=kt[j],M.format!==Ge)if(rt!==null)if(Dt){if(L)if(M.layerUpdates.size>0){const ht=rc(ft.width,ft.height,M.format,M.type);for(const lt of M.layerUpdates){const Lt=ft.data.subarray(lt*ht/ft.data.BYTES_PER_ELEMENT,(lt+1)*ht/ft.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,lt,ft.width,ft.height,1,rt,Lt)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ft.width,ft.height,Z.depth,rt,ft.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Tt,ft.width,ft.height,Z.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Dt?L&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ft.width,ft.height,Z.depth,rt,mt,ft.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,Tt,ft.width,ft.height,Z.depth,0,rt,mt,ft.data)}else{Dt&&jt&&e.texStorage2D(i.TEXTURE_2D,ct,Tt,kt[0].width,kt[0].height);for(let j=0,$=kt.length;j<$;j++)ft=kt[j],M.format!==Ge?rt!==null?Dt?L&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,ft.width,ft.height,rt,ft.data):e.compressedTexImage2D(i.TEXTURE_2D,j,Tt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Dt?L&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,ft.width,ft.height,rt,mt,ft.data):e.texImage2D(i.TEXTURE_2D,j,Tt,ft.width,ft.height,0,rt,mt,ft.data)}else if(M.isDataArrayTexture)if(Dt){if(jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,Tt,Z.width,Z.height,Z.depth),L)if(M.layerUpdates.size>0){const j=rc(Z.width,Z.height,M.format,M.type);for(const $ of M.layerUpdates){const ht=Z.data.subarray($*j/Z.data.BYTES_PER_ELEMENT,($+1)*j/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,Z.width,Z.height,1,rt,mt,ht)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,rt,mt,Z.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,Z.width,Z.height,Z.depth,0,rt,mt,Z.data);else if(M.isData3DTexture)Dt?(jt&&e.texStorage3D(i.TEXTURE_3D,ct,Tt,Z.width,Z.height,Z.depth),L&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,rt,mt,Z.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,Z.width,Z.height,Z.depth,0,rt,mt,Z.data);else if(M.isFramebufferTexture){if(jt)if(Dt)e.texStorage2D(i.TEXTURE_2D,ct,Tt,Z.width,Z.height);else{let j=Z.width,$=Z.height;for(let ht=0;ht<ct;ht++)e.texImage2D(i.TEXTURE_2D,ht,Tt,j,$,0,rt,mt,null),j>>=1,$>>=1}}else if(kt.length>0){if(Dt&&jt){const j=St(kt[0]);e.texStorage2D(i.TEXTURE_2D,ct,Tt,j.width,j.height)}for(let j=0,$=kt.length;j<$;j++)ft=kt[j],Dt?L&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,rt,mt,ft):e.texImage2D(i.TEXTURE_2D,j,Tt,rt,mt,ft);M.generateMipmaps=!1}else if(Dt){if(jt){const j=St(Z);e.texStorage2D(i.TEXTURE_2D,ct,Tt,j.width,j.height)}L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt,mt,Z)}else e.texImage2D(i.TEXTURE_2D,0,Tt,rt,mt,Z);m(M)&&f(P),Q.__version=z.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function et(w,M,H){if(M.image.length!==6)return;const P=Ft(w,M),U=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+H);const z=n.get(U);if(U.version!==z.__version||P===!0){e.activeTexture(i.TEXTURE0+H);const Q=Gt.getPrimaries(Gt.workingColorSpace),J=M.colorSpace===xn?null:Gt.getPrimaries(M.colorSpace),nt=M.colorSpace===xn||Q===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);const Rt=M.isCompressedTexture||M.image[0].isCompressedTexture,Z=M.image[0]&&M.image[0].isDataTexture,rt=[];for(let $=0;$<6;$++)!Rt&&!Z?rt[$]=_(M.image[$],!0,s.maxCubemapSize):rt[$]=Z?M.image[$].image:M.image[$],rt[$]=$t(M,rt[$]);const mt=rt[0],Tt=r.convert(M.format,M.colorSpace),ft=r.convert(M.type),kt=b(M.internalFormat,Tt,ft,M.colorSpace),Dt=M.isVideoTexture!==!0,jt=z.__version===void 0||P===!0,L=U.dataReady;let ct=D(M,mt);Pt(i.TEXTURE_CUBE_MAP,M);let j;if(Rt){Dt&&jt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,kt,mt.width,mt.height);for(let $=0;$<6;$++){j=rt[$].mipmaps;for(let ht=0;ht<j.length;ht++){const lt=j[ht];M.format!==Ge?Tt!==null?Dt?L&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,0,0,lt.width,lt.height,Tt,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,kt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Dt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,0,0,lt.width,lt.height,Tt,ft,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht,kt,lt.width,lt.height,0,Tt,ft,lt.data)}}}else{if(j=M.mipmaps,Dt&&jt){j.length>0&&ct++;const $=St(rt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,kt,$.width,$.height)}for(let $=0;$<6;$++)if(Z){Dt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,rt[$].width,rt[$].height,Tt,ft,rt[$].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,kt,rt[$].width,rt[$].height,0,Tt,ft,rt[$].data);for(let ht=0;ht<j.length;ht++){const Lt=j[ht].image[$].image;Dt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,0,0,Lt.width,Lt.height,Tt,ft,Lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,kt,Lt.width,Lt.height,0,Tt,ft,Lt.data)}}else{Dt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Tt,ft,rt[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,kt,Tt,ft,rt[$]);for(let ht=0;ht<j.length;ht++){const lt=j[ht];Dt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,0,0,Tt,ft,lt.image[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ht+1,kt,Tt,ft,lt.image[$])}}}m(M)&&f(i.TEXTURE_CUBE_MAP),z.__version=U.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function gt(w,M,H,P,U,z){const Q=r.convert(H.format,H.colorSpace),J=r.convert(H.type),nt=b(H.internalFormat,Q,J,H.colorSpace),Rt=n.get(M),Z=n.get(H);if(Z.__renderTarget=M,!Rt.__hasExternalTextures){const rt=Math.max(1,M.width>>z),mt=Math.max(1,M.height>>z);U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?e.texImage3D(U,z,nt,rt,mt,M.depth,0,Q,J,null):e.texImage2D(U,z,nt,rt,mt,0,Q,J,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),zt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,P,U,Z.__webglTexture,0,Bt(M)):(U===i.TEXTURE_2D||U>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&U<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,P,U,Z.__webglTexture,z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function at(w,M,H){if(i.bindRenderbuffer(i.RENDERBUFFER,w),M.depthBuffer){const P=M.depthTexture,U=P&&P.isDepthTexture?P.type:null,z=y(M.stencilBuffer,U),Q=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=Bt(M);zt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,J,z,M.width,M.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,J,z,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,z,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,w)}else{const P=M.textures;for(let U=0;U<P.length;U++){const z=P[U],Q=r.convert(z.format,z.colorSpace),J=r.convert(z.type),nt=b(z.internalFormat,Q,J,z.colorSpace),Rt=Bt(M);H&&zt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,nt,M.width,M.height):zt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Rt,nt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,nt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function bt(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const P=n.get(M.depthTexture);P.__renderTarget=M,(!P.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),K(M.depthTexture,0);const U=P.__webglTexture,z=Bt(M);if(M.depthTexture.format===fi)zt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,U,0,z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,U,0);else if(M.depthTexture.format===Mi)zt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,U,0,z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,U,0);else throw new Error("Unknown depthTexture format")}function At(w){const M=n.get(w),H=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const P=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),P){const U=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,P.removeEventListener("dispose",U)};P.addEventListener("dispose",U),M.__depthDisposeCallback=U}M.__boundDepthTexture=P}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");bt(M.__webglFramebuffer,w)}else if(H){M.__webglDepthbuffer=[];for(let P=0;P<6;P++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[P]),M.__webglDepthbuffer[P]===void 0)M.__webglDepthbuffer[P]=i.createRenderbuffer(),at(M.__webglDepthbuffer[P],w,!1);else{const U=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,z=M.__webglDepthbuffer[P];i.bindRenderbuffer(i.RENDERBUFFER,z),i.framebufferRenderbuffer(i.FRAMEBUFFER,U,i.RENDERBUFFER,z)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),at(M.__webglDepthbuffer,w,!1);else{const P=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,U=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,U),i.framebufferRenderbuffer(i.FRAMEBUFFER,P,i.RENDERBUFFER,U)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Et(w,M,H){const P=n.get(w);M!==void 0&&gt(P.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&At(w)}function Jt(w){const M=w.texture,H=n.get(w),P=n.get(M);w.addEventListener("dispose",A);const U=w.textures,z=w.isWebGLCubeRenderTarget===!0,Q=U.length>1;if(Q||(P.__webglTexture===void 0&&(P.__webglTexture=i.createTexture()),P.__version=M.version,o.memory.textures++),z){H.__webglFramebuffer=[];for(let J=0;J<6;J++)if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer[J]=[];for(let nt=0;nt<M.mipmaps.length;nt++)H.__webglFramebuffer[J][nt]=i.createFramebuffer()}else H.__webglFramebuffer[J]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer=[];for(let J=0;J<M.mipmaps.length;J++)H.__webglFramebuffer[J]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Q)for(let J=0,nt=U.length;J<nt;J++){const Rt=n.get(U[J]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&zt(w)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let J=0;J<U.length;J++){const nt=U[J];H.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[J]);const Rt=r.convert(nt.format,nt.colorSpace),Z=r.convert(nt.type),rt=b(nt.internalFormat,Rt,Z,nt.colorSpace,w.isXRRenderTarget===!0),mt=Bt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,rt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,H.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),at(H.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(z){e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture),Pt(i.TEXTURE_CUBE_MAP,M);for(let J=0;J<6;J++)if(M.mipmaps&&M.mipmaps.length>0)for(let nt=0;nt<M.mipmaps.length;nt++)gt(H.__webglFramebuffer[J][nt],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,nt);else gt(H.__webglFramebuffer[J],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);m(M)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Q){for(let J=0,nt=U.length;J<nt;J++){const Rt=U[J],Z=n.get(Rt);e.bindTexture(i.TEXTURE_2D,Z.__webglTexture),Pt(i.TEXTURE_2D,Rt),gt(H.__webglFramebuffer,w,Rt,i.COLOR_ATTACHMENT0+J,i.TEXTURE_2D,0),m(Rt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let J=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(J=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(J,P.__webglTexture),Pt(J,M),M.mipmaps&&M.mipmaps.length>0)for(let nt=0;nt<M.mipmaps.length;nt++)gt(H.__webglFramebuffer[nt],w,M,i.COLOR_ATTACHMENT0,J,nt);else gt(H.__webglFramebuffer,w,M,i.COLOR_ATTACHMENT0,J,0);m(M)&&f(J),e.unbindTexture()}w.depthBuffer&&At(w)}function Ot(w){const M=w.textures;for(let H=0,P=M.length;H<P;H++){const U=M[H];if(m(U)){const z=E(w),Q=n.get(U).__webglTexture;e.bindTexture(z,Q),f(z),e.unbindTexture()}}}const ee=[],O=[];function Me(w){if(w.samples>0){if(zt(w)===!1){const M=w.textures,H=w.width,P=w.height;let U=i.COLOR_BUFFER_BIT;const z=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=n.get(w),J=M.length>1;if(J)for(let nt=0;nt<M.length;nt++)e.bindFramebuffer(i.FRAMEBUFFER,Q.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Q.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Q.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Q.__webglFramebuffer);for(let nt=0;nt<M.length;nt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(U|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(U|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Q.__webglColorRenderbuffer[nt]);const Rt=n.get(M[nt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Rt,0)}i.blitFramebuffer(0,0,H,P,0,0,H,P,U,i.NEAREST),c===!0&&(ee.length=0,O.length=0,ee.push(i.COLOR_ATTACHMENT0+nt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(ee.push(z),O.push(z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,O)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ee))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let nt=0;nt<M.length;nt++){e.bindFramebuffer(i.FRAMEBUFFER,Q.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,Q.__webglColorRenderbuffer[nt]);const Rt=n.get(M[nt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Q.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.TEXTURE_2D,Rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Q.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const M=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Bt(w){return Math.min(s.maxSamples,w.samples)}function zt(w){const M=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function yt(w){const M=o.render.frame;h.get(w)!==M&&(h.set(w,M),w.update())}function $t(w,M){const H=w.colorSpace,P=w.format,U=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||H!==Si&&H!==xn&&(Gt.getTransfer(H)===Kt?(P!==Ge||U!==cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),M}function St(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=I,this.setTexture2D=K,this.setTexture2DArray=X,this.setTexture3D=tt,this.setTextureCube=q,this.rebindTextures=Et,this.setupRenderTarget=Jt,this.updateRenderTargetMipmap=Ot,this.updateMultisampleRenderTarget=Me,this.setupDepthRenderbuffer=At,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=zt}function ug(i,t){function e(n,s=xn){let r;const o=Gt.getTransfer(s);if(n===cn)return i.UNSIGNED_BYTE;if(n===Do)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Lo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===zc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Oc)return i.BYTE;if(n===Bc)return i.SHORT;if(n===Hi)return i.UNSIGNED_SHORT;if(n===Po)return i.INT;if(n===Bn)return i.UNSIGNED_INT;if(n===qe)return i.FLOAT;if(n===Wi)return i.HALF_FLOAT;if(n===kc)return i.ALPHA;if(n===Hc)return i.RGB;if(n===Ge)return i.RGBA;if(n===Gc)return i.LUMINANCE;if(n===Vc)return i.LUMINANCE_ALPHA;if(n===fi)return i.DEPTH_COMPONENT;if(n===Mi)return i.DEPTH_STENCIL;if(n===Io)return i.RED;if(n===Uo)return i.RED_INTEGER;if(n===Wc)return i.RG;if(n===No)return i.RG_INTEGER;if(n===Fo)return i.RGBA_INTEGER;if(n===bs||n===Es||n===Ts||n===ws)if(o===Kt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===bs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Es)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ts)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ws)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===bs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Es)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ts)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ws)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===qr||n===jr||n===Yr||n===$r)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===qr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===jr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Yr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$r)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Kr||n===Zr||n===Jr)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Kr||n===Zr)return o===Kt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Jr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Qr||n===to||n===eo||n===no||n===io||n===so||n===ro||n===oo||n===ao||n===co||n===lo||n===ho||n===uo||n===fo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Qr)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===to)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===eo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===no)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===io)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===so)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ro)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===oo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ao)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===co)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===lo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ho)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===uo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fo)return o===Kt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===As||n===po||n===mo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===As)return o===Kt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===po)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===mo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Xc||n===go||n===_o||n===vo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===As)return r.COMPRESSED_RED_RGTC1_EXT;if(n===go)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===_o)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===vo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class fg extends Ie{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class hi extends ae{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pg={type:"move"};class Mr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(l,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;l.inputState.pinching&&u>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(pg)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new hi;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const mg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class _g{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new xe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new bn({vertexShader:mg,fragmentShader:gg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new be(new Hn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class vg extends Gn{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,u=null,p=null,g=null;const _=new _g,m=e.getContextAttributes();let f=null,E=null;const b=[],y=[],D=new wt;let C=null;const A=new Ie;A.viewport=new re;const T=new Ie;T.viewport=new re;const x=[A,T],v=new fg;let R=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let et=b[Y];return et===void 0&&(et=new Mr,b[Y]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Y){let et=b[Y];return et===void 0&&(et=new Mr,b[Y]=et),et.getGripSpace()},this.getHand=function(Y){let et=b[Y];return et===void 0&&(et=new Mr,b[Y]=et),et.getHandSpace()};function k(Y){const et=y.indexOf(Y.inputSource);if(et===-1)return;const gt=b[et];gt!==void 0&&(gt.update(Y.inputSource,Y.frame,l||o),gt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function G(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",K);for(let Y=0;Y<b.length;Y++){const et=y[Y];et!==null&&(y[Y]=null,b[Y].disconnect(et))}R=null,I=null,_.reset(),t.setRenderTarget(f),p=null,u=null,d=null,s=null,E=null,Ft.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",G),s.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(D),s.renderState.layers===void 0){const et={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,et),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),E=new zn(p.framebufferWidth,p.framebufferHeight,{format:Ge,type:cn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let et=null,gt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=m.stencil?Mi:fi,gt=m.stencil?xi:Bn);const bt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(bt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),E=new zn(u.textureWidth,u.textureHeight,{format:Ge,type:cn,depthTexture:new rl(u.textureWidth,u.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Ft.setContext(s),Ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(Y){for(let et=0;et<Y.removed.length;et++){const gt=Y.removed[et],at=y.indexOf(gt);at>=0&&(y[at]=null,b[at].disconnect(gt))}for(let et=0;et<Y.added.length;et++){const gt=Y.added[et];let at=y.indexOf(gt);if(at===-1){for(let At=0;At<b.length;At++)if(At>=y.length){y.push(gt),at=At;break}else if(y[At]===null){y[At]=gt,at=At;break}if(at===-1)break}const bt=b[at];bt&&bt.connect(gt)}}const X=new N,tt=new N;function q(Y,et,gt){X.setFromMatrixPosition(et.matrixWorld),tt.setFromMatrixPosition(gt.matrixWorld);const at=X.distanceTo(tt),bt=et.projectionMatrix.elements,At=gt.projectionMatrix.elements,Et=bt[14]/(bt[10]-1),Jt=bt[14]/(bt[10]+1),Ot=(bt[9]+1)/bt[5],ee=(bt[9]-1)/bt[5],O=(bt[8]-1)/bt[0],Me=(At[8]+1)/At[0],Bt=Et*O,zt=Et*Me,yt=at/(-O+Me),$t=yt*-O;if(et.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX($t),Y.translateZ(yt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),bt[10]===-1)Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const St=Et+yt,w=Jt+yt,M=Bt-$t,H=zt+(at-$t),P=Ot*Jt/w*St,U=ee*Jt/w*St;Y.projectionMatrix.makePerspective(M,H,P,U,St,w),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function st(Y,et){et===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(et.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let et=Y.near,gt=Y.far;_.texture!==null&&(_.depthNear>0&&(et=_.depthNear),_.depthFar>0&&(gt=_.depthFar)),v.near=T.near=A.near=et,v.far=T.far=A.far=gt,(R!==v.near||I!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),R=v.near,I=v.far),A.layers.mask=Y.layers.mask|2,T.layers.mask=Y.layers.mask|4,v.layers.mask=A.layers.mask|T.layers.mask;const at=Y.parent,bt=v.cameras;st(v,at);for(let At=0;At<bt.length;At++)st(bt[At],at);bt.length===2?q(v,A,T):v.projectionMatrix.copy(A.projectionMatrix),dt(Y,v,at)};function dt(Y,et,gt){gt===null?Y.matrix.copy(et.matrixWorld):(Y.matrix.copy(gt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(et.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Gi*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(u===null&&p===null))return c},this.setFoveation=function(Y){c=Y,u!==null&&(u.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let pt=null;function Pt(Y,et){if(h=et.getViewerPose(l||o),g=et,h!==null){const gt=h.views;p!==null&&(t.setRenderTargetFramebuffer(E,p.framebuffer),t.setRenderTarget(E));let at=!1;gt.length!==v.cameras.length&&(v.cameras.length=0,at=!0);for(let At=0;At<gt.length;At++){const Et=gt[At];let Jt=null;if(p!==null)Jt=p.getViewport(Et);else{const ee=d.getViewSubImage(u,Et);Jt=ee.viewport,At===0&&(t.setRenderTargetTextures(E,ee.colorTexture,u.ignoreDepthValues?void 0:ee.depthStencilTexture),t.setRenderTarget(E))}let Ot=x[At];Ot===void 0&&(Ot=new Ie,Ot.layers.enable(At),Ot.viewport=new re,x[At]=Ot),Ot.matrix.fromArray(Et.transform.matrix),Ot.matrix.decompose(Ot.position,Ot.quaternion,Ot.scale),Ot.projectionMatrix.fromArray(Et.projectionMatrix),Ot.projectionMatrixInverse.copy(Ot.projectionMatrix).invert(),Ot.viewport.set(Jt.x,Jt.y,Jt.width,Jt.height),At===0&&(v.matrix.copy(Ot.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),at===!0&&v.cameras.push(Ot)}const bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")){const At=d.getDepthInformation(gt[0]);At&&At.isValid&&At.texture&&_.init(t,At,s.renderState)}}for(let gt=0;gt<b.length;gt++){const at=y[gt],bt=b[gt];at!==null&&bt!==void 0&&bt.update(at,et,l||o)}pt&&pt(Y,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}const Ft=new il;Ft.setAnimationLoop(Pt),this.setAnimationLoop=function(Y){pt=Y},this.dispose=function(){}}}const Pn=new je,xg=new Qt;function Mg(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,tl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,E,b,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?c(m,f,E,b):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ee&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ee&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const E=t.get(f),b=E.envMap,y=E.envMapRotation;b&&(m.envMap.value=b,Pn.copy(y),Pn.x*=-1,Pn.y*=-1,Pn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Pn.y*=-1,Pn.z*=-1),m.envMapRotation.value.setFromMatrix4(xg.makeRotationFromEuler(Pn)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,E,b){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*E,m.scale.value=b*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,E){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ee&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const E=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function yg(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,b){const y=b.program;n.uniformBlockBinding(E,y)}function l(E,b){let y=s[E.id];y===void 0&&(g(E),y=h(E),s[E.id]=y,E.addEventListener("dispose",m));const D=b.program;n.updateUBOMapping(E,D);const C=t.render.frame;r[E.id]!==C&&(u(E),r[E.id]=C)}function h(E){const b=d();E.__bindingPointIndex=b;const y=i.createBuffer(),D=E.__size,C=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,D,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,y),y}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){const b=s[E.id],y=E.uniforms,D=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let C=0,A=y.length;C<A;C++){const T=Array.isArray(y[C])?y[C]:[y[C]];for(let x=0,v=T.length;x<v;x++){const R=T[x];if(p(R,C,x,D)===!0){const I=R.__offset,k=Array.isArray(R.value)?R.value:[R.value];let G=0;for(let K=0;K<k.length;K++){const X=k[K],tt=_(X);typeof X=="number"||typeof X=="boolean"?(R.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,I+G,R.__data)):X.isMatrix3?(R.__data[0]=X.elements[0],R.__data[1]=X.elements[1],R.__data[2]=X.elements[2],R.__data[3]=0,R.__data[4]=X.elements[3],R.__data[5]=X.elements[4],R.__data[6]=X.elements[5],R.__data[7]=0,R.__data[8]=X.elements[6],R.__data[9]=X.elements[7],R.__data[10]=X.elements[8],R.__data[11]=0):(X.toArray(R.__data,G),G+=tt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(E,b,y,D){const C=E.value,A=b+"_"+y;if(D[A]===void 0)return typeof C=="number"||typeof C=="boolean"?D[A]=C:D[A]=C.clone(),!0;{const T=D[A];if(typeof C=="number"||typeof C=="boolean"){if(T!==C)return D[A]=C,!0}else if(T.equals(C)===!1)return T.copy(C),!0}return!1}function g(E){const b=E.uniforms;let y=0;const D=16;for(let A=0,T=b.length;A<T;A++){const x=Array.isArray(b[A])?b[A]:[b[A]];for(let v=0,R=x.length;v<R;v++){const I=x[v],k=Array.isArray(I.value)?I.value:[I.value];for(let G=0,K=k.length;G<K;G++){const X=k[G],tt=_(X),q=y%D,st=q%tt.boundary,dt=q+st;y+=st,dt!==0&&D-dt<tt.storage&&(y+=D-dt),I.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=tt.storage}}}const C=y%D;return C>0&&(y+=D-C),E.__size=y,E.__cache={},this}function _(E){const b={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(b.boundary=4,b.storage=4):E.isVector2?(b.boundary=8,b.storage=8):E.isVector3||E.isColor?(b.boundary=16,b.storage=12):E.isVector4?(b.boundary=16,b.storage=16):E.isMatrix3?(b.boundary=48,b.storage=48):E.isMatrix4?(b.boundary=64,b.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),b}function m(E){const b=E.target;b.removeEventListener("dispose",m);const y=o.indexOf(b.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function f(){for(const E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}class Sg{constructor(t={}){const{canvas:e=ld(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const E=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ce,this.toneMapping=yn,this.toneMappingExposure=1;const y=this;let D=!1,C=0,A=0,T=null,x=-1,v=null;const R=new re,I=new re;let k=null;const G=new Ht(0);let K=0,X=e.width,tt=e.height,q=1,st=null,dt=null;const pt=new re(0,0,X,tt),Pt=new re(0,0,X,tt);let Ft=!1;const Y=new zo;let et=!1,gt=!1;const at=new Qt,bt=new Qt,At=new N,Et=new re,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ot=!1;function ee(){return T===null?q:1}let O=n;function Me(S,F){return e.getContext(S,F)}try{const S={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Co}`),e.addEventListener("webglcontextlost",$,!1),e.addEventListener("webglcontextrestored",ht,!1),e.addEventListener("webglcontextcreationerror",lt,!1),O===null){const F="webgl2";if(O=Me(F,S),O===null)throw Me(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Bt,zt,yt,$t,St,w,M,H,P,U,z,Q,J,nt,Rt,Z,rt,mt,Tt,ft,kt,Dt,jt,L;function ct(){Bt=new Ap(O),Bt.init(),Dt=new ug(O,Bt),zt=new yp(O,Bt,t,Dt),yt=new lg(O,Bt),zt.reverseDepthBuffer&&u&&yt.buffers.depth.setReversed(!0),$t=new Pp(O),St=new Ym,w=new dg(O,Bt,yt,St,zt,Dt,$t),M=new bp(y),H=new wp(y),P=new Fd(O),jt=new xp(O,P),U=new Rp(O,P,$t,jt),z=new Lp(O,U,P,$t),Tt=new Dp(O,zt,w),Z=new Sp(St),Q=new jm(y,M,H,Bt,zt,jt,Z),J=new Mg(y,St),nt=new Km,Rt=new ng(Bt),mt=new vp(y,M,H,yt,z,p,c),rt=new ag(y,z,zt),L=new yg(O,$t,zt,yt),ft=new Mp(O,Bt,$t),kt=new Cp(O,Bt,$t),$t.programs=Q.programs,y.capabilities=zt,y.extensions=Bt,y.properties=St,y.renderLists=nt,y.shadowMap=rt,y.state=yt,y.info=$t}ct();const j=new vg(y,O);this.xr=j,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const S=Bt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Bt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(S){S!==void 0&&(q=S,this.setSize(X,tt,!1))},this.getSize=function(S){return S.set(X,tt)},this.setSize=function(S,F,V=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=S,tt=F,e.width=Math.floor(S*q),e.height=Math.floor(F*q),V===!0&&(e.style.width=S+"px",e.style.height=F+"px"),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(X*q,tt*q).floor()},this.setDrawingBufferSize=function(S,F,V){X=S,tt=F,q=V,e.width=Math.floor(S*V),e.height=Math.floor(F*V),this.setViewport(0,0,S,F)},this.getCurrentViewport=function(S){return S.copy(R)},this.getViewport=function(S){return S.copy(pt)},this.setViewport=function(S,F,V,W){S.isVector4?pt.set(S.x,S.y,S.z,S.w):pt.set(S,F,V,W),yt.viewport(R.copy(pt).multiplyScalar(q).round())},this.getScissor=function(S){return S.copy(Pt)},this.setScissor=function(S,F,V,W){S.isVector4?Pt.set(S.x,S.y,S.z,S.w):Pt.set(S,F,V,W),yt.scissor(I.copy(Pt).multiplyScalar(q).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(S){yt.setScissorTest(Ft=S)},this.setOpaqueSort=function(S){st=S},this.setTransparentSort=function(S){dt=S},this.getClearColor=function(S){return S.copy(mt.getClearColor())},this.setClearColor=function(){mt.setClearColor.apply(mt,arguments)},this.getClearAlpha=function(){return mt.getClearAlpha()},this.setClearAlpha=function(){mt.setClearAlpha.apply(mt,arguments)},this.clear=function(S=!0,F=!0,V=!0){let W=0;if(S){let B=!1;if(T!==null){const it=T.texture.format;B=it===Fo||it===No||it===Uo}if(B){const it=T.texture.type,ut=it===cn||it===Bn||it===Hi||it===xi||it===Do||it===Lo,_t=mt.getClearColor(),vt=mt.getClearAlpha(),Ct=_t.r,It=_t.g,xt=_t.b;ut?(g[0]=Ct,g[1]=It,g[2]=xt,g[3]=vt,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=Ct,_[1]=It,_[2]=xt,_[3]=vt,O.clearBufferiv(O.COLOR,0,_))}else W|=O.COLOR_BUFFER_BIT}F&&(W|=O.DEPTH_BUFFER_BIT),V&&(W|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$,!1),e.removeEventListener("webglcontextrestored",ht,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),nt.dispose(),Rt.dispose(),St.dispose(),M.dispose(),H.dispose(),z.dispose(),jt.dispose(),L.dispose(),Q.dispose(),j.dispose(),j.removeEventListener("sessionstart",jo),j.removeEventListener("sessionend",Yo),En.stop()};function $(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ht(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const S=$t.autoReset,F=rt.enabled,V=rt.autoUpdate,W=rt.needsUpdate,B=rt.type;ct(),$t.autoReset=S,rt.enabled=F,rt.autoUpdate=V,rt.needsUpdate=W,rt.type=B}function lt(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Lt(S){const F=S.target;F.removeEventListener("dispose",Lt),se(F)}function se(S){fe(S),St.remove(S)}function fe(S){const F=St.get(S).programs;F!==void 0&&(F.forEach(function(V){Q.releaseProgram(V)}),S.isShaderMaterial&&Q.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,V,W,B,it){F===null&&(F=Jt);const ut=B.isMesh&&B.matrixWorld.determinant()<0,_t=xl(S,F,V,W,B);yt.setMaterial(W,ut);let vt=V.index,Ct=1;if(W.wireframe===!0){if(vt=U.getWireframeAttribute(V),vt===void 0)return;Ct=2}const It=V.drawRange,xt=V.attributes.position;let Vt=It.start*Ct,te=(It.start+It.count)*Ct;it!==null&&(Vt=Math.max(Vt,it.start*Ct),te=Math.min(te,(it.start+it.count)*Ct)),vt!==null?(Vt=Math.max(Vt,0),te=Math.min(te,vt.count)):xt!=null&&(Vt=Math.max(Vt,0),te=Math.min(te,xt.count));const ne=te-Vt;if(ne<0||ne===1/0)return;jt.setup(B,W,_t,V,vt);let ye,Wt=ft;if(vt!==null&&(ye=P.get(vt),Wt=kt,Wt.setIndex(ye)),B.isMesh)W.wireframe===!0?(yt.setLineWidth(W.wireframeLinewidth*ee()),Wt.setMode(O.LINES)):Wt.setMode(O.TRIANGLES);else if(B.isLine){let Mt=W.linewidth;Mt===void 0&&(Mt=1),yt.setLineWidth(Mt*ee()),B.isLineSegments?Wt.setMode(O.LINES):B.isLineLoop?Wt.setMode(O.LINE_LOOP):Wt.setMode(O.LINE_STRIP)}else B.isPoints?Wt.setMode(O.POINTS):B.isSprite&&Wt.setMode(O.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Wt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Bt.get("WEBGL_multi_draw"))Wt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Mt=B._multiDrawStarts,Ke=B._multiDrawCounts,Xt=B._multiDrawCount,Oe=vt?P.get(vt).bytesPerElement:1,Vn=St.get(W).currentProgram.getUniforms();for(let we=0;we<Xt;we++)Vn.setValue(O,"_gl_DrawID",we),Wt.render(Mt[we]/Oe,Ke[we])}else if(B.isInstancedMesh)Wt.renderInstances(Vt,ne,B.count);else if(V.isInstancedBufferGeometry){const Mt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Ke=Math.min(V.instanceCount,Mt);Wt.renderInstances(Vt,ne,Ke)}else Wt.render(Vt,ne)};function Yt(S,F,V){S.transparent===!0&&S.side===He&&S.forceSinglePass===!1?(S.side=Ee,S.needsUpdate=!0,qi(S,F,V),S.side=an,S.needsUpdate=!0,qi(S,F,V),S.side=He):qi(S,F,V)}this.compile=function(S,F,V=null){V===null&&(V=S),f=Rt.get(V),f.init(F),b.push(f),V.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),S!==V&&S.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),f.setupLights();const W=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const it=B.material;if(it)if(Array.isArray(it))for(let ut=0;ut<it.length;ut++){const _t=it[ut];Yt(_t,V,B),W.add(_t)}else Yt(it,V,B),W.add(it)}),b.pop(),f=null,W},this.compileAsync=function(S,F,V=null){const W=this.compile(S,F,V);return new Promise(B=>{function it(){if(W.forEach(function(ut){St.get(ut).currentProgram.isReady()&&W.delete(ut)}),W.size===0){B(S);return}setTimeout(it,10)}Bt.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let Fe=null;function $e(S){Fe&&Fe(S)}function jo(){En.stop()}function Yo(){En.start()}const En=new il;En.setAnimationLoop($e),typeof self<"u"&&En.setContext(self),this.setAnimationLoop=function(S){Fe=S,j.setAnimationLoop(S),S===null?En.stop():En.start()},j.addEventListener("sessionstart",jo),j.addEventListener("sessionend",Yo),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),S.isScene===!0&&S.onBeforeRender(y,S,F,T),f=Rt.get(S,b.length),f.init(F),b.push(f),bt.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Y.setFromProjectionMatrix(bt),gt=this.localClippingEnabled,et=Z.init(this.clippingPlanes,gt),m=nt.get(S,E.length),m.init(),E.push(m),j.enabled===!0&&j.isPresenting===!0){const it=y.xr.getDepthSensingMesh();it!==null&&qs(it,F,-1/0,y.sortObjects)}qs(S,F,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(st,dt),Ot=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Ot&&mt.addToRenderList(m,S),this.info.render.frame++,et===!0&&Z.beginShadows();const V=f.state.shadowsArray;rt.render(V,S,F),et===!0&&Z.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,B=m.transmissive;if(f.setupLights(),F.isArrayCamera){const it=F.cameras;if(B.length>0)for(let ut=0,_t=it.length;ut<_t;ut++){const vt=it[ut];Ko(W,B,S,vt)}Ot&&mt.render(S);for(let ut=0,_t=it.length;ut<_t;ut++){const vt=it[ut];$o(m,S,vt,vt.viewport)}}else B.length>0&&Ko(W,B,S,F),Ot&&mt.render(S),$o(m,S,F);T!==null&&(w.updateMultisampleRenderTarget(T),w.updateRenderTargetMipmap(T)),S.isScene===!0&&S.onAfterRender(y,S,F),jt.resetDefaultState(),x=-1,v=null,b.pop(),b.length>0?(f=b[b.length-1],et===!0&&Z.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function qs(S,F,V,W){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)V=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLight)f.pushLight(S),S.castShadow&&f.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Y.intersectsSprite(S)){W&&Et.setFromMatrixPosition(S.matrixWorld).applyMatrix4(bt);const ut=z.update(S),_t=S.material;_t.visible&&m.push(S,ut,_t,V,Et.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Y.intersectsObject(S))){const ut=z.update(S),_t=S.material;if(W&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Et.copy(S.boundingSphere.center)):(ut.boundingSphere===null&&ut.computeBoundingSphere(),Et.copy(ut.boundingSphere.center)),Et.applyMatrix4(S.matrixWorld).applyMatrix4(bt)),Array.isArray(_t)){const vt=ut.groups;for(let Ct=0,It=vt.length;Ct<It;Ct++){const xt=vt[Ct],Vt=_t[xt.materialIndex];Vt&&Vt.visible&&m.push(S,ut,Vt,V,Et.z,xt)}}else _t.visible&&m.push(S,ut,_t,V,Et.z,null)}}const it=S.children;for(let ut=0,_t=it.length;ut<_t;ut++)qs(it[ut],F,V,W)}function $o(S,F,V,W){const B=S.opaque,it=S.transmissive,ut=S.transparent;f.setupLightsView(V),et===!0&&Z.setGlobalState(y.clippingPlanes,V),W&&yt.viewport(R.copy(W)),B.length>0&&Xi(B,F,V),it.length>0&&Xi(it,F,V),ut.length>0&&Xi(ut,F,V),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function Ko(S,F,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[W.id]===void 0&&(f.state.transmissionRenderTarget[W.id]=new zn(1,1,{generateMipmaps:!0,type:Bt.has("EXT_color_buffer_half_float")||Bt.has("EXT_color_buffer_float")?Wi:cn,minFilter:Fn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Gt.workingColorSpace}));const it=f.state.transmissionRenderTarget[W.id],ut=W.viewport||R;it.setSize(ut.z,ut.w);const _t=y.getRenderTarget();y.setRenderTarget(it),y.getClearColor(G),K=y.getClearAlpha(),K<1&&y.setClearColor(16777215,.5),y.clear(),Ot&&mt.render(V);const vt=y.toneMapping;y.toneMapping=yn;const Ct=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),f.setupLightsView(W),et===!0&&Z.setGlobalState(y.clippingPlanes,W),Xi(S,V,W),w.updateMultisampleRenderTarget(it),w.updateRenderTargetMipmap(it),Bt.has("WEBGL_multisampled_render_to_texture")===!1){let It=!1;for(let xt=0,Vt=F.length;xt<Vt;xt++){const te=F[xt],ne=te.object,ye=te.geometry,Wt=te.material,Mt=te.group;if(Wt.side===He&&ne.layers.test(W.layers)){const Ke=Wt.side;Wt.side=Ee,Wt.needsUpdate=!0,Zo(ne,V,W,ye,Wt,Mt),Wt.side=Ke,Wt.needsUpdate=!0,It=!0}}It===!0&&(w.updateMultisampleRenderTarget(it),w.updateRenderTargetMipmap(it))}y.setRenderTarget(_t),y.setClearColor(G,K),Ct!==void 0&&(W.viewport=Ct),y.toneMapping=vt}function Xi(S,F,V){const W=F.isScene===!0?F.overrideMaterial:null;for(let B=0,it=S.length;B<it;B++){const ut=S[B],_t=ut.object,vt=ut.geometry,Ct=W===null?ut.material:W,It=ut.group;_t.layers.test(V.layers)&&Zo(_t,F,V,vt,Ct,It)}}function Zo(S,F,V,W,B,it){S.onBeforeRender(y,F,V,W,B,it),S.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(y,F,V,W,S,it),B.transparent===!0&&B.side===He&&B.forceSinglePass===!1?(B.side=Ee,B.needsUpdate=!0,y.renderBufferDirect(V,F,W,B,S,it),B.side=an,B.needsUpdate=!0,y.renderBufferDirect(V,F,W,B,S,it),B.side=He):y.renderBufferDirect(V,F,W,B,S,it),S.onAfterRender(y,F,V,W,B,it)}function qi(S,F,V){F.isScene!==!0&&(F=Jt);const W=St.get(S),B=f.state.lights,it=f.state.shadowsArray,ut=B.state.version,_t=Q.getParameters(S,B.state,it,F,V),vt=Q.getProgramCacheKey(_t);let Ct=W.programs;W.environment=S.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(S.isMeshStandardMaterial?H:M).get(S.envMap||W.environment),W.envMapRotation=W.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Ct===void 0&&(S.addEventListener("dispose",Lt),Ct=new Map,W.programs=Ct);let It=Ct.get(vt);if(It!==void 0){if(W.currentProgram===It&&W.lightsStateVersion===ut)return Qo(S,_t),It}else _t.uniforms=Q.getUniforms(S),S.onBeforeCompile(_t,y),It=Q.acquireProgram(_t,vt),Ct.set(vt,It),W.uniforms=_t.uniforms;const xt=W.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(xt.clippingPlanes=Z.uniform),Qo(S,_t),W.needsLights=yl(S),W.lightsStateVersion=ut,W.needsLights&&(xt.ambientLightColor.value=B.state.ambient,xt.lightProbe.value=B.state.probe,xt.directionalLights.value=B.state.directional,xt.directionalLightShadows.value=B.state.directionalShadow,xt.spotLights.value=B.state.spot,xt.spotLightShadows.value=B.state.spotShadow,xt.rectAreaLights.value=B.state.rectArea,xt.ltc_1.value=B.state.rectAreaLTC1,xt.ltc_2.value=B.state.rectAreaLTC2,xt.pointLights.value=B.state.point,xt.pointLightShadows.value=B.state.pointShadow,xt.hemisphereLights.value=B.state.hemi,xt.directionalShadowMap.value=B.state.directionalShadowMap,xt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,xt.spotShadowMap.value=B.state.spotShadowMap,xt.spotLightMatrix.value=B.state.spotLightMatrix,xt.spotLightMap.value=B.state.spotLightMap,xt.pointShadowMap.value=B.state.pointShadowMap,xt.pointShadowMatrix.value=B.state.pointShadowMatrix),W.currentProgram=It,W.uniformsList=null,It}function Jo(S){if(S.uniformsList===null){const F=S.currentProgram.getUniforms();S.uniformsList=Cs.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function Qo(S,F){const V=St.get(S);V.outputColorSpace=F.outputColorSpace,V.batching=F.batching,V.batchingColor=F.batchingColor,V.instancing=F.instancing,V.instancingColor=F.instancingColor,V.instancingMorph=F.instancingMorph,V.skinning=F.skinning,V.morphTargets=F.morphTargets,V.morphNormals=F.morphNormals,V.morphColors=F.morphColors,V.morphTargetsCount=F.morphTargetsCount,V.numClippingPlanes=F.numClippingPlanes,V.numIntersection=F.numClipIntersection,V.vertexAlphas=F.vertexAlphas,V.vertexTangents=F.vertexTangents,V.toneMapping=F.toneMapping}function xl(S,F,V,W,B){F.isScene!==!0&&(F=Jt),w.resetTextureUnits();const it=F.fog,ut=W.isMeshStandardMaterial?F.environment:null,_t=T===null?y.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Si,vt=(W.isMeshStandardMaterial?H:M).get(W.envMap||ut),Ct=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,It=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),xt=!!V.morphAttributes.position,Vt=!!V.morphAttributes.normal,te=!!V.morphAttributes.color;let ne=yn;W.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ne=y.toneMapping);const ye=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Wt=ye!==void 0?ye.length:0,Mt=St.get(W),Ke=f.state.lights;if(et===!0&&(gt===!0||S!==v)){const De=S===v&&W.id===x;Z.setState(W,S,De)}let Xt=!1;W.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==Ke.state.version||Mt.outputColorSpace!==_t||B.isBatchedMesh&&Mt.batching===!1||!B.isBatchedMesh&&Mt.batching===!0||B.isBatchedMesh&&Mt.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Mt.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Mt.instancing===!1||!B.isInstancedMesh&&Mt.instancing===!0||B.isSkinnedMesh&&Mt.skinning===!1||!B.isSkinnedMesh&&Mt.skinning===!0||B.isInstancedMesh&&Mt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Mt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Mt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Mt.instancingMorph===!1&&B.morphTexture!==null||Mt.envMap!==vt||W.fog===!0&&Mt.fog!==it||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==Z.numPlanes||Mt.numIntersection!==Z.numIntersection)||Mt.vertexAlphas!==Ct||Mt.vertexTangents!==It||Mt.morphTargets!==xt||Mt.morphNormals!==Vt||Mt.morphColors!==te||Mt.toneMapping!==ne||Mt.morphTargetsCount!==Wt)&&(Xt=!0):(Xt=!0,Mt.__version=W.version);let Oe=Mt.currentProgram;Xt===!0&&(Oe=qi(W,F,B));let Vn=!1,we=!1,Ai=!1;const ie=Oe.getUniforms(),We=Mt.uniforms;if(yt.useProgram(Oe.program)&&(Vn=!0,we=!0,Ai=!0),W.id!==x&&(x=W.id,we=!0),Vn||v!==S){yt.buffers.depth.getReversed()?(at.copy(S.projectionMatrix),dd(at),ud(at),ie.setValue(O,"projectionMatrix",at)):ie.setValue(O,"projectionMatrix",S.projectionMatrix),ie.setValue(O,"viewMatrix",S.matrixWorldInverse);const hn=ie.map.cameraPosition;hn!==void 0&&hn.setValue(O,At.setFromMatrixPosition(S.matrixWorld)),zt.logarithmicDepthBuffer&&ie.setValue(O,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ie.setValue(O,"isOrthographic",S.isOrthographicCamera===!0),v!==S&&(v=S,we=!0,Ai=!0)}if(B.isSkinnedMesh){ie.setOptional(O,B,"bindMatrix"),ie.setOptional(O,B,"bindMatrixInverse");const De=B.skeleton;De&&(De.boneTexture===null&&De.computeBoneTexture(),ie.setValue(O,"boneTexture",De.boneTexture,w))}B.isBatchedMesh&&(ie.setOptional(O,B,"batchingTexture"),ie.setValue(O,"batchingTexture",B._matricesTexture,w),ie.setOptional(O,B,"batchingIdTexture"),ie.setValue(O,"batchingIdTexture",B._indirectTexture,w),ie.setOptional(O,B,"batchingColorTexture"),B._colorsTexture!==null&&ie.setValue(O,"batchingColorTexture",B._colorsTexture,w));const Ri=V.morphAttributes;if((Ri.position!==void 0||Ri.normal!==void 0||Ri.color!==void 0)&&Tt.update(B,V,Oe),(we||Mt.receiveShadow!==B.receiveShadow)&&(Mt.receiveShadow=B.receiveShadow,ie.setValue(O,"receiveShadow",B.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(We.envMap.value=vt,We.flipEnvMap.value=vt.isCubeTexture&&vt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(We.envMapIntensity.value=F.environmentIntensity),we&&(ie.setValue(O,"toneMappingExposure",y.toneMappingExposure),Mt.needsLights&&Ml(We,Ai),it&&W.fog===!0&&J.refreshFogUniforms(We,it),J.refreshMaterialUniforms(We,W,q,tt,f.state.transmissionRenderTarget[S.id]),Cs.upload(O,Jo(Mt),We,w)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Cs.upload(O,Jo(Mt),We,w),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ie.setValue(O,"center",B.center),ie.setValue(O,"modelViewMatrix",B.modelViewMatrix),ie.setValue(O,"normalMatrix",B.normalMatrix),ie.setValue(O,"modelMatrix",B.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const De=W.uniformsGroups;for(let hn=0,dn=De.length;hn<dn;hn++){const ta=De[hn];L.update(ta,Oe),L.bind(ta,Oe)}}return Oe}function Ml(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function yl(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(S,F,V){St.get(S.texture).__webglTexture=F,St.get(S.depthTexture).__webglTexture=V;const W=St.get(S);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||Bt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,F){const V=St.get(S);V.__webglFramebuffer=F,V.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(S,F=0,V=0){T=S,C=F,A=V;let W=!0,B=null,it=!1,ut=!1;if(S){const vt=St.get(S);if(vt.__useDefaultFramebuffer!==void 0)yt.bindFramebuffer(O.FRAMEBUFFER,null),W=!1;else if(vt.__webglFramebuffer===void 0)w.setupRenderTarget(S);else if(vt.__hasExternalTextures)w.rebindTextures(S,St.get(S.texture).__webglTexture,St.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const xt=S.depthTexture;if(vt.__boundDepthTexture!==xt){if(xt!==null&&St.has(xt)&&(S.width!==xt.image.width||S.height!==xt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(S)}}const Ct=S.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(ut=!0);const It=St.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(It[F])?B=It[F][V]:B=It[F],it=!0):S.samples>0&&w.useMultisampledRTT(S)===!1?B=St.get(S).__webglMultisampledFramebuffer:Array.isArray(It)?B=It[V]:B=It,R.copy(S.viewport),I.copy(S.scissor),k=S.scissorTest}else R.copy(pt).multiplyScalar(q).floor(),I.copy(Pt).multiplyScalar(q).floor(),k=Ft;if(yt.bindFramebuffer(O.FRAMEBUFFER,B)&&W&&yt.drawBuffers(S,B),yt.viewport(R),yt.scissor(I),yt.setScissorTest(k),it){const vt=St.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,vt.__webglTexture,V)}else if(ut){const vt=St.get(S.texture),Ct=F||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,vt.__webglTexture,V||0,Ct)}x=-1},this.readRenderTargetPixels=function(S,F,V,W,B,it,ut){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=St.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ut!==void 0&&(_t=_t[ut]),_t){yt.bindFramebuffer(O.FRAMEBUFFER,_t);try{const vt=S.texture,Ct=vt.format,It=vt.type;if(!zt.textureFormatReadable(Ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!zt.textureTypeReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-W&&V>=0&&V<=S.height-B&&O.readPixels(F,V,W,B,Dt.convert(Ct),Dt.convert(It),it)}finally{const vt=T!==null?St.get(T).__webglFramebuffer:null;yt.bindFramebuffer(O.FRAMEBUFFER,vt)}}},this.readRenderTargetPixelsAsync=async function(S,F,V,W,B,it,ut){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=St.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ut!==void 0&&(_t=_t[ut]),_t){const vt=S.texture,Ct=vt.format,It=vt.type;if(!zt.textureFormatReadable(Ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!zt.textureTypeReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=S.width-W&&V>=0&&V<=S.height-B){yt.bindFramebuffer(O.FRAMEBUFFER,_t);const xt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,xt),O.bufferData(O.PIXEL_PACK_BUFFER,it.byteLength,O.STREAM_READ),O.readPixels(F,V,W,B,Dt.convert(Ct),Dt.convert(It),0);const Vt=T!==null?St.get(T).__webglFramebuffer:null;yt.bindFramebuffer(O.FRAMEBUFFER,Vt);const te=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await hd(O,te,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,xt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,it),O.deleteBuffer(xt),O.deleteSync(te),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,F=null,V=0){S.isTexture!==!0&&(Oi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,S=arguments[1]);const W=Math.pow(2,-V),B=Math.floor(S.image.width*W),it=Math.floor(S.image.height*W),ut=F!==null?F.x:0,_t=F!==null?F.y:0;w.setTexture2D(S,0),O.copyTexSubImage2D(O.TEXTURE_2D,V,0,0,ut,_t,B,it),yt.unbindTexture()},this.copyTextureToTexture=function(S,F,V=null,W=null,B=0){S.isTexture!==!0&&(Oi("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,S=arguments[1],F=arguments[2],B=arguments[3]||0,V=null);let it,ut,_t,vt,Ct,It,xt,Vt,te;const ne=S.isCompressedTexture?S.mipmaps[B]:S.image;V!==null?(it=V.max.x-V.min.x,ut=V.max.y-V.min.y,_t=V.isBox3?V.max.z-V.min.z:1,vt=V.min.x,Ct=V.min.y,It=V.isBox3?V.min.z:0):(it=ne.width,ut=ne.height,_t=ne.depth||1,vt=0,Ct=0,It=0),W!==null?(xt=W.x,Vt=W.y,te=W.z):(xt=0,Vt=0,te=0);const ye=Dt.convert(F.format),Wt=Dt.convert(F.type);let Mt;F.isData3DTexture?(w.setTexture3D(F,0),Mt=O.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(w.setTexture2DArray(F,0),Mt=O.TEXTURE_2D_ARRAY):(w.setTexture2D(F,0),Mt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,F.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,F.unpackAlignment);const Ke=O.getParameter(O.UNPACK_ROW_LENGTH),Xt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Oe=O.getParameter(O.UNPACK_SKIP_PIXELS),Vn=O.getParameter(O.UNPACK_SKIP_ROWS),we=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,ne.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ne.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,vt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ct),O.pixelStorei(O.UNPACK_SKIP_IMAGES,It);const Ai=S.isDataArrayTexture||S.isData3DTexture,ie=F.isDataArrayTexture||F.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){const We=St.get(S),Ri=St.get(F),De=St.get(We.__renderTarget),hn=St.get(Ri.__renderTarget);yt.bindFramebuffer(O.READ_FRAMEBUFFER,De.__webglFramebuffer),yt.bindFramebuffer(O.DRAW_FRAMEBUFFER,hn.__webglFramebuffer);for(let dn=0;dn<_t;dn++)Ai&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,St.get(S).__webglTexture,B,It+dn),S.isDepthTexture?(ie&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,St.get(F).__webglTexture,B,te+dn),O.blitFramebuffer(vt,Ct,it,ut,xt,Vt,it,ut,O.DEPTH_BUFFER_BIT,O.NEAREST)):ie?O.copyTexSubImage3D(Mt,B,xt,Vt,te+dn,vt,Ct,it,ut):O.copyTexSubImage2D(Mt,B,xt,Vt,te+dn,vt,Ct,it,ut);yt.bindFramebuffer(O.READ_FRAMEBUFFER,null),yt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else ie?S.isDataTexture||S.isData3DTexture?O.texSubImage3D(Mt,B,xt,Vt,te,it,ut,_t,ye,Wt,ne.data):F.isCompressedArrayTexture?O.compressedTexSubImage3D(Mt,B,xt,Vt,te,it,ut,_t,ye,ne.data):O.texSubImage3D(Mt,B,xt,Vt,te,it,ut,_t,ye,Wt,ne):S.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,B,xt,Vt,it,ut,ye,Wt,ne.data):S.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,B,xt,Vt,ne.width,ne.height,ye,ne.data):O.texSubImage2D(O.TEXTURE_2D,B,xt,Vt,it,ut,ye,Wt,ne);O.pixelStorei(O.UNPACK_ROW_LENGTH,Ke),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Xt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Oe),O.pixelStorei(O.UNPACK_SKIP_ROWS,Vn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,we),B===0&&F.generateMipmaps&&O.generateMipmap(Mt),yt.unbindTexture()},this.copyTextureToTexture3D=function(S,F,V=null,W=null,B=0){return S.isTexture!==!0&&(Oi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,W=arguments[1]||null,S=arguments[2],F=arguments[3],B=arguments[4]||0),Oi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,F,V,W,B)},this.initRenderTarget=function(S){St.get(S).__webglFramebuffer===void 0&&w.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?w.setTextureCube(S,0):S.isData3DTexture?w.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?w.setTexture2DArray(S,0):w.setTexture2D(S,0),yt.unbindTexture()},this.resetState=function(){C=0,A=0,T=null,yt.reset(),jt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Gt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Gt._getUnpackColorSpace()}}class bg extends ae{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new je,this.environmentIntensity=1,this.environmentRotation=new je,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class hl extends xe{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Pe,h=Pe,d,u){super(null,o,a,c,l,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class oc extends Ve{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ri=new Qt,ac=new Qt,ms=[],cc=new ln,Eg=new Qt,Ui=new be,Ni=new Ei;class Mo extends be{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new oc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Eg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ln),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ri),cc.copy(t.boundingBox).applyMatrix4(ri),this.boundingBox.union(cc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ei),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ri),Ni.copy(t.boundingSphere).applyMatrix4(ri),this.boundingSphere.union(Ni)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Ui.geometry=this.geometry,Ui.material=this.material,Ui.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ni.copy(this.boundingSphere),Ni.applyMatrix4(n),t.ray.intersectsSphere(Ni)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ri),ac.multiplyMatrices(n,ri),Ui.matrixWorld=ac,Ui.raycast(t,ms);for(let o=0,a=ms.length;o<a;o++){const c=ms[o];c.instanceId=r,c.object=this,e.push(c)}ms.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new oc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new hl(new Float32Array(s*this.count),s,this.count,Io,qe));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ns extends Ti{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Ht(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Fs=new N,Os=new N,lc=new Qt,Fi=new Vs,gs=new Ei,yr=new N,hc=new N;class dl extends ae{constructor(t=new Te,e=new Ns){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Fs.fromBufferAttribute(e,s-1),Os.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Fs.distanceTo(Os);t.setAttribute("lineDistance",new ce(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),gs.copy(n.boundingSphere),gs.applyMatrix4(s),gs.radius+=r,t.ray.intersectsSphere(gs)===!1)return;lc.copy(s).invert(),Fi.copy(t.ray).applyMatrix4(lc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=l){const f=h.getX(_),E=h.getX(_+1),b=_s(this,t,Fi,c,f,E);b&&e.push(b)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(p),f=_s(this,t,Fi,c,_,m);f&&e.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=l){const f=_s(this,t,Fi,c,_,_+1);f&&e.push(f)}if(this.isLineLoop){const _=_s(this,t,Fi,c,g-1,p);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function _s(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(Fs.fromBufferAttribute(o,s),Os.fromBufferAttribute(o,r),e.distanceSqToSegment(Fs,Os,yr,hc)>n)return;yr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(yr);if(!(c<t.near||c>t.far))return{distance:c,point:hc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const dc=new N,uc=new N;class ul extends dl{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)dc.fromBufferAttribute(e,s),uc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+dc.distanceTo(uc);t.setAttribute("lineDistance",new ce(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Xs extends Te{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],p=[];let g=0;const _=[],m=n/2;let f=0;E(),o===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new ce(d,3)),this.setAttribute("normal",new ce(u,3)),this.setAttribute("uv",new ce(p,2));function E(){const y=new N,D=new N;let C=0;const A=(e-t)/n;for(let T=0;T<=r;T++){const x=[],v=T/r,R=v*(e-t)+t;for(let I=0;I<=s;I++){const k=I/s,G=k*c+a,K=Math.sin(G),X=Math.cos(G);D.x=R*K,D.y=-v*n+m,D.z=R*X,d.push(D.x,D.y,D.z),y.set(K,A,X).normalize(),u.push(y.x,y.y,y.z),p.push(k,1-v),x.push(g++)}_.push(x)}for(let T=0;T<s;T++)for(let x=0;x<r;x++){const v=_[x][T],R=_[x+1][T],I=_[x+1][T+1],k=_[x][T+1];(t>0||x!==0)&&(h.push(v,R,k),C+=3),(e>0||x!==r-1)&&(h.push(R,I,k),C+=3)}l.addGroup(f,C,0),f+=C}function b(y){const D=g,C=new wt,A=new N;let T=0;const x=y===!0?t:e,v=y===!0?1:-1;for(let I=1;I<=s;I++)d.push(0,m*v,0),u.push(0,v,0),p.push(.5,.5),g++;const R=g;for(let I=0;I<=s;I++){const G=I/s*c+a,K=Math.cos(G),X=Math.sin(G);A.x=x*X,A.y=m*v,A.z=x*K,d.push(A.x,A.y,A.z),u.push(0,v,0),C.x=K*.5+.5,C.y=X*.5*v+.5,p.push(C.x,C.y),g++}for(let I=0;I<s;I++){const k=D+I,G=R+I;y===!0?h.push(G,G+1,k):h.push(G+1,G,k),T+=3}l.addGroup(f,T,y===!0?1:2),f+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ho extends Xs{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ho(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Go extends Te{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new ce(r,3)),this.setAttribute("normal",new ce(r.slice(),3)),this.setAttribute("uv",new ce(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(E){const b=new N,y=new N,D=new N;for(let C=0;C<e.length;C+=3)p(e[C+0],b),p(e[C+1],y),p(e[C+2],D),c(b,y,D,E)}function c(E,b,y,D){const C=D+1,A=[];for(let T=0;T<=C;T++){A[T]=[];const x=E.clone().lerp(y,T/C),v=b.clone().lerp(y,T/C),R=C-T;for(let I=0;I<=R;I++)I===0&&T===C?A[T][I]=x:A[T][I]=x.clone().lerp(v,I/R)}for(let T=0;T<C;T++)for(let x=0;x<2*(C-T)-1;x++){const v=Math.floor(x/2);x%2===0?(u(A[T][v+1]),u(A[T+1][v]),u(A[T][v])):(u(A[T][v+1]),u(A[T+1][v+1]),u(A[T+1][v]))}}function l(E){const b=new N;for(let y=0;y<r.length;y+=3)b.x=r[y+0],b.y=r[y+1],b.z=r[y+2],b.normalize().multiplyScalar(E),r[y+0]=b.x,r[y+1]=b.y,r[y+2]=b.z}function h(){const E=new N;for(let b=0;b<r.length;b+=3){E.x=r[b+0],E.y=r[b+1],E.z=r[b+2];const y=m(E)/2/Math.PI+.5,D=f(E)/Math.PI+.5;o.push(y,1-D)}g(),d()}function d(){for(let E=0;E<o.length;E+=6){const b=o[E+0],y=o[E+2],D=o[E+4],C=Math.max(b,y,D),A=Math.min(b,y,D);C>.9&&A<.1&&(b<.2&&(o[E+0]+=1),y<.2&&(o[E+2]+=1),D<.2&&(o[E+4]+=1))}}function u(E){r.push(E.x,E.y,E.z)}function p(E,b){const y=E*3;b.x=t[y+0],b.y=t[y+1],b.z=t[y+2]}function g(){const E=new N,b=new N,y=new N,D=new N,C=new wt,A=new wt,T=new wt;for(let x=0,v=0;x<r.length;x+=9,v+=6){E.set(r[x+0],r[x+1],r[x+2]),b.set(r[x+3],r[x+4],r[x+5]),y.set(r[x+6],r[x+7],r[x+8]),C.set(o[v+0],o[v+1]),A.set(o[v+2],o[v+3]),T.set(o[v+4],o[v+5]),D.copy(E).add(b).add(y).divideScalar(3);const R=m(D);_(C,v+0,E,R),_(A,v+2,b,R),_(T,v+4,y,R)}}function _(E,b,y,D){D<0&&E.x===1&&(o[b]=E.x-1),y.x===0&&y.z===0&&(o[b]=D/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function f(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Go(t.vertices,t.indices,t.radius,t.details)}}const vs=new N,xs=new N,Sr=new N,Ms=new Ue;class fl extends Te{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(pi*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],d=new Array(3),u={},p=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:f}=Ms;if(_.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),f.fromBufferAttribute(a,l[2]),Ms.getNormal(Sr),d[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,d[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,d[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let E=0;E<3;E++){const b=(E+1)%3,y=d[E],D=d[b],C=Ms[h[E]],A=Ms[h[b]],T=`${y}_${D}`,x=`${D}_${y}`;x in u&&u[x]?(Sr.dot(u[x].normal)<=r&&(p.push(C.x,C.y,C.z),p.push(A.x,A.y,A.z)),u[x]=null):T in u||(u[T]={index0:l[E],index1:l[b],normal:Sr.clone()})}}for(const g in u)if(u[g]){const{index0:_,index1:m}=u[g];vs.fromBufferAttribute(a,_),xs.fromBufferAttribute(a,m),p.push(vs.x,vs.y,vs.z),p.push(xs.x,xs.y,xs.z)}this.setAttribute("position",new ce(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Vo extends Go{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Vo(t.radius,t.detail)}}class Wo extends Te{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let d=t;const u=(e-t)/s,p=new N,g=new wt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const f=r+m/n*o;p.x=d*Math.cos(f),p.y=d*Math.sin(f),c.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}d+=u}for(let _=0;_<s;_++){const m=_*(n+1);for(let f=0;f<n;f++){const E=f+m,b=E,y=E+n+1,D=E+n+2,C=E+1;a.push(b,y,C),a.push(y,D,C)}}this.setIndex(a),this.setAttribute("position",new ce(c,3)),this.setAttribute("normal",new ce(l,3)),this.setAttribute("uv",new ce(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wo(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class pl extends Ti{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qc,this.normalScale=new wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new je,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ml extends ae{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Tg extends ml{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ae.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const br=new Qt,fc=new N,pc=new N;class wg{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zo,this._frameExtents=new wt(1,1),this._viewportCount=1,this._viewports=[new re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;fc.setFromMatrixPosition(t.matrixWorld),e.position.copy(fc),pc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(pc),e.updateMatrixWorld(),br.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(br),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(br)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Ag extends wg{constructor(){super(new sl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Rg extends ml{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ae.DEFAULT_UP),this.updateMatrix(),this.target=new ae,this.shadow=new Ag}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const mc=new Qt;class gl{constructor(t,e,n=0,s=1/0){this.ray=new Vs(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Bo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return mc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(mc),this}intersectObject(t,e=!0,n=[]){return yo(t,this,n,e),n.sort(gc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)yo(t[s],this,n,e);return n.sort(gc),n}}function gc(i,t){return i.distance-t.distance}function yo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)yo(r[o],t,e,!0)}}class _c{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(ge(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Cg extends Gn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Co}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Co);function Pg({engine:i,panel:t,model:e,setMode:n,rebuild:s,tell:r,getMode:o}){const a=document.createElement("div");a.id="advanced-editor",a.innerHTML=`
 <details>

  <summary>Asset library</summary>

  <div id="asset-groups"></div>

 </details>

 <details>

  <summary>Group editing</summary>

  <div class="advanced-grid">

   <button id="group-select">Multi-select</button>

   <button id="group-move">Move group</button>

   <button id="group-delete">Delete group</button>

   <button id="group-clear">Clear selection</button>

  </div>

  <small id="group-count">0 selected</small>

 </details>

 <details>

  <summary>Spatial tools</summary>

  <div class="advanced-grid">

   <button id="measure-distance">Distance</button>

   <button id="measure-area">Area</button>

   <button id="clear-measurement">Clear</button>

  </div>

  <div id="measurement-result">
   Select a measurement tool.
  </div>

  <small id="cursor-coordinates"></small>

 </details>

 <details>

  <summary>Display layers</summary>

  <div id="editor-layers"></div>

 </details>`,t.querySelector("#construction-tools").append(a);const c=A=>a.querySelector("#"+A),l=new Set,h=[],d={buildings:!0,roads:!0,bridges:!0,parks:!0,trees:!0,parcels:!0},u=i.view.scene,p=new hi;u.add(p);const g=new Ns({color:"#f2b85b",depthTest:!1,transparent:!0,opacity:1}),_=new Ns({color:"#fff1ba",depthTest:!1});function m(){for(const A of[...p.children])p.remove(A),A.geometry.dispose()}function f(){m();for(const A of[...l]){const T=e.find(A);if(!T){l.delete(A);continue}if(d[T.key]===!1)continue;const x=T.object,v=x.dimensions,R=T.key==="trees",I=new Ye(v.width*(R?2:1)+4,v.height+10,v.depth*(R?2:1)+4),k=new fl(I);I.dispose();const G=new ul(k,g);G.position.set(x.position.x,4+v.height/2,x.position.z),G.renderOrder=60,p.add(G)}if(h.length){const A=[...h];o()==="measure-area"&&h.length>2&&A.push(h[0]);const T=new Te().setFromPoints(A.map(v=>new N(v[0],38,v[1]))),x=new dl(T,_);x.renderOrder=70,p.add(x)}c("group-count").textContent=l.size+" selected",i.invalidate()}function E(){l.clear(),f()}function b(){h.length=0,c("measurement-result").textContent="Click points to measure.",f()}for(const[A,T]of Object.entries(Il)){const x=document.createElement("details"),v=document.createElement("summary");v.textContent=A;const R=document.createElement("div");R.className="advanced-grid";for(const[I,k]of T){const G=document.createElement("button");G.textContent=k,G.dataset.asset=I,G.onclick=()=>{n(I),r("Click land to place "+k+".")},R.append(G)}x.append(v,R),c("asset-groups").append(x)}for(const A of Object.keys(d)){const T=document.createElement("label"),x=document.createElement("input");x.type="checkbox",x.checked=!0,x.onchange=()=>{d[A]=x.checked,s(),f()};const v=document.createElement("span");v.textContent=A[0].toUpperCase()+A.slice(1),T.append(x,v),c("editor-layers").append(T)}c("group-select").onclick=()=>{n("multi-select"),r("Click objects to add or remove them.")},c("group-clear").onclick=E,c("group-move").onclick=()=>{if(!l.size){r("Select objects first.",!0);return}n("group-move"),r("Click the new position of the first selected object.")},c("group-delete").onclick=()=>{if(!l.size){r("Select objects first.",!0);return}const A=e.groupEdit([...l],"delete");if(A){r(A,!0);return}l.clear(),s(),f(),r("Selected objects deleted.")},c("measure-distance").onclick=()=>{n("measure-distance"),b()},c("measure-area").onclick=()=>{n("measure-area"),b()},c("clear-measurement").onclick=b;function y(A,T){const x=o();if(x==="multi-select"){if(T){const v=e.find(T.id);v&&v.key!=="roads"&&d[v.key]!==!1&&(l.has(T.id)?l.delete(T.id):l.add(T.id))}return f(),!0}if(x==="group-move"){const v=[...l][0],R=e.find(v);if(!R)return E(),!0;const I=Math.round(A.x/5)*5,k=Math.round(A.z/5)*5,G=e.groupEdit([...l],"move",I-R.object.position.x,k-R.object.position.z);return G?(r(G,!0),!0):(s(),f(),n("multi-select"),r("Group moved."),!0)}if(x==="measure-distance"||x==="measure-area"){h.push([A.x,A.z]);const v=Jl(h),R=Ql(h);return c("measurement-result").textContent=x==="measure-area"?R.toFixed(1)+" m²":v.toFixed(1)+" m",f(),!0}return!1}function D(A){const T=c("cursor-coordinates");T.offsetParent&&(T.textContent="X "+A.x.toFixed(1)+" · Z "+A.z.toFixed(1)+" m")}function C(){m(),u.remove(p),g.dispose(),_.dispose(),a.remove()}return{layers:d,handleClick:y,coordinates:D,redraw:f,visibleState:()=>th(i.state,d),dispose:C}}class So{constructor(t,e){this.view=t,this.onSelect=e,this.raycaster=new gl,this.pointers=new Set,this.hitPoint=new N,this.targets=t.state.buildings.map(s=>{const{x:r,z:o}=s.position,{width:a,depth:c,height:l}=s.dimensions;return{building:s,bounds:new ln(new N(r-a/2-2,3,o-c/2-2),new N(r+a/2+2,l+(s.type==="house"?13:9),o+c/2+3))}});const n=t.renderer.domElement;this.down=s=>{this.pointers.add(s.pointerId),this.pointers.size>1?this.cancelled=!0:(this.start={x:s.clientX,y:s.clientY},this.cancelled=s.button!==0||s.shiftKey||s.ctrlKey||s.metaKey||s.altKey)},this.move=s=>{this.start&&Math.hypot(s.clientX-this.start.x,s.clientY-this.start.y)>5&&(this.cancelled=!0)},this.up=s=>{this.pointers.delete(s.pointerId);const r=this.start;if(this.pointers.size===0&&(this.start=null),s.button!==0||this.cancelled||!r)return;const o=n.getBoundingClientRect();if(o.width<=0||o.height<=0)return;t.camera.updateMatrixWorld(),this.raycaster.setFromCamera(new wt((s.clientX-o.left)/o.width*2-1,-(s.clientY-o.top)/o.height*2+1),t.camera);let a,c=1/0;for(const l of this.targets)if(this.raycaster.ray.intersectBox(l.bounds,this.hitPoint)){const h=this.hitPoint.distanceToSquared(this.raycaster.ray.origin);h<c&&(c=h,a=l.building)}t.highlight(a),e(a)},this.cancel=()=>{this.cancelled=!0,this.start=null,this.pointers.clear()},this.handlers={pointerdown:this.down,pointermove:this.move,pointerup:this.up,pointercancel:this.cancel};for(const[s,r]of Object.entries(this.handlers))n.addEventListener(s,r)}dispose(){for(const[t,e]of Object.entries(this.handlers))this.view.renderer.domElement.removeEventListener(t,e)}}function Dg(i){const t=i.view;Ar(i.state,2400);const e=new eh(i.state),n=t.renderer.domElement,s=i.selection.onSelect;let r="inspect",o=null,a=null,c=null,l=null,h=14,d=40,u=!1,p=60,g=null,_=!0;const m=new Set,f=new gl,E=new sn(new N(0,1,0),-4.5),b=new N,y=new be(new Ye(1,1,1),new On({color:"#39ae66",transparent:!0,opacity:.45,depthWrite:!1}));y.visible=!1,y.renderOrder=10,t.scene.add(y);const D=document.createElement("section");D.id="construction-panel",D.innerHTML=`
 <div class="construction-heading">
  <strong>EDIT THE CITY</strong>
  <button id="construction-toggle"
   aria-expanded="false">Edit</button>
 </div>

 <div id="construction-tools" hidden>

  <div class="construction-grid"></div>

  <div id="object-properties" hidden>

   <strong id="object-title">Object</strong>

   <div class="object-fields">

    <label>X
     <input data-property="x"
      type="number" step="5">
    </label>

    <label>Z
     <input data-property="z"
      type="number" step="5">
    </label>

    <label>Width
     <input data-property="width"
      type="number" min="2">
    </label>

    <label>Depth
     <input data-property="depth"
      type="number" min="2">
    </label>

    <label>Height
     <input data-property="height"
      type="number" min="1">
    </label>

    <label>Colour
     <input data-property="color"
      type="color">
    </label>

    <label class="full-property">
     District
     <input data-property="district"
      type="text" maxlength="80">
    </label>

   </div>

   <div class="object-actions">

    <button data-edit="apply">
     Apply changes
    </button>

    <button data-edit="rotate">
     Rotate 90°
    </button>

    <button data-edit="move">
     Move
    </button>

    <button data-edit="duplicate">
     Duplicate
    </button>

    <button data-edit="widen" hidden>

     Change road width

    </button>

    <button data-edit="delete">
     Delete
    </button>

   </div>

  </div>

  <div id="world-controls">

   <small id="world-size"></small>

   <button id="expand-world">
    Expand workspace
   </button>

  </div>

  <div id="landscape-tools">

   <details>

    <summary>Terrain &amp; landscaping</summary>

    <div class="landscape-grid">

     <button data-land="raise-land">
      Raise
     </button>

     <button data-land="lower-land">
      Lower
     </button>

     <button data-land="flatten-land">
      Flatten
     </button>

     <button data-land="pond">
      Pond
     </button>

     <button data-land="paint-trees">
      Plant trees
     </button>

     <button data-land="clear-trees">
      Clear trees
     </button>

    </div>

   </details>

   <details>

    <summary>Land parcels</summary>

    <div class="landscape-grid">

     <button data-land="residential-land">
      Residential
     </button>

     <button data-land="commercial-land">
      Commercial
     </button>

     <button data-land="public-land">
      Public
     </button>

     <button data-land="clear-parcel">
      Clear parcel
     </button>

    </div>

   </details>

   <div id="landscape-brush" hidden>

    <label>

     Brush size

     <select id="brush-size">

      <option value="20">
       Small
      </option>

      <option value="40" selected>
       Medium
      </option>

      <option value="80">
       Large
      </option>

      <option value="120">
       Extra large
      </option>

     </select>

    </label>

   </div>

  </div>

  <div id="path-road-options" hidden>

   <label>

    Road width

    <select id="path-road-width">

     <option value="10">10 m</option>

     <option value="14" selected>14 m</option>

     <option value="20">20 m</option>

     <option value="28">28 m</option>

    </select>

   </label>

   <button id="cancel-path">
    Cancel drawing
   </button>

  </div>

  <div id="road-options" hidden>

   <label>
    Road length
    <select id="road-length">
     <option value="40">40 m</option>
     <option value="60" selected>60 m</option>
     <option value="100">100 m</option>
    </select>
   </label>

   <button data-action="rotate">Rotate</button>

  </div>

  <div class="construction-actions">
   <button data-action="undo">Undo</button>
   <button data-action="redo">Redo</button>
  </div>

  <div class="construction-stats"></div>

  <p id="construction-message" role="status">
   Choose a construction tool.
  </p>

 </div>`,document.body.append(D);const C=D.querySelector(".construction-grid"),A=D.querySelector("#construction-tools"),T=D.querySelector("#construction-message"),x=D.querySelector(".construction-stats"),v=D.querySelector("#road-options"),R=[["inspect","Inspect"],["edit","Select object"],["tree","Tree"],["house","House"],["apartment","Apartment"],["commercial","Commercial"],["office","Office"],["hospital","Hospital"],["school","School"],["civic","Civic"],["park","Park"],["road","Road segment"],["draw-road","Draw road"],["curve-road","Curve"],["draw-bridge","Bridge"],["demolish","Demolish"],["upgrade","Upgrade"]];function I(P,U=!1){T.textContent=P,T.dataset.error=String(U)}function k(){const P=i.state;D.querySelector("#world-size").textContent=P.boundary+" × "+P.boundary+" m",D.querySelector("#expand-world").disabled=P.boundary>=3600,x.textContent=P.buildings.length+" buildings · "+P.roads.length+" roads · "+P.parks.length+" parks",document.querySelector("#building-count").textContent=P.buildings.length+" buildings",document.querySelector("#district-count").textContent=new Set([...P.buildings,...P.parks].map(U=>U.district)).size+" districts",D.querySelector('[data-action="undo"]').disabled=!e.undoStack.length,D.querySelector('[data-action="redo"]').disabled=!e.redoStack.length}function G(P){r=P,D.querySelector("#landscape-brush").hidden=!Ss.includes(r),D.querySelectorAll("[data-land]").forEach(U=>U.setAttribute("aria-pressed",String(U.dataset.land===r))),c=null,l=null,Ft(),tt(),D.querySelector("#path-road-options").hidden=!Pt(),["edit","move","duplicate"].includes(r)||(o=null,D.querySelector("#object-properties").hidden=!0),y.visible=!1,g=null,m.clear(),_&&r!=="inspect"?(i.selection.dispose(),_=!1):!_&&r==="inspect"&&(i.selection=new So(t,s),_=!0),t.highlight(null),s(null),C.querySelectorAll("button").forEach(U=>U.setAttribute("aria-pressed",String(U.dataset.tool===r))),v.hidden=r!=="road",n.style.cursor=r==="inspect"?"":"crosshair",I(r==="inspect"?"Click buildings to inspect.":r==="demolish"?"Click a structure to demolish.":r==="upgrade"?"Click a building to upgrade.":"Choose an empty location."),i.invalidate()}for(const[P,U]of R){const z=document.createElement("button");z.textContent=U,z.dataset.tool=P,z.onclick=()=>G(P),C.append(z)}const K=D.querySelector("#construction-toggle");K.onclick=()=>{A.hidden=!A.hidden,K.textContent=A.hidden?"Edit":"Close",K.setAttribute("aria-expanded",String(!A.hidden)),A.hidden&&G("inspect"),k()};const X=new be(new Wo(.92,1,48),new On({color:"#e9f4cc",side:He,transparent:!0,opacity:.9,depthTest:!1,depthWrite:!1}));X.rotation.x=-Math.PI/2,X.visible=!1,X.renderOrder=50,t.scene.add(X);function tt(){X.visible=!1}function q(){y.visible=!1,X.position.set(b.x,35,b.z),X.scale.set(d,d,1),X.visible=!0,i.invalidate()}D.querySelectorAll("[data-land]").forEach(P=>{P.onclick=()=>{G(P.dataset.land),I("Click land to apply the brush.")}}),D.querySelector("#brush-size").onchange=P=>{d=Number(P.target.value),tt(),i.invalidate()};const st=new hi;t.scene.add(st);const dt=new Ye(1,1,1),pt=new On({color:"#39ae66",transparent:!0,opacity:.65,depthWrite:!1});function Pt(){return["draw-road","curve-road","draw-bridge"].includes(r)}function Ft(){st.clear()}function Y(P,U){Ft(),pt.color.set(U?"#39ae66":"#d75e54");for(let z=1;z<P.length;z++){const Q=P[z-1],J=P[z],nt=J[0]-Q[0],Rt=J[1]-Q[1],Z=new be(dt,pt);Z.position.set((Q[0]+J[0])/2,6.5,(Q[1]+J[1])/2),Z.scale.set(h,.5,Math.hypot(nt,Rt)+2),Z.rotation.y=Math.atan2(nt,Rt),st.add(Z)}i.invalidate()}function et(){return[Math.round(b.x/5)*5,Math.round(b.z/5)*5]}function gt(){if(!c)return;const P=et();try{const U=Tc(c,P,h,l),z=Ac(U,h,r==="draw-bridge"),Q=Bs(i.state,z);Y(U,!Q),I(r==="curve-road"&&!l?"Choose the curve control point.":Q||"Click to complete road.",!!Q&&(r!=="curve-road"||!!l))}catch{Ft()}}function at(){const P=et();if(!c){c=P,I(r==="curve-road"?"Choose the curve control point.":"Choose the road destination.");return}if(r==="curve-road"&&!l){l=P,I("Choose the curve destination.");return}const U=e.drawRoad(c,P,h,l,r==="draw-bridge");if(U){I(U,!0);return}c=null,l=null,Ft(),Et(),I("Road created.")}D.querySelector("#path-road-width").onchange=P=>{h=Number(P.target.value),Ft()},D.querySelector("#cancel-path").onclick=()=>{c=null,l=null,Ft(),I("Drawing cancelled."),i.invalidate()};function bt(P){const U=n.getBoundingClientRect();return!U.width||!U.height?null:(t.camera.updateMatrixWorld(),f.setFromCamera(new wt((P.clientX-U.left)/U.width*2-1,-(P.clientY-U.top)/U.height*2+1),t.camera),f.ray.intersectPlane(E,b))}function At(){var J;let P=null,U=1/0;const z=i.state,Q=r==="upgrade"?z.buildings:[...z.buildings,...z.parks,...z.roads,...z.trees];for(const nt of Q){const Rt=(J=e.find(nt.id))==null?void 0:J.key;if((a==null?void 0:a.layers[Rt])===!1)continue;const{x:Z,z:rt}=nt.position,{width:mt,depth:Tt,height:ft}=nt.dimensions,kt=z.buildings.includes(nt),Dt=new ln(new N(Z-mt/2,3,rt-Tt/2),new N(Z+mt/2,kt?ft+13:nt.type==="tree"?ft+8:5,rt+Tt/2));if(nt.path){if(nt.path.points.slice(1).reduce(($,ht,lt)=>Math.min($,ai([b.x,b.z],nt.path.points[lt],ht)),1/0)>nt.path.width/2+3)continue;const j=b.distanceToSquared(f.ray.origin);j<U&&(U=j,P=nt);continue}const jt=f.ray.intersectBox(Dt,new N);if(!jt)continue;const L=jt.distanceToSquared(f.ray.origin);L<U&&(P=nt,U=L)}return P}function Et(){var Z;const P=document.documentElement.dataset.mode==="night",U=i.activity,z=U.constructor,Q=U.level,J=U.time,nt=U.paused;U.dispose(),t.highlight(null),s(null);for(const rt of[...t.scene.children])rt.isInstancedMesh&&Array.isArray(rt.userData.ids)&&(t.scene.remove(rt),rt.material.dispose(),rt.dispose());t.pickables.length=0,t.batches.clear(),i.camera.worldSize=i.state.boundary,i.camera.controls.maxDistance=Math.max(6e3,i.state.boundary*3),t.camera.far=i.state.boundary*5,t.camera.updateProjectionMatrix();const Rt=t.state;try{a&&(t.state=a.visibleState()),t.build()}finally{t.state=Rt}t.flush(),i.activity=new z(t),i.activity.time=J,i.activity.setLevel(Q),i.activity.paused=nt,i.activity.setNight(P),t.setDayNight(P),_&&(i.selection.dispose(),i.selection=new So(t,s)),k(),a==null||a.redraw(),(Z=i.onCityChanged)==null||Z.call(i),t.renderer.shadowMap.needsUpdate=!0,y.visible=!1,i.invalidate()}function Jt(P){const U=e.find(P),z=D.querySelector("#object-properties");if(!U){z.hidden=!0,o=null;return}o=P;const{key:Q,object:J}=U;z.hidden=!1,D.querySelector("#object-title").textContent=J.type+" · "+J.id;const nt={x:J.position.x,z:J.position.z,width:J.dimensions.width,depth:J.dimensions.depth,height:J.dimensions.height,color:J.visual.color||"#b8c6ad",district:J.district};z.querySelectorAll("[data-property]").forEach(mt=>{mt.value=nt[mt.dataset.property]});const Rt=Q==="roads"&&e.originalRoads.has(P);z.querySelectorAll("input,button").forEach(mt=>{mt.disabled=Rt});const Z=z.querySelector('[data-property="height"]');Z.disabled=Rt||Q==="parks"||Q==="roads",z.querySelector('[data-property="depth"]').disabled=Rt||Q==="trees",z.querySelector('[data-edit="duplicate"]').disabled=Rt||Q==="roads";const rt=!!J.path;if(rt){z.querySelectorAll("input").forEach(mt=>mt.disabled=!0);for(const mt of["apply","rotate","move","duplicate"])z.querySelector('[data-edit="'+mt+'"]').disabled=!0}z.querySelector('[data-edit="widen"]').hidden=!rt,I(Rt?"Original road is protected.":"Edit properties or choose Move.")}function Ot(P){if(P){I(P,!0);return}Et(),G("edit"),Jt(o),I("Object updated.")}D.querySelector('[data-edit="apply"]').onclick=()=>{const P={};D.querySelectorAll("[data-property]").forEach(U=>{if(U.disabled)return;const z=U.dataset.property;P[z]=U.type==="number"?U.value===""?NaN:Number(U.value):U.value}),Ot(e.edit(o,P))},D.querySelector('[data-edit="rotate"]').onclick=()=>{Ot(e.edit(o,{rotate:!0}))},D.querySelector('[data-edit="move"]').onclick=()=>{G("move"),I("Click the new object location.")},D.querySelector('[data-edit="duplicate"]').onclick=()=>{G("duplicate"),I("Click the location for the copy.")},D.querySelector('[data-edit="widen"]').onclick=()=>{const P=e.find(o);if(!(P!=null&&P.object.path))return;const U=[10,14,20,28],z=U.indexOf(P.object.path.width),Q=U[(z+1)%U.length];Ot(e.widenRoad(o,Q))},D.querySelector('[data-edit="delete"]').onclick=()=>{const P=e.demolish(o);if(P){I(P,!0);return}o=null,Et(),Jt(null),I("Object deleted.")},D.querySelector("#expand-world").onclick=()=>{const P=e.expand();if(P){I(P,!0);return}Et(),I("Workspace expanded.")};function ee(P,U){const{width:z,depth:Q,height:J}=P.dimensions;y.position.set(P.position.x,4.5+Math.max(J,2)/2,P.position.z),y.scale.set(z,Math.max(J,2),Q),y.material.color.set(U?"#39ae66":"#db514b"),y.visible=!0,i.invalidate()}let O=-1/0;function Me(P){if(P.shiftKey||P.ctrlKey||P.metaKey||P.altKey||P.buttons&&!g){y.visible=!1,tt(),Ft(),i.invalidate();return}if(!P.buttons){const U=performance.now();if(U-O<33)return;O=U}if(r!=="inspect"){if(g&&Math.hypot(P.clientX-g.x,P.clientY-g.y)>6){g.dragged=!0,tt(),y.visible=!1,i.invalidate();return}if(bt(P)){if(a==null||a.coordinates(b),["multi-select","group-move","measure-distance","measure-area"].includes(r)){y.visible=!1;return}if(Ss.includes(r)){q();return}if(Pt()){gt();return}if(r==="move"||r==="duplicate"){const U=e.find(o);if(!U)return;const z=structuredClone(U.object);z.position.x=Math.round(b.x/5)*5,z.position.z=Math.round(b.z/5)*5,ee(z,!0);return}if(Object.hasOwn(Ds,r)){const U=Pr(r,b.x,b.z,u,p),z=Dr(i.state,r,U);ee(U,!z),I(z||"Valid location — click to build.",!!z)}else{const U=At();U?(ee(U,r==="upgrade"),I(r==="demolish"?"Click to demolish "+U.type:"Click to upgrade "+U.type)):(y.visible=!1,i.invalidate())}}}}function Bt(P){if(P.button!==0||P.shiftKey||P.ctrlKey||P.metaKey||P.altKey){yt(),Ft();return}if(r!=="inspect"){if(m.add(P.pointerId),m.size>1){g&&(g.dragged=!0),y.visible=!1,i.invalidate();return}P.button===0&&(g={x:P.clientX,y:P.clientY,pointerId:P.pointerId,dragged:!1})}}function zt(P){if(P.shiftKey||P.ctrlKey||P.metaKey||P.altKey){yt();return}m.delete(P.pointerId);const U=g;if(g=null,r==="inspect"||!U||U.dragged||U.pointerId!==P.pointerId||P.button!==0||Math.hypot(P.clientX-U.x,P.clientY-U.y)>6||!bt(P))return;if(Ss.includes(r)){const Q=e.landscapeBrush(r,b.x,b.z,d);if(Q){I(Q,!0);return}Et(),q(),I("Landscape updated.");return}if(Pt()){at();return}if(a&&["multi-select","group-move","measure-distance","measure-area"].includes(r)&&a.handleClick(b,r==="multi-select"?At():null))return;let z;if(r==="edit"){const Q=At();Jt(Q==null?void 0:Q.id);return}if(r==="move"||r==="duplicate"){const Q=Math.round(b.x/5)*5,J=Math.round(b.z/5)*5,nt=r==="move"?e.edit(o,{x:Q,z:J}):e.duplicate(o,Q,J);Ot(nt);return}if(Object.hasOwn(Ds,r))z=e.place(r,b.x,b.z,u,p);else{const Q=At();if(!Q){I("No structure selected.",!0);return}z=r==="demolish"?e.demolish(Q.id):e.upgrade(Q.id)}if(z){I(z,!0);return}Et(),I("City updated successfully.")}function yt(){tt(),g=null,m.clear(),y.visible=!1,i.invalidate()}function $t(){u=!u,y.visible=!1,I(u?"Road orientation: north–south":"Road orientation: east–west"),i.invalidate()}D.querySelector("#road-length").onchange=P=>{p=Number(P.target.value),y.visible=!1,I("Road length: "+p+" m"),i.invalidate()},D.querySelector('[data-action="rotate"]').onclick=$t,D.querySelector('[data-action="undo"]').onclick=()=>{e.undo()&&(Et(),I("Decision reversed."))},D.querySelector('[data-action="redo"]').onclick=()=>{e.redo()&&(Et(),I("Decision restored."))};function St(P){var U,z;(z=(U=P.target).matches)!=null&&z.call(U,"input,select,textarea")||(P.key==="Escape"?G("inspect"):P.key.toLowerCase()==="r"&&r==="road"&&$t())}const w={pointerdown:Bt,pointermove:Me,pointerup:zt,pointercancel:yt,pointerleave:yt};for(const[P,U]of Object.entries(w))n.addEventListener(P,U);function M(){y.visible=!1,tt(),Ft(),g=null,i.invalidate()}n.addEventListener("wheel",M,{passive:!0}),window.addEventListener("keydown",St);const H=i.dispose.bind(i);return i.dispose=()=>{for(const[P,U]of Object.entries(w))n.removeEventListener(P,U);n.removeEventListener("wheel",M),window.removeEventListener("keydown",St),Ft(),t.scene.remove(X),X.geometry.dispose(),X.material.dispose(),t.scene.remove(st),dt.dispose(),pt.dispose(),t.scene.remove(y),y.geometry.dispose(),y.material.dispose(),a==null||a.dispose(),D.remove(),H()},i.construction=e,i.rebuildCity=Et,a=Pg({engine:i,panel:D,model:e,setMode:G,rebuild:Et,tell:I,getMode:()=>r}),G("inspect"),Et(),k(),e}const Lg="Riverbend",Ig=4201,Ug=1200,Ng={centerX:0,width:110},Fg=[-540,-360,-180,180,360,540],Og=[-540,-360,-180,0,180,360,540],Bg=["Garden Quarter","Westbank Living","Civic Commons","Market Quarter","Central Business District","Riverside Park"],zg={collectors:[-118,118],linksAt:[-270,270]},kg={name:Lg,seed:Ig,size:Ug,river:Ng,roadCoordinates:Fg,rowCoordinates:Og,districts:Bg,roadNetwork:zg},Hg=i=>i.axis??(i.dimensions.width<100?"z":"x"),vc=(i,t,e,n=0)=>Math.abs(i-e.position.x)<e.dimensions.width/2+n&&Math.abs(t-e.position.z)<(e.type==="tree"?e.dimensions.width:e.dimensions.depth)/2+n;function _l(i){const t=[];for(const e of i.roads){if(e.path)continue;const n=Hg(e)==="z",s=n?e.dimensions.depth:e.dimensions.width,r=(n?e.dimensions.width:e.dimensions.depth)/2;for(let o=-s/2+24;o<s/2-20;o+=64)for(const a of[-1,1]){const c=a*(r+3),l=e.position.x+(n?c:o),h=e.position.z+(n?o:c);Math.abs(l-i.water.position.x)<i.water.dimensions.width/2+32||i.roads.some(d=>d!==e&&vc(l,h,d,10))||[...i.buildings,...i.trees,...i.parks].some(d=>vc(l,h,d,6))||t.push({x:l,z:h,dx:n?-a:0,dz:n?0:-a,roadId:e.id})}}return t}function Gg(i){const t=i.roads.filter(r=>r.id.startsWith("road-v-")).map(r=>r.position.x).sort((r,o)=>r-o),e=i.roads.filter(r=>r.id.startsWith("road-h-")).map(r=>r.position.z).sort((r,o)=>r-o),n=[],s=[];for(let r=0;r+1<t.length;r+=2)for(let o=0;o+1<e.length;o+=2){const a=t[r]+3,c=t[r+1]-3,l=e[o]+3,h=e[o+1]-3;n.push([[a,l],[c,l],[c,h],[a,h]])}for(const r of i.parks){const{x:o,z:a}=r.position,{width:c,depth:l}=r.dimensions;for(const h of[-1,1])s.push([[o,a+h*13],[o,a+h*(l/2-8)]]),s.push([[o+h*13,a],[o+h*(c/2-8),a]])}return{cars:n,walkers:s}}function bo(i){return i.reduce((t,e,n)=>{const s=i[(n+1)%i.length];return t+Math.hypot(e[0]-s[0],e[1]-s[1])},0)}function xc(i,t){const e=bo(i);if(e<=0)throw new Error("Invalid activity route");let n=(t%e+e)%e;for(let s=0;s<i.length;s++){const r=i[s],o=i[(s+1)%i.length],a=o[0]-r[0],c=o[1]-r[1],l=Math.hypot(a,c);if(l){if(n<l||s===i.length-1)return{x:r[0]+a*n/l,z:r[1]+c*n/l,angle:Math.atan2(a,c)};n-=l}}}const Mc={off:[0,0],low:[15,12],normal:[30,24],high:[60,40]};class Vg{constructor(t){this.view=t,this.time=0,this.paused=!1,this.routes=Gg(t.state),this.dummy=new ae,this.meshes=[],this.carBodies=this.mesh(t.geometries.box,60,"#ffffff"),this.carRoofs=this.mesh(t.geometries.box,60,"#748d92"),this.peopleBodies=this.mesh(t.geometries.box,40,"#ffffff"),this.peopleHeads=this.mesh(t.geometries.sphere,40,"#c99d7b");const e=["#b95c4e","#d4d8d2","#547a91","#b7a160","#557266","#353e48"];for(let n=0;n<60;n++)this.carBodies.setColorAt(n,new Ht(e[n%e.length]));for(let n=0;n<40;n++)this.peopleBodies.setColorAt(n,new Ht(e[(n+2)%e.length]));this.carBodies.instanceColor.needsUpdate=!0,this.peopleBodies.instanceColor.needsUpdate=!0,this.createLightPools(),this.createVehicleLights(),this.setLevel("normal")}mesh(t,e,n){const s=new pl({color:n,roughness:.8}),r=new Mo(t,s,e);return r.instanceMatrix.setUsage(qh),r.frustumCulled=!1,r.castShadow=!1,r.receiveShadow=!0,r.count=0,this.view.scene.add(r),this.meshes.push(r),r}createVehicleLights(){this.night=!1,this.headlights=this.mesh(this.view.geometries.box,120,"#fff1cb"),this.taillights=this.mesh(this.view.geometries.box,120,"#ff3025"),this.headlights.material.emissive.set("#fff1cb"),this.headlights.material.emissiveIntensity=3,this.taillights.material.emissive.set("#ff3025"),this.taillights.material.emissiveIntensity=2.5,this.headlightBeams=this.mesh(this.lightGeometry,60,"#ffffff"),this.headlightBeams.material.dispose(),this.headlightBeams.material=new On({map:this.lightTexture,color:"#fff4d9",transparent:!0,opacity:.75,depthWrite:!1,blending:Ls,toneMapped:!1}),this.headlights.visible=!1,this.taillights.visible=!1,this.headlightBeams.visible=!1}createLightPools(){const e=new Uint8Array(16384);for(let r=0;r<64;r++)for(let o=0;o<64;o++){const a=Math.hypot((o-31.5)/32,(r-31.5)/32),c=Math.max(0,1-a)**2,l=(r*64+o)*4;e[l]=255,e[l+1]=210,e[l+2]=135,e[l+3]=Math.round(c*255)}this.lightTexture=new hl(e,64,64),this.lightTexture.magFilter=Ne,this.lightTexture.minFilter=Ne,this.lightTexture.needsUpdate=!0,this.lightGeometry=new Hn(1,1).rotateX(-Math.PI/2);const n=new On({map:this.lightTexture,transparent:!0,opacity:.65,depthWrite:!1,blending:Ls,toneMapped:!1}),s=_l(this.view.state);this.pools=new Mo(this.lightGeometry,n,s.length),s.forEach((r,o)=>{this.matrix(this.pools,o,r.x+r.dx*6,4.48,r.z+r.dz*6,24,1,24,0)}),this.pools.instanceMatrix.needsUpdate=!0,this.pools.computeBoundingSphere(),this.pools.visible=!1,this.view.scene.add(this.pools)}matrix(t,e,n,s,r,o,a,c,l){this.dummy.position.set(n,s,r),this.dummy.scale.set(o,a,c),this.dummy.rotation.set(0,l,0),this.dummy.updateMatrix(),t.setMatrixAt(e,this.dummy.matrix)}setNight(t){this.pools.visible=t,this.night=t,this.headlights.visible=t,this.taillights.visible=t,this.headlightBeams.visible=t,this.update(0,!0),this.view.dirty=!0}setLevel(t){this.level=Object.hasOwn(Mc,t)?t:"normal";let[e,n]=Mc[this.level];this.routes.cars.length||(e=0),this.routes.walkers.length||(n=0),this.carBodies.count=e,this.carRoofs.count=e,this.headlights.count=e*2,this.taillights.count=e*2,this.headlightBeams.count=e,this.peopleBodies.count=n,this.peopleHeads.count=n,this.view.dirty=!0,this.update(0,!0)}update(t,e=!1){if(this.paused&&!e)return!1;const n=this.carBodies.count,s=this.peopleBodies.count;if(!n&&!s)return!1;this.time+=t;const r=this.routes.cars;for(let a=0;a<n;a++){const c=a%r.length,l=r[c],h=Math.floor(a/r.length)*bo(l)/Math.ceil(n/r.length),d=14+c%5,u=xc(l,this.time*d+h);this.matrix(this.carBodies,a,u.x,5.6,u.z,3,2.2,6.2,u.angle),this.matrix(this.carRoofs,a,u.x,7,u.z,2.4,1.1,3.4,u.angle);const p=Math.sin(u.angle),g=Math.cos(u.angle),_=Math.cos(u.angle),m=-Math.sin(u.angle);if(this.night){for(let f=0;f<2;f++){const E=f===0?-.95:.95,b=a*2+f;this.matrix(this.headlights,b,u.x+p*3.15+_*E,5.8,u.z+g*3.15+m*E,.65,.5,.25,u.angle),this.matrix(this.taillights,b,u.x-p*3.15+_*E,5.8,u.z-g*3.15+m*E,.65,.5,.25,u.angle)}this.matrix(this.headlightBeams,a,u.x+p*10,4.49,u.z+g*10,8,1,19,u.angle)}}const o=this.routes.walkers;for(let a=0;a<s;a++){const c=a%o.length,l=o[c],h=Math.floor(a/o.length)*bo(l)/Math.ceil(s/o.length),d=xc(l,this.time*(1.5+c%3*.15)+h);this.matrix(this.peopleBodies,a,d.x,5.15,d.z,.85,1.8,.65,d.angle),this.matrix(this.peopleHeads,a,d.x,6.3,d.z,.28,.28,.28,d.angle)}for(const a of this.meshes)a.instanceMatrix.needsUpdate=!0;return!0}dispose(){for(const t of this.meshes)this.view.scene.remove(t),t.material.dispose(),t.dispose();this.view.scene.remove(this.pools),this.pools.material.dispose(),this.pools.dispose(),this.lightGeometry.dispose(),this.lightTexture.dispose()}}class Wg{constructor(t){this.state=t>>>0}next(){let t=this.state+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+this.next()*(e-t)}pick(t){return t[Math.floor(this.next()*t.length)]}}function Xg(i){return{id:"terrain",type:"terrain",district:"Citywide",position:{x:0,y:-8,z:0},dimensions:{width:i.size,depth:i.size,height:16},orientation:0,visual:{color:"#abbc91"}}}function qg(i){return{id:"river",type:"river",district:"Riverside Park",position:{x:i.river.centerX,y:0,z:0},dimensions:{width:i.river.width,depth:i.size,height:1},orientation:0,visual:{color:"#68a9ad"}}}function jg(i){var e;const t=[];for(const n of i.roadCoordinates)t.push({id:`road-v-${n}`,type:Math.abs(n)===180?"arterial":"local",district:"Citywide",position:{x:n,y:1,z:0},dimensions:{width:Math.abs(n)===180?22:14,height:1,depth:1100},orientation:0,visual:{color:"#697671"}});for(const n of i.rowCoordinates)t.push({id:`road-h-${n}`,type:n===0?"arterial":"secondary",district:"Citywide",position:{x:0,y:1,z:n},dimensions:{width:1100,height:1,depth:n===0?24:16},orientation:0,visual:{color:"#697671"}});for(const n of((e=i.roadNetwork)==null?void 0:e.collectors)??[]){const s=i.roadCoordinates.filter(r=>Math.sign(r)===Math.sign(n)).sort((r,o)=>Math.abs(r)-Math.abs(o))[0];if(!Number.isFinite(s)||Math.abs(n)<100||Math.abs(n)>=Math.abs(s)-25)throw new Error("Invalid riverside collector");t.push({id:`collector-${n}`,type:"collector",axis:"z",district:"Citywide",position:{x:n,y:1,z:0},dimensions:{width:12,height:1,depth:1100},orientation:0,visual:{color:"#697671"}});for(const r of i.roadNetwork.linksAt??[]){if(Math.abs(r)>530||i.rowCoordinates.some(o=>Math.abs(o-r)<35))throw new Error("Invalid local connector");t.push({id:`link-${n}-${r}`,type:"local",axis:"x",district:"Citywide",position:{x:(n+s)/2,y:1,z:r},dimensions:{width:Math.abs(s-n),height:1,depth:10},orientation:0,visual:{color:"#697671"}})}}return t}const Yg=new Set(["Garden Quarter","Westbank Living","Civic Commons","Market Quarter","Central Business District"]);function $g(i){const{roadCoordinates:t,rowCoordinates:e,layout:n}=i;if(!Array.isArray(t)||t.length<4||!Array.isArray(e)||e.length<3)throw new Error("Layout needs road columns and rows.");for(const o of[t,e])if(o.some((a,c)=>!Number.isFinite(a)||Math.abs(a)>540||c>0&&a-o[c-1]<155))throw new Error("Roads must be ordered, within ±540 m and at least 155 m apart.");if(t.some(o=>Math.abs(o)<145))throw new Error("Vertical roads must clear the riverside corridor.");if(!t.some(o=>o<0)||!t.some(o=>o>0))throw new Error("Roads are required on both river banks.");const s=t.slice(0,-1).map((o,a)=>[o,t[a+1]]).filter(([o,a])=>o*a>0);if(!Array.isArray(n.districtGrid)||n.districtGrid.length!==s.length||n.districtGrid.some(o=>!Array.isArray(o)||o.length!==e.length-1||o.some(a=>!Yg.has(a))))throw new Error("District grid must match the buildable blocks.");if(!Array.isArray(n.parks)||n.parks.some(o=>!Array.isArray(o)||o.length!==2||!Number.isInteger(o[0])||!Number.isInteger(o[1])||o[0]<0||o[0]>=s.length||o[1]<0||o[1]>=e.length-1))throw new Error("Park coordinates must identify buildable blocks.");const r=new Set(n.parks.map(o=>o.join(":")));return s.flatMap(([o,a],c)=>e.slice(0,-1).map((l,h)=>({id:`block-${c}-${h}`,x:(o+a)/2,z:(l+e[h+1])/2,width:a-o,depth:e[h+1]-l,district:n.districtGrid[c][h],park:r.has(`${c}:${h}`)})))}function Kg(i,t){const e=[],n=[];if(i.layout)return Zg(i,t);const s=[-450,-270,270,450],r=[-450,-270,-90,90,270,450];for(const o of s)for(const a of r){const c=o<0?a<0?"Garden Quarter":o===-450?"Westbank Living":"Civic Commons":a<0?"Central Business District":"Market Quarter";if(o===270&&a===270||o===-270&&a===90){n.push({id:`park-${o}-${a}`,type:"park",district:"Riverside Park",position:{x:o,y:1,z:a},dimensions:{width:140,depth:140,height:1},orientation:0,visual:{color:"#96b77d"}});continue}for(let l of[-48,0,48])for(let h of[-46,46]){let d=c==="Garden Quarter"?"house":c==="Westbank Living"?"apartment":c==="Central Business District"?t.next()>.4?"office":"commercial":c==="Civic Commons"?"midrise":"commercial";o===-270&&l===0&&h===-46&&(d=a===270?"hospital":a===450?"school":"civic");const u=t.range(26,36),p=t.range(27,38),g={house:t.range(10,16),apartment:t.range(22,32),midrise:t.range(40,58),commercial:t.range(18,32),office:t.range(65,132),hospital:30,school:18,civic:30}[d],_=d==="office"?["#b7c9c4","#8faeb0","#d8dfd2"]:d==="house"?["#ead6b4","#d8d7bc","#f0e2cc"]:["#e2dfcc","#d5c5af","#c0cec0","#ede4d3"];e.push({id:`building-${String(e.length+1).padStart(3,"0")}`,type:d,district:c,position:{x:o+l,y:2,z:a+h},dimensions:{width:u,depth:p,height:g},orientation:0,visual:{color:t.pick(_),roof:t.pick(["#937565","#76877e","#b2927d"]),roofForm:d==="house"?"gable":"flat"}})}}return{buildings:e,parks:n}}function Zg(i,t){const e=[],n=[];let s=0;for(const r of $g(i)){const{x:o,z:a,width:c,depth:l,district:h}=r;if(r.park){n.push({id:`park-${r.id}`,type:"park",district:"Riverside Park",position:{x:o,y:1,z:a},dimensions:{width:c-48,depth:l-48,height:1},orientation:0,visual:{color:"#96b77d"}});continue}const d=c>=180?3:2,u=(c-54)/d,p=(l-54)/2;for(let g=0;g<d;g++)for(let _=0;_<2;_++){let m=h==="Garden Quarter"?"house":h==="Westbank Living"?"apartment":h==="Central Business District"?t.next()>.4?"office":"commercial":h==="Civic Commons"?"midrise":"commercial";h==="Civic Commons"&&s<3&&(m=["civic","hospital","school"][s++]);const f=t.range(24,Math.min(36,u-10)),E=t.range(27,Math.min(38,p-10)),b={house:t.range(10,16),apartment:t.range(22,32),midrise:t.range(40,58),commercial:t.range(18,32),office:t.range(65,132),hospital:30,school:18,civic:30}[m],y=m==="office"?["#b7c9c4","#8faeb0","#d8dfd2"]:m==="house"?["#ead6b4","#d8d7bc","#f0e2cc"]:["#e2dfcc","#d5c5af","#c0cec0","#ede4d3"];e.push({id:`building-${r.id}-${g}-${_}`,type:m,district:h,position:{x:o+(g-(d-1)/2)*u,y:2,z:a+(_-.5)*p},dimensions:{width:f,depth:E,height:b},orientation:0,visual:{color:t.pick(y),roof:t.pick(["#937565","#76877e","#b2927d"]),roofForm:m==="house"?"gable":"flat"}})}}return{buildings:e,parks:n}}function Jg(i,t,e){const n=[],s=(r,o)=>n.push({id:`tree-${n.length+1}`,type:"tree",district:"Landscape",position:{x:r,y:2,z:o},dimensions:{width:t.range(7,11),depth:8,height:t.range(14,23)},orientation:0,visual:{color:t.pick(["#577c54","#70925d","#8aab6f","#426d58"])}});for(const r of[-137,-100,100,137])for(let o=-550;o<570;o+=30)i.rowCoordinates.every(a=>Math.abs(o-a)>25)&&s(r,o);for(const r of[-565,565])for(let o=-540;o<550;o+=32)s(r,o);for(const r of e)for(let o=0;o<35;o++){let a=t.range(i.layout?-r.dimensions.width/2+10:-60,i.layout?r.dimensions.width/2-10:60),c=t.range(i.layout?-r.dimensions.depth/2+10:-60,i.layout?r.dimensions.depth/2-10:60);Math.abs(a)>10&&Math.abs(c)>10&&s(r.position.x+a,r.position.z+c)}if(!i.layout)for(const r of[-450,-270,270,450])for(let o=-510;o<530;o+=180)for(const a of[-64,64])s(r+a,o);return n}function Qg(i){if(!Number.isInteger(i.seed)||i.size!==1200||i.river.centerX!==0||i.river.width!==110)throw new Error("Current engine requires a 1200 m boundary, straight 110 m river and integer seed.");const t=new Wg(i.seed),{buildings:e,parks:n}=Kg(i,t),s=jg(i),r=i.rowCoordinates.map(o=>({id:`bridge-${o}`,type:"bridge",district:"Citywide",position:{x:0,y:1,z:o},dimensions:{width:150,depth:o===0?24:16,height:2},orientation:0,visual:{color:"#c7c6ae"}}));return{version:t_(i),name:i.name,seed:i.seed,boundary:i.size,terrain:Xg(i),water:qg(i),roads:s,bridges:r,buildings:e,parks:n,trees:Jg(i,t,n).filter(o=>!s.some(a=>a.axis&&Math.abs(o.position.x-a.position.x)<(o.dimensions.width+a.dimensions.width)/2+5&&Math.abs(o.position.z-a.position.z)<(o.dimensions.width+a.dimensions.depth)/2+5))}}function t_(i){return i.roadNetwork||i.layout?"U0.2-dev":"U0.1"}function e_(i){const t=[];for(const e of i.parks){const{x:n,z:s}=e.position,{width:r,depth:o}=e.dimensions,a=(l,h,d,u)=>![...i.trees,...i.roads,...i.buildings].some(g=>Math.abs(l-g.position.x)<(d+g.dimensions.width)/2+3&&Math.abs(h-g.position.z)<(u+(g.type==="tree"?g.dimensions.width:g.dimensions.depth))/2+3),c=(l,h,d,u,p,g,_,m)=>{t.push({kind:l,color:h,parkId:e.id,x:n+d,y:u,z:s+p,width:g,height:_,depth:m})};for(const l of[-1,1])for(const h of[-46,-28,28,46]){const d=l*8;if(!(Math.abs(h)+4>o/2)&&!(Math.abs(d)+3>r/2)&&a(n+d,s+h,4,7)){c("bench","#a18160",d,5.5,h,2.5,.65,6),c("bench-back","#a18160",d+l*1.1,7,h,.45,2,6);for(const u of[-2,2])c("bench-leg","#626c65",d,4.7,h+u,1.8,1.5,.6)}}for(const l of[-1,1])for(const h of[-53,53]){const d=l*6;Math.abs(h)+3>o/2||Math.abs(d)+2>r/2||a(n+d,s+h,3,3)&&(c("lamp","#596863",d,8,h,.7,8,.7),c("lamp-head","#f0dfaf",d,12,h,1.8,1,1.8))}}return t}function n_(i){const t=[],{position:e,dimensions:n}=i.water,s=n.width/2,r=n.depth,o=(a,c,l,h,d,u,p,g)=>{const _={kind:a,color:c,x:l,y:h,z:d,width:u,height:p,depth:g};i.roads.some(f=>Math.abs(l-f.position.x)<(u+f.dimensions.width)/2+5&&Math.abs(d-f.position.z)<(g+f.dimensions.depth)/2+5)||t.push(_)};for(const a of[-1,1]){const c=e.x+a*(s+10),l=e.x+a*(s+25);for(let h=-r/2+12;h<=r/2-12;h+=12)o("rail","#647674",c,7,h,.65,.65,12),o("rail-post","#647674",c,5.5,h,.8,3,.8);for(let h=-r/2+30;h<r/2-20;h+=60){o("bench","#947557",l,5.6,h,2.5,.55,6),o("bench","#947557",l+a*1.1,7,h,.45,2.2,6);for(const d of[-2,2])o("bench-leg","#586460",l,4.7,h+d,2,.95,.6)}for(let h=-r/2+48;h<r/2-20;h+=72)o("lamp","#596863",l,8,h,.65,8,.65),o("lamp","#596863",l-a*1.3,12,h,3.2,.55,.65),o("lamp-head","#f0dfaf",l-a*2.5,11.5,h,1.6,.65,1.4)}for(const a of i.bridges){const{x:c,z:l}=a.position,{width:h,depth:d}=a.dimensions;for(const u of[-1,1])t.push({kind:"bridge-cap",color:"#9baba5",x:c,y:8.7,z:l+u*(d/2+2),width:h+2,height:.45,depth:2.2})}return t}function i_(i,t){const{width:e,depth:n,height:s}=i.dimensions,r=[...i.id].reduce((l,h)=>Math.imul(l,31)+h.charCodeAt(0)>>>0,0)%3,o=[],a=(l,h,d,u,p,g,_)=>o.push({color:l,x:h,y:d,z:u,width:p,height:g,depth:_}),c=t.at(-1);if(i.type==="apartment"||i.type==="midrise")for(const l of t)for(let h=l.bottom+3;h+4<l.top;h+=8)for(const d of[-1,1]){const u=d*(l.depth/2+1.25);a("#ded8c7",0,h,u,l.width*.65,.65,2.5),a("#81928c",0,h+1.1,d*(l.depth/2+2.3),l.width*.65,1.5,.25)}if(i.type==="office")for(const l of t){const h=l.top-l.bottom;for(const d of[-1,1])for(const u of[-l.width*.37,l.width*.37])a("#aabbb8",u,l.bottom+h/2,d*(l.depth/2+.32),.7,h,.3)}if(["office","apartment","midrise"].includes(i.type)){for(const l of[-1,1])a("#ded8c7",0,s+2,l*(c.depth/2-.6),c.width,2,.5),a("#ded8c7",l*(c.width/2-.6),s+2,0,.5,2,c.depth);r===0&&a("#81928c",-c.width*.2,s+2.2,0,3,1.4,3)}if(i.type==="commercial")for(const l of[-1,1])a("#526e70",l*e*.27,4.5,n/2+.35,e*.3,5,.35);return{parts:o,roofRotation:i.type==="house"&&r===1?Math.PI/2:0,roofHeight:r===2?7:9,officeGlass:r===0?"#42636b":r===1?"#526e70":"#597c80"}}function s_(i){const{width:t,depth:e,height:n}=i.dimensions,r=[...i.id].reduce((a,c)=>Math.imul(a,31)+c.charCodeAt(0)>>>0,0)%3,o=(a,c,l=1,h=1)=>({bottom:a,top:c,width:t*l,depth:e*h});if(i.type==="office")return r===0?[o(0,16),o(16,n,.72,.76)]:r===1?[o(0,n*.46),o(n*.46,n*.78,.82,.84),o(n*.78,n,.62,.66)]:[o(0,12),o(12,n,.9,.62)];if(i.type==="midrise"||i.type==="apartment"){if(r===0)return[o(0,n*.67),o(n*.67,n,.76,.82)];if(r===1)return[o(0,n*.8),o(n*.8,n,.86,.7)]}return[o(0,n)]}function r_(i){const t=new Tg(16185319,8689027,2.5);i.add(t);const e=new Rg(16773333,3.2);return e.position.set(-400,850,350),e.castShadow=!0,e.shadow.mapSize.set(1024,1024),Object.assign(e.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:1800}),e.shadow.bias=-4e-4,e.shadow.normalBias=1.5,i.add(e),{hemisphere:t,sun:e}}function o_(i,t){const{hemisphere:e,sun:n}=i;e.color.setHex(t?7441848:16185319),e.groundColor.setHex(t?3753822:8689027),e.intensity=t?.65:2.5,n.color.setHex(t?10402285:16773333),n.intensity=t?.85:3.2,n.castShadow=!t}class a_{constructor(t,e){this.state=e,this.scene=new bg,this.scene.background=new Ht("#e9eee7"),this.camera=new Ie(38,1,2,6500),this.renderer=new Sg({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.shadowMap.type=Ic,this.renderer.outputColorSpace=Ce,this.renderer.toneMapping=Nc,t.appendChild(this.renderer.domElement),this.geometries={front:new Hn(1,1),side:new Hn(1,1).rotateY(Math.PI/2),box:new Ye(1,1,1),cone:new Ho(1,1,7),sphere:new Vo(1,1),cylinder:new Xs(1,1,1,8)};const n=new Te;n.setAttribute("position",new ce([-.5,0,-.5,.5,0,-.5,0,1,-.5,-.5,0,.5,0,1,.5,.5,0,.5,-.5,0,-.5,0,1,-.5,0,1,.5,-.5,0,-.5,0,1,.5,-.5,0,.5,.5,0,-.5,.5,0,.5,0,1,.5,.5,0,-.5,0,1,.5,0,1,-.5],3)),n.computeVertexNormals(),this.geometries.roof=n,this.batches=new Map,this.pickables=[],this.lights=r_(this.scene),this.build(),this.flush(),this.observer=new ResizeObserver(()=>this.resize(t)),this.observer.observe(t),this.resize(t)}part(t,e,n,s,r,o,a,c,l=null,h=0){const d=this.buildingTransform;if(d){const p=n-d.x,g=r-d.z,_=Math.cos(d.angle),m=Math.sin(d.angle);n=d.x+p*_+g*m,r=d.z-p*m+g*_,h+=d.angle}const u=`${t}:${e}`;this.batches.has(u)||this.batches.set(u,{shape:t,color:e,items:[]}),this.batches.get(u).items.push({x:n,y:s,z:r,w:o,h:a,d:c,id:l,rotation:h})}box(t,e,n,s,r,o,a,c=null){this.part("box",t,e,n,s,r,o,a,c)}build(){const t=this.state,e=t.boundary;Wl(this,t),this.box("#68a9ad",0,3,0,110,1,e);for(const n of[-59,59])this.box("#c6c7ac",n,4,0,8,5,e);for(const n of[-74,74])this.box("#dbd7bf",n,3,0,20,2,e);for(let n=-e/2+30;n<e/2;n+=52)this.box("#92c1bd",0,3.6,n,65,.1,1.2);for(const n of n_(t))this.box(n.color,n.x,n.y,n.z,n.width,n.height,n.depth);for(const n of _l(t))this.box("#596863",n.x,8,n.z,.65,8,.65),this.box("#596863",n.x+n.dx*1.5,12,n.z+n.dz*1.5,n.dx?3.6:.65,.55,n.dz?3.6:.65),this.box("#f0dfaf",n.x+n.dx*3,11.7,n.z+n.dz*3,1.5,.65,1.5);for(const n of t.roads){if(n.path){this.drawPathRoad(n);continue}const{x:s,z:r}=n.position,{width:o,depth:a}=n.dimensions;this.box("#d4d2bc",s,3,r,o+9,2,a+9),this.box("#6f7b75",s,4.1,r,o,.3,a);const c=n.axis??(o<100?"z":"x"),l=c==="z"?a:o,h=c==="z"?r:s;for(let d=h-l/2+15;d<h+l/2-10;d+=25){const u=c==="z"?s:d,p=c==="z"?d:r;t.roads.some(g=>g!==n&&(g.axis??(g.dimensions.width<100?"z":"x"))!==c&&Math.abs(u-g.position.x)<g.dimensions.width/2+7&&Math.abs(p-g.position.z)<g.dimensions.depth/2+7)||this.box("#d8d7ba",u,4.4,p,c==="z"?1:10,.1,c==="z"?10:1)}}for(const n of t.bridges){const s=n.position.z,r=n.dimensions.depth;for(const o of[-r/2-2,r/2+2]){this.box("#e6dfc8",0,7,s+o,152,3,2);for(const a of[-48,48])this.box("#b9baa6",a,2,s+o,5,8,5)}}for(const n of t.parks){const{x:s,z:r}=n.position,{width:o,depth:a}=n.dimensions;this.box(n.visual.color,s,3,r,o+5,1,a+5),this.box("#ded5b6",s,4,r,o,.5,7),this.box("#ded5b6",s,4,r,7,.5,a),s<0?(this.part("cylinder","#d5d7c3",s,4.5,r,13,2,13),this.part("cylinder","#7fb4b2",s,5.7,r,10,.5,10)):(this.box("#d7cab0",s,4.4,r,16,.6,16),this.box("#c3b59a",s,4.8,r,8,.2,8))}for(const n of[-e/2+20,e/2-20])for(const s of[-400,-100,200,420])this.part("sphere","#a7bd8d",n,0,s,20,9,65);for(const n of e_(t))this.box(n.color,n.x,n.y,n.z,n.width,n.height,n.depth);for(const n of t.buildings)this.building(n);for(const n of t.trees){const{x:s,z:r}=n.position,o=n.dimensions.height,a=n.dimensions.width;this.part("cylinder","#8b8164",s,6,r,1.5,8,1.5),this.part("sphere",n.visual.color,s,o*.65+5,r,a,o*.48,a)}}building(t){const e=t.orientation||0,n=Math.round(e/(Math.PI/2)),s={...t,dimensions:{...t.dimensions}};if(Math.abs(n)%2){const r=s.dimensions;[r.width,r.depth]=[r.depth,r.width]}this.buildingTransform={x:t.position.x,z:t.position.z,angle:e};try{this.buildLocalBuilding(s)}finally{this.buildingTransform=null}}buildLocalBuilding(t){if(Object.hasOwn(Eo,t.type)){Ul(this,t);return}const{x:e,z:n}=t.position,{width:s,depth:r,height:o}=t.dimensions,a=t.id,c=4;this.box("#c9c7ad",e,3,n,s+7,1,r+7,a);const l=s_(t),h=l[l.length-1],d=i_(t,l);for(const p of l)this.box(t.visual.color,e,c+(p.bottom+p.top)/2,n,p.width,p.top-p.bottom,p.depth,a);t.type==="house"?(this.part("roof",t.visual.roof,e,c+o,n,d.roofRotation?r+4:s+4,d.roofHeight,d.roofRotation?s+4:r+4,a,d.roofRotation),this.box("#eee2c9",e+s*.25,c+o+4,n,3,9,3,a)):(this.box("#f1ead8",e,c+o,n,h.width+2,1.6,h.depth+2,a),this.box(t.visual.roof,e,c+o+1,n,h.width-3,1,h.depth-3,a),this.box("#b6b5a4",e+3,c+o+3,n,8,4,7,a));const u=t.type==="office"?d.officeGlass:"#687d79";for(const p of l){const g=p.width,_=p.depth;for(let m=c+p.bottom+5;m+2<=c+p.top;m+=t.type==="office"?9:8){for(const f of[-1,1])for(let E=-g/2+5;E<g/2-2;E+=7)this.part("front",u,e+E,m,n+f*(_/2+.15),t.type==="office"?5.2:3.7,3.8,1,a);for(const f of[-1,1])for(let E=-_/2+5;E<_/2-2;E+=8)this.part("side",u,e+f*(g/2+.15),m,n+E,1,3.8,t.type==="office"?5.2:4,a)}}for(const p of d.parts)this.box(p.color,e+p.x,c+p.y,n+p.z,p.width,p.height,p.depth,a);if(this.box("#536960",e,7,n+r/2+.3,4,6,.6,a),t.type==="commercial"&&this.box("#b47c55",e,9,n+r/2+2,s,2,5,a),t.type==="hospital"&&(this.box("#b65d4c",e,c+o+2,n,12,1,3,a),this.box("#b65d4c",e,c+o+2,n,3,1,12,a)),t.type==="school"&&this.box("#ceab60",e,c+o+2,n,s*.7,2,r*.65,a),t.type==="civic"){for(let p=-s/2+3;p<s/2;p+=6)this.part("cylinder","#f5ecd9",e+p,12,n+r/2+2,1.5,16,1.5,a);this.box("#e8dfca",e,21,n+r/2+2,s+3,3,6,a)}}drawPathRoad(t){const{points:e,width:n,bridge:s}=t.path;for(let r=1;r<e.length;r++){const o=e[r-1],a=e[r],c=a[0]-o[0],l=a[1]-o[1],h=Math.hypot(c,l),d=Math.atan2(c,l),u=(o[0]+a[0])/2,p=(o[1]+a[1])/2,g=h+n*.3;if(this.part("box","#d4d2bc",u,3.6,p,n+6,1.8,g,t.id,d),this.part("box",t.visual.color||"#697671",u,4.8,p,n,.5,g,t.id,d),this.part("box","#e0ddc3",u,5.1,p,.6,.1,Math.min(h*.55,8),t.id,d),s&&Math.abs(u)<80){const _=Math.cos(d),m=-Math.sin(d);for(const f of[-1,1]){const E=f*(n/2+1);this.part("box","#e6dfc8",u+_*E,7,p+m*E,1.2,3,g,t.id,d)}r%3===0&&this.box("#b9baa6",u,1.7,p,4,6,4,t.id)}r<e.length-1&&this.part("cylinder","#697671",a[0],4.8,a[1],n/2,.5,n/2,t.id)}}flush(){const t=new ae;for(const e of this.batches.values()){const n=new pl({color:e.color,roughness:.85,side:["roof","front","side"].includes(e.shape)?He:an});n.userData.nightGlow=["front","side"].includes(e.shape)?"window":e.color==="#f0dfaf"?"lamp":null;const s=new Mo(this.geometries[e.shape],n,e.items.length);s.userData.ids=[],e.items.forEach((r,o)=>{t.position.set(r.x,r.y,r.z),t.scale.set(r.w,r.h,r.d),t.rotation.set(0,r.rotation,0),t.updateMatrix(),s.setMatrixAt(o,t.matrix),s.userData.ids[o]=r.id}),s.castShadow=!["front","side"].includes(e.shape),s.receiveShadow=!0,s.computeBoundingSphere(),this.scene.add(s),s.userData.ids.some(Boolean)&&this.pickables.push(s)}this.batches.clear()}setDayNight(t){var e;this.scene.background.set(t?"#111c30":"#e9eee7"),o_(this.lights,t),this.scene.traverse(n=>{var o;const s=n.material,r=(o=s==null?void 0:s.userData)==null?void 0:o.nightGlow;r&&(s.emissive.set(t?r==="lamp"?"#ffcf80":"#ffd393":"#000000"),s.emissiveIntensity=t?r==="lamp"?1.8:.8:0)}),this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0,(e=this.onInvalidate)==null||e.call(this)}highlight(t){var o;if(this.dirty=!0,(o=this.onInvalidate)==null||o.call(this),this.outline&&(this.scene.remove(this.outline),this.outline.geometry.dispose(),this.outline.material.dispose(),this.outline=null),!t)return;const{width:e,depth:n,height:s}=t.dimensions,r=new Ye(e+10,s+12,n+10);this.outline=new ul(new fl(r),new Ns({color:"#e49b42"})),r.dispose(),this.outline.position.set(t.position.x,4+s/2,t.position.z),this.scene.add(this.outline)}resize(t){var r;const e=t.getBoundingClientRect(),n=Math.floor(e.width),s=Math.floor(e.height);n<=0||s<=0||n===this.viewportWidth&&s===this.viewportHeight||(this.viewportWidth=n,this.viewportHeight=s,this.camera.aspect=n/s,this.camera.updateProjectionMatrix(),this.renderer.setSize(n,s),this.dirty=!0,(r=this.onInvalidate)==null||r.call(this))}render(){this.renderer.render(this.scene,this.camera),this.dirty=!1}dispose(){this.observer.disconnect(),this.highlight(null),this.scene.traverse(t=>{t.isMesh&&(t.material.dispose(),t.isInstancedMesh&&t.dispose())}),Object.values(this.geometries).forEach(t=>t.dispose()),this.renderer.dispose()}}const yc={type:"change"},Xo={type:"start"},vl={type:"end"},ys=new Vs,Sc=new sn,c_=Math.cos(70*Rs.DEG2RAD),le=new N,Se=2*Math.PI,Zt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Er=1e-6;class l_ extends Cg{constructor(t,e=null){super(t,e),this.state=Zt.NONE,this.enabled=!0,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:di.ROTATE,MIDDLE:di.DOLLY,RIGHT:di.PAN},this.touches={ONE:ci.ROTATE,TWO:ci.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new N,this._lastQuaternion=new kn,this._lastTargetPosition=new N,this._quat=new kn().setFromUnitVectors(t.up,new N(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new _c,this._sphericalDelta=new _c,this._scale=1,this._panOffset=new N,this._rotateStart=new wt,this._rotateEnd=new wt,this._rotateDelta=new wt,this._panStart=new wt,this._panEnd=new wt,this._panDelta=new wt,this._dollyStart=new wt,this._dollyEnd=new wt,this._dollyDelta=new wt,this._dollyDirection=new N,this._mouse=new wt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=d_.bind(this),this._onPointerDown=h_.bind(this),this._onPointerUp=u_.bind(this),this._onContextMenu=x_.bind(this),this._onMouseWheel=m_.bind(this),this._onKeyDown=g_.bind(this),this._onTouchStart=__.bind(this),this._onTouchMove=v_.bind(this),this._onMouseDown=f_.bind(this),this._onMouseMove=p_.bind(this),this._interceptControlDown=M_.bind(this),this._interceptControlUp=y_.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(yc),this.update(),this.state=Zt.NONE}update(t=null){const e=this.object.position;le.copy(e).sub(this.target),le.applyQuaternion(this._quat),this._spherical.setFromVector3(le),this.autoRotate&&this.state===Zt.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Se:n>Math.PI&&(n-=Se),s<-Math.PI?s+=Se:s>Math.PI&&(s-=Se),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(le.setFromSpherical(this._spherical),le.applyQuaternion(this._quatInverse),e.copy(this.target).add(le),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=le.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const a=new N(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new N(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=le.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(ys.origin.copy(this.object.position),ys.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ys.direction))<c_?this.object.lookAt(this.target):(Sc.setFromNormalAndCoplanarPoint(this.object.up,this.target),ys.intersectPlane(Sc,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Er||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Er||this._lastTargetPosition.distanceToSquared(this.target)>Er?(this.dispatchEvent(yc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Se/60*this.autoRotateSpeed*t:Se/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){le.setFromMatrixColumn(e,0),le.multiplyScalar(-t),this._panOffset.add(le)}_panUp(t,e){this.screenSpacePanning===!0?le.setFromMatrixColumn(e,1):(le.setFromMatrixColumn(e,0),le.crossVectors(this.object.up,le)),le.multiplyScalar(t),this._panOffset.add(le)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;le.copy(s).sub(this.target);let r=le.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Se*this._rotateDelta.x/e.clientHeight),this._rotateUp(Se*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(Se*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-Se*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(Se*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-Se*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Se*this._rotateDelta.x/e.clientHeight),this._rotateUp(Se*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new wt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function h_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function d_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function u_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(vl),this.state=Zt.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function f_(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case di.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Zt.DOLLY;break;case di.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Zt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Zt.ROTATE}break;case di.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Zt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Zt.PAN}break;default:this.state=Zt.NONE}this.state!==Zt.NONE&&this.dispatchEvent(Xo)}function p_(i){switch(this.state){case Zt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Zt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Zt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function m_(i){this.enabled===!1||this.enableZoom===!1||this.state!==Zt.NONE||(i.preventDefault(),this.dispatchEvent(Xo),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(vl))}function g_(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function __(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ci.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Zt.TOUCH_ROTATE;break;case ci.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Zt.TOUCH_PAN;break;default:this.state=Zt.NONE}break;case 2:switch(this.touches.TWO){case ci.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Zt.TOUCH_DOLLY_PAN;break;case ci.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Zt.TOUCH_DOLLY_ROTATE;break;default:this.state=Zt.NONE}break;default:this.state=Zt.NONE}this.state!==Zt.NONE&&this.dispatchEvent(Xo)}function v_(i){switch(this._trackPointer(i),this.state){case Zt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Zt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Zt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Zt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Zt.NONE}}function x_(i){this.enabled!==!1&&i.preventDefault()}function M_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function y_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function S_(i,t,e=650){const n=Rs.clamp(t.x,-e,e),s=Rs.clamp(t.y,0,150),r=Rs.clamp(t.z,-e,e);return n===t.x&&s===t.y&&r===t.z?!1:(i.position.x+=n-t.x,i.position.y+=s-t.y,i.position.z+=r-t.z,t.set(n,s,r),!0)}class b_{constructor(t,e){this.camera=t,this.controls=new l_(t,e),this.controls.enableDamping=!0,this.controls.zoomSpeed=.65,this.controls.rotateSpeed=.6,this.controls.panSpeed=.9,this.controls.zoomToCursor=!1,this.controls.listenToKeyEvents(window),this.controls.dampingFactor=.12,this.controls.minDistance=80,this.controls.maxDistance=6e3,this.controls.maxPolarAngle=Math.PI/2.12,this.controls.screenSpacePanning=!1,this.reset()}reset(){this.top=!1,this.controls.target.set(0,0,0),this.camera.position.set(1250,1250,1500).multiplyScalar(Math.max(1,1.3/this.camera.aspect)),this.controls.update()}toggleTop(){if(this.top){this.reset();return}this.top=!0,this.controls.target.set(0,0,0),this.camera.position.set(0,2100*((this.worldSize||1200)/1200)/Math.min(1,this.camera.aspect),.1),this.controls.update()}update(t){const e=this.controls.update(t),n=S_(this.camera,this.controls.target,this.worldSize?this.worldSize/2+50:650);return e||n}dispose(){this.controls.dispose()}}class E_{constructor(t,e=s=>globalThis.requestAnimationFrame(s),n=s=>globalThis.cancelAnimationFrame(s)){this.step=t,this.request=e,this.cancel=n,this.pending=null,this.disposed=!1,this.tick=s=>{this.pending=null,!this.disposed&&this.step(s)&&this.invalidate()}}invalidate(){!this.disposed&&this.pending===null&&(this.pending=this.request(this.tick))}suspend(){this.pending!==null&&this.cancel(this.pending),this.pending=null}dispose(){this.suspend(),this.disposed=!0}}class T_{constructor(t,e,n){this.state=Qg(e),this.view=new a_(t,this.state),this.camera=new b_(this.view.camera,this.view.renderer.domElement),this.selection=new So(this.view,n),this.activity=new Vg(this.view);let s=null;this.scheduler=new E_(r=>{if(document.hidden)return s=null,!1;const o=s===null?1/60:Math.min((r-s)/1e3,.1);s=r;const a=this.camera.update(o),c=this.activity.update(o);(a||c||this.view.dirty)&&this.view.render();const l=a||c||this.camera.controls.autoRotate;return l||(s=null),l}),this.invalidate=()=>{this.view.dirty=!0,this.scheduler.invalidate()},this.view.onInvalidate=this.invalidate,this.camera.controls.addEventListener("change",this.invalidate),this.visibility=()=>{document.hidden?(s=null,this.scheduler.suspend()):this.invalidate()},document.addEventListener("visibilitychange",this.visibility),this.invalidate()}dispose(){this.scheduler.dispose(),document.removeEventListener("visibilitychange",this.visibility),this.camera.controls.removeEventListener("change",this.invalidate),this.view.onInvalidate=null,this.selection.dispose(),this.camera.dispose(),this.activity.dispose(),this.view.dispose()}}const qo=kg;document.querySelector(".location h1").textContent=qo.name;document.querySelector("#seed").textContent=`SEED ${qo.seed}`;const Tr=document.querySelector("#selection");try{let n=function(){i.view.setDayNight(e),i.activity.setNight(e),document.documentElement.dataset.mode=e?"night":"day",t.setAttribute("aria-pressed",String(e)),t.replaceChildren(document.createTextNode(e?"☀ ":"☾ "));const c=document.createElement("span");c.textContent=e?"Day":"Night",t.append(c)};const i=new T_(document.querySelector("#viewport"),qo,c=>{if(Tr.replaceChildren(),Tr.hidden=!c,!c)return;const l=document.createElement("span");l.className="eyebrow",l.textContent=c.district;const h=document.createElement("h2");h.textContent=c.type.charAt(0).toUpperCase()+c.type.slice(1);const d=document.createElement("p");d.textContent=`${c.id} · ${Math.round(c.dimensions.height)} m tall`;const u=document.createElement("p");u.textContent=`${Math.round(c.dimensions.width)} × ${Math.round(c.dimensions.depth)} m footprint`,Tr.append(l,h,d,u)});new URLSearchParams(location.search).has("diagnostics")&&El(async()=>{const{attachPerformanceCheck:c}=await import("./PerformanceCheck-ZvCn_iov.js");return{attachPerformanceCheck:c}},[],import.meta.url).then(({attachPerformanceCheck:c})=>c(i));const t=document.querySelector("#day-night");let e=new URLSearchParams(location.search).get("mode")!=="day";t.onclick=()=>{e=!e,n()},n();const s=document.querySelector("#activity");s.onchange=()=>{i.activity.setLevel(s.value),i.invalidate()};const r=document.querySelector("#quality");r.onchange=()=>{i.view.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,Number(r.value))),i.invalidate()},s.onchange(),r.onchange(),Dg(i),oh(i),Ll(i),Rl(i),document.querySelector("#building-count").textContent=`${i.state.buildings.length} buildings`,document.querySelector("#district-count").textContent=`${new Set([...i.state.buildings,...i.state.parks].map(c=>c.district)).size} districts`;const o=document.querySelector("#top");document.querySelector("#reset").onclick=()=>{i.camera.reset(),o.setAttribute("aria-pressed","false")},o.onclick=()=>{i.camera.toggleTop(),o.setAttribute("aria-pressed",String(i.camera.top))};const a=document.querySelector("#fullscreen");a.hidden=!document.fullscreenEnabled,a.onclick=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{a.textContent="Fullscreen unavailable"}},window.addEventListener("pagehide",c=>{c.persisted||i.dispose()}),window.addEventListener("pageshow",c=>{c.persisted&&i.invalidate()})}catch(i){document.querySelector("#error").hidden=!1,document.querySelector("#error").textContent=`Unable to start the city: ${i.message}`,console.error(i)}
