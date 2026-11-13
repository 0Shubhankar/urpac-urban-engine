import './styles/main.css';
import config from '../scenarios/default-city.json';
import {CityEngine} from './core/CityEngine.js';
const panel=document.querySelector('#selection');
try {
const engine=new CityEngine(document.querySelector('#viewport'),config,b=>{panel.replaceChildren();panel.hidden=!b;if(!b)return;const label=document.createElement('span');label.className='eyebrow';label.textContent=b.district;const title=document.createElement('h2');title.textContent=b.type.charAt(0).toUpperCase()+b.type.slice(1);const detail=document.createElement('p');detail.textContent=`${b.id} · ${Math.round(b.dimensions.height)} m tall`;const dimensions=document.createElement('p');dimensions.textContent=`${Math.round(b.dimensions.width)} × ${Math.round(b.dimensions.depth)} m footprint`;panel.append(label,title,detail,dimensions);});
if(new URLSearchParams(location.search).has('diagnostics')) import('./diagnostics/PerformanceCheck.js').then(({attachPerformanceCheck})=>attachPerformanceCheck(engine));
document.querySelector('#building-count').textContent=`${engine.state.buildings.length} buildings`;
const top=document.querySelector('#top');document.querySelector('#reset').onclick=()=>{engine.camera.reset();top.setAttribute('aria-pressed','false');};top.onclick=()=>{engine.camera.toggleTop();top.setAttribute('aria-pressed',String(engine.camera.top));};
const fullscreen=document.querySelector('#fullscreen');fullscreen.hidden=!document.fullscreenEnabled;fullscreen.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{fullscreen.textContent='Fullscreen unavailable';}};
window.addEventListener('pagehide',event=>{if(!event.persisted)engine.dispose();});
window.addEventListener('pageshow',event=>{if(event.persisted)engine.invalidate();});
} catch(error){document.querySelector('#error').hidden=false;document.querySelector('#error').textContent=`Unable to start the city: ${error.message}`;console.error(error);}
