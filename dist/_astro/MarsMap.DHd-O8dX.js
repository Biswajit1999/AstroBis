import{j as e}from"./jsx-runtime.CYiYLu1p.js";import{r as u}from"./index.CZlPm10g.js";import{C as q,u as J,S as D,g as w,b as Q,M as X,A as R,E as Y,B as Z,T as ee,h as M,L as S,H as I,e as re,f as ae,c as se,d as T,a as ie,O as te}from"./Bloom.CdVrq9AT.js";import{c as A,L as oe,M as ne,R as le,E as ce,C as me}from"./rocket.HyhI223X.js";import"./client.vFaO0wSm.js";/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]],$=A("circle-dot",de);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],ue=A("info",pe);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}]],G=A("mountain",xe);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],ge=A("search",he),N="/AstroBis".endsWith("/")?"/AstroBis":"/AstroBis/",fe=`${N}data/mars-map.json`,U=`${N}assets/mars-texture.jpg`,be=`${N}assets/mars-mola-heightmap.png`,W=`${N}assets/mars-mola-hillshade.jpg`,_={minMeters:-8177,maxMeters:21171,marsRadiusMeters:3389500,get elevationSpanScale(){return(this.maxMeters-this.minMeters)/this.marsRadiusMeters},get zeroDatumNorm(){return(0-this.minMeters)/(this.maxMeters-this.minMeters)}},L={x:M.degToRad(-2),y:M.degToRad(-30),z:0},je={schemaVersion:1,generatedAt:"2026-08-03T00:00:00.000Z",body:{name:"Mars",radiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,gravityMs2:3.71,escapeVelocityKms:5.03,meanDistanceAu:1.523679,orbitalPeriodDays:686.98,solHours:24.6597,axialTiltDeg:25.19,knownMoons:2,moons:["Phobos","Deimos"],atmosphere:"Thin CO2-dominated atmosphere with dust and water-ice clouds.",surface:"Basaltic crust, iron-oxide dust, volcanoes, canyon systems, impact basins, and polar layered deposits."},textures:{localSurfaceUrl:"assets/mars-texture.jpg",localHeightmapUrl:"assets/mars-mola-heightmap.png",localHillshadeUrl:"assets/mars-mola-hillshade.jpg",surfaceCredit:"Solar System Scope / Wikimedia Commons Mars texture map",heightmapCredit:"NASA PDS Mars Global Surveyor MOLA MEGDR median topography",elevationRangeMeters:{min:-8177,max:21171},textureNote:"Surface color is a public global texture; 3D terrain and relief shading are derived from NASA PDS MOLA topography and vertically exaggerated for readability."},features:[{id:"olympus-mons",name:"Olympus Mons",type:"volcano",lat:18.65,lon:-133.8,scale:"about 600 km wide",priority:"major",summary:"Largest known volcano in the Solar System.",source:"NASA / USGS Mars reference"},{id:"valles-marineris",name:"Valles Marineris",type:"canyon system",lat:-14,lon:-60,scale:"more than 4,000 km long",priority:"major",summary:"A vast equatorial canyon system.",source:"NASA / USGS Mars reference"},{id:"jezero-crater",name:"Jezero Crater",type:"crater / delta",lat:18.38,lon:77.58,scale:"about 45 km diameter",priority:"mission",summary:"Perseverance landing region with an ancient delta.",source:"NASA Mars 2020"}],landingSites:[{id:"curiosity",name:"Curiosity",agency:"NASA",status:"active rover",lat:-4.5895,lon:137.4417,summary:"Mars Science Laboratory rover in Gale Crater."},{id:"perseverance",name:"Perseverance",agency:"NASA",status:"active rover",lat:18.4447,lon:77.4508,summary:"Mars 2020 rover in Jezero Crater."}],moons:[{name:"Phobos",radiusKm:11.1,orbitKm:9376,orbitalPeriodHours:7.65,summary:"Inner, larger moon."},{name:"Deimos",radiusKm:6.2,orbitKm:23463,orbitalPeriodHours:30.31,summary:"Outer, smaller moon."}],sources:[],notes:{coordinates:"Approximate feature center points normalized to -180 to +180 longitude.",visualization:"A real-data WebGL atlas with MOLA-derived terrain, not a rover-scale GIS terrain engine."}},F={volcano:"#fb923c","canyon system":"#facc15","impact basin":"#60a5fa",crater:"#fda4af","crater / delta":"#34d399","impact basin / plain":"#93c5fd","volcanic province":"#fdba74","volcanic chain":"#f97316","fracture / mineral region":"#22d3ee","fractured terrain":"#a78bfa","ice-filled crater":"#e0f2fe","north polar layered deposits":"#bfdbfe","south polar layered deposits":"#bfdbfe",mission:"#4ade80"},B=[{key:"olympus-mons",label:"Olympus"},{key:"valles-marineris",label:"Valles"},{key:"jezero-crater",label:"Jezero"},{key:"gale-crater",label:"Gale"},{key:"planum-boreum",label:"North pole"}];function K(r,i=0){return Number.isFinite(Number(r))?Number(r).toLocaleString(void 0,{maximumFractionDigits:i,minimumFractionDigits:i}):"n/a"}function C(r){return(Number(r)+540)%360-180}function P(r,i,t=1){const s=M.degToRad(90-Number(r)),a=M.degToRad(C(i)+180);return new T(-t*Math.sin(s)*Math.cos(a),t*Math.cos(s),t*Math.sin(s)*Math.sin(a))}function E(r){return{lat:M.clamp((.5-r.y)*180,-90,90),lon:C(r.x*360-180)}}function O(r){return{left:`${(C(r.lon)+180)/360*100}%`,top:`${(90-r.lat)/180*100}%`}}function ye(r,i=1.006){const t=[];for(let s=-180;s<=180;s+=4)t.push(P(r,s,i));return t}function ve(r,i=1.006){const t=[];for(let s=-88;s<=88;s+=4)t.push(P(s,r,i));return t}function Me({visible:r}){const i=u.useMemo(()=>new re({uniforms:{glowColor:{value:new se("#fb923c")},intensity:{value:r?1:0}},vertexShader:`
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.74 - abs(vNormal.z), 2.35);
        float haze = clamp(rim, 0.0, 0.34) * intensity;
        gl_FragColor = vec4(glowColor, haze);
      }
    `,transparent:!0,side:ae,depthWrite:!1,blending:R}),[r]);return u.useEffect(()=>{i.uniforms.intensity.value=r?1:0},[i,r]),r?e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[1.055,128,128]}),e.jsx("primitive",{object:i,attach:"material"})]}):null}function ke({visible:r}){return r?e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{position:[0,1.011,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("circleGeometry",{args:[.22,80]}),e.jsx("meshBasicMaterial",{color:"#dbeafe",transparent:!0,opacity:.52,depthWrite:!1})]}),e.jsxs("mesh",{position:[0,-1.011,0],rotation:[Math.PI/2,0,0],children:[e.jsx("circleGeometry",{args:[.18,80]}),e.jsx("meshBasicMaterial",{color:"#e0f2fe",transparent:!0,opacity:.42,depthWrite:!1})]})]}):null}function we({visible:r}){if(!r)return null;const i=[-60,-30,0,30,60],t=[-150,-120,-90,-60,-30,0,30,60,90,120,150,180];return e.jsxs("group",{children:[i.map(s=>e.jsx(S,{points:ye(s),color:s===0?"#facc15":"#94a3b8",transparent:!0,opacity:s===0?.42:.18,lineWidth:.55},`lat-${s}`)),t.map(s=>e.jsx(S,{points:ve(s),color:"#94a3b8",transparent:!0,opacity:s===0?.32:.16,lineWidth:.45},`lon-${s}`))]})}function H({item:r,selected:i,onSelect:t,labels:s,kind:a}){const o=a==="mission"?F.mission:F[r.type]||"#93c5fd",n=P(r.lat,r.lon,i?1.04:1.026),l=i?.024:r.priority==="major"||a==="mission"?.017:.011;return e.jsxs("group",{position:n,children:[e.jsxs("mesh",{onClick:c=>{c.stopPropagation(),t({...r,kind:a})},onPointerOver:c=>{c.stopPropagation(),document.body.style.cursor="pointer"},onPointerOut:()=>{document.body.style.cursor="auto"},children:[e.jsx("sphereGeometry",{args:[l,18,18]}),e.jsx("meshBasicMaterial",{color:o})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[l*2.8,18,18]}),e.jsx("meshBasicMaterial",{color:o,transparent:!0,opacity:i?.28:.13,blending:R,depthWrite:!1})]}),s&&(i||r.priority==="major"||a==="mission")&&e.jsx(I,{center:!0,distanceFactor:2.35,children:e.jsx("button",{type:"button",className:`mars-marker-label ${i?"is-selected":""}`,onClick:c=>{c.stopPropagation(),t({...r,kind:a})},children:r.name})})]})}function Se({moons:r,visible:i}){const t=u.useRef(),s=u.useMemo(()=>[Array.from({length:160},(a,o)=>{const n=o/159*Math.PI*2;return new T(Math.cos(n)*1.55,Math.sin(n)*.08,Math.sin(n)*1.55)}),Array.from({length:160},(a,o)=>{const n=o/159*Math.PI*2;return new T(Math.cos(n)*2.18,Math.sin(n)*.13,Math.sin(n)*2.18)})],[]);return ie(({clock:a})=>{t.current&&(t.current.rotation.y=a.getElapsedTime()*.18)}),i?e.jsxs("group",{ref:t,rotation:[M.degToRad(1.1),0,M.degToRad(24)],children:[e.jsx(S,{points:s[0],color:"#fbbf24",transparent:!0,opacity:.3,lineWidth:.6}),e.jsx(S,{points:s[1],color:"#c4b5fd",transparent:!0,opacity:.22,lineWidth:.5}),(r||[]).slice(0,2).map((a,o)=>{const n=o===0?1.55:2.18,l=o===0?.8:3.5;return e.jsxs("group",{position:[Math.cos(l)*n,o===0?.08:-.06,Math.sin(l)*n],children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[o===0?.035:.027,18,18]}),e.jsx("meshStandardMaterial",{color:o===0?"#c4b5a5":"#9ca3af",roughness:.94})]}),e.jsx(I,{center:!0,distanceFactor:2.6,children:e.jsx("div",{className:"mars-moon-label",children:a.name})})]},a.name)})]}):null}function Ae(){const r=u.useRef();return e.jsx(te,{ref:r,enableDamping:!0,dampingFactor:.06,enablePan:!1,autoRotate:!1,minDistance:1.35,maxDistance:6.4})}function Ne({data:r,selected:i,onSelect:t,onCoordinate:s,layers:a,terrainBoost:o}){const[n,l,c]=J(ee,[U,be,W]);u.useMemo(()=>{n.colorSpace=D,c.colorSpace=D,n.anisotropy=8,l.anisotropy=8,c.anisotropy=8,l.wrapS=w,l.wrapT=w,c.wrapS=w,c.wrapT=w},[n,l,c]);const j=r.features||[],m=r.landingSites||[],f=a.terrain?_.elevationSpanScale*o:0,g=a.terrain?-_.zeroDatumNorm*f:0;return e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#03020d"]}),e.jsx("fog",{attach:"fog",args:["#03020d",6,17]}),e.jsx(Q,{radius:180,depth:80,count:7200,factor:3.3,saturation:.18,fade:!0,speed:.03}),e.jsx("ambientLight",{intensity:.22,color:"#fbd2a0"}),e.jsx("directionalLight",{position:[4.5,1.8,3.8],intensity:4.25,color:"#fff0d1"}),e.jsx("pointLight",{position:[4.5,1.8,3.8],intensity:3.3,color:"#fb923c",distance:12}),e.jsx("pointLight",{position:[-3.8,-1.2,-2.6],intensity:.42,color:"#60a5fa",distance:8}),e.jsxs("group",{rotation:[L.x,L.y,L.z],children:[e.jsxs("mesh",{onPointerMove:p=>{p.uv&&s(E(p.uv))},onClick:p=>{p.uv&&t({...E(p.uv),id:"coordinate-pick",name:"Selected coordinate",kind:"coordinate",type:"surface point",summary:"Manual coordinate selected on the Mars texture."})},children:[e.jsx("sphereGeometry",{args:[1,256,256]}),e.jsx("meshStandardMaterial",{map:n,bumpMap:a.relief||a.terrain?l:null,bumpScale:a.relief?.055:.022,displacementMap:a.terrain?l:null,displacementScale:f,displacementBias:g,roughness:.93,metalness:0,color:"#ffffff"})]}),a.relief&&e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[1.002,256,256]}),e.jsx("meshStandardMaterial",{map:c,displacementMap:a.terrain?l:null,displacementScale:f,displacementBias:g,transparent:!0,opacity:.28,blending:X,depthWrite:!1,roughness:1,metalness:0})]}),e.jsx(ke,{visible:a.polarCaps}),e.jsx(we,{visible:a.graticule}),a.features&&j.map(p=>e.jsx(H,{item:p,selected:i?.id===p.id,onSelect:t,labels:a.labels,kind:"feature"},p.id)),a.missions&&m.map(p=>e.jsx(H,{item:{...p,type:"mission",priority:p.status?.includes("active")?"major":"mission"},selected:i?.id===p.id,onSelect:t,labels:a.labels,kind:"mission"},p.id))]}),e.jsx(Me,{visible:a.atmosphere}),e.jsx(Se,{moons:r.moons,visible:a.moons}),e.jsxs("mesh",{position:[4.8,1.7,3.9],children:[e.jsx("sphereGeometry",{args:[.22,48,48]}),e.jsx("meshBasicMaterial",{color:"#fbbf24"})]}),e.jsxs("mesh",{position:[4.8,1.7,3.9],children:[e.jsx("sphereGeometry",{args:[.82,48,48]}),e.jsx("meshBasicMaterial",{color:"#fb923c",transparent:!0,opacity:.08,blending:R,depthWrite:!1})]}),e.jsx(Y,{children:e.jsx(Z,{luminanceThreshold:.22,luminanceSmoothing:.78,intensity:1.08,radius:.64})}),e.jsx(Ae,{})]})}function b({icon:r,label:i,active:t,onClick:s}){return e.jsxs("button",{type:"button",className:`mars-layer-button ${t?"is-active":""}`,onClick:s,title:i,children:[e.jsx(r,{size:15}),e.jsx("span",{children:i})]})}function Ce({data:r,query:i,setQuery:t,filter:s,setFilter:a,layers:o,toggleLayer:n,selected:l,setSelected:c,setFocusTick:j,terrainBoost:m,setTerrainBoost:f}){const g=r.features||[];r.landingSites;const p=u.useMemo(()=>["all",...Array.from(new Set(g.map(d=>d.type))).sort()],[g]),y=B.map(d=>g.find(v=>v.id===d.key)).filter(Boolean);return e.jsxs("aside",{className:"mars-panel mars-left-panel",children:[e.jsx("div",{className:"mars-kicker",children:"AstroBis Mars map"}),e.jsx("h1",{children:"Real 3D surface atlas"}),e.jsx("p",{children:"A WebGL Mars globe with a real texture map, NASA PDS MOLA terrain displacement, named surface features, landing-site markers, moon orbits, coordinate picking, and labelled scientific caveats."}),e.jsxs("div",{className:"mars-search",children:[e.jsx(ge,{size:16}),e.jsx("input",{value:i,onChange:d=>t(d.target.value),placeholder:"Search Mars feature or mission"})]}),e.jsx("select",{className:"mars-select",value:s,onChange:d=>a(d.target.value),"aria-label":"Feature filter",children:p.map(d=>e.jsx("option",{value:d,children:d==="all"?"All feature types":d},d))}),e.jsx("div",{className:"mars-presets",children:y.map(d=>e.jsx("button",{type:"button",onClick:()=>{c({...d,kind:"feature"}),j(v=>v+1)},children:B.find(v=>v.key===d.id)?.label||d.name},d.id))}),e.jsxs("div",{className:"mars-stats-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Radius"}),e.jsxs("strong",{children:[K(r.body?.radiusKm)," km"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Gravity"}),e.jsxs("strong",{children:[r.body?.gravityMs2," m/s2"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Sol"}),e.jsxs("strong",{children:[r.body?.solHours?.toFixed(2)," h"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Moons"}),e.jsx("strong",{children:r.body?.knownMoons})]})]}),e.jsxs("div",{className:"mars-terrain-control",children:[e.jsxs("div",{children:[e.jsx("span",{children:"MOLA terrain"}),e.jsx("strong",{children:o.terrain?`${m.toFixed(0)}x vertical`:"off"})]}),e.jsx("input",{type:"range",min:"1",max:"18",step:"1",value:m,disabled:!o.terrain,onChange:d=>f(Number(d.target.value)),"aria-label":"MOLA terrain vertical exaggeration"}),e.jsx("small",{children:"1x is closest to planetary scale; higher values make volcanoes, basins, and canyon systems legible on a whole-planet globe."})]}),e.jsxs("div",{className:"mars-layer-grid",children:[e.jsx(b,{icon:G,label:"3D terrain",active:o.terrain,onClick:()=>n("terrain")}),e.jsx(b,{icon:oe,label:"Relief",active:o.relief,onClick:()=>n("relief")}),e.jsx(b,{icon:ne,label:"Grid",active:o.graticule,onClick:()=>n("graticule")}),e.jsx(b,{icon:G,label:"Features",active:o.features,onClick:()=>n("features")}),e.jsx(b,{icon:le,label:"Missions",active:o.missions,onClick:()=>n("missions")}),e.jsx(b,{icon:$,label:"Moons",active:o.moons,onClick:()=>n("moons")}),e.jsx(b,{icon:ce,label:"Haze",active:o.atmosphere,onClick:()=>n("atmosphere")}),e.jsx(b,{icon:$,label:"Polar caps",active:o.polarCaps,onClick:()=>n("polarCaps")}),e.jsx(b,{icon:me,label:"Labels",active:o.labels,onClick:()=>n("labels")}),e.jsx(b,{icon:ue,label:"Mini map",active:o.miniMap,onClick:()=>n("miniMap")})]}),e.jsx("div",{className:"mars-note",children:r.textures?.textureNote||"MOLA terrain is vertically exaggerated for whole-planet readability."}),l?.kind==="coordinate"&&e.jsxs("div",{className:"mars-coordinate-callout",children:["Picked: ",l.lat.toFixed(2)," lat / ",l.lon.toFixed(2)," lon"]})]})}function ze({data:r,selected:i,hoverCoordinate:t,setSelected:s}){const a=i||r.features?.[0]||null;return e.jsxs("aside",{className:"mars-panel mars-right-panel",children:[e.jsxs("div",{className:"mars-panel-top",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mars-kicker",children:a?.kind==="mission"?"Landing site":a?.kind==="coordinate"?"Coordinate pick":a?.type||"Surface feature"}),e.jsx("h2",{children:a?.name||"Mars"})]}),i&&e.jsx("button",{type:"button",className:"mars-close",onClick:()=>s(null),children:"x"})]}),e.jsx("p",{className:"mars-summary",children:a?.summary||r.body?.surface}),e.jsxs("div",{className:"mars-info-list",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Latitude"}),e.jsx("strong",{children:Number.isFinite(a?.lat)?`${a.lat.toFixed(3)} deg`:"n/a"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Longitude"}),e.jsx("strong",{children:Number.isFinite(a?.lon)?`${C(a.lon).toFixed(3)} deg`:"n/a"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Scale"}),e.jsx("strong",{children:a?.scale||a?.status||"reference point"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Source"}),e.jsx("strong",{children:a?.source||a?.agency||"AstroBis Mars snapshot"})]})]}),e.jsx("div",{className:"mars-section-title",children:"Planet constants"}),e.jsxs("div",{className:"mars-info-list compact",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Mean distance"}),e.jsxs("strong",{children:[r.body?.meanDistanceAu," AU"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Orbital period"}),e.jsxs("strong",{children:[K(r.body?.orbitalPeriodDays,2)," days"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Axial tilt"}),e.jsxs("strong",{children:[r.body?.axialTiltDeg," deg"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Escape velocity"}),e.jsxs("strong",{children:[r.body?.escapeVelocityKms," km/s"]})]})]}),e.jsx("div",{className:"mars-section-title",children:"Moons"}),e.jsx("div",{className:"mars-moon-cards",children:(r.moons||[]).map(o=>e.jsxs("div",{children:[e.jsx("strong",{children:o.name}),e.jsxs("span",{children:[o.orbitalPeriodHours," h orbit"]})]},o.name))}),e.jsxs("div",{className:"mars-coordinate-readout",children:["Hover coordinate: ",t?`${t.lat.toFixed(2)} lat / ${t.lon.toFixed(2)} lon`:"move over the globe"]})]})}function Le({data:r,selected:i,setSelected:t,visible:s,query:a,filter:o,layers:n}){if(!s)return null;const l=a.trim().toLowerCase(),c=(r.features||[]).filter(m=>{const f=!l||`${m.name} ${m.type} ${m.summary}`.toLowerCase().includes(l),g=o==="all"||m.type===o;return f&&g}),j=r.landingSites||[];return e.jsxs("div",{className:"mars-mini-map",children:[e.jsx("div",{className:"mars-mini-map-bg"}),e.jsx("div",{className:`mars-mini-map-relief ${n.relief||n.terrain?"is-visible":""}`}),e.jsx("div",{className:"mars-mini-map-grid"}),c.map(m=>e.jsx("button",{type:"button",className:`mars-map-dot feature ${i?.id===m.id?"is-selected":""}`,style:O(m),title:m.name,onClick:()=>t({...m,kind:"feature"})},m.id)),j.map(m=>e.jsx("button",{type:"button",className:`mars-map-dot mission ${i?.id===m.id?"is-selected":""}`,style:O(m),title:m.name,onClick:()=>t({...m,kind:"mission",type:"mission"})},m.id)),e.jsxs("div",{className:"mars-mini-caption",children:[e.jsx("strong",{children:"Mars reference map"}),e.jsx("span",{children:"features + landing sites"})]})]})}function Te({data:r,setSelected:i}){const t=r.landingSites||[];return e.jsxs("div",{className:"mars-mission-rail",children:[e.jsx("div",{className:"mars-rail-title",children:"Landing-site chronology"}),e.jsx("div",{className:"mars-rail-list",children:t.map(s=>e.jsxs("button",{type:"button",onClick:()=>i({...s,kind:"mission",type:"mission"}),children:[e.jsx("span",{children:s.name}),e.jsx("strong",{children:s.status})]},s.id))})]})}function Re({data:r}){return e.jsx("div",{className:"mars-source-strip",children:(r.sources||[]).slice(0,4).map(i=>e.jsxs("a",{href:i.url,target:"_blank",rel:"noopener noreferrer",children:[e.jsx("span",{children:i.label}),e.jsx("small",{children:i.note})]},i.id))})}function Be(){const[r,i]=u.useState(je),[t,s]=u.useState(null),[a,o]=u.useState(null),[n,l]=u.useState(""),[c,j]=u.useState("all"),[m,f]=u.useState(0),[g,p]=u.useState(5),[y,d]=u.useState({terrain:!0,relief:!0,graticule:!0,features:!0,missions:!0,moons:!0,atmosphere:!0,labels:!0,polarCaps:!0,miniMap:!0});u.useEffect(()=>{let x=!0;async function h(){try{const k=await fetch(`${fe}?ts=${Date.now()}`,{cache:"no-store"});if(!k.ok)throw new Error("Mars snapshot unavailable");const z=await k.json();x&&(i(z),s(null))}catch{x&&s(null)}}return h(),()=>{x=!1}},[]);const v=x=>d(h=>({...h,[x]:!h[x]})),V=u.useMemo(()=>{const x=n.trim().toLowerCase();return{...r,features:(r.features||[]).filter(h=>{const k=!x||`${h.name} ${h.type} ${h.summary}`.toLowerCase().includes(x),z=c==="all"||h.type===c;return k&&z})}},[r,n,c]);return e.jsxs("div",{className:"mars-map-shell",children:[e.jsx(q,{camera:{position:[.12,.28,3.05],fov:43},dpr:[1,1.75],children:e.jsx(u.Suspense,{fallback:null,children:e.jsx(Ne,{data:V,selected:t,onSelect:x=>{s(x),f(h=>h+1)},onCoordinate:o,layers:y,terrainBoost:g})})}),e.jsxs("div",{className:"mars-top-strip",children:[e.jsxs("span",{children:["UTC ",new Date(r.generatedAt||Date.now()).toISOString().slice(0,16).replace("T"," ")]}),e.jsx("strong",{children:"Mars Areography Console"}),e.jsxs("span",{children:[(r.features||[]).length," features / ",(r.landingSites||[]).length," landers and rovers / MOLA ",y.terrain?`${g}x terrain`:"terrain off"]})]}),e.jsx(Ce,{data:r,query:n,setQuery:l,filter:c,setFilter:j,layers:y,toggleLayer:v,selected:t,setSelected:s,setFocusTick:f,terrainBoost:g,setTerrainBoost:p}),e.jsx(ze,{data:r,selected:t,hoverCoordinate:a,setSelected:s}),e.jsx(Le,{data:r,selected:t,setSelected:s,visible:y.miniMap,query:n,filter:c,layers:y}),e.jsx(Te,{data:r,setSelected:x=>{s(x),f(h=>h+1)}}),e.jsx(Re,{data:r}),e.jsxs("div",{className:"mars-credit",children:["Texture: ",r.textures?.surfaceCredit||"Mars public texture"," - Terrain: ",r.textures?.heightmapCredit||"NASA PDS MOLA MEGDR"," - Data: NASA / USGS / IAU reference sources"]}),e.jsx("style",{children:Pe})]})}const Pe=`
.mars-map-shell {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px);
  min-height: 740px;
  overflow: hidden;
  background:
    radial-gradient(circle at 54% 46%, rgba(251,146,60,0.18), transparent 35%),
    radial-gradient(circle at 88% 12%, rgba(96,165,250,0.12), transparent 24%),
    #03020d;
  color: #fff;
}
.mars-panel {
  position: absolute;
  z-index: 26;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(5, 8, 18, 0.78);
  border-radius: 20px;
  padding: 1rem;
  backdrop-filter: blur(22px);
  box-shadow: 0 20px 80px rgba(0,0,0,0.34);
}
.mars-left-panel {
  top: 86px;
  left: 20px;
  width: min(360px, calc(100vw - 40px));
  max-height: calc(100% - 350px);
  overflow-y: auto;
}
.mars-right-panel {
  top: 86px;
  right: 20px;
  width: min(370px, calc(100vw - 40px));
  max-height: calc(100% - 128px);
  overflow-y: auto;
}
.mars-kicker {
  color: #67e8f9;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.mars-left-panel h1,
.mars-right-panel h2 {
  font-family: Space Grotesk, Inter, sans-serif;
  margin: 0.35rem 0 0.55rem;
  line-height: 1.02;
}
.mars-left-panel h1 {
  font-size: 1.85rem;
}
.mars-right-panel h2 {
  font-size: 1.55rem;
}
.mars-left-panel p,
.mars-summary {
  color: rgba(255,255,255,0.58);
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}
.mars-search {
  margin-top: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 0.65rem 0.75rem;
}
.mars-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #fff;
  background: transparent;
  font-size: 13px;
}
.mars-search input::placeholder {
  color: rgba(255,255,255,0.38);
}
.mars-select {
  width: 100%;
  margin-top: 0.7rem;
  border: 1px solid rgba(255,255,255,0.12);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.045)),
    #11131d;
  color: #fff;
  border-radius: 14px;
  padding: 0.68rem 0.75rem;
  font-weight: 800;
  color-scheme: dark;
  outline: 0;
}
.mars-select:focus {
  border-color: rgba(251,146,60,0.44);
  box-shadow: 0 0 0 3px rgba(251,146,60,0.16);
}
.mars-select option {
  color: #fff;
  background: #11131d;
  font-weight: 800;
}
.mars-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 0.75rem;
}
.mars-presets button,
.mars-layer-button {
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.055);
  color: rgba(255,255,255,0.76);
  border-radius: 999px;
  padding: 0.48rem 0.7rem;
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
}
.mars-layer-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
  border-radius: 12px;
  min-height: 38px;
}
.mars-layer-button.is-active {
  color: #fed7aa;
  border-color: rgba(251,146,60,0.42);
  background: rgba(251,146,60,0.14);
}
.mars-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 0.85rem;
}
.mars-stats-grid div,
.mars-moon-cards div {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  border-radius: 12px;
  padding: 0.6rem;
}
.mars-stats-grid span,
.mars-info-list span,
.mars-moon-cards span {
  display: block;
  color: rgba(255,255,255,0.42);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.mars-stats-grid strong {
  display: block;
  margin-top: 3px;
  color: #fed7aa;
  font-size: 14px;
}
.mars-terrain-control {
  margin-top: 0.85rem;
  border: 1px solid rgba(251,146,60,0.18);
  background: linear-gradient(135deg, rgba(251,146,60,0.11), rgba(96,165,250,0.055));
  border-radius: 14px;
  padding: 0.72rem;
}
.mars-terrain-control div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.mars-terrain-control span {
  color: #fed7aa;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.mars-terrain-control strong {
  color: #93c5fd;
  font-size: 12px;
}
.mars-terrain-control input {
  width: 100%;
  margin: 0.62rem 0 0.38rem;
  accent-color: #fb923c;
}
.mars-terrain-control input:disabled {
  opacity: 0.45;
}
.mars-terrain-control small {
  display: block;
  color: rgba(255,255,255,0.46);
  font-size: 10.5px;
  line-height: 1.45;
}
.mars-layer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 0.85rem;
}
.mars-note,
.mars-coordinate-callout,
.mars-coordinate-readout {
  margin-top: 0.85rem;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  border-radius: 12px;
  padding: 0.65rem;
  color: rgba(255,255,255,0.48);
  font-size: 11px;
  line-height: 1.5;
}
.mars-coordinate-callout {
  color: #bfdbfe;
  border-color: rgba(96,165,250,0.22);
}
.mars-panel-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}
.mars-close {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.75);
  font-weight: 900;
  cursor: pointer;
}
.mars-info-list {
  margin-top: 0.95rem;
}
.mars-info-list div {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 0.52rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.mars-info-list strong {
  color: #93c5fd;
  text-align: right;
  max-width: 62%;
  font-size: 12px;
}
.mars-info-list.compact strong {
  color: #fed7aa;
}
.mars-section-title {
  margin-top: 1rem;
  color: #fda4af;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.mars-moon-cards {
  margin-top: 0.65rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.mars-moon-cards strong {
  display: block;
  color: #fff;
  margin-bottom: 4px;
}
.mars-top-strip {
  position: absolute;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 24;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  max-width: min(760px, calc(100vw - 860px));
  padding: 0.56rem 0.8rem;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 999px;
  background: rgba(5,8,18,0.62);
  backdrop-filter: blur(18px);
  color: rgba(255,255,255,0.52);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
}
.mars-top-strip strong {
  color: #fed7aa;
}
.mars-marker-label,
.mars-moon-label {
  border: 1px solid rgba(251,146,60,0.44);
  background: rgba(5,8,18,0.78);
  color: #fed7aa;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 900;
  white-space: nowrap;
  pointer-events: auto;
}
.mars-marker-label.is-selected {
  color: #fff;
  background: rgba(251,146,60,0.28);
}
.mars-moon-label {
  color: #e5e7eb;
  border-color: rgba(196,181,253,0.38);
}
.mars-mini-map {
  position: absolute;
  left: 20px;
  bottom: 22px;
  z-index: 25;
  width: min(460px, calc(100vw - 40px));
  height: 230px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  overflow: hidden;
  background: #160b08;
  box-shadow: 0 20px 80px rgba(0,0,0,0.32);
}
.mars-mini-map-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(20,8,4,0.08), rgba(20,8,4,0.38)), url('${U}');
  background-size: cover;
  background-position: center;
  filter: saturate(1.04) contrast(1.1);
}
.mars-mini-map-relief {
  position: absolute;
  inset: 0;
  background-image: url('${W}');
  background-size: cover;
  background-position: center;
  mix-blend-mode: multiply;
  opacity: 0;
  transition: opacity 160ms ease;
}
.mars-mini-map-relief.is-visible {
  opacity: 0.34;
}
.mars-mini-map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 20% 25%, 16.66% 25%;
  opacity: 0.42;
}
.mars-map-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 1px solid #fff;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.mars-map-dot.feature {
  background: #f97316;
  box-shadow: 0 0 10px rgba(249,115,22,0.75);
}
.mars-map-dot.mission {
  background: #22c55e;
  box-shadow: 0 0 12px rgba(34,197,94,0.75);
}
.mars-map-dot.is-selected {
  width: 14px;
  height: 14px;
}
.mars-mini-caption {
  position: absolute;
  left: 12px;
  top: 10px;
  display: grid;
  gap: 2px;
}
.mars-mini-caption strong {
  font-family: Space Grotesk, Inter, sans-serif;
  font-weight: 950;
}
.mars-mini-caption span {
  color: rgba(255,255,255,0.62);
  font-size: 11px;
}
.mars-mission-rail {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 25;
  width: min(720px, calc(100vw - 980px));
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(5,8,18,0.74);
  border-radius: 18px;
  padding: 0.8rem;
  backdrop-filter: blur(20px);
}
.mars-rail-title {
  color: #67e8f9;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.55rem;
}
.mars-rail-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(128px, 1fr));
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}
.mars-rail-list button {
  text-align: left;
  min-width: 128px;
  border: 1px solid rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.04);
  color: #fff;
  border-radius: 12px;
  padding: 0.56rem;
  cursor: pointer;
}
.mars-rail-list span {
  display: block;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mars-rail-list strong {
  display: block;
  margin-top: 4px;
  color: rgba(255,255,255,0.46);
  font-size: 10px;
  line-height: 1.35;
}
.mars-source-strip {
  position: absolute;
  right: 20px;
  bottom: 22px;
  z-index: 24;
  display: none;
  gap: 8px;
  width: min(360px, calc(100vw - 40px));
}
.mars-source-strip a {
  display: block;
  text-decoration: none;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(5,8,18,0.62);
  border-radius: 12px;
  padding: 0.58rem 0.7rem;
  backdrop-filter: blur(18px);
}
.mars-source-strip span {
  display: block;
  color: #93c5fd;
  font-size: 12px;
  font-weight: 900;
}
.mars-source-strip small {
  display: block;
  margin-top: 3px;
  color: rgba(255,255,255,0.42);
  font-size: 10px;
  line-height: 1.35;
}
.mars-credit {
  position: absolute;
  right: 22px;
  bottom: 8px;
  z-index: 20;
  color: rgba(255,255,255,0.28);
  font-size: 10px;
}
@media (max-width: 1540px) {
  .mars-map-shell {
    width: auto;
    max-width: 100%;
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 78px 14px 24px;
    display: grid;
    gap: 14px;
  }
  .mars-map-shell canvas {
    order: -1;
    min-height: 560px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
  }
  .mars-panel,
  .mars-top-strip,
  .mars-mini-map,
  .mars-mission-rail,
  .mars-source-strip,
  .mars-credit {
    position: relative;
    inset: auto;
    transform: none;
    width: auto;
    max-width: none;
  }
  .mars-right-panel {
    max-height: none;
  }
  .mars-top-strip {
    max-width: none;
    justify-content: space-between;
    order: -2;
    overflow-x: auto;
  }
  .mars-left-panel {
    order: 0;
  }
  .mars-mini-map {
    height: 230px;
  }
  .mars-mission-rail {
    padding: 0.75rem;
  }
  .mars-rail-list {
    grid-template-columns: repeat(5, minmax(150px, 1fr));
  }
  .mars-source-strip {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    display: grid;
  }
}
@media (max-width: 640px) {
  .mars-map-shell {
    padding-left: 10px;
    padding-right: 10px;
  }
  .mars-map-shell canvas {
    min-height: 470px;
  }
  .mars-left-panel h1 {
    font-size: 1.52rem;
  }
  .mars-layer-grid,
  .mars-stats-grid {
    grid-template-columns: 1fr;
  }
  .mars-moon-cards {
    grid-template-columns: 1fr;
  }
  .mars-top-strip {
    align-items: flex-start;
    border-radius: 16px;
    white-space: normal;
    flex-wrap: wrap;
  }
}
`;export{Be as default};
