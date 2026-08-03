import{j as e}from"./jsx-runtime.CYiYLu1p.js";import{r as u}from"./index.CZlPm10g.js";import{C as J,u as Q,S as D,g as S,b as X,M as Y,A as P,E as Z,B as ee,T as re,h as v,L as A,H as I,e as ae,f as se,c as te,d as N,a as U,i as ie,j as oe,O as ne}from"./Bloom.B1EckQMS.js";import{c as C,L as le,M as ce,R as me,E as de,C as pe}from"./rocket.HyhI223X.js";import"./client.vFaO0wSm.js";/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]],$=C("circle-dot",ue);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],he=C("info",xe);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}]],G=C("mountain",ge);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],be=C("search",fe),z="/AstroBis".endsWith("/")?"/AstroBis":"/AstroBis/",je=`${z}data/mars-map.json`,W=`${z}assets/mars-texture.jpg`,ye=`${z}assets/mars-mola-heightmap.png`,K=`${z}assets/mars-mola-hillshade.jpg`,_={minMeters:-8177,maxMeters:21171,marsRadiusMeters:3389500,get elevationSpanScale(){return(this.maxMeters-this.minMeters)/this.marsRadiusMeters},get zeroDatumNorm(){return(0-this.minMeters)/(this.maxMeters-this.minMeters)}},k={x:v.degToRad(-2),y:v.degToRad(-30),z:0},ve={schemaVersion:1,generatedAt:"2026-08-03T00:00:00.000Z",body:{name:"Mars",radiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,gravityMs2:3.71,escapeVelocityKms:5.03,meanDistanceAu:1.523679,orbitalPeriodDays:686.98,solHours:24.6597,axialTiltDeg:25.19,knownMoons:2,moons:["Phobos","Deimos"],atmosphere:"Thin CO2-dominated atmosphere with dust and water-ice clouds.",surface:"Basaltic crust, iron-oxide dust, volcanoes, canyon systems, impact basins, and polar layered deposits."},textures:{localSurfaceUrl:"assets/mars-texture.jpg",localHeightmapUrl:"assets/mars-mola-heightmap.png",localHillshadeUrl:"assets/mars-mola-hillshade.jpg",surfaceCredit:"Solar System Scope / Wikimedia Commons Mars texture map",heightmapCredit:"NASA PDS Mars Global Surveyor MOLA MEGDR median topography",elevationRangeMeters:{min:-8177,max:21171},textureNote:"Surface color is a public global texture; 3D terrain and relief shading are derived from NASA PDS MOLA topography and vertically exaggerated for readability."},features:[{id:"olympus-mons",name:"Olympus Mons",type:"volcano",lat:18.65,lon:-133.8,scale:"about 600 km wide",priority:"major",summary:"Largest known volcano in the Solar System.",source:"NASA / USGS Mars reference"},{id:"valles-marineris",name:"Valles Marineris",type:"canyon system",lat:-14,lon:-60,scale:"more than 4,000 km long",priority:"major",summary:"A vast equatorial canyon system.",source:"NASA / USGS Mars reference"},{id:"jezero-crater",name:"Jezero Crater",type:"crater / delta",lat:18.38,lon:77.58,scale:"about 45 km diameter",priority:"mission",summary:"Perseverance landing region with an ancient delta.",source:"NASA Mars 2020"}],landingSites:[{id:"curiosity",name:"Curiosity",agency:"NASA",status:"active rover",lat:-4.5895,lon:137.4417,summary:"Mars Science Laboratory rover in Gale Crater."},{id:"perseverance",name:"Perseverance",agency:"NASA",status:"active rover",lat:18.4447,lon:77.4508,summary:"Mars 2020 rover in Jezero Crater."}],moons:[{name:"Phobos",radiusKm:11.1,orbitKm:9376,orbitalPeriodHours:7.65,summary:"Inner, larger moon."},{name:"Deimos",radiusKm:6.2,orbitKm:23463,orbitalPeriodHours:30.31,summary:"Outer, smaller moon."}],sources:[],notes:{coordinates:"Approximate feature center points normalized to -180 to +180 longitude.",visualization:"A real-data WebGL atlas with MOLA-derived terrain, not a rover-scale GIS terrain engine."}},E={volcano:"#fb923c","canyon system":"#facc15","impact basin":"#60a5fa",crater:"#fda4af","crater / delta":"#34d399","impact basin / plain":"#93c5fd","volcanic province":"#fdba74","volcanic chain":"#f97316","fracture / mineral region":"#22d3ee","fractured terrain":"#a78bfa","ice-filled crater":"#e0f2fe","north polar layered deposits":"#bfdbfe","south polar layered deposits":"#bfdbfe",mission:"#4ade80"},F=[{key:"olympus-mons",label:"Olympus"},{key:"valles-marineris",label:"Valles"},{key:"jezero-crater",label:"Jezero"},{key:"gale-crater",label:"Gale"},{key:"planum-boreum",label:"North pole"}];function V(r,t=0){return Number.isFinite(Number(r))?Number(r).toLocaleString(void 0,{maximumFractionDigits:t,minimumFractionDigits:t}):"n/a"}function L(r){return(Number(r)+540)%360-180}function T(r,t,i=1){const s=v.degToRad(90-Number(r)),a=v.degToRad(L(t)+180);return new N(-i*Math.sin(s)*Math.cos(a),i*Math.cos(s),i*Math.sin(s)*Math.sin(a))}function B(r){return{lat:v.clamp((.5-r.y)*180,-90,90),lon:L(r.x*360-180)}}function O(r){return{left:`${(L(r.lon)+180)/360*100}%`,top:`${(90-r.lat)/180*100}%`}}function Me(r,t=1.006){const i=[];for(let s=-180;s<=180;s+=4)i.push(T(r,s,t));return i}function ke(r,t=1.006){const i=[];for(let s=-88;s<=88;s+=4)i.push(T(s,r,t));return i}function we({visible:r}){const t=u.useMemo(()=>new ae({uniforms:{glowColor:{value:new te("#fb923c")},intensity:{value:r?1:0}},vertexShader:`
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
    `,transparent:!0,side:se,depthWrite:!1,blending:P}),[r]);return u.useEffect(()=>{t.uniforms.intensity.value=r?1:0},[t,r]),r?e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[1.055,128,128]}),e.jsx("primitive",{object:t,attach:"material"})]}):null}function Se({visible:r}){return r?e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{position:[0,1.011,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("circleGeometry",{args:[.22,80]}),e.jsx("meshBasicMaterial",{color:"#dbeafe",transparent:!0,opacity:.52,depthWrite:!1})]}),e.jsxs("mesh",{position:[0,-1.011,0],rotation:[Math.PI/2,0,0],children:[e.jsx("circleGeometry",{args:[.18,80]}),e.jsx("meshBasicMaterial",{color:"#e0f2fe",transparent:!0,opacity:.42,depthWrite:!1})]})]}):null}function Ae({visible:r}){if(!r)return null;const t=[-60,-30,0,30,60],i=[-150,-120,-90,-60,-30,0,30,60,90,120,150,180];return e.jsxs("group",{children:[t.map(s=>e.jsx(A,{points:Me(s),color:s===0?"#facc15":"#94a3b8",transparent:!0,opacity:s===0?.42:.18,lineWidth:.55},`lat-${s}`)),i.map(s=>e.jsx(A,{points:ke(s),color:"#94a3b8",transparent:!0,opacity:s===0?.32:.16,lineWidth:.45},`lon-${s}`))]})}function H({item:r,selected:t,onSelect:i,labels:s,kind:a}){const o=a==="mission"?E.mission:E[r.type]||"#93c5fd",n=T(r.lat,r.lon,t?1.04:1.026),p=t?.024:r.priority==="major"||a==="mission"?.017:.011;return e.jsxs("group",{position:n,children:[e.jsxs("mesh",{onClick:l=>{l.stopPropagation(),i({...r,kind:a})},onPointerOver:l=>{l.stopPropagation(),document.body.style.cursor="pointer"},onPointerOut:()=>{document.body.style.cursor="auto"},children:[e.jsx("sphereGeometry",{args:[p,18,18]}),e.jsx("meshBasicMaterial",{color:o})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[p*2.8,18,18]}),e.jsx("meshBasicMaterial",{color:o,transparent:!0,opacity:t?.28:.13,blending:P,depthWrite:!1})]}),s&&(t||r.priority==="major"||a==="mission")&&e.jsx(I,{center:!0,distanceFactor:2.35,children:e.jsx("button",{type:"button",className:`mars-marker-label ${t?"is-selected":""}`,onClick:l=>{l.stopPropagation(),i({...r,kind:a})},children:r.name})})]})}function Ne({moons:r,visible:t}){const i=u.useRef(),s=u.useMemo(()=>[Array.from({length:160},(a,o)=>{const n=o/159*Math.PI*2;return new N(Math.cos(n)*1.55,Math.sin(n)*.08,Math.sin(n)*1.55)}),Array.from({length:160},(a,o)=>{const n=o/159*Math.PI*2;return new N(Math.cos(n)*2.18,Math.sin(n)*.13,Math.sin(n)*2.18)})],[]);return U(({clock:a})=>{i.current&&(i.current.rotation.y=a.getElapsedTime()*.18)}),t?e.jsxs("group",{ref:i,rotation:[v.degToRad(1.1),0,v.degToRad(24)],children:[e.jsx(A,{points:s[0],color:"#fbbf24",transparent:!0,opacity:.3,lineWidth:.6}),e.jsx(A,{points:s[1],color:"#c4b5fd",transparent:!0,opacity:.22,lineWidth:.5}),(r||[]).slice(0,2).map((a,o)=>{const n=o===0?1.55:2.18,p=o===0?.8:3.5;return e.jsxs("group",{position:[Math.cos(p)*n,o===0?.08:-.06,Math.sin(p)*n],children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[o===0?.035:.027,18,18]}),e.jsx("meshStandardMaterial",{color:o===0?"#c4b5a5":"#9ca3af",roughness:.94})]}),e.jsx(I,{center:!0,distanceFactor:2.6,children:e.jsx("div",{className:"mars-moon-label",children:a.name})})]},a.name)})]}):null}function Ce({selected:r,focusTick:t}){const i=u.useRef(),{camera:s}=ie(),a=u.useMemo(()=>{if(!r)return null;const o=T(r.lat,r.lon,1).applyEuler(new oe(k.x,k.y,k.z)).normalize();return{target:o.clone().multiplyScalar(.28),camera:o.clone().multiplyScalar(2.75).add(new N(.16,.12,.16))}},[r?.id,t]);return U(()=>{!i.current||!a||(i.current.target.lerp(a.target,.035),s.position.lerp(a.camera,.026),s.lookAt(i.current.target),i.current.update())}),e.jsx(ne,{ref:i,enableDamping:!0,dampingFactor:.06,minDistance:1.35,maxDistance:6.4})}function ze({data:r,selected:t,onSelect:i,onCoordinate:s,layers:a,focusTick:o,terrainBoost:n}){const[p,l,f]=Q(re,[W,ye,K]);u.useMemo(()=>{p.colorSpace=D,f.colorSpace=D,p.anisotropy=8,l.anisotropy=8,f.anisotropy=8,l.wrapS=S,l.wrapT=S,f.wrapS=S,f.wrapT=S},[p,l,f]);const c=r.features||[],j=r.landingSites||[],x=a.terrain?_.elevationSpanScale*n:0,M=a.terrain?-_.zeroDatumNorm*x:0;return e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#03020d"]}),e.jsx("fog",{attach:"fog",args:["#03020d",6,17]}),e.jsx(X,{radius:180,depth:80,count:7200,factor:3.3,saturation:.18,fade:!0,speed:.03}),e.jsx("ambientLight",{intensity:.22,color:"#fbd2a0"}),e.jsx("directionalLight",{position:[4.5,1.8,3.8],intensity:4.25,color:"#fff0d1"}),e.jsx("pointLight",{position:[4.5,1.8,3.8],intensity:3.3,color:"#fb923c",distance:12}),e.jsx("pointLight",{position:[-3.8,-1.2,-2.6],intensity:.42,color:"#60a5fa",distance:8}),e.jsxs("group",{rotation:[k.x,k.y,k.z],children:[e.jsxs("mesh",{onPointerMove:m=>{m.uv&&s(B(m.uv))},onClick:m=>{m.uv&&i({...B(m.uv),id:"coordinate-pick",name:"Selected coordinate",kind:"coordinate",type:"surface point",summary:"Manual coordinate selected on the Mars texture."})},children:[e.jsx("sphereGeometry",{args:[1,256,256]}),e.jsx("meshStandardMaterial",{map:p,bumpMap:a.relief||a.terrain?l:null,bumpScale:a.relief?.055:.022,displacementMap:a.terrain?l:null,displacementScale:x,displacementBias:M,roughness:.93,metalness:0,color:"#ffffff"})]}),a.relief&&e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[1.002,256,256]}),e.jsx("meshStandardMaterial",{map:f,displacementMap:a.terrain?l:null,displacementScale:x,displacementBias:M,transparent:!0,opacity:.28,blending:Y,depthWrite:!1,roughness:1,metalness:0})]}),e.jsx(Se,{visible:a.polarCaps}),e.jsx(Ae,{visible:a.graticule}),a.features&&c.map(m=>e.jsx(H,{item:m,selected:t?.id===m.id,onSelect:i,labels:a.labels,kind:"feature"},m.id)),a.missions&&j.map(m=>e.jsx(H,{item:{...m,type:"mission",priority:m.status?.includes("active")?"major":"mission"},selected:t?.id===m.id,onSelect:i,labels:a.labels,kind:"mission"},m.id))]}),e.jsx(we,{visible:a.atmosphere}),e.jsx(Ne,{moons:r.moons,visible:a.moons}),e.jsxs("mesh",{position:[4.8,1.7,3.9],children:[e.jsx("sphereGeometry",{args:[.22,48,48]}),e.jsx("meshBasicMaterial",{color:"#fbbf24"})]}),e.jsxs("mesh",{position:[4.8,1.7,3.9],children:[e.jsx("sphereGeometry",{args:[.82,48,48]}),e.jsx("meshBasicMaterial",{color:"#fb923c",transparent:!0,opacity:.08,blending:P,depthWrite:!1})]}),e.jsx(Z,{children:e.jsx(ee,{luminanceThreshold:.22,luminanceSmoothing:.78,intensity:1.08,radius:.64})}),e.jsx(Ce,{selected:t?.lat!==void 0?t:null,focusTick:o})]})}function b({icon:r,label:t,active:i,onClick:s}){return e.jsxs("button",{type:"button",className:`mars-layer-button ${i?"is-active":""}`,onClick:s,title:t,children:[e.jsx(r,{size:15}),e.jsx("span",{children:t})]})}function Le({data:r,query:t,setQuery:i,filter:s,setFilter:a,layers:o,toggleLayer:n,selected:p,setSelected:l,setFocusTick:f,terrainBoost:c,setTerrainBoost:j}){const x=r.features||[];r.landingSites;const M=u.useMemo(()=>["all",...Array.from(new Set(x.map(d=>d.type))).sort()],[x]),m=F.map(d=>x.find(y=>y.id===d.key)).filter(Boolean);return e.jsxs("aside",{className:"mars-panel mars-left-panel",children:[e.jsx("div",{className:"mars-kicker",children:"AstroBis Mars map"}),e.jsx("h1",{children:"Real 3D surface atlas"}),e.jsx("p",{children:"A WebGL Mars globe with a real texture map, NASA PDS MOLA terrain displacement, named surface features, landing-site markers, moon orbits, coordinate picking, and labelled scientific caveats."}),e.jsxs("div",{className:"mars-search",children:[e.jsx(be,{size:16}),e.jsx("input",{value:t,onChange:d=>i(d.target.value),placeholder:"Search Mars feature or mission"})]}),e.jsx("select",{className:"mars-select",value:s,onChange:d=>a(d.target.value),"aria-label":"Feature filter",children:M.map(d=>e.jsx("option",{value:d,children:d==="all"?"All feature types":d},d))}),e.jsx("div",{className:"mars-presets",children:m.map(d=>e.jsx("button",{type:"button",onClick:()=>{l({...d,kind:"feature"}),f(y=>y+1)},children:F.find(y=>y.key===d.id)?.label||d.name},d.id))}),e.jsxs("div",{className:"mars-stats-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Radius"}),e.jsxs("strong",{children:[V(r.body?.radiusKm)," km"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Gravity"}),e.jsxs("strong",{children:[r.body?.gravityMs2," m/s2"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Sol"}),e.jsxs("strong",{children:[r.body?.solHours?.toFixed(2)," h"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Moons"}),e.jsx("strong",{children:r.body?.knownMoons})]})]}),e.jsxs("div",{className:"mars-terrain-control",children:[e.jsxs("div",{children:[e.jsx("span",{children:"MOLA terrain"}),e.jsx("strong",{children:o.terrain?`${c.toFixed(0)}x vertical`:"off"})]}),e.jsx("input",{type:"range",min:"1",max:"18",step:"1",value:c,disabled:!o.terrain,onChange:d=>j(Number(d.target.value)),"aria-label":"MOLA terrain vertical exaggeration"}),e.jsx("small",{children:"1x is closest to planetary scale; higher values make volcanoes, basins, and canyon systems legible on a whole-planet globe."})]}),e.jsxs("div",{className:"mars-layer-grid",children:[e.jsx(b,{icon:G,label:"3D terrain",active:o.terrain,onClick:()=>n("terrain")}),e.jsx(b,{icon:le,label:"Relief",active:o.relief,onClick:()=>n("relief")}),e.jsx(b,{icon:ce,label:"Grid",active:o.graticule,onClick:()=>n("graticule")}),e.jsx(b,{icon:G,label:"Features",active:o.features,onClick:()=>n("features")}),e.jsx(b,{icon:me,label:"Missions",active:o.missions,onClick:()=>n("missions")}),e.jsx(b,{icon:$,label:"Moons",active:o.moons,onClick:()=>n("moons")}),e.jsx(b,{icon:de,label:"Haze",active:o.atmosphere,onClick:()=>n("atmosphere")}),e.jsx(b,{icon:$,label:"Polar caps",active:o.polarCaps,onClick:()=>n("polarCaps")}),e.jsx(b,{icon:pe,label:"Labels",active:o.labels,onClick:()=>n("labels")}),e.jsx(b,{icon:he,label:"Mini map",active:o.miniMap,onClick:()=>n("miniMap")})]}),e.jsx("div",{className:"mars-note",children:r.textures?.textureNote||"MOLA terrain is vertically exaggerated for whole-planet readability."}),p?.kind==="coordinate"&&e.jsxs("div",{className:"mars-coordinate-callout",children:["Picked: ",p.lat.toFixed(2)," lat / ",p.lon.toFixed(2)," lon"]})]})}function Te({data:r,selected:t,hoverCoordinate:i,setSelected:s}){const a=t||r.features?.[0]||null;return e.jsxs("aside",{className:"mars-panel mars-right-panel",children:[e.jsxs("div",{className:"mars-panel-top",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mars-kicker",children:a?.kind==="mission"?"Landing site":a?.kind==="coordinate"?"Coordinate pick":a?.type||"Surface feature"}),e.jsx("h2",{children:a?.name||"Mars"})]}),t&&e.jsx("button",{type:"button",className:"mars-close",onClick:()=>s(null),children:"x"})]}),e.jsx("p",{className:"mars-summary",children:a?.summary||r.body?.surface}),e.jsxs("div",{className:"mars-info-list",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Latitude"}),e.jsx("strong",{children:Number.isFinite(a?.lat)?`${a.lat.toFixed(3)} deg`:"n/a"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Longitude"}),e.jsx("strong",{children:Number.isFinite(a?.lon)?`${L(a.lon).toFixed(3)} deg`:"n/a"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Scale"}),e.jsx("strong",{children:a?.scale||a?.status||"reference point"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Source"}),e.jsx("strong",{children:a?.source||a?.agency||"AstroBis Mars snapshot"})]})]}),e.jsx("div",{className:"mars-section-title",children:"Planet constants"}),e.jsxs("div",{className:"mars-info-list compact",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Mean distance"}),e.jsxs("strong",{children:[r.body?.meanDistanceAu," AU"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Orbital period"}),e.jsxs("strong",{children:[V(r.body?.orbitalPeriodDays,2)," days"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Axial tilt"}),e.jsxs("strong",{children:[r.body?.axialTiltDeg," deg"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Escape velocity"}),e.jsxs("strong",{children:[r.body?.escapeVelocityKms," km/s"]})]})]}),e.jsx("div",{className:"mars-section-title",children:"Moons"}),e.jsx("div",{className:"mars-moon-cards",children:(r.moons||[]).map(o=>e.jsxs("div",{children:[e.jsx("strong",{children:o.name}),e.jsxs("span",{children:[o.orbitalPeriodHours," h orbit"]})]},o.name))}),e.jsxs("div",{className:"mars-coordinate-readout",children:["Hover coordinate: ",i?`${i.lat.toFixed(2)} lat / ${i.lon.toFixed(2)} lon`:"move over the globe"]})]})}function Re({data:r,selected:t,setSelected:i,visible:s,query:a,filter:o,layers:n}){if(!s)return null;const p=a.trim().toLowerCase(),l=(r.features||[]).filter(c=>{const j=!p||`${c.name} ${c.type} ${c.summary}`.toLowerCase().includes(p),x=o==="all"||c.type===o;return j&&x}),f=r.landingSites||[];return e.jsxs("div",{className:"mars-mini-map",children:[e.jsx("div",{className:"mars-mini-map-bg"}),e.jsx("div",{className:`mars-mini-map-relief ${n.relief||n.terrain?"is-visible":""}`}),e.jsx("div",{className:"mars-mini-map-grid"}),l.map(c=>e.jsx("button",{type:"button",className:`mars-map-dot feature ${t?.id===c.id?"is-selected":""}`,style:O(c),title:c.name,onClick:()=>i({...c,kind:"feature"})},c.id)),f.map(c=>e.jsx("button",{type:"button",className:`mars-map-dot mission ${t?.id===c.id?"is-selected":""}`,style:O(c),title:c.name,onClick:()=>i({...c,kind:"mission",type:"mission"})},c.id)),e.jsxs("div",{className:"mars-mini-caption",children:[e.jsx("strong",{children:"Mars reference map"}),e.jsx("span",{children:"features + landing sites"})]})]})}function Pe({data:r,setSelected:t}){const i=r.landingSites||[];return e.jsxs("div",{className:"mars-mission-rail",children:[e.jsx("div",{className:"mars-rail-title",children:"Landing-site chronology"}),e.jsx("div",{className:"mars-rail-list",children:i.map(s=>e.jsxs("button",{type:"button",onClick:()=>t({...s,kind:"mission",type:"mission"}),children:[e.jsx("span",{children:s.name}),e.jsx("strong",{children:s.status})]},s.id))})]})}function De({data:r}){return e.jsx("div",{className:"mars-source-strip",children:(r.sources||[]).slice(0,4).map(t=>e.jsxs("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",children:[e.jsx("span",{children:t.label}),e.jsx("small",{children:t.note})]},t.id))})}function Oe(){const[r,t]=u.useState(ve),[i,s]=u.useState(null),[a,o]=u.useState(null),[n,p]=u.useState(""),[l,f]=u.useState("all"),[c,j]=u.useState(0),[x,M]=u.useState(5),[m,d]=u.useState({terrain:!0,relief:!0,graticule:!0,features:!0,missions:!0,moons:!0,atmosphere:!0,labels:!0,polarCaps:!0,miniMap:!0});u.useEffect(()=>{let h=!0;async function g(){try{const w=await fetch(`${je}?ts=${Date.now()}`,{cache:"no-store"});if(!w.ok)throw new Error("Mars snapshot unavailable");const R=await w.json();h&&(t(R),s(null))}catch{h&&s(null)}}return g(),()=>{h=!1}},[]);const y=h=>d(g=>({...g,[h]:!g[h]})),q=u.useMemo(()=>{const h=n.trim().toLowerCase();return{...r,features:(r.features||[]).filter(g=>{const w=!h||`${g.name} ${g.type} ${g.summary}`.toLowerCase().includes(h),R=l==="all"||g.type===l;return w&&R})}},[r,n,l]);return e.jsxs("div",{className:"mars-map-shell",children:[e.jsx(J,{camera:{position:[.12,.28,3.05],fov:43},dpr:[1,1.75],children:e.jsx(u.Suspense,{fallback:null,children:e.jsx(ze,{data:q,selected:i,onSelect:h=>{s(h),j(g=>g+1)},onCoordinate:o,layers:m,focusTick:c,terrainBoost:x})})}),e.jsxs("div",{className:"mars-top-strip",children:[e.jsxs("span",{children:["UTC ",new Date(r.generatedAt||Date.now()).toISOString().slice(0,16).replace("T"," ")]}),e.jsx("strong",{children:"Mars Areography Console"}),e.jsxs("span",{children:[(r.features||[]).length," features / ",(r.landingSites||[]).length," landers and rovers / MOLA ",m.terrain?`${x}x terrain`:"terrain off"]})]}),e.jsx(Le,{data:r,query:n,setQuery:p,filter:l,setFilter:f,layers:m,toggleLayer:y,selected:i,setSelected:s,setFocusTick:j,terrainBoost:x,setTerrainBoost:M}),e.jsx(Te,{data:r,selected:i,hoverCoordinate:a,setSelected:s}),e.jsx(Re,{data:r,selected:i,setSelected:s,visible:m.miniMap,query:n,filter:l,layers:m}),e.jsx(Pe,{data:r,setSelected:h=>{s(h),j(g=>g+1)}}),e.jsx(De,{data:r}),e.jsxs("div",{className:"mars-credit",children:["Texture: ",r.textures?.surfaceCredit||"Mars public texture"," - Terrain: ",r.textures?.heightmapCredit||"NASA PDS MOLA MEGDR"," - Data: NASA / USGS / IAU reference sources"]}),e.jsx("style",{children:$e})]})}const $e=`
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
  background: rgba(255,255,255,0.06);
  color: #fff;
  border-radius: 14px;
  padding: 0.68rem 0.75rem;
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
  background-image: linear-gradient(rgba(20,8,4,0.08), rgba(20,8,4,0.38)), url('${W}');
  background-size: cover;
  background-position: center;
  filter: saturate(1.04) contrast(1.1);
}
.mars-mini-map-relief {
  position: absolute;
  inset: 0;
  background-image: url('${K}');
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
`;export{Oe as default};
