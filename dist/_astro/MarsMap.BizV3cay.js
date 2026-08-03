import{j as e}from"./jsx-runtime.CYiYLu1p.js";import{r as d}from"./index.CZlPm10g.js";import{C as W,u as H,S as U,b as K,A as T,E as V,B as q,T as J,M as j,L as M,H as G,e as Q,f as X,c as Y,d as S,a as _,g as Z,h as ee,O as re}from"./Bloom.YREvqkth.js";import{c as N,L as ae,M as se,R as te,E as ie,C as oe}from"./rocket.HyhI223X.js";import"./client.vFaO0wSm.js";/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]],L=N("circle-dot",ne);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],ce=N("info",le);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=[["path",{d:"m8 3 4 8 5-5 5 15H2L8 3z",key:"otkl63"}]],me=N("mountain",de);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],ue=N("search",pe),B="/AstroBis".endsWith("/")?"/AstroBis":"/AstroBis/",xe=`${B}data/mars-map.json`,E=`${B}assets/mars-texture.jpg`,y={x:j.degToRad(-2),y:j.degToRad(-30),z:0},A={schemaVersion:1,generatedAt:"2026-08-03T00:00:00.000Z",body:{name:"Mars",radiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,gravityMs2:3.71,escapeVelocityKms:5.03,meanDistanceAu:1.523679,orbitalPeriodDays:686.98,solHours:24.6597,axialTiltDeg:25.19,knownMoons:2,moons:["Phobos","Deimos"],atmosphere:"Thin CO2-dominated atmosphere with dust and water-ice clouds.",surface:"Basaltic crust, iron-oxide dust, volcanoes, canyon systems, impact basins, and polar layered deposits."},textures:{localSurfaceUrl:"assets/mars-texture.jpg",surfaceCredit:"Solar System Scope / Wikimedia Commons Mars texture map",textureNote:"Relief and haze are visualization layers, not meter-scale terrain rendering."},features:[{id:"olympus-mons",name:"Olympus Mons",type:"volcano",lat:18.65,lon:-133.8,scale:"about 600 km wide",priority:"major",summary:"Largest known volcano in the Solar System.",source:"NASA / USGS Mars reference"},{id:"valles-marineris",name:"Valles Marineris",type:"canyon system",lat:-14,lon:-60,scale:"more than 4,000 km long",priority:"major",summary:"A vast equatorial canyon system.",source:"NASA / USGS Mars reference"},{id:"jezero-crater",name:"Jezero Crater",type:"crater / delta",lat:18.38,lon:77.58,scale:"about 45 km diameter",priority:"mission",summary:"Perseverance landing region with an ancient delta.",source:"NASA Mars 2020"}],landingSites:[{id:"curiosity",name:"Curiosity",agency:"NASA",status:"active rover",lat:-4.5895,lon:137.4417,summary:"Mars Science Laboratory rover in Gale Crater."},{id:"perseverance",name:"Perseverance",agency:"NASA",status:"active rover",lat:18.4447,lon:77.4508,summary:"Mars 2020 rover in Jezero Crater."}],moons:[{name:"Phobos",radiusKm:11.1,orbitKm:9376,orbitalPeriodHours:7.65,summary:"Inner, larger moon."},{name:"Deimos",radiusKm:6.2,orbitKm:23463,orbitalPeriodHours:30.31,summary:"Outer, smaller moon."}],sources:[],notes:{coordinates:"Approximate feature center points normalized to -180 to +180 longitude.",visualization:"A real-data WebGL atlas, not a high-resolution GIS terrain engine."}},P={volcano:"#fb923c","canyon system":"#facc15","impact basin":"#60a5fa",crater:"#fda4af","crater / delta":"#34d399","impact basin / plain":"#93c5fd","volcanic province":"#fdba74","volcanic chain":"#f97316","fracture / mineral region":"#22d3ee","fractured terrain":"#a78bfa","ice-filled crater":"#e0f2fe","north polar layered deposits":"#bfdbfe","south polar layered deposits":"#bfdbfe",mission:"#4ade80"},R=[{key:"olympus-mons",label:"Olympus"},{key:"valles-marineris",label:"Valles"},{key:"jezero-crater",label:"Jezero"},{key:"gale-crater",label:"Gale"},{key:"planum-boreum",label:"North pole"}];function I(r,t=0){return Number.isFinite(Number(r))?Number(r).toLocaleString(void 0,{maximumFractionDigits:t,minimumFractionDigits:t}):"n/a"}function C(r){return(Number(r)+540)%360-180}function z(r,t,i=1){const a=j.degToRad(90-Number(r)),s=j.degToRad(C(t)+180);return new S(-i*Math.sin(a)*Math.cos(s),i*Math.cos(a),i*Math.sin(a)*Math.sin(s))}function F(r){return{lat:j.clamp((.5-r.y)*180,-90,90),lon:C(r.x*360-180)}}function $(r){return{left:`${(C(r.lon)+180)/360*100}%`,top:`${(90-r.lat)/180*100}%`}}function he(r,t=1.006){const i=[];for(let a=-180;a<=180;a+=4)i.push(z(r,a,t));return i}function ge(r,t=1.006){const i=[];for(let a=-88;a<=88;a+=4)i.push(z(a,r,t));return i}function fe({visible:r}){const t=d.useMemo(()=>new Q({uniforms:{glowColor:{value:new Y("#fb923c")},intensity:{value:r?1:0}},vertexShader:`
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
    `,transparent:!0,side:X,depthWrite:!1,blending:T}),[r]);return d.useEffect(()=>{t.uniforms.intensity.value=r?1:0},[t,r]),r?e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[1.055,128,128]}),e.jsx("primitive",{object:t,attach:"material"})]}):null}function be({visible:r}){return r?e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{position:[0,1.011,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("circleGeometry",{args:[.22,80]}),e.jsx("meshBasicMaterial",{color:"#dbeafe",transparent:!0,opacity:.52,depthWrite:!1})]}),e.jsxs("mesh",{position:[0,-1.011,0],rotation:[Math.PI/2,0,0],children:[e.jsx("circleGeometry",{args:[.18,80]}),e.jsx("meshBasicMaterial",{color:"#e0f2fe",transparent:!0,opacity:.42,depthWrite:!1})]})]}):null}function je({visible:r}){if(!r)return null;const t=[-60,-30,0,30,60],i=[-150,-120,-90,-60,-30,0,30,60,90,120,150,180];return e.jsxs("group",{children:[t.map(a=>e.jsx(M,{points:he(a),color:a===0?"#facc15":"#94a3b8",transparent:!0,opacity:a===0?.42:.18,lineWidth:.55},`lat-${a}`)),i.map(a=>e.jsx(M,{points:ge(a),color:"#94a3b8",transparent:!0,opacity:a===0?.32:.16,lineWidth:.45},`lon-${a}`))]})}function D({item:r,selected:t,onSelect:i,labels:a,kind:s}){const o=s==="mission"?P.mission:P[r.type]||"#93c5fd",n=z(r.lat,r.lon,t?1.04:1.026),p=t?.024:r.priority==="major"||s==="mission"?.017:.011;return e.jsxs("group",{position:n,children:[e.jsxs("mesh",{onClick:m=>{m.stopPropagation(),i({...r,kind:s})},onPointerOver:m=>{m.stopPropagation(),document.body.style.cursor="pointer"},onPointerOut:()=>{document.body.style.cursor="auto"},children:[e.jsx("sphereGeometry",{args:[p,18,18]}),e.jsx("meshBasicMaterial",{color:o})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[p*2.8,18,18]}),e.jsx("meshBasicMaterial",{color:o,transparent:!0,opacity:t?.28:.13,blending:T,depthWrite:!1})]}),a&&(t||r.priority==="major"||s==="mission")&&e.jsx(G,{center:!0,distanceFactor:2.35,children:e.jsx("button",{type:"button",className:`mars-marker-label ${t?"is-selected":""}`,onClick:m=>{m.stopPropagation(),i({...r,kind:s})},children:r.name})})]})}function ye({moons:r,visible:t}){const i=d.useRef(),a=d.useMemo(()=>[Array.from({length:160},(s,o)=>{const n=o/159*Math.PI*2;return new S(Math.cos(n)*1.55,Math.sin(n)*.08,Math.sin(n)*1.55)}),Array.from({length:160},(s,o)=>{const n=o/159*Math.PI*2;return new S(Math.cos(n)*2.18,Math.sin(n)*.13,Math.sin(n)*2.18)})],[]);return _(({clock:s})=>{i.current&&(i.current.rotation.y=s.getElapsedTime()*.18)}),t?e.jsxs("group",{ref:i,rotation:[j.degToRad(1.1),0,j.degToRad(24)],children:[e.jsx(M,{points:a[0],color:"#fbbf24",transparent:!0,opacity:.3,lineWidth:.6}),e.jsx(M,{points:a[1],color:"#c4b5fd",transparent:!0,opacity:.22,lineWidth:.5}),(r||[]).slice(0,2).map((s,o)=>{const n=o===0?1.55:2.18,p=o===0?.8:3.5;return e.jsxs("group",{position:[Math.cos(p)*n,o===0?.08:-.06,Math.sin(p)*n],children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[o===0?.035:.027,18,18]}),e.jsx("meshStandardMaterial",{color:o===0?"#c4b5a5":"#9ca3af",roughness:.94})]}),e.jsx(G,{center:!0,distanceFactor:2.6,children:e.jsx("div",{className:"mars-moon-label",children:s.name})})]},s.name)})]}):null}function ve({selected:r,focusTick:t}){const i=d.useRef(),{camera:a}=Z(),s=d.useMemo(()=>{if(!r)return null;const o=z(r.lat,r.lon,1).applyEuler(new ee(y.x,y.y,y.z)).normalize();return{target:o.clone().multiplyScalar(.28),camera:o.clone().multiplyScalar(2.75).add(new S(.16,.12,.16))}},[r?.id,t]);return _(()=>{!i.current||!s||(i.current.target.lerp(s.target,.035),a.position.lerp(s.camera,.026),a.lookAt(i.current.target),i.current.update())}),e.jsx(re,{ref:i,enableDamping:!0,dampingFactor:.06,minDistance:1.35,maxDistance:6.4})}function ke({data:r,selected:t,onSelect:i,onCoordinate:a,layers:s,focusTick:o}){const n=H(J,E);d.useMemo(()=>{n.colorSpace=U,n.anisotropy=8},[n]);const p=r.features||[],m=r.landingSites||[];return e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#03020d"]}),e.jsx("fog",{attach:"fog",args:["#03020d",6,17]}),e.jsx(K,{radius:180,depth:80,count:7200,factor:3.3,saturation:.18,fade:!0,speed:.03}),e.jsx("ambientLight",{intensity:.22,color:"#fbd2a0"}),e.jsx("directionalLight",{position:[4.5,1.8,3.8],intensity:4.25,color:"#fff0d1"}),e.jsx("pointLight",{position:[4.5,1.8,3.8],intensity:3.3,color:"#fb923c",distance:12}),e.jsx("pointLight",{position:[-3.8,-1.2,-2.6],intensity:.42,color:"#60a5fa",distance:8}),e.jsxs("group",{rotation:[y.x,y.y,y.z],children:[e.jsxs("mesh",{onPointerMove:l=>{l.uv&&a(F(l.uv))},onClick:l=>{l.uv&&i({...F(l.uv),id:"coordinate-pick",name:"Selected coordinate",kind:"coordinate",type:"surface point",summary:"Manual coordinate selected on the Mars texture."})},children:[e.jsx("sphereGeometry",{args:[1,160,160]}),e.jsx("meshStandardMaterial",{map:n,bumpMap:s.relief?n:null,bumpScale:s.relief?.035:0,roughness:.93,metalness:0,color:"#ffffff"})]}),e.jsx(be,{visible:s.polarCaps}),e.jsx(je,{visible:s.graticule}),s.features&&p.map(l=>e.jsx(D,{item:l,selected:t?.id===l.id,onSelect:i,labels:s.labels,kind:"feature"},l.id)),s.missions&&m.map(l=>e.jsx(D,{item:{...l,type:"mission",priority:l.status?.includes("active")?"major":"mission"},selected:t?.id===l.id,onSelect:i,labels:s.labels,kind:"mission"},l.id))]}),e.jsx(fe,{visible:s.atmosphere}),e.jsx(ye,{moons:r.moons,visible:s.moons}),e.jsxs("mesh",{position:[4.8,1.7,3.9],children:[e.jsx("sphereGeometry",{args:[.22,48,48]}),e.jsx("meshBasicMaterial",{color:"#fbbf24"})]}),e.jsxs("mesh",{position:[4.8,1.7,3.9],children:[e.jsx("sphereGeometry",{args:[.82,48,48]}),e.jsx("meshBasicMaterial",{color:"#fb923c",transparent:!0,opacity:.08,blending:T,depthWrite:!1})]}),e.jsx(V,{children:e.jsx(q,{luminanceThreshold:.22,luminanceSmoothing:.78,intensity:1.08,radius:.64})}),e.jsx(ve,{selected:t?.lat!==void 0?t:null,focusTick:o})]})}function h({icon:r,label:t,active:i,onClick:a}){return e.jsxs("button",{type:"button",className:`mars-layer-button ${i?"is-active":""}`,onClick:a,title:t,children:[e.jsx(r,{size:15}),e.jsx("span",{children:t})]})}function we({data:r,query:t,setQuery:i,filter:a,setFilter:s,layers:o,toggleLayer:n,selected:p,setSelected:m,setFocusTick:l}){const g=r.features||[];r.landingSites;const f=d.useMemo(()=>["all",...Array.from(new Set(g.map(c=>c.type))).sort()],[g]),v=R.map(c=>g.find(b=>b.id===c.key)).filter(Boolean);return e.jsxs("aside",{className:"mars-panel mars-left-panel",children:[e.jsx("div",{className:"mars-kicker",children:"AstroBis Mars map"}),e.jsx("h1",{children:"Real 3D surface atlas"}),e.jsx("p",{children:"A WebGL Mars globe with a real texture map, named surface features, landing-site markers, moon orbits, coordinate picking, and labelled scientific caveats."}),e.jsxs("div",{className:"mars-search",children:[e.jsx(ue,{size:16}),e.jsx("input",{value:t,onChange:c=>i(c.target.value),placeholder:"Search Mars feature or mission"})]}),e.jsx("select",{className:"mars-select",value:a,onChange:c=>s(c.target.value),"aria-label":"Feature filter",children:f.map(c=>e.jsx("option",{value:c,children:c==="all"?"All feature types":c},c))}),e.jsx("div",{className:"mars-presets",children:v.map(c=>e.jsx("button",{type:"button",onClick:()=>{m({...c,kind:"feature"}),l(b=>b+1)},children:R.find(b=>b.key===c.id)?.label||c.name},c.id))}),e.jsxs("div",{className:"mars-stats-grid",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Radius"}),e.jsxs("strong",{children:[I(r.body?.radiusKm)," km"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Gravity"}),e.jsxs("strong",{children:[r.body?.gravityMs2," m/s2"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Sol"}),e.jsxs("strong",{children:[r.body?.solHours?.toFixed(2)," h"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Moons"}),e.jsx("strong",{children:r.body?.knownMoons})]})]}),e.jsxs("div",{className:"mars-layer-grid",children:[e.jsx(h,{icon:ae,label:"Relief",active:o.relief,onClick:()=>n("relief")}),e.jsx(h,{icon:se,label:"Grid",active:o.graticule,onClick:()=>n("graticule")}),e.jsx(h,{icon:me,label:"Features",active:o.features,onClick:()=>n("features")}),e.jsx(h,{icon:te,label:"Missions",active:o.missions,onClick:()=>n("missions")}),e.jsx(h,{icon:L,label:"Moons",active:o.moons,onClick:()=>n("moons")}),e.jsx(h,{icon:ie,label:"Haze",active:o.atmosphere,onClick:()=>n("atmosphere")}),e.jsx(h,{icon:L,label:"Polar caps",active:o.polarCaps,onClick:()=>n("polarCaps")}),e.jsx(h,{icon:oe,label:"Labels",active:o.labels,onClick:()=>n("labels")}),e.jsx(h,{icon:ce,label:"Mini map",active:o.miniMap,onClick:()=>n("miniMap")})]}),e.jsx("div",{className:"mars-note",children:r.textures?.textureNote||"Relief and haze are visualization layers."}),p?.kind==="coordinate"&&e.jsxs("div",{className:"mars-coordinate-callout",children:["Picked: ",p.lat.toFixed(2)," lat / ",p.lon.toFixed(2)," lon"]})]})}function Me({data:r,selected:t,hoverCoordinate:i,setSelected:a}){const s=t||r.features?.[0]||null;return e.jsxs("aside",{className:"mars-panel mars-right-panel",children:[e.jsxs("div",{className:"mars-panel-top",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mars-kicker",children:s?.kind==="mission"?"Landing site":s?.kind==="coordinate"?"Coordinate pick":s?.type||"Surface feature"}),e.jsx("h2",{children:s?.name||"Mars"})]}),t&&e.jsx("button",{type:"button",className:"mars-close",onClick:()=>a(null),children:"x"})]}),e.jsx("p",{className:"mars-summary",children:s?.summary||r.body?.surface}),e.jsxs("div",{className:"mars-info-list",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Latitude"}),e.jsx("strong",{children:Number.isFinite(s?.lat)?`${s.lat.toFixed(3)} deg`:"n/a"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Longitude"}),e.jsx("strong",{children:Number.isFinite(s?.lon)?`${C(s.lon).toFixed(3)} deg`:"n/a"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Scale"}),e.jsx("strong",{children:s?.scale||s?.status||"reference point"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Source"}),e.jsx("strong",{children:s?.source||s?.agency||"AstroBis Mars snapshot"})]})]}),e.jsx("div",{className:"mars-section-title",children:"Planet constants"}),e.jsxs("div",{className:"mars-info-list compact",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Mean distance"}),e.jsxs("strong",{children:[r.body?.meanDistanceAu," AU"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Orbital period"}),e.jsxs("strong",{children:[I(r.body?.orbitalPeriodDays,2)," days"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Axial tilt"}),e.jsxs("strong",{children:[r.body?.axialTiltDeg," deg"]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Escape velocity"}),e.jsxs("strong",{children:[r.body?.escapeVelocityKms," km/s"]})]})]}),e.jsx("div",{className:"mars-section-title",children:"Moons"}),e.jsx("div",{className:"mars-moon-cards",children:(r.moons||[]).map(o=>e.jsxs("div",{children:[e.jsx("strong",{children:o.name}),e.jsxs("span",{children:[o.orbitalPeriodHours," h orbit"]})]},o.name))}),e.jsxs("div",{className:"mars-coordinate-readout",children:["Hover coordinate: ",i?`${i.lat.toFixed(2)} lat / ${i.lon.toFixed(2)} lon`:"move over the globe"]})]})}function Se({data:r,selected:t,setSelected:i,visible:a,query:s,filter:o}){if(!a)return null;const n=s.trim().toLowerCase(),p=(r.features||[]).filter(l=>{const g=!n||`${l.name} ${l.type} ${l.summary}`.toLowerCase().includes(n),f=o==="all"||l.type===o;return g&&f}),m=r.landingSites||[];return e.jsxs("div",{className:"mars-mini-map",children:[e.jsx("div",{className:"mars-mini-map-bg"}),e.jsx("div",{className:"mars-mini-map-grid"}),p.map(l=>e.jsx("button",{type:"button",className:`mars-map-dot feature ${t?.id===l.id?"is-selected":""}`,style:$(l),title:l.name,onClick:()=>i({...l,kind:"feature"})},l.id)),m.map(l=>e.jsx("button",{type:"button",className:`mars-map-dot mission ${t?.id===l.id?"is-selected":""}`,style:$(l),title:l.name,onClick:()=>i({...l,kind:"mission",type:"mission"})},l.id)),e.jsxs("div",{className:"mars-mini-caption",children:[e.jsx("strong",{children:"Mars reference map"}),e.jsx("span",{children:"features + landing sites"})]})]})}function Ne({data:r,setSelected:t}){const i=r.landingSites||[];return e.jsxs("div",{className:"mars-mission-rail",children:[e.jsx("div",{className:"mars-rail-title",children:"Landing-site chronology"}),e.jsx("div",{className:"mars-rail-list",children:i.map(a=>e.jsxs("button",{type:"button",onClick:()=>t({...a,kind:"mission",type:"mission"}),children:[e.jsx("span",{children:a.name}),e.jsx("strong",{children:a.status})]},a.id))})]})}function Ce({data:r}){return e.jsx("div",{className:"mars-source-strip",children:(r.sources||[]).slice(0,4).map(t=>e.jsxs("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",children:[e.jsx("span",{children:t.label}),e.jsx("small",{children:t.note})]},t.id))})}function Fe(){const[r,t]=d.useState(A),[i,a]=d.useState(null),[s,o]=d.useState(null),[n,p]=d.useState(""),[m,l]=d.useState("all"),[g,f]=d.useState(0),[v,c]=d.useState({relief:!0,graticule:!0,features:!0,missions:!0,moons:!0,atmosphere:!0,labels:!0,polarCaps:!0,miniMap:!0});d.useEffect(()=>{let u=!0;async function x(){try{const w=await fetch(`${xe}?ts=${Date.now()}`,{cache:"no-store"});if(!w.ok)throw new Error("Mars snapshot unavailable");const k=await w.json();u&&(t(k),a(k.features?.[0]?{...k.features[0],kind:"feature"}:null))}catch{u&&a(A.features?.[0]?{...A.features[0],kind:"feature"}:null)}}return x(),()=>{u=!1}},[]);const b=u=>c(x=>({...x,[u]:!x[u]})),O=d.useMemo(()=>{const u=n.trim().toLowerCase();return{...r,features:(r.features||[]).filter(x=>{const w=!u||`${x.name} ${x.type} ${x.summary}`.toLowerCase().includes(u),k=m==="all"||x.type===m;return w&&k})}},[r,n,m]);return e.jsxs("div",{className:"mars-map-shell",children:[e.jsx(W,{camera:{position:[.12,.28,3.05],fov:43},dpr:[1,1.75],children:e.jsx(d.Suspense,{fallback:null,children:e.jsx(ke,{data:O,selected:i,onSelect:u=>{a(u),f(x=>x+1)},onCoordinate:o,layers:v,focusTick:g})})}),e.jsxs("div",{className:"mars-top-strip",children:[e.jsxs("span",{children:["UTC ",new Date(r.generatedAt||Date.now()).toISOString().slice(0,16).replace("T"," ")]}),e.jsx("strong",{children:"Mars Areography Console"}),e.jsxs("span",{children:[(r.features||[]).length," features / ",(r.landingSites||[]).length," landers and rovers"]})]}),e.jsx(we,{data:r,query:n,setQuery:p,filter:m,setFilter:l,layers:v,toggleLayer:b,selected:i,setSelected:a,setFocusTick:f}),e.jsx(Me,{data:r,selected:i,hoverCoordinate:s,setSelected:a}),e.jsx(Se,{data:r,selected:i,setSelected:a,visible:v.miniMap,query:n,filter:m}),e.jsx(Ne,{data:r,setSelected:u=>{a(u),f(x=>x+1)}}),e.jsx(Ce,{data:r}),e.jsxs("div",{className:"mars-credit",children:["Texture: ",r.textures?.surfaceCredit||"Mars public texture"," - Data: NASA / USGS / IAU reference sources"]}),e.jsx("style",{children:ze})]})}const ze=`
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
  background-image: linear-gradient(rgba(20,8,4,0.08), rgba(20,8,4,0.38)), url('${E}');
  background-size: cover;
  background-position: center;
  filter: saturate(1.04) contrast(1.1);
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
    width: 100%;
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
`;export{Fe as default};
