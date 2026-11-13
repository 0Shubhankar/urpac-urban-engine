
import test from 'node:test';

import assert from 'node:assert/strict';

import {

 roadSegments,

 makePathRoad,

 roadsTouch,

 validatePathRoad

} from '../src/core/RoadPaths.js';

import {

 ConstructionModel,

 roadsConnected

} from '../src/core/ConstructionModel.js';

function setup(){

 const state={

  boundary:2400,

  terrain:{

   dimensions:{

    width:2400,depth:2400
   }
  },

  water:{

   position:{x:0,y:2,z:0},

   dimensions:{

    width:110,depth:2400,height:1
   }
  },

  buildings:[],

  parks:[],

  trees:[],

  bridges:[],

  roads:[

   {

    id:'original',

    type:'local',

    axis:'x',

    district:'Original',

    position:{x:400,y:2,z:500},

    dimensions:{

     width:400,depth:14,height:1
    },

    visual:{color:'#697671'}
   }
  ]
 };

 return {

  state,

  model:new ConstructionModel(state)
 };
}

test('Straight roads preserve endpoints',()=>{

 const p=roadSegments(

  [400,500],[800,800],14
 );

 assert.deepEqual(p[0],[400,500]);

 assert.deepEqual(

  p.at(-1),[800,800]
 );
});

test('Quadratic curves preserve endpoints',()=>{

 const p=roadSegments(

  [400,500],[800,800],

  14,[800,500]
 );

 assert.deepEqual(p[0],[400,500]);

 assert.deepEqual(

  p.at(-1),[800,800]
 );

 assert.ok(p.length>2);

 assert.ok(

  p.some(q=>q[0]-400>q[1]-500)
 );
});

test('Freeform roads connect and support undo',()=>{

 const {state,model}=setup();

 assert.equal(

  model.drawRoad(

   [400,500],[800,800],14
  ),

  null
 );

 assert.equal(state.roads.length,2);

 assert.ok(

  roadsConnected(state.roads)
 );

 assert.equal(model.undo(),true);

 assert.equal(state.roads.length,1);

 assert.equal(model.redo(),true);

 assert.equal(state.roads.length,2);
});

test('Disconnected roads are rejected',()=>{

 const {model}=setup();

 assert.ok(

  model.drawRoad(

   [900,900],[1100,1100],14
  )
 );
});

test('Roads cannot intersect buildings',()=>{

 const {state}=setup();

 state.buildings.push({

  position:{x:600,y:2,z:650},

  dimensions:{

   width:50,depth:50,height:30
  }
 });

 const road=makePathRoad(

  roadSegments(

   [400,500],[800,800],14
  ),

  14
 );

 assert.ok(

  validatePathRoad(state,road)
 );
});

test('Bridges must cross opposite riverbanks',()=>{

 const {model}=setup();

 assert.ok(

  model.drawRoad(

   [400,500],[-400,500],

   14,null,false
  )
 );

 assert.equal(

  model.drawRoad(

   [400,500],[-400,500],

   14,null,true
  ),

  null
 );
});

test('Path roads can be widened and removed',()=>{

 const {state,model}=setup();

 assert.equal(

  model.drawRoad(

   [400,500],[800,800],14
  ),

  null
 );

 const id=state.roads.at(-1).id;

 assert.equal(

  model.widenRoad(id,20),null
 );

 assert.equal(

  model.find(id).object.path.width,20
 );

 assert.equal(

  model.demolish(id),null
 );

 assert.equal(state.roads.length,1);
});
