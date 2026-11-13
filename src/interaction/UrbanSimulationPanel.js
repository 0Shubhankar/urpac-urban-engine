
import {

 DEFAULTS,

 UrbanSimulation

} from '../core/UrbanSimulation.js';

export function attachUrbanSimulation(engine){

 const sim=new UrbanSimulation(
  engine.state
 );

 engine.simulation=sim;

 let speed=0;

 const months=[
  'January','February','March',
  'April','May','June',
  'July','August','September',
  'October','November','December'
 ];

 const panel=document.createElement(
  'details'
 );

 panel.id='urban-simulation';

 panel.open=true;

 panel.innerHTML=`
 <summary>URBAN SIMULATION</summary>

 <div class="simulation-content">

  <div id="simulation-date"></div>

  <div class="simulation-speed">

   <button data-speed="0">Pause</button>

   <button data-speed="1">1×</button>

   <button data-speed="2">2×</button>

   <button data-speed="5">5×</button>

  </div>

  <button id="simulation-step">
   Advance one month
  </button>

  <div id="simulation-metrics"></div>

  <div id="simulation-services"></div>

  <details class="simulation-subsection">

   <summary>Population dynamics</summary>

   <div id="simulation-flows"></div>

  </details>

  <details class="simulation-subsection">

   <summary>Model assumptions</summary>

   <p>
    Illustrative parameters.
    Not empirically calibrated.
   </p>

   <div id="simulation-parameters"></div>

   <button id="simulation-apply">
    Apply assumptions
   </button>

   <button id="simulation-defaults">
    Restore default assumptions
   </button>

  </details>

  <p id="simulation-message"
   role="status">
   Simulation paused.
  </p>

 </div>`;

 document.querySelector(
  '#construction-panel'
 ).append(panel);

 const get=id=>panel.querySelector(
  '#'+id
 );

 const format=n=>

  Math.round(n).toLocaleString();

 const percent=n=>

  (n*100).toFixed(1)+'%';

 function tell(message,error=false){

  const status=get('simulation-message');

  status.textContent=message;

  status.dataset.error=String(error);
 }

 function setSpeed(value){

  speed=value;

  panel.querySelectorAll(
   '[data-speed]'
  ).forEach(b=>

   b.setAttribute(
    'aria-pressed',
    String(Number(b.dataset.speed)===speed)
   )
  );

  tell(speed
   ?'Simulation running.'
   :'Simulation paused.'
  );
 }

 function metric(label,value){

  const box=document.createElement('div');

  const name=document.createElement(
   'small'
  );

  name.textContent=label;

  const number=document.createElement(
   'strong'
  );

  number.textContent=value;

  box.append(name,number);

  return box;
 }

 function service(label,value){

  const box=document.createElement('div');

  box.className='simulation-service';

  const row=document.createElement('div');

  row.className='simulation-service-label';

  const name=document.createElement(
   'span'
  );

  name.textContent=label;

  const text=document.createElement(
   'span'
  );

  text.textContent=percent(value);

  row.append(name,text);

  const track=document.createElement(
   'div'
  );

  track.className='simulation-track';

  const bar=document.createElement('div');

  bar.className='simulation-bar';

  bar.style.width=
   Math.min(
    100,Math.max(0,value*100)
   )+'%';

  bar.style.background=
   value<.5?'#b96c58':
   value<.8?'#b39c61':'#68987b';

  track.append(bar);

  box.append(row,track);

  return box;
 }

 function refresh(){

  const m=sim.getMetrics();

  const month=sim.data.month;

  get('simulation-date').textContent=

   'Year '+(Math.floor(month/12)+1)+

   ' · '+months[month%12];

  const values=[

   ['Population',
    format(m.population)],

   ['Housing capacity',
    format(m.housing)],

   ['Job capacity',
    format(m.jobs)],

   ['Employed residents',
    format(m.employed)],

   ['Housing occupancy',
    m.housing
     ?percent(m.occupancy)
     :'N/A'],

   ['Unemployment',
    percent(m.unemployment)],

   ['Housing shortage',
    format(m.housingShortage)],

   ['Green space/person',
    m.greenPerResident.toFixed(1)+' m²'],

   ['Land-value index',
    m.value.toFixed(1)],

   ['Vacant housing',
    format(m.vacantCapacity)]
  ];

  const grid=get('simulation-metrics');

  grid.replaceChildren();

  for(const [label,value] of values){

   grid.append(metric(label,value));
  }

  const services=get(
   'simulation-services'
  );

  services.replaceChildren();

  for(const [label,value] of [

   ['Healthcare adequacy',
    m.healthAdequacy],

   ['Education adequacy',
    m.schoolAdequacy],

   ['Green-space adequacy',
    m.greenAdequacy],

   ['Road proximity index',
    m.access]

  ]){

   services.append(
    service(label,value)
   );
  }

  const flow=sim.data.last;

  const flows=get('simulation-flows');

  flows.replaceChildren();

  for(const [label,value] of [

   ['Births',flow.births],

   ['Deaths',flow.deaths],

   ['Net migration',flow.migration],

   ['Net population change',

    flow.births-flow.deaths+
    flow.migration]
  ]){

   const row=document.createElement(
    'div'
   );

   row.textContent=
    label+': '+value.toFixed(2);

   flows.append(row);
  }
 }

 const labels={

  floorHeight:'Floor height (m)',

  usableShare:'Usable floor share',

  residentialSpace:'Residential m²/person',

  officeSpace:'Office m²/job',

  commercialSpace:'Commercial m²/job',

  publicJobSpace:'Public facility m²/job',

  initialOccupancy:'Initial occupancy',

  labourShare:'Labour participation',

  schoolShare:'School-age population share',

  greenTarget:'Green m²/person target',

  migrationRate:'Monthly migration limit',

  birthRate:'Annual birth rate',

  deathRate:'Annual death rate',

  healthSpace:'Healthcare m²/resident proxy',

  schoolSpace:'School m²/student',

  accessDistance:'Road distance decay (m)',

  parkDistance:'Park distance decay (m)'
 };

 function refreshParameters(){

  const grid=get(
   'simulation-parameters'
  );

  grid.replaceChildren();

  for(const [key,value] of Object.entries(
   sim.data.parameters
  )){

   const row=document.createElement(
    'label'
   );

   const name=document.createElement(
    'span'
   );

   name.textContent=labels[key]||key;

   const input=document.createElement(
    'input'
   );

   input.type='number';

   input.step='any';

   input.min='0';

   input.value=String(value);

   input.dataset.parameter=key;

   row.append(name,input);

   grid.append(row);
  }
 }

 function save(){

  engine.saveSimulation?.();
 }

 function advance(){

  try{

   sim.advance(1);

   refresh();

   save();

  }catch(error){

   setSpeed(0);

   tell(error.message,true);
  }
 }

 panel.querySelectorAll(
  '[data-speed]'
 ).forEach(b=>{

  b.onclick=()=>

   setSpeed(Number(b.dataset.speed));
 });

 get('simulation-step').onclick=()=>{

  setSpeed(0);

  advance();
 };

 get('simulation-apply').onclick=()=>{

  try{

   const values={};

   panel.querySelectorAll(
    '[data-parameter]'
   ).forEach(input=>{

    if(input.value==='')

     throw Error('All assumptions required');

    values[input.dataset.parameter]=
     Number(input.value);
   });

   sim.setParameters(values);

   refresh();

   save();

   tell('Assumptions updated.');

  }catch(error){

   tell(error.message,true);
  }
 };

 get('simulation-defaults').onclick=()=>{

  sim.setParameters(DEFAULTS);

  refreshParameters();

  refresh();

  save();

  tell('Default assumptions restored.');
 };

 const previousChanged=engine.onCityChanged;

 engine.onCityChanged=()=>{

  previousChanged?.();

  refresh();
 };

 // Called after loading a city snapshot.

 engine.restoreSimulation=data=>{

  setSpeed(0);

  sim.restore(data);

  refreshParameters();

  refresh();
 };

 // One month every 2 seconds at 1x.
 // No time advancement in hidden tabs.

 let elapsed=0;

 let previous=performance.now();

 const timer=setInterval(()=>{

  const now=performance.now();

  const delta=Math.min(
   now-previous,500
  );

  previous=now;

  if(document.hidden||!speed){

   elapsed=0;

   return;
  }

  elapsed+=delta*speed;

  while(elapsed>=2000){

   elapsed-=2000;

   advance();

   if(!speed)break;
  }

 },200);

 const dispose=engine.dispose.bind(engine);

 engine.dispose=()=>{

  clearInterval(timer);

  panel.remove();

  dispose();
 };

 refreshParameters();

 refresh();

 setSpeed(0);
}
