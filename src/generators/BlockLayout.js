// Grid-based layout, independent of the renderer. The first U0.2 increment
// deliberately retains the original 1200 m boundary and straight river.
const allowed = new Set(['Garden Quarter','Westbank Living','Civic Commons','Market Quarter','Central Business District']);
export function createBlocks(config) {
  const {roadCoordinates: xs,rowCoordinates: zs,layout} = config;
  if (!Array.isArray(xs) || xs.length < 4 || !Array.isArray(zs) || zs.length < 3) throw new Error('Layout needs road columns and rows.');
  for (const axis of [xs,zs]) {
    if(axis.some((v,i)=>!Number.isFinite(v)||Math.abs(v)>540||(i>0&&v-axis[i-1]<155))) throw new Error('Roads must be ordered, within ±540 m and at least 155 m apart.');
  }
  if(xs.some(x=>Math.abs(x)<145)) throw new Error('Vertical roads must clear the riverside corridor.');
  if(!xs.some(x=>x<0)||!xs.some(x=>x>0)) throw new Error('Roads are required on both river banks.');
  const columns=xs.slice(0,-1).map((x,i)=>[x,xs[i+1]]).filter(([a,b])=>a*b>0);
  if(!Array.isArray(layout.districtGrid)||layout.districtGrid.length!==columns.length||layout.districtGrid.some(col=>!Array.isArray(col)||col.length!==zs.length-1||col.some(d=>!allowed.has(d)))) throw new Error('District grid must match the buildable blocks.');
  if(!Array.isArray(layout.parks)||layout.parks.some(p=>!Array.isArray(p)||p.length!==2||!Number.isInteger(p[0])||!Number.isInteger(p[1])||p[0]<0||p[0]>=columns.length||p[1]<0||p[1]>=zs.length-1)) throw new Error('Park coordinates must identify buildable blocks.');
  const parkKeys=new Set(layout.parks.map(p=>p.join(':')));
  return columns.flatMap(([left,right],i)=>zs.slice(0,-1).map((bottom,j)=>({id:`block-${i}-${j}`,x:(left+right)/2,z:(bottom+zs[j+1])/2,width:right-left,depth:zs[j+1]-bottom,district:layout.districtGrid[i][j],park:parkKeys.has(`${i}:${j}`)})));
}
