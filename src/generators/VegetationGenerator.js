export function generateVegetation(c,random,parks) {
 const trees=[];
 const add=(x,z)=>trees.push({id:`tree-${trees.length+1}`,type:'tree',district:'Landscape',position:{x,y:2,z},dimensions:{width:random.range(7,11),depth:8,height:random.range(14,23)},orientation:0,visual:{color:random.pick(['#577c54','#70925d','#8aab6f','#426d58'])}});
 for(const x of [-137,-100,100,137]) for(let z=-550;z<570;z+=30) if(c.rowCoordinates.every(r=>Math.abs(z-r)>25))add(x,z);
 for(const x of [-565,565])for(let z=-540;z<550;z+=32)add(x,z);
 for(const p of parks) for(let i=0;i<35;i++){let x=random.range(-60,60),z=random.range(-60,60);if(Math.abs(x)>10&&Math.abs(z)>10)add(p.position.x+x,p.position.z+z);}
 for(const x of [-450,-270,270,450])for(let z=-510;z<530;z+=180)for(const dx of [-64,64])add(x+dx,z);
 return trees;
}
