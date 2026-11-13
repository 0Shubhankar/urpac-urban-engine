import './styles/main.css';
import defaultConfig from '../scenarios/default-city.json';
import westhaven from '../scenarios/westhaven.json';
const params=new URLSearchParams(location.search);
const config=params.get('city')==='westhaven'?westhaven:defaultConfig;
const switcher=document.querySelector('#scenario');
switcher.value=config===westhaven?'westhaven':'riverbend';
switcher.onchange=()=>{const url=new URL(location.href);url.searchParams.set('city',switcher.value);location.href=url.href;};
document.querySelector('.location h1').textContent=config.name;
document.querySelector('#seed').textContent=`SEED ${config.seed}`;
import {CityEngine} from './core/CityEngine.js';
const panel=document.querySelector('#selection');
try {
const engine=new CityEngine(document.querySelector('#viewport'),config,b=>{panel.replaceChildren();panel.hidden=!b;if(!b)return;const label=document.createElement('span');label.className='eyebrow';label.textContent=b.district;const title=document.createElement('h2');title.textContent=b.type.charAt(0).toUpperCase()+b.type.slice(1);const detail=document.createElement('p');detail.textContent=`${b.id} · ${Math.round(b.dimensions.height)} m tall`;const dimensions=document.createElement('p');dimensions.textContent=`${Math.round(b.dimensions.width)} × ${Math.round(b.dimensions.depth)} m footprint`;panel.append(label,title,detail,dimensions);});
if(new URLSearchParams(location.search).has('diagnostics')) import('./diagnostics/PerformanceCheck.js').then(({attachPerformanceCheck})=>attachPerformanceCheck(engine));
document.querySelector('#building-count').textContent=`${engine.state.buildings.length} buildings`;
document.querySelector('#district-count').textContent=`${new Set([...engine.state.buildings,...engine.state.parks].map(o=>o.district)).size} districts`;
const top=document.querySelector('#top');document.querySelector('#reset').onclick=()=>{engine.camera.reset();top.setAttribute('aria-pressed','false');};top.onclick=()=>{engine.camera.toggleTop();top.setAttribute('aria-pressed',String(engine.camera.top));};
const fullscreen=document.querySelector('#fullscreen');fullscreen.hidden=!document.fullscreenEnabled;fullscreen.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{fullscreen.textContent='Fullscreen unavailable';}};
window.addEventListener('pagehide',event=>{if(!event.persisted)engine.dispose();});
window.addEventListener('pageshow',event=>{if(event.persisted)engine.invalidate();});
} catch(error){document.querySelector('#error').hidden=false;document.querySelector('#error').textContent=`Unable to start the city: ${error.message}`;console.error(error);}
