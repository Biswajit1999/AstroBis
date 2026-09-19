import{r as e}from"./rolldown-runtime.hePW80VL.js";import{D as t,S as n,T as r,_ as i,a,b as o,c as s,i as c,l,m as u,n as d,p as f,r as p,s as m,t as h,u as g,w as _,x as v}from"./r3f.DF-uQ3lW.js";import{a as y,i as b,n as x,o as S,r as C,t as ee}from"./rocket.B9zE9k94.js";var w=S(`circle-dot`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`circle`,{cx:`12`,cy:`12`,r:`1`,key:`41hilf`}]]),T=S(`info`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 16v-4`,key:`1dtifu`}],[`path`,{d:`M12 8h.01`,key:`e9boi3`}]]),E=S(`mountain`,[[`path`,{d:`m8 3 4 8 5-5 5 15H2L8 3z`,key:`otkl63`}]]),D=S(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),O=e(t(),1),k=r(),A=`/AstroBis`.endsWith(`/`)?`/AstroBis`:`/AstroBis/`,j=`${A}data/mars-map.json`,M=`${A}assets/mars-texture.jpg`,N=`${A}assets/mars-mola-heightmap.png`,P=`${A}assets/mars-mola-hillshade.jpg`,F={minMeters:-8177,maxMeters:21171,marsRadiusMeters:3389500,get elevationSpanScale(){return(this.maxMeters-this.minMeters)/this.marsRadiusMeters},get zeroDatumNorm(){return(0-this.minMeters)/(this.maxMeters-this.minMeters)}},I={x:i.degToRad(-2),y:i.degToRad(-30),z:0},L={schemaVersion:1,generatedAt:`2026-08-03T00:00:00.000Z`,body:{name:`Mars`,radiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,gravityMs2:3.71,escapeVelocityKms:5.03,meanDistanceAu:1.523679,orbitalPeriodDays:686.98,solHours:24.6597,axialTiltDeg:25.19,knownMoons:2,moons:[`Phobos`,`Deimos`],atmosphere:`Thin CO2-dominated atmosphere with dust and water-ice clouds.`,surface:`Basaltic crust, iron-oxide dust, volcanoes, canyon systems, impact basins, and polar layered deposits.`},textures:{localSurfaceUrl:`assets/mars-texture.jpg`,localHeightmapUrl:`assets/mars-mola-heightmap.png`,localHillshadeUrl:`assets/mars-mola-hillshade.jpg`,surfaceCredit:`Solar System Scope / Wikimedia Commons Mars texture map`,heightmapCredit:`NASA PDS Mars Global Surveyor MOLA MEGDR median topography`,elevationRangeMeters:{min:-8177,max:21171},textureNote:`Surface color is a public global texture; 3D terrain and relief shading are derived from NASA PDS MOLA topography and vertically exaggerated for readability.`},features:[{id:`olympus-mons`,name:`Olympus Mons`,type:`volcano`,lat:18.65,lon:-133.8,scale:`about 600 km wide`,priority:`major`,summary:`Largest known volcano in the Solar System.`,source:`NASA / USGS Mars reference`},{id:`valles-marineris`,name:`Valles Marineris`,type:`canyon system`,lat:-14,lon:-60,scale:`more than 4,000 km long`,priority:`major`,summary:`A vast equatorial canyon system.`,source:`NASA / USGS Mars reference`},{id:`jezero-crater`,name:`Jezero Crater`,type:`crater / delta`,lat:18.38,lon:77.58,scale:`about 45 km diameter`,priority:`mission`,summary:`Perseverance landing region with an ancient delta.`,source:`NASA Mars 2020`}],landingSites:[{id:`curiosity`,name:`Curiosity`,agency:`NASA`,status:`active rover`,lat:-4.5895,lon:137.4417,summary:`Mars Science Laboratory rover in Gale Crater.`},{id:`perseverance`,name:`Perseverance`,agency:`NASA`,status:`active rover`,lat:18.4447,lon:77.4508,summary:`Mars 2020 rover in Jezero Crater.`}],moons:[{name:`Phobos`,radiusKm:11.1,orbitKm:9376,orbitalPeriodHours:7.65,summary:`Inner, larger moon.`},{name:`Deimos`,radiusKm:6.2,orbitKm:23463,orbitalPeriodHours:30.31,summary:`Outer, smaller moon.`}],sources:[],notes:{coordinates:`Approximate feature center points normalized to -180 to +180 longitude.`,visualization:`A real-data WebGL atlas with MOLA-derived terrain, not a rover-scale GIS terrain engine.`}},R={volcano:`#fb923c`,"canyon system":`#facc15`,"impact basin":`#60a5fa`,crater:`#fda4af`,"crater / delta":`#34d399`,"impact basin / plain":`#93c5fd`,"volcanic province":`#fdba74`,"volcanic chain":`#f97316`,"fracture / mineral region":`#22d3ee`,"fractured terrain":`#a78bfa`,"ice-filled crater":`#e0f2fe`,"north polar layered deposits":`#bfdbfe`,"south polar layered deposits":`#bfdbfe`,mission:`#4ade80`},z=[{key:`olympus-mons`,label:`Olympus`},{key:`valles-marineris`,label:`Valles`},{key:`jezero-crater`,label:`Jezero`},{key:`gale-crater`,label:`Gale`},{key:`planum-boreum`,label:`North pole`}];function B(e,t=0){return Number.isFinite(Number(e))?Number(e).toLocaleString(void 0,{maximumFractionDigits:t,minimumFractionDigits:t}):`n/a`}function V(e){return(Number(e)+540)%360-180}function H(e,t,n=1){let r=i.degToRad(90-Number(e)),a=i.degToRad(V(t)+180);return new _(-n*Math.sin(r)*Math.cos(a),n*Math.cos(r),n*Math.sin(r)*Math.sin(a))}function U(e){return{lat:i.clamp((.5-e.y)*180,-90,90),lon:V(e.x*360-180)}}function W(e){return{left:`${(V(e.lon)+180)/360*100}%`,top:`${(90-e.lat)/180*100}%`}}function G(e,t=1.006){let n=[];for(let r=-180;r<=180;r+=4)n.push(H(e,r,t));return n}function K(e,t=1.006){let n=[];for(let r=-88;r<=88;r+=4)n.push(H(r,e,t));return n}function q({visible:e}){let t=(0,O.useMemo)(()=>new v({uniforms:{glowColor:{value:new u(`#fb923c`)},intensity:{value:+!!e}},vertexShader:`
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
    `,transparent:!0,side:1,depthWrite:!1,blending:2}),[e]);return(0,O.useEffect)(()=>{t.uniforms.intensity.value=+!!e},[t,e]),e?(0,k.jsxs)(`mesh`,{children:[(0,k.jsx)(`sphereGeometry`,{args:[1.055,128,128]}),(0,k.jsx)(`primitive`,{object:t,attach:`material`})]}):null}function J({visible:e}){return e?(0,k.jsxs)(k.Fragment,{children:[(0,k.jsxs)(`mesh`,{position:[0,1.011,0],rotation:[-Math.PI/2,0,0],children:[(0,k.jsx)(`circleGeometry`,{args:[.22,80]}),(0,k.jsx)(`meshBasicMaterial`,{color:`#dbeafe`,transparent:!0,opacity:.52,depthWrite:!1})]}),(0,k.jsxs)(`mesh`,{position:[0,-1.011,0],rotation:[Math.PI/2,0,0],children:[(0,k.jsx)(`circleGeometry`,{args:[.18,80]}),(0,k.jsx)(`meshBasicMaterial`,{color:`#e0f2fe`,transparent:!0,opacity:.42,depthWrite:!1})]})]}):null}function Y({visible:e}){return e?(0,k.jsxs)(`group`,{children:[[-60,-30,0,30,60].map(e=>(0,k.jsx)(a,{points:G(e),color:e===0?`#facc15`:`#94a3b8`,transparent:!0,opacity:e===0?.42:.18,lineWidth:.55},`lat-${e}`)),[-150,-120,-90,-60,-30,0,30,60,90,120,150,180].map(e=>(0,k.jsx)(a,{points:K(e),color:`#94a3b8`,transparent:!0,opacity:e===0?.32:.16,lineWidth:.45},`lon-${e}`))]}):null}function X({item:e,selected:t,onSelect:n,labels:r,kind:i}){let a=i===`mission`?R.mission:R[e.type]||`#93c5fd`,o=H(e.lat,e.lon,t?1.04:1.026),s=t?.024:e.priority===`major`||i===`mission`?.017:.011;return(0,k.jsxs)(`group`,{position:o,children:[(0,k.jsxs)(`mesh`,{onClick:t=>{t.stopPropagation(),n({...e,kind:i})},onPointerOver:e=>{e.stopPropagation(),document.body.style.cursor=`pointer`},onPointerOut:()=>{document.body.style.cursor=`auto`},children:[(0,k.jsx)(`sphereGeometry`,{args:[s,18,18]}),(0,k.jsx)(`meshBasicMaterial`,{color:a})]}),(0,k.jsxs)(`mesh`,{children:[(0,k.jsx)(`sphereGeometry`,{args:[s*2.8,18,18]}),(0,k.jsx)(`meshBasicMaterial`,{color:a,transparent:!0,opacity:t?.28:.13,blending:2,depthWrite:!1})]}),r&&(t||e.priority===`major`||i===`mission`)&&(0,k.jsx)(m,{center:!0,distanceFactor:2.35,children:(0,k.jsx)(`button`,{type:`button`,className:`mars-marker-label ${t?`is-selected`:``}`,onClick:t=>{t.stopPropagation(),n({...e,kind:i})},children:e.name})})]})}function Z({moons:e,visible:t}){let n=(0,O.useRef)(),r=(0,O.useMemo)(()=>[Array.from({length:160},(e,t)=>{let n=t/159*Math.PI*2;return new _(Math.cos(n)*1.55,Math.sin(n)*.08,Math.sin(n)*1.55)}),Array.from({length:160},(e,t)=>{let n=t/159*Math.PI*2;return new _(Math.cos(n)*2.18,Math.sin(n)*.13,Math.sin(n)*2.18)})],[]);return l(({clock:e})=>{n.current&&(n.current.rotation.y=e.getElapsedTime()*.18)}),t?(0,k.jsxs)(`group`,{ref:n,rotation:[i.degToRad(1.1),0,i.degToRad(24)],children:[(0,k.jsx)(a,{points:r[0],color:`#fbbf24`,transparent:!0,opacity:.3,lineWidth:.6}),(0,k.jsx)(a,{points:r[1],color:`#c4b5fd`,transparent:!0,opacity:.22,lineWidth:.5}),(e||[]).slice(0,2).map((e,t)=>{let n=t===0?1.55:2.18,r=t===0?.8:3.5;return(0,k.jsxs)(`group`,{position:[Math.cos(r)*n,t===0?.08:-.06,Math.sin(r)*n],children:[(0,k.jsxs)(`mesh`,{children:[(0,k.jsx)(`sphereGeometry`,{args:[t===0?.035:.027,18,18]}),(0,k.jsx)(`meshStandardMaterial`,{color:t===0?`#c4b5a5`:`#9ca3af`,roughness:.94})]}),(0,k.jsx)(m,{center:!0,distanceFactor:2.6,children:(0,k.jsx)(`div`,{className:`mars-moon-label`,children:e.name})})]},e.name)})]}):null}function Q(){let e=(0,O.useRef)();return(0,k.jsx)(c,{ref:e,enableDamping:!0,dampingFactor:.06,enablePan:!1,autoRotate:!1,minDistance:1.35,maxDistance:6.4})}function te({data:e,selected:t,onSelect:r,onCoordinate:i,layers:a,terrainBoost:s}){let[c,l,u]=g(n,[M,N,P]);(0,O.useMemo)(()=>{c.colorSpace=o,u.colorSpace=o,c.anisotropy=8,l.anisotropy=8,u.anisotropy=8,l.wrapS=f,l.wrapT=f,u.wrapS=f,u.wrapT=f},[c,l,u]);let m=e.features||[],_=e.landingSites||[],v=a.terrain?F.elevationSpanScale*s:0,y=a.terrain?-F.zeroDatumNorm*v:0;return(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(`color`,{attach:`background`,args:[`#03020d`]}),(0,k.jsx)(`fog`,{attach:`fog`,args:[`#03020d`,6,17]}),(0,k.jsx)(p,{radius:180,depth:80,count:7200,factor:3.3,saturation:.18,fade:!0,speed:.03}),(0,k.jsx)(`ambientLight`,{intensity:.22,color:`#fbd2a0`}),(0,k.jsx)(`directionalLight`,{position:[4.5,1.8,3.8],intensity:4.25,color:`#fff0d1`}),(0,k.jsx)(`pointLight`,{position:[4.5,1.8,3.8],intensity:3.3,color:`#fb923c`,distance:12}),(0,k.jsx)(`pointLight`,{position:[-3.8,-1.2,-2.6],intensity:.42,color:`#60a5fa`,distance:8}),(0,k.jsxs)(`group`,{rotation:[I.x,I.y,I.z],children:[(0,k.jsxs)(`mesh`,{onPointerMove:e=>{e.uv&&i(U(e.uv))},onClick:e=>{e.uv&&r({...U(e.uv),id:`coordinate-pick`,name:`Selected coordinate`,kind:`coordinate`,type:`surface point`,summary:`Manual coordinate selected on the Mars texture.`})},children:[(0,k.jsx)(`sphereGeometry`,{args:[1,256,256]}),(0,k.jsx)(`meshStandardMaterial`,{map:c,bumpMap:a.relief||a.terrain?l:null,bumpScale:a.relief?.055:.022,displacementMap:a.terrain?l:null,displacementScale:v,displacementBias:y,roughness:.93,metalness:0,color:`#ffffff`})]}),a.relief&&(0,k.jsxs)(`mesh`,{children:[(0,k.jsx)(`sphereGeometry`,{args:[1.002,256,256]}),(0,k.jsx)(`meshStandardMaterial`,{map:u,displacementMap:a.terrain?l:null,displacementScale:v,displacementBias:y,transparent:!0,opacity:.28,blending:4,depthWrite:!1,roughness:1,metalness:0})]}),(0,k.jsx)(J,{visible:a.polarCaps}),(0,k.jsx)(Y,{visible:a.graticule}),a.features&&m.map(e=>(0,k.jsx)(X,{item:e,selected:t?.id===e.id,onSelect:r,labels:a.labels,kind:`feature`},e.id)),a.missions&&_.map(e=>(0,k.jsx)(X,{item:{...e,type:`mission`,priority:e.status?.includes(`active`)?`major`:`mission`},selected:t?.id===e.id,onSelect:r,labels:a.labels,kind:`mission`},e.id))]}),(0,k.jsx)(q,{visible:a.atmosphere}),(0,k.jsx)(Z,{moons:e.moons,visible:a.moons}),(0,k.jsxs)(`mesh`,{position:[4.8,1.7,3.9],children:[(0,k.jsx)(`sphereGeometry`,{args:[.22,48,48]}),(0,k.jsx)(`meshBasicMaterial`,{color:`#fbbf24`})]}),(0,k.jsxs)(`mesh`,{position:[4.8,1.7,3.9],children:[(0,k.jsx)(`sphereGeometry`,{args:[.82,48,48]}),(0,k.jsx)(`meshBasicMaterial`,{color:`#fb923c`,transparent:!0,opacity:.08,blending:2,depthWrite:!1})]}),(0,k.jsx)(d,{children:(0,k.jsx)(h,{luminanceThreshold:.22,luminanceSmoothing:.78,intensity:1.08,radius:.64})}),(0,k.jsx)(Q,{})]})}function $({icon:e,label:t,active:n,onClick:r}){return(0,k.jsxs)(`button`,{type:`button`,className:`mars-layer-button ${n?`is-active`:``}`,onClick:r,title:t,children:[(0,k.jsx)(e,{size:15}),(0,k.jsx)(`span`,{children:t})]})}function ne({data:e,query:t,setQuery:n,filter:r,setFilter:i,layers:a,toggleLayer:o,selected:s,setSelected:c,setFocusTick:l,terrainBoost:u,setTerrainBoost:d}){let f=e.features||[];e.landingSites;let p=(0,O.useMemo)(()=>[`all`,...Array.from(new Set(f.map(e=>e.type))).sort()],[f]),m=z.map(e=>f.find(t=>t.id===e.key)).filter(Boolean);return(0,k.jsxs)(`aside`,{className:`mars-panel mars-left-panel`,children:[(0,k.jsx)(`div`,{className:`mars-kicker`,children:`AstroBis Mars map`}),(0,k.jsx)(`h1`,{children:`Real 3D surface atlas`}),(0,k.jsx)(`p`,{children:`A WebGL Mars globe with a real texture map, NASA PDS MOLA terrain displacement, named surface features, landing-site markers, moon orbits, coordinate picking, and labelled scientific caveats.`}),(0,k.jsxs)(`div`,{className:`mars-search`,children:[(0,k.jsx)(D,{size:16}),(0,k.jsx)(`input`,{value:t,onChange:e=>n(e.target.value),placeholder:`Search Mars feature or mission`})]}),(0,k.jsx)(`select`,{className:`mars-select`,value:r,onChange:e=>i(e.target.value),"aria-label":`Feature filter`,children:p.map(e=>(0,k.jsx)(`option`,{value:e,children:e===`all`?`All feature types`:e},e))}),(0,k.jsx)(`div`,{className:`mars-presets`,children:m.map(e=>(0,k.jsx)(`button`,{type:`button`,onClick:()=>{c({...e,kind:`feature`}),l(e=>e+1)},children:z.find(t=>t.key===e.id)?.label||e.name},e.id))}),(0,k.jsxs)(`div`,{className:`mars-stats-grid`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Radius`}),(0,k.jsxs)(`strong`,{children:[B(e.body?.radiusKm),` km`]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Gravity`}),(0,k.jsxs)(`strong`,{children:[e.body?.gravityMs2,` m/s2`]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Sol`}),(0,k.jsxs)(`strong`,{children:[e.body?.solHours?.toFixed(2),` h`]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Moons`}),(0,k.jsx)(`strong`,{children:e.body?.knownMoons})]})]}),(0,k.jsxs)(`div`,{className:`mars-terrain-control`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`MOLA terrain`}),(0,k.jsx)(`strong`,{children:a.terrain?`${u.toFixed(0)}x vertical`:`off`})]}),(0,k.jsx)(`input`,{type:`range`,min:`1`,max:`18`,step:`1`,value:u,disabled:!a.terrain,onChange:e=>d(Number(e.target.value)),"aria-label":`MOLA terrain vertical exaggeration`}),(0,k.jsx)(`small`,{children:`1x is closest to planetary scale; higher values make volcanoes, basins, and canyon systems legible on a whole-planet globe.`})]}),(0,k.jsxs)(`div`,{className:`mars-layer-grid`,children:[(0,k.jsx)($,{icon:E,label:`3D terrain`,active:a.terrain,onClick:()=>o(`terrain`)}),(0,k.jsx)($,{icon:C,label:`Relief`,active:a.relief,onClick:()=>o(`relief`)}),(0,k.jsx)($,{icon:x,label:`Grid`,active:a.graticule,onClick:()=>o(`graticule`)}),(0,k.jsx)($,{icon:E,label:`Features`,active:a.features,onClick:()=>o(`features`)}),(0,k.jsx)($,{icon:ee,label:`Missions`,active:a.missions,onClick:()=>o(`missions`)}),(0,k.jsx)($,{icon:w,label:`Moons`,active:a.moons,onClick:()=>o(`moons`)}),(0,k.jsx)($,{icon:b,label:`Haze`,active:a.atmosphere,onClick:()=>o(`atmosphere`)}),(0,k.jsx)($,{icon:w,label:`Polar caps`,active:a.polarCaps,onClick:()=>o(`polarCaps`)}),(0,k.jsx)($,{icon:y,label:`Labels`,active:a.labels,onClick:()=>o(`labels`)}),(0,k.jsx)($,{icon:T,label:`Mini map`,active:a.miniMap,onClick:()=>o(`miniMap`)})]}),(0,k.jsx)(`div`,{className:`mars-note`,children:e.textures?.textureNote||`MOLA terrain is vertically exaggerated for whole-planet readability.`}),s?.kind===`coordinate`&&(0,k.jsxs)(`div`,{className:`mars-coordinate-callout`,children:[`Picked: `,s.lat.toFixed(2),` lat / `,s.lon.toFixed(2),` lon`]})]})}function re({data:e,selected:t,hoverCoordinate:n,setSelected:r}){let i=t||e.features?.[0]||null;return(0,k.jsxs)(`aside`,{className:`mars-panel mars-right-panel`,children:[(0,k.jsxs)(`div`,{className:`mars-panel-top`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`div`,{className:`mars-kicker`,children:i?.kind===`mission`?`Landing site`:i?.kind===`coordinate`?`Coordinate pick`:i?.type||`Surface feature`}),(0,k.jsx)(`h2`,{children:i?.name||`Mars`})]}),t&&(0,k.jsx)(`button`,{type:`button`,className:`mars-close`,onClick:()=>r(null),children:`x`})]}),(0,k.jsx)(`p`,{className:`mars-summary`,children:i?.summary||e.body?.surface}),(0,k.jsxs)(`div`,{className:`mars-info-list`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Latitude`}),(0,k.jsx)(`strong`,{children:Number.isFinite(i?.lat)?`${i.lat.toFixed(3)} deg`:`n/a`})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Longitude`}),(0,k.jsx)(`strong`,{children:Number.isFinite(i?.lon)?`${V(i.lon).toFixed(3)} deg`:`n/a`})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Scale`}),(0,k.jsx)(`strong`,{children:i?.scale||i?.status||`reference point`})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Source`}),(0,k.jsx)(`strong`,{children:i?.source||i?.agency||`AstroBis Mars snapshot`})]})]}),(0,k.jsx)(`div`,{className:`mars-section-title`,children:`Planet constants`}),(0,k.jsxs)(`div`,{className:`mars-info-list compact`,children:[(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Mean distance`}),(0,k.jsxs)(`strong`,{children:[e.body?.meanDistanceAu,` AU`]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Orbital period`}),(0,k.jsxs)(`strong`,{children:[B(e.body?.orbitalPeriodDays,2),` days`]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Axial tilt`}),(0,k.jsxs)(`strong`,{children:[e.body?.axialTiltDeg,` deg`]})]}),(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`span`,{children:`Escape velocity`}),(0,k.jsxs)(`strong`,{children:[e.body?.escapeVelocityKms,` km/s`]})]})]}),(0,k.jsx)(`div`,{className:`mars-section-title`,children:`Moons`}),(0,k.jsx)(`div`,{className:`mars-moon-cards`,children:(e.moons||[]).map(e=>(0,k.jsxs)(`div`,{children:[(0,k.jsx)(`strong`,{children:e.name}),(0,k.jsxs)(`span`,{children:[e.orbitalPeriodHours,` h orbit`]})]},e.name))}),(0,k.jsxs)(`div`,{className:`mars-coordinate-readout`,children:[`Hover coordinate: `,n?`${n.lat.toFixed(2)} lat / ${n.lon.toFixed(2)} lon`:`move over the globe`]})]})}function ie({data:e,selected:t,setSelected:n,visible:r,query:i,filter:a,layers:o}){if(!r)return null;let s=i.trim().toLowerCase(),c=(e.features||[]).filter(e=>{let t=!s||`${e.name} ${e.type} ${e.summary}`.toLowerCase().includes(s),n=a===`all`||e.type===a;return t&&n}),l=e.landingSites||[];return(0,k.jsxs)(`div`,{className:`mars-mini-map`,children:[(0,k.jsx)(`div`,{className:`mars-mini-map-bg`}),(0,k.jsx)(`div`,{className:`mars-mini-map-relief ${o.relief||o.terrain?`is-visible`:``}`}),(0,k.jsx)(`div`,{className:`mars-mini-map-grid`}),c.map(e=>(0,k.jsx)(`button`,{type:`button`,className:`mars-map-dot feature ${t?.id===e.id?`is-selected`:``}`,style:W(e),title:e.name,onClick:()=>n({...e,kind:`feature`})},e.id)),l.map(e=>(0,k.jsx)(`button`,{type:`button`,className:`mars-map-dot mission ${t?.id===e.id?`is-selected`:``}`,style:W(e),title:e.name,onClick:()=>n({...e,kind:`mission`,type:`mission`})},e.id)),(0,k.jsxs)(`div`,{className:`mars-mini-caption`,children:[(0,k.jsx)(`strong`,{children:`Mars reference map`}),(0,k.jsx)(`span`,{children:`features + landing sites`})]})]})}function ae({data:e,setSelected:t}){let n=e.landingSites||[];return(0,k.jsxs)(`div`,{className:`mars-mission-rail`,children:[(0,k.jsx)(`div`,{className:`mars-rail-title`,children:`Landing-site chronology`}),(0,k.jsx)(`div`,{className:`mars-rail-list`,children:n.map(e=>(0,k.jsxs)(`button`,{type:`button`,onClick:()=>t({...e,kind:`mission`,type:`mission`}),children:[(0,k.jsx)(`span`,{children:e.name}),(0,k.jsx)(`strong`,{children:e.status})]},e.id))})]})}function oe({data:e}){return(0,k.jsx)(`div`,{className:`mars-source-strip`,children:(e.sources||[]).slice(0,4).map(e=>(0,k.jsxs)(`a`,{href:e.url,target:`_blank`,rel:`noopener noreferrer`,children:[(0,k.jsx)(`span`,{children:e.label}),(0,k.jsx)(`small`,{children:e.note})]},e.id))})}function se(){let[e,t]=(0,O.useState)(L),[n,r]=(0,O.useState)(null),[i,a]=(0,O.useState)(null),[o,c]=(0,O.useState)(``),[l,u]=(0,O.useState)(`all`),[d,f]=(0,O.useState)(0),[p,m]=(0,O.useState)(5),[h,g]=(0,O.useState)({terrain:!0,relief:!0,graticule:!0,features:!0,missions:!0,moons:!0,atmosphere:!0,labels:!0,polarCaps:!0,miniMap:!0});(0,O.useEffect)(()=>{let e=!0;async function n(){try{let n=await fetch(`${j}?ts=${Date.now()}`,{cache:`no-store`});if(!n.ok)throw Error(`Mars snapshot unavailable`);let i=await n.json();e&&(t(i),r(null))}catch{e&&r(null)}}return n(),()=>{e=!1}},[]);let _=e=>g(t=>({...t,[e]:!t[e]})),v=(0,O.useMemo)(()=>{let t=o.trim().toLowerCase();return{...e,features:(e.features||[]).filter(e=>{let n=!t||`${e.name} ${e.type} ${e.summary}`.toLowerCase().includes(t),r=l===`all`||e.type===l;return n&&r})}},[e,o,l]);return(0,k.jsxs)(`div`,{className:`mars-map-shell`,children:[(0,k.jsx)(s,{camera:{position:[.12,.28,3.05],fov:43},dpr:[1,1.75],children:(0,k.jsx)(O.Suspense,{fallback:null,children:(0,k.jsx)(te,{data:v,selected:n,onSelect:e=>{r(e),f(e=>e+1)},onCoordinate:a,layers:h,terrainBoost:p})})}),(0,k.jsxs)(`div`,{className:`mars-top-strip`,children:[(0,k.jsxs)(`span`,{children:[`UTC `,new Date(e.generatedAt||Date.now()).toISOString().slice(0,16).replace(`T`,` `)]}),(0,k.jsx)(`strong`,{children:`Mars Areography Console`}),(0,k.jsxs)(`span`,{children:[(e.features||[]).length,` features / `,(e.landingSites||[]).length,` landers and rovers / MOLA `,h.terrain?`${p}x terrain`:`terrain off`]})]}),(0,k.jsx)(ne,{data:e,query:o,setQuery:c,filter:l,setFilter:u,layers:h,toggleLayer:_,selected:n,setSelected:r,setFocusTick:f,terrainBoost:p,setTerrainBoost:m}),(0,k.jsx)(re,{data:e,selected:n,hoverCoordinate:i,setSelected:r}),(0,k.jsx)(ie,{data:e,selected:n,setSelected:r,visible:h.miniMap,query:o,filter:l,layers:h}),(0,k.jsx)(ae,{data:e,setSelected:e=>{r(e),f(e=>e+1)}}),(0,k.jsx)(oe,{data:e}),(0,k.jsxs)(`div`,{className:`mars-credit`,children:[`Texture: `,e.textures?.surfaceCredit||`Mars public texture`,` - Terrain: `,e.textures?.heightmapCredit||`NASA PDS MOLA MEGDR`,` - Data: NASA / USGS / IAU reference sources`]}),(0,k.jsx)(`style`,{children:ce})]})}var ce=`
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
  background-image: linear-gradient(rgba(20,8,4,0.08), rgba(20,8,4,0.38)), url('${M}');
  background-size: cover;
  background-position: center;
  filter: saturate(1.04) contrast(1.1);
}
.mars-mini-map-relief {
  position: absolute;
  inset: 0;
  background-image: url('${P}');
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
`;export{se as default};