import{j as t}from"./jsx-runtime.CYiYLu1p.js";import{r as h}from"./index.CZlPm10g.js";import{C as ye,b as ve,E as je,B as ke,O as Me,u as Ne,T as Se,S as Ae,a as F,c as U,V as ze,d as G,L as X,A as W,H as oe,D as Ce,e as re,f as Le}from"./Bloom.BiThqmRs.js";import"./client.vFaO0wSm.js";/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=(...e)=>e.filter((s,o,i)=>!!s&&s.trim()!==""&&i.indexOf(s)===o).join(" ").trim();/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(s,o,i)=>i?i.toUpperCase():o.toLowerCase());/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=e=>{const s=_e(e);return s.charAt(0).toUpperCase()+s.slice(1)};/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var P={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=e=>{for(const s in e)if(s.startsWith("aria-")||s==="role"||s==="title")return!0;return!1},De=h.createContext({}),$e=()=>h.useContext(De),Ie=h.forwardRef(({color:e,size:s,strokeWidth:o,absoluteStrokeWidth:i,className:a="",children:r,iconNode:p,...c},l)=>{const{size:m=24,strokeWidth:n=2,absoluteStrokeWidth:u=!1,color:d="currentColor",className:w=""}=$e()??{},N=i??u?Number(o??n)*24/Number(s??m):o??n;return h.createElement("svg",{ref:l,...P,width:s??m??P.width,height:s??m??P.height,stroke:e??d,strokeWidth:N,className:ae("lucide",w,a),...!r&&!Oe(c)&&{"aria-hidden":"true"},...c},[...p.map(([v,T])=>h.createElement(v,T)),...Array.isArray(r)?r:[r]])});/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=(e,s)=>{const o=h.forwardRef(({className:i,...a},r)=>h.createElement(Ie,{ref:r,iconNode:s,className:ae(`lucide-${Ee(ee(e))}`,`lucide-${e}`,i),...a}));return o.displayName=ee(e),o};/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],B=f("activity",Te);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]],Re=f("cloud",Pe);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]],Ue=f("crosshair",Fe);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],$=f("earth",Ge);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],q=f("eye",We);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",key:"1slcih"}]],qe=f("flame",Be);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],He=f("layers",Ve);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],ie=f("map",Ke);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=[["path",{d:"M15 18h-5",key:"95g1m2"}],["path",{d:"M18 14h-8",key:"sponae"}],["path",{d:"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2",key:"39pd36"}],["rect",{width:"8",height:"4",x:"10",y:"6",rx:"1",key:"aywv1n"}]],V=f("newspaper",Ye);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["path",{d:"M20.341 6.484A10 10 0 0 1 10.266 21.85",key:"1enhxb"}],["path",{d:"M3.659 17.516A10 10 0 0 1 13.74 2.152",key:"1crzgf"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["circle",{cx:"19",cy:"5",r:"2",key:"mhkx31"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}]],ne=f("orbit",Ze);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478",key:"1fwjs5"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134",key:"ehdyv1"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134",key:"1q22gi"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478",key:"r2q7qm"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],le=f("radio",Je);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Xe=f("refresh-cw",Qe);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=[["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}],["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",key:"u4xsad"}],["path",{d:"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",key:"676m9"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",key:"92ym6u"}]],ce=f("rocket",et);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["path",{d:"m13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5",key:"dzhfyz"}],["path",{d:"M16.5 7.5 19 5",key:"1ltcjm"}],["path",{d:"m17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5",key:"nfoymv"}],["path",{d:"M9 21a6 6 0 0 0-6-6",key:"1iajcf"}],["path",{d:"M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z",key:"nv9zqy"}]],H=f("satellite",tt);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],ot=f("triangle-alert",st);/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=[["path",{d:"M2 12q2.5 2 5 0t5 0 5 0 5 0",key:"8ddzzs"}],["path",{d:"M2 19q2.5 2 5 0t5 0 5 0 5 0",key:"1wj4st"}],["path",{d:"M2 5q2.5 2 5 0t5 0 5 0 5 0",key:"69x50u"}]],at=f("waves-horizontal",rt),de=6371,it="/AstroBis".endsWith("/")?"/AstroBis":"/AstroBis/",nt=`${it}data/world-ops.json`,lt=new Date("2026-01-01T00:00:00.000Z"),k={day:"https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",normal:"https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",specular:"https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",lights:"https://threejs.org/examples/textures/planets/earth_lights_2048.png",clouds:"https://threejs.org/examples/textures/planets/earth_clouds_1024.png"},R={schemaVersion:1,generatedAt:"2026-01-01T00:00:00.000Z",sources:[{id:"fallback",label:"Bundled AstroBis fallback",status:"fallback",count:4}],events:[{id:"fallback-earth-event",type:"nasa-event",title:"EarthOps snapshot unavailable",lat:28.5729,lon:-80.649,severity:"reference",timestamp:"2026-01-01T00:00:00.000Z",source:"offline fallback",url:"https://eonet.gsfc.nasa.gov/",summary:"Fallback marker used when the build-time EarthOps snapshot cannot be loaded."}],satellites:[{id:"fallback-iss",name:"ISS (ZARYA)",noradId:25544,objectId:"1998-067A",group:"Space stations",status:"station",epoch:"2026-01-01T00:00:00.000Z",meanMotion:15.49,eccentricity:7e-4,inclination:51.64,raan:0,argumentOfPerigee:0,meanAnomaly:0,altitudeKm:420}],launches:[],news:[],media:[{id:"nasa-live",type:"live-directory",title:"NASA Live and NASA+",provider:"NASA",status:"official public programming",url:"https://www.nasa.gov/live/",embedUrl:"",summary:"Official NASA live programming, launch coverage, mission events, and NASA+ viewing links."},{id:"iss-live-video",type:"video",title:"ISS Live Video",provider:"NASA / YouTube",status:"official public stream",url:"https://www.youtube.com/watch?v=M3HKLzjvKPc",embedUrl:"https://www.youtube-nocookie.com/embed/M3HKLzjvKPc?rel=0&modestbranding=1",summary:"Public live video stream associated with the International Space Station."}],totals:{events:1,satellites:1,debris:0,launches:0,news:0,media:2}},ct={EQ:"earthquake",TC:"cyclone",FL:"flood",VO:"volcano"},pe=[{key:"satellites",label:"Satellites",icon:H,color:"#67e8f9"},{key:"debris",label:"Debris",icon:ot,color:"#fb7185"},{key:"launches",label:"Launches",icon:ce,color:"#fbbf24"},{key:"nasaEvents",label:"NASA Events",icon:qe,color:"#fb923c"},{key:"earthquakes",label:"Earthquakes",icon:B,color:"#f472b6"},{key:"disasters",label:"Disasters",icon:at,color:"#a78bfa"},{key:"news",label:"Space News",icon:V,color:"#93c5fd"},{key:"clouds",label:"Clouds",icon:Re,color:"#e0f2fe"},{key:"cityLights",label:"City Lights",icon:q,color:"#fde68a"},{key:"orbitTrails",label:"Orbit Trails",icon:ne,color:"#22c55e"},{key:"miniMap",label:"2D Mini Map",icon:ie,color:"#38bdf8"}],dt=Object.fromEntries(pe.map(e=>[e.key,!0])),pt=[{key:"globe",label:"3D Globe",icon:$},{key:"map",label:"2D Ops Map",icon:ie},{key:"shell",label:"Orbit Shell",icon:ne}],mt={wildfires:"#fb923c",volcanoes:"#f97316",severeStorms:"#60a5fa",seaLakeIce:"#93c5fd",dustHaze:"#fbbf24",floods:"#38bdf8",landslides:"#c084fc",manmade:"#f472b6",earthquake:"#f472b6",cyclone:"#a78bfa",flood:"#38bdf8",volcano:"#f97316",disaster:"#a78bfa","nasa-event":"#fb923c"},me={station:"#86efac",satellite:"#67e8f9","recent-object":"#fbbf24",debris:"#fb7185"};function E(e,s,o){return Math.max(s,Math.min(o,e))}function K(e){return(e+540)%360-180}function g(e){const s=Number(e);return Number.isFinite(s)?s:null}function I(e){const s=Number(e);if(Number.isFinite(s)&&s>1e9)return new Date(s).toISOString();const o=Date.parse(e);return Number.isFinite(o)?new Date(o).toISOString():new Date().toISOString()}function Y(e,s=220){const o=String(e||"").replace(/\s+/g," ").trim();return o.length<=s?o:`${o.slice(0,s-1).trim()}...`}function ue(e,s,o=1){const i=(90-e)*Math.PI/180,a=(s+180)*Math.PI/180;return new G(-o*Math.sin(i)*Math.cos(a),o*Math.cos(i),o*Math.sin(i)*Math.sin(a))}function z(e,s){return{x:(K(s)+180)/360*100,y:(90-E(e,-89.9,89.9))/180*100}}function ut(e){const s=e.length()||1;return{lat:Math.asin(E(e.y/s,-1,1))*180/Math.PI,lon:K(Math.atan2(e.z,-e.x)*180/Math.PI-180)}}function ht(e,s=Date.now()){return e?.meanMotion?ut(D(e,s)):null}function Z(e=lt){const s=Math.floor((Date.UTC(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate())-Date.UTC(e.getUTCFullYear(),0,0))/864e5),o=23.44*Math.sin(360/365*(s-81)*Math.PI/180),i=e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600;return{latitude:o,longitude:K((12-i)*15)}}function he(e){if(!e)return"";const s=e.latitude*Math.PI/180,o=[];for(let i=-180;i<=180;i+=4){const a=(i-e.longitude)*Math.PI/180,r=Math.sin(s),p=Math.abs(r)<.03?Math.cos(a)>0?-89:89:Math.atan(-Math.cos(s)*Math.cos(a)/r)*180/Math.PI,c=(i+180)/360*100,l=(90-Math.max(-89,Math.min(89,p)))/180*100;o.push(`${c.toFixed(2)},${l.toFixed(2)}`)}return`M ${o.join(" L ")}`}function M(e,s={}){const o=new Date(e);return Number.isNaN(o.getTime())?"date pending":o.toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",...s})}function ge(e){const s=new Date(e);if(Number.isNaN(s.getTime()))return"time pending";const o=s.getTime()-Date.now(),i=Math.abs(o);return i<36e5?`${Math.round(o/6e4)} min`:i<864e5?`${Math.round(o/36e5)} hr`:`${Math.round(o/864e5)} days`}function gt(e){const s=String(e||"").toLowerCase();return s.includes("red")||s.includes("high")?"#fb7185":s.includes("orange")||s.includes("medium")?"#fbbf24":s.includes("green")||s.includes("low")||s.includes("active")?"#86efac":"#93c5fd"}function j(e,s){return e==="launch"?"#fbbf24":e==="satellite"?me[s.status]||"#67e8f9":e==="news"?"#93c5fd":mt[s.type]||"#a78bfa"}function y(e){return e?`${e.kind}:${e.item.id||e.item.title||e.item.name}`:""}function bt(e=[]){return[...e].reverse().find(s=>s?.type==="Point"&&Array.isArray(s.coordinates))}function xt(e){const s=bt(e.geometry);if(!s)return null;const[o,i]=s.coordinates||[];if(!Number.isFinite(Number(i))||!Number.isFinite(Number(o)))return null;const a=e.categories?.[0];return{id:`eonet-${e.id}`,type:a?.id||"nasa-event",title:e.title||"NASA Earth event",lat:Number(i),lon:Number(o),severity:e.closed?"closed":"active",timestamp:I(s.date||e.closed||Date.now()),source:"NASA EONET live refresh",url:e.sources?.[0]?.url||e.link||"https://eonet.gsfc.nasa.gov/",summary:Y(e.description||a?.title||"Open NASA Earth Observatory Natural Event Tracker record.")}}function ft(e){const s=e.geometry?.coordinates||[],[o,i,a]=s,r=g(e.properties?.mag);return!Number.isFinite(Number(i))||!Number.isFinite(Number(o))?null:{id:`usgs-${e.id}`,type:"earthquake",title:e.properties?.title||"USGS earthquake",lat:Number(i),lon:Number(o),severity:r>=6.5?"high":r>=5?"medium":"low",timestamp:I(e.properties?.time),source:"USGS live refresh",url:e.properties?.url||"https://earthquake.usgs.gov/",summary:Y(`Magnitude ${r??"n/a"} earthquake at ${e.properties?.place||"reported location"}; depth ${g(a)??"n/a"} km.`),magnitude:r,depthKm:g(a)}}function wt(e){const s=e.geometry?.coordinates||[],[o,i]=s,a=e.properties||{};return!Number.isFinite(Number(i))||!Number.isFinite(Number(o))?null:{id:`gdacs-${a.eventtype}-${a.eventid}-${a.episodeid}`,type:ct[a.eventtype]||"disaster",title:a.name||a.description||"GDACS disaster alert",lat:Number(i),lon:Number(o),severity:String(a.alertlevel||a.episodealertlevel||"Green").toLowerCase(),timestamp:I(a.datemodified||a.fromdate||Date.now()),source:"GDACS live refresh",url:a.url?.report||"https://www.gdacs.org/",summary:Y(a.htmldescription||a.description||"GDACS public disaster alert record."),country:a.country||""}}function be(e){const s=g(e);if(!s||s<=0)return null;const o=398600.4418,i=s*2*Math.PI/86400;return Math.cbrt(o/i**2)-de}function te(e,s){const o=g(e.MEAN_MOTION);return{id:`${s.id}-${e.NORAD_CAT_ID||e.OBJECT_ID||e.OBJECT_NAME}`,name:e.OBJECT_NAME||`NORAD ${e.NORAD_CAT_ID}`,noradId:g(e.NORAD_CAT_ID),objectId:e.OBJECT_ID||"",group:s.label,status:s.status,epoch:I(e.EPOCH),meanMotion:o,eccentricity:g(e.ECCENTRICITY)??0,inclination:g(e.INCLINATION)??0,raan:g(e.RA_OF_ASC_NODE)??0,argumentOfPerigee:g(e.ARG_OF_PERICENTER)??0,meanAnomaly:g(e.MEAN_ANOMALY)??0,altitudeKm:be(o)}}function xe(e){const s=e.altitudeKm??be(e.meanMotion)??550;return E(1+s/de,1.025,7.2)}function fe(e,s,o,i,a){const r=o*Math.PI/180,p=i*Math.PI/180,c=a*Math.PI/180,l=Math.cos(p),m=Math.sin(p),n=Math.cos(r),u=Math.sin(r),d=Math.cos(c),w=Math.sin(c),N=e*d-s*w,v=e*w+s*d;return new G(N*l-v*n*m,v*u,N*m+v*n*l)}function D(e,s=Date.now()){const o=xe(e),i=Date.parse(e.epoch||""),a=Number.isFinite(i)?(s-i)/864e5:0,r=g(e.meanMotion)??1,p=(g(e.meanAnomaly)??0)*Math.PI/180+a*r*2*Math.PI,c=E(g(e.eccentricity)??0,0,.25),l=o*(1-c*Math.cos(p));return fe(Math.cos(p)*l,Math.sin(p)*l,g(e.inclination)??0,g(e.raan)??0,g(e.argumentOfPerigee)??0)}function yt(e,s=180){const o=xe(e),i=E(g(e.eccentricity)??0,0,.2),a=[];for(let r=0;r<=s;r+=1){const p=r/s*Math.PI*2,c=o*(1-i*Math.cos(p));a.push(fe(Math.cos(p)*c,Math.sin(p)*c,g(e.inclination)??0,g(e.raan)??0,g(e.argumentOfPerigee)??0))}return a}function vt(e,s){return e.source?.includes("NASA")||["wildfires","volcanoes","severeStorms","seaLakeIce","dustHaze","nasa-event"].includes(e.type)?s.nasaEvents:e.type==="earthquake"&&e.source?.includes("USGS")?s.earthquakes:s.disasters}function jt(e,s){if(!Array.isArray(e)||e.length<=s)return e||[];const o=Math.max(1,Math.ceil(e.length/s));return e.filter((i,a)=>a%o===0).slice(0,s)}async function C(e){const s=new AbortController,o=setTimeout(()=>s.abort(),12e3);try{const i=await fetch(e,{cache:"no-store",signal:s.signal,headers:{accept:"application/json"}});if(!i.ok)throw new Error(`HTTP ${i.status}`);return await i.json()}finally{clearTimeout(o)}}async function kt(){const[e,s,o,i,a]=await Promise.allSettled([C("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=90"),C("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"),C(`https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?eventlist=EQ%2CTC%2CFL%2CVO&fromdate=${new Date(Date.now()-3888e6).toISOString().slice(0,10)}&todate=${new Date().toISOString().slice(0,10)}`),C("https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json"),C("https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json")]),r=[...e.status==="fulfilled"?(e.value.events||[]).map(xt):[],...s.status==="fulfilled"?(s.value.features||[]).map(ft).sort((c,l)=>(l?.magnitude||0)-(c?.magnitude||0)).slice(0,120):[],...o.status==="fulfilled"?(o.value.features||[]).map(wt).slice(0,160):[]].filter(Boolean),p=[...i.status==="fulfilled"?i.value.map(c=>te(c,{id:"stations",label:"Space stations",status:"station"})):[],...a.status==="fulfilled"?jt(a.value,80).map(c=>te(c,{id:"last-30-days",label:"Recent launches",status:"recent-object"})):[]].filter(c=>c.name&&c.meanMotion);return{events:r,satellites:p,statuses:{eonet:e.status,usgs:s.status,gdacs:o.status,stations:i.status,recent:a.status}}}function Mt({events:e,launches:s,satellites:o,layers:i,selected:a,onSelect:r}){const p=Z(new Date),c=h.useMemo(()=>{const n=o.filter(d=>d.status==="debris"?i.debris:i.satellites).slice(0,620),u=Date.now();return n.map(d=>{const w=ht(d,u);return w?{satellite:d,...z(w.lat,w.lon)}:null}).filter(Boolean)},[o,i.debris,i.satellites]),l=e.slice(0,260).map(n=>({event:n,...z(n.lat,n.lon)})),m=s.filter(n=>Number.isFinite(n.lat)&&Number.isFinite(n.lon)).slice(0,48).map(n=>({launch:n,...z(n.lat,n.lon)}));return t.jsxs("div",{className:"worldops-projection-map",children:[t.jsx("div",{className:"worldops-projection-bg"}),t.jsxs("svg",{viewBox:"0 0 100 100",preserveAspectRatio:"none","aria-hidden":"true",children:[[-120,-60,0,60,120].map(n=>{const u=z(0,n).x;return t.jsx("line",{x1:u,y1:"0",x2:u,y2:"100"},`lon-${n}`)}),[-60,-30,0,30,60].map(n=>{const u=z(n,0).y;return t.jsx("line",{x1:"0",y1:u,x2:"100",y2:u},`lat-${n}`)}),t.jsx("path",{d:he(p),className:"terminator"})]}),c.map(({satellite:n,x:u,y:d})=>t.jsx("button",{type:"button",className:`worldops-projection-dot orbital ${n.status==="debris"?"debris":""} ${y(a)===y({kind:"satellite",item:n})?"is-active":""}`,style:{left:`${u}%`,top:`${d}%`,"--dot-color":j("satellite",n)},onClick:()=>r({kind:"satellite",item:n}),title:n.name},n.id)),l.map(({event:n,x:u,y:d})=>t.jsx("button",{type:"button",className:`worldops-projection-dot event ${y(a)===y({kind:"event",item:n})?"is-active":""}`,style:{left:`${u}%`,top:`${d}%`,"--dot-color":j("event",n)},onClick:()=>r({kind:"event",item:n}),title:n.title},n.id)),m.map(({launch:n,x:u,y:d})=>t.jsx("button",{type:"button",className:`worldops-projection-dot launch ${y(a)===y({kind:"launch",item:n})?"is-active":""}`,style:{left:`${u}%`,top:`${d}%`,"--dot-color":j("launch",n)},onClick:()=>r({kind:"launch",item:n}),title:n.name},n.id)),t.jsxs("div",{className:"worldops-map-legend",children:[t.jsxs("span",{children:[t.jsx("i",{style:{"--dot-color":"#67e8f9"}})," satellites"]}),t.jsxs("span",{children:[t.jsx("i",{style:{"--dot-color":"#fb7185"}})," debris"]}),t.jsxs("span",{children:[t.jsx("i",{style:{"--dot-color":"#fb923c"}})," events"]}),t.jsxs("span",{children:[t.jsx("i",{style:{"--dot-color":"#fbbf24"}})," launches"]})]})]})}function Nt({texture:e,sunDirection:s}){const o=h.useMemo(()=>new re({uniforms:{lightsMap:{value:e},sunDirection:{value:s}},vertexShader:`
      varying vec2 vUv;
      varying vec3 vNormalWorld;
      void main() {
        vUv = uv;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D lightsMap;
      uniform vec3 sunDirection;
      varying vec2 vUv;
      varying vec3 vNormalWorld;
      void main() {
        float daylight = dot(normalize(vNormalWorld), normalize(sunDirection));
        float night = smoothstep(0.20, -0.18, daylight);
        vec3 lights = texture2D(lightsMap, vUv).rgb;
        gl_FragColor = vec4(lights * night * 1.65, night * 0.72);
      }
    `,transparent:!0,blending:W,depthWrite:!1}),[e]);return F(()=>{o.uniforms.sunDirection&&(o.uniforms.sunDirection.value=s)}),h.useEffect(()=>{o.uniforms.lightsMap.value=e},[o,e]),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[1.006,128,128]}),t.jsx("primitive",{object:o,attach:"material"})]})}function St(){const e=h.useMemo(()=>new re({uniforms:{glowColor:{value:new U("#67e8f9")}},vertexShader:`
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.76 - abs(vNormal.z), 2.35);
        gl_FragColor = vec4(glowColor, clamp(rim, 0.0, 0.2));
      }
    `,transparent:!0,side:Le,depthWrite:!1,blending:W}),[]);return t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[1.058,96,96]}),t.jsx("primitive",{object:e,attach:"material"})]})}function At({layers:e,markerCount:s,shellMode:o=!1}){const[i,a,r,p,c]=Ne(Se,[k.day,k.normal,k.specular,k.lights,k.clouds]),l=h.useRef(),m=h.useMemo(()=>Z(new Date),[s]),n=h.useMemo(()=>ue(m.latitude,m.longitude,7.1),[m.latitude,m.longitude]),u=h.useMemo(()=>n.clone().normalize(),[n]);return h.useMemo(()=>{[i,p,c].forEach(d=>{d.colorSpace=Ae,d.anisotropy=8}),a.anisotropy=8,r.anisotropy=8},[i,a,r,p,c]),F(({clock:d})=>{l.current&&(l.current.rotation.y=d.getElapsedTime()*.006)}),t.jsxs("group",{children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[1,128,128]}),t.jsx("meshPhongMaterial",{map:i,normalMap:a,normalScale:new ze(.36,.36),specularMap:r,specular:new U("#315982"),shininess:20,transparent:o,opacity:o?.36:1})]}),e.cityLights&&!o&&t.jsx(Nt,{texture:p,sunDirection:u}),e.clouds&&t.jsxs("mesh",{ref:l,children:[t.jsx("sphereGeometry",{args:[1.013,128,128]}),t.jsx("meshLambertMaterial",{map:c,transparent:!0,opacity:o?.12:.34,depthWrite:!1})]}),t.jsx(St,{}),t.jsx("ambientLight",{intensity:.12,color:"#7dd3fc"}),t.jsx("directionalLight",{position:n.toArray(),color:"#fff7ed",intensity:3.5}),t.jsx("pointLight",{position:n.toArray(),color:"#facc15",intensity:2.2,distance:14})]})}function se({item:e,kind:s,selected:o,onSelect:i}){if(!Number.isFinite(e.lat)||!Number.isFinite(e.lon))return null;const a=y(o)===y({kind:s,item:e}),r=j(s,e),p=ue(e.lat,e.lon,s==="launch"?1.055:1.035),c=s==="launch"?.017:a?.019:.011;return t.jsxs("group",{position:p,onClick:l=>{l.stopPropagation(),i({kind:s,item:e})},children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[c,18,18]}),t.jsx("meshBasicMaterial",{color:r,transparent:!0,opacity:.96})]}),t.jsxs("mesh",{children:[t.jsx("ringGeometry",{args:[c*1.8,c*3.4,32]}),t.jsx("meshBasicMaterial",{color:r,transparent:!0,opacity:a?.72:.26,side:Ce,depthWrite:!1})]}),a&&t.jsx(oe,{center:!0,distanceFactor:5.4,children:t.jsxs("div",{className:"worldops-space-label",children:[t.jsx("span",{children:s==="launch"?"Launch site":e.source}),t.jsx("strong",{children:e.title||e.name})]})})]})}function zt({selected:e}){const s=[{label:"LEO",radius:1.08,color:"#67e8f9"},{label:"MEO",radius:3.05,color:"#a78bfa"},{label:"GEO",radius:6.61,color:"#fbbf24"}];return t.jsxs(t.Fragment,{children:[s.map(o=>{const i=[];for(let a=0;a<=192;a+=1){const r=a/192*Math.PI*2;i.push(new G(Math.cos(r)*o.radius,0,Math.sin(r)*o.radius))}return t.jsx(X,{points:i,color:o.color,transparent:!0,opacity:o.label==="GEO"?.2:.16,lineWidth:.65},o.label)}),e?.kind==="satellite"&&t.jsx(X,{points:yt(e.item),color:j("satellite",e.item),transparent:!0,opacity:.62,lineWidth:1.2})]})}function Ct({satellites:e,layers:s,mode:o="globe"}){const i=h.useRef(),a=h.useRef(0),r=h.useMemo(()=>e.filter(c=>c.status==="debris"?s.debris:s.satellites).slice(0,760),[e,s.debris,s.satellites]),p=h.useMemo(()=>{const c=new Float32Array(Math.max(r.length,1)*3),l=new Float32Array(Math.max(r.length,1)*3);return r.forEach((m,n)=>{const u=new U(me[m.status]||"#67e8f9");l[n*3]=u.r,l[n*3+1]=u.g,l[n*3+2]=u.b;const d=D(m);c[n*3]=d.x,c[n*3+1]=d.y,c[n*3+2]=d.z}),{positions:c,colors:l}},[r]);return F(({clock:c})=>{if(!i.current||c.elapsedTime-a.current<.75)return;a.current=c.elapsedTime;const l=Date.now(),m=i.current.attributes.position;r.forEach((n,u)=>{const d=D(n,l);m.array[u*3]=d.x,m.array[u*3+1]=d.y,m.array[u*3+2]=d.z}),m.needsUpdate=!0}),r.length?t.jsxs("points",{children:[t.jsxs("bufferGeometry",{ref:i,children:[t.jsx("bufferAttribute",{attach:"attributes-position",array:p.positions,count:r.length,itemSize:3}),t.jsx("bufferAttribute",{attach:"attributes-color",array:p.colors,count:r.length,itemSize:3})]},`satellite-geometry-${r.length}`),t.jsx("pointsMaterial",{vertexColors:!0,size:o==="shell"?.028:.019,transparent:!0,opacity:o==="shell"?.9:.74,sizeAttenuation:!0,depthWrite:!1})]},`satellite-cloud-${r.length}`):null}function Lt({selected:e,onSelect:s}){if(e?.kind!=="satellite")return null;const o=e.item,i=D(o),a=j("satellite",o);return t.jsxs("group",{position:i,onClick:r=>{r.stopPropagation(),s(e)},children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[.035,24,24]}),t.jsx("meshBasicMaterial",{color:a})]}),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[.075,24,24]}),t.jsx("meshBasicMaterial",{color:a,transparent:!0,opacity:.16,blending:W,depthWrite:!1})]}),t.jsx(oe,{center:!0,distanceFactor:5.2,children:t.jsxs("div",{className:"worldops-space-label",children:[t.jsx("span",{children:o.group}),t.jsx("strong",{children:o.name})]})})]})}function Et({events:e,launches:s,satellites:o,layers:i,selected:a,onSelect:r,mode:p="globe"}){const c=s.filter(m=>Number.isFinite(m.lat)&&Number.isFinite(m.lon)),l=e.length+c.length+o.length;return t.jsxs(t.Fragment,{children:[t.jsx("color",{attach:"background",args:["#01030b"]}),t.jsx(ve,{radius:220,depth:90,count:9e3,factor:3.1,saturation:.18,fade:!0,speed:.08}),t.jsx(At,{layers:i,markerCount:l,shellMode:p==="shell"}),i.orbitTrails&&t.jsx(zt,{selected:a}),t.jsx(Ct,{satellites:o,layers:i,mode:p}),t.jsx(Lt,{selected:a,onSelect:r}),e.map(m=>t.jsx(se,{item:m,kind:"event",selected:a,onSelect:r},m.id)),i.launches&&c.map(m=>t.jsx(se,{item:m,kind:"launch",selected:a,onSelect:r},m.id)),t.jsx(je,{children:t.jsx(ke,{luminanceThreshold:.3,luminanceSmoothing:.82,intensity:1.15,radius:.62})}),t.jsx(Me,{enableDamping:!0,dampingFactor:.06,minDistance:1.25,maxDistance:8.7})]})}function O({label:e,value:s,color:o}){return t.jsxs("div",{className:"worldops-stat-pill",style:{"--accent":o},children:[t.jsx("strong",{children:s}),t.jsx("span",{children:e})]})}function _t({layer:e,enabled:s,onToggle:o}){const i=e.icon;return t.jsxs("button",{type:"button",className:"worldops-layer-button",onClick:o,"aria-pressed":s,style:{"--layer-color":e.color},title:e.label,children:[t.jsx(i,{size:15,strokeWidth:2.2}),t.jsx("span",{children:e.label}),t.jsx("i",{"aria-hidden":"true"})]})}function Ot({mode:e,active:s,onSelect:o}){const i=e.icon;return t.jsxs("button",{type:"button",className:"worldops-mode-button","data-active":s?"true":"false",onClick:()=>o(e.key),title:e.label,children:[t.jsx(i,{size:15,strokeWidth:2.2}),t.jsx("span",{children:e.label})]})}function Dt({payload:e,layers:s,setLayers:o,refreshing:i,onRefresh:a,liveStatus:r,visibleCounts:p,onSelect:c,satellites:l,viewMode:m,setViewMode:n}){const u=l.filter(d=>d.status==="station"||d.status==="recent-object").slice(0,8);return t.jsxs("aside",{className:"worldops-panel worldops-left",children:[t.jsxs("div",{className:"worldops-kicker",children:[t.jsx(le,{size:14})," AstroBis EarthOps"]}),t.jsx("h1",{children:"AstroBis EarthOps World Map"}),t.jsx("p",{children:"Space infrastructure, launch activity, Earth hazards, and spaceflight news in one orbital awareness console."}),t.jsxs("div",{className:"worldops-stat-grid",children:[t.jsx(O,{label:"events",value:p.events,color:"#fb923c"}),t.jsx(O,{label:"orbital objects",value:e.totals?.satellites??e.satellites.length,color:"#67e8f9"}),t.jsx(O,{label:"debris sample",value:e.totals?.debris??0,color:"#fb7185"}),t.jsx(O,{label:"launches",value:e.launches.length,color:"#fbbf24"})]}),t.jsxs("div",{className:"worldops-control-block",children:[t.jsxs("div",{className:"worldops-block-title",children:[t.jsx($,{size:14})," View mode"]}),t.jsx("div",{className:"worldops-mode-grid",children:pt.map(d=>t.jsx(Ot,{mode:d,active:m===d.key,onSelect:n},d.key))})]}),t.jsxs("div",{className:"worldops-control-block",children:[t.jsxs("div",{className:"worldops-block-title",children:[t.jsx(He,{size:14})," Layers"]}),t.jsx("div",{className:"worldops-layer-grid",children:pe.map(d=>t.jsx(_t,{layer:d,enabled:s[d.key],onToggle:()=>o(w=>({...w,[d.key]:!w[d.key]}))},d.key))})]}),t.jsxs("div",{className:"worldops-control-block",children:[t.jsxs("div",{className:"worldops-block-title",children:[t.jsx(H,{size:14})," Priority orbital assets"]}),t.jsx("div",{className:"worldops-asset-list",children:u.map(d=>t.jsxs("button",{type:"button",onClick:()=>c({kind:"satellite",item:d}),children:[t.jsx("span",{children:d.name}),t.jsxs("strong",{children:[Math.round(d.altitudeKm||0).toLocaleString()," km"]})]},d.id))})]}),t.jsxs("button",{type:"button",className:"worldops-refresh",onClick:a,disabled:i,children:[t.jsx(Xe,{size:15,className:i?"worldops-spin":""}),i?"Refreshing public feeds":"Refresh live layers"]}),t.jsxs("div",{className:"worldops-source-note",children:["Snapshot ",M(e.generatedAt,{year:"numeric"}),". Live layer status: ",r,"."]})]})}function L({rows:e}){return t.jsx("div",{className:"worldops-detail-rows",children:e.map(([s,o,i])=>t.jsxs("div",{children:[t.jsx("span",{children:s}),t.jsx("strong",{style:{color:i||"#bfdbfe"},children:o||"n/a"})]},s))})}function $t({selected:e,payload:s,sourceMode:o}){const i=e||(s.launches[0]?{kind:"launch",item:s.launches[0]}:s.events[0]?{kind:"event",item:s.events[0]}:s.satellites[0]?{kind:"satellite",item:s.satellites[0]}:null);if(!i)return null;const{kind:a,item:r}=i,p=j(a,r),c=r.title||r.name,l=a==="event"?r.source:a==="launch"?"Upcoming launch":a==="satellite"?r.group:a==="media"?"Public media source":r.site;return t.jsxs("aside",{className:"worldops-panel worldops-right",style:{"--accent":p},children:[t.jsxs("div",{className:"worldops-kicker",children:[t.jsx(Ue,{size:14})," Intelligence panel"]}),t.jsxs("div",{className:"worldops-detail-heading",children:[t.jsx("span",{children:l}),t.jsx("h2",{children:c}),t.jsx("p",{children:r.summary||r.mission||r.status||"Public data snapshot item."})]}),a==="event"&&t.jsx(L,{rows:[["Layer",r.type,p],["Severity",r.severity,gt(r.severity)],["Position",`${r.lat.toFixed(2)}, ${r.lon.toFixed(2)}`],["Updated",M(r.timestamp)]]}),a==="launch"&&t.jsx(L,{rows:[["NET",M(r.net),"#fef3c7"],["Countdown",ge(r.net),"#fbbf24"],["Provider",r.provider],["Pad",r.pad],["Location",r.location]]}),a==="satellite"&&t.jsx(L,{rows:[["NORAD",r.noradId],["Object ID",r.objectId],["Status",r.status,p],["Altitude proxy",`${Math.round(r.altitudeKm||0).toLocaleString()} km`],["Inclination",`${Number(r.inclination||0).toFixed(2)} deg`],["Epoch",M(r.epoch)]]}),a==="news"&&t.jsx(L,{rows:[["Site",r.site],["Published",M(r.publishedAt)],["Source","Spaceflight News API snapshot","#93c5fd"]]}),a==="media"&&t.jsxs(t.Fragment,{children:[t.jsx(L,{rows:[["Provider",r.provider],["Type",r.type],["Status",r.status,"#86efac"],["Use",r.embedUrl?"embeddable public player":"open official source"]]}),r.embedUrl&&t.jsx("div",{className:"worldops-media-frame",children:t.jsx("iframe",{src:r.embedUrl,title:r.title,loading:"lazy",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0})})]}),t.jsx("a",{className:"worldops-source-link",href:r.url||"#",target:"_blank",rel:"noopener noreferrer",children:"Open public source"}),t.jsx("div",{className:"worldops-method-note",children:o==="live"?"Live refresh updates CORS-friendly public feeds in the browser; launches and news remain build snapshots.":"Public feed snapshot. Disaster and news layers are situational context, not official hazard or impact assessments."})]})}function It({events:e,launches:s,selected:o,onSelect:i}){const a=Z(new Date),r=e.slice(0,180),p=s.filter(l=>Number.isFinite(l.lat)&&Number.isFinite(l.lon)).slice(0,24),c=(l,m)=>({left:`${(l.lon+180)/360*100}%`,top:`${(90-l.lat)/180*100}%`,background:j(m,l),boxShadow:`0 0 12px ${j(m,l)}`});return t.jsxs("div",{className:"worldops-mini-map",children:[t.jsx("div",{className:"worldops-mini-map-bg"}),t.jsxs("svg",{viewBox:"0 0 100 100",preserveAspectRatio:"none","aria-hidden":"true",children:[[25,50,75].map(l=>t.jsx("line",{x1:l,y1:"0",x2:l,y2:"100"},`x${l}`)),[25,50,75].map(l=>t.jsx("line",{x1:"0",y1:l,x2:"100",y2:l},`y${l}`)),t.jsx("path",{d:he(a)})]}),r.map(l=>t.jsx("button",{type:"button",className:`worldops-map-dot ${y(o)===y({kind:"event",item:l})?"is-active":""}`,style:c(l,"event"),onClick:()=>i({kind:"event",item:l}),title:l.title},l.id)),p.map(l=>t.jsx("button",{type:"button",className:`worldops-map-dot launch ${y(o)===y({kind:"launch",item:l})?"is-active":""}`,style:c(l,"launch"),onClick:()=>i({kind:"launch",item:l}),title:l.name},l.id)),t.jsxs("div",{className:"worldops-mini-label",children:[t.jsx("strong",{children:"2D operational map"}),t.jsx("span",{children:"events, launch sites, terminator"})]})]})}function Tt({launches:e,events:s,news:o,media:i,layers:a,onSelect:r}){const p=s.slice(0,9),c=e.slice().sort((n,u)=>Date.parse(n.net)-Date.parse(u.net)).slice(0,8),l=a.news?o.slice(0,7):[],m=i.slice(0,6);return t.jsxs("section",{className:"worldops-timeline","aria-label":"EarthOps mission timeline",children:[t.jsxs("div",{className:"worldops-timeline-group",children:[t.jsxs("header",{children:[t.jsx(ce,{size:14})," Upcoming launches"]}),t.jsx("div",{className:"worldops-timeline-scroll",children:c.map(n=>t.jsxs("button",{type:"button",onClick:()=>r({kind:"launch",item:n}),children:[t.jsx("span",{children:ge(n.net)}),t.jsx("strong",{children:n.name}),t.jsx("small",{children:n.location})]},n.id))})]}),t.jsxs("div",{className:"worldops-timeline-group",children:[t.jsxs("header",{children:[t.jsx(B,{size:14})," Earth signals"]}),t.jsx("div",{className:"worldops-timeline-scroll",children:p.map(n=>t.jsxs("button",{type:"button",onClick:()=>r({kind:"event",item:n}),children:[t.jsx("span",{children:n.source}),t.jsx("strong",{children:n.title}),t.jsxs("small",{children:[n.severity," - ",M(n.timestamp)]})]},n.id))})]}),t.jsxs("div",{className:"worldops-timeline-group",children:[t.jsxs("header",{children:[t.jsx(V,{size:14})," Space news"]}),t.jsx("div",{className:"worldops-timeline-scroll",children:l.map(n=>t.jsxs("button",{type:"button",onClick:()=>r({kind:"news",item:n}),children:[t.jsx("span",{children:n.site}),t.jsx("strong",{children:n.title}),t.jsx("small",{children:M(n.publishedAt)})]},n.id))})]}),t.jsxs("div",{className:"worldops-timeline-group",children:[t.jsxs("header",{children:[t.jsx(q,{size:14})," Public media"]}),t.jsx("div",{className:"worldops-timeline-scroll",children:m.map(n=>t.jsxs("button",{type:"button",onClick:()=>r({kind:"media",item:n}),children:[t.jsx("span",{children:n.provider}),t.jsx("strong",{children:n.title}),t.jsx("small",{children:n.status})]},n.id))})]})]})}function Pt(){return t.jsxs("div",{className:"worldops-loading",children:[t.jsx($,{size:26}),t.jsx("span",{children:"Rendering EarthOps globe"})]})}function Rt({payload:e,viewMode:s,visibleCounts:o,sourceMode:i}){const a=new Date().toISOString().replace("T"," ").slice(0,19),r=e.generatedAt?new Date(e.generatedAt).toISOString().replace("T"," ").slice(0,16):"snapshot pending";return t.jsxs("div",{className:"worldops-command-strip",children:[t.jsxs("span",{children:[t.jsx(le,{size:13})," UTC ",a]}),t.jsxs("span",{children:[t.jsx($,{size:13})," ",s==="map"?"2D ops projection":s==="shell"?"orbital-shell view":"3D globe view"]}),t.jsxs("span",{children:[t.jsx(B,{size:13})," ",o.events.toLocaleString()," signals"]}),t.jsxs("span",{children:[t.jsx(H,{size:13})," ",o.satellites.toLocaleString()," objects"]}),t.jsxs("span",{children:[t.jsx(q,{size:13})," ",e.media?.length||0," public media"]}),t.jsxs("span",{children:[t.jsx(V,{size:13})," ",i]}),t.jsxs("strong",{children:["snapshot ",r," UTC"]})]})}function Vt(){const[e,s]=h.useState(R),[o,i]=h.useState(dt),[a,r]=h.useState("globe"),[p,c]=h.useState(null),[l,m]=h.useState(!0),[n,u]=h.useState(!1),[d,w]=h.useState("snapshot"),[N,v]=h.useState("snapshot ready");h.useEffect(()=>{let b=!0;return fetch(nt,{cache:"no-store"}).then(x=>{if(!x.ok)throw new Error("WorldOps snapshot missing");return x.json()}).then(x=>{b&&(s(x),c(x.launches?.[0]?{kind:"launch",item:x.launches[0]}:x.events?.[0]?{kind:"event",item:x.events[0]}:null),w("snapshot"))}).catch(()=>{b&&(s(R),c({kind:"event",item:R.events[0]}),v("fallback"))}).finally(()=>{b&&m(!1)}),()=>{b=!1}},[]);async function T(){u(!0);try{const b=await kt();s(x=>{const _=x.satellites.filter(we=>!["Space stations","Recent launches"].includes(we.group));return{...x,events:b.events.length?b.events:x.events,satellites:b.satellites.length?[...b.satellites,..._]:x.satellites,totals:{...x.totals,events:b.events.length||x.events.length,satellites:b.satellites.length?b.satellites.length+_.length:x.satellites.length}}}),w("live"),v(Object.entries(b.statuses).map(([x,_])=>`${x}:${_}`).join(" / "))}catch(b){v(`refresh held: ${b.message}`)}finally{u(!1)}}const S=h.useMemo(()=>e.events.filter(b=>vt(b,o)),[e.events,o]),J=h.useMemo(()=>e.satellites.filter(b=>b.status==="debris"?o.debris:o.satellites),[e.satellites,o.debris,o.satellites]),A=h.useMemo(()=>o.launches?e.launches:[],[e.launches,o.launches]),Q=h.useMemo(()=>({events:S.length,satellites:J.length,launches:A.length}),[S.length,J.length,A.length]);return t.jsxs("div",{className:`worldops-root view-${a}`,children:[t.jsx("style",{children:Ft}),t.jsxs("div",{className:`worldops-canvas is-${a}`,children:[a==="map"?t.jsx(Mt,{events:S,launches:A,satellites:e.satellites,layers:o,selected:p,onSelect:c}):t.jsx(ye,{camera:{position:a==="shell"?[.18,.2,5.05]:[.18,.32,3.35],fov:a==="shell"?48:44},dpr:[1,1.75],children:t.jsx(h.Suspense,{fallback:null,children:t.jsx(Et,{events:S,launches:A,satellites:e.satellites,layers:o,selected:p,onSelect:c,mode:a})})}),l&&t.jsx(Pt,{}),t.jsx("div",{className:"worldops-orbit-credit",children:"Data snapshots: NASA EONET - USGS - GDACS - CelesTrak - Launch Library 2 - Spaceflight News API"})]}),t.jsx(Rt,{payload:e,viewMode:a,visibleCounts:Q,sourceMode:d}),t.jsx(Dt,{payload:e,layers:o,setLayers:i,refreshing:n,onRefresh:T,liveStatus:N,visibleCounts:Q,onSelect:c,satellites:e.satellites,viewMode:a,setViewMode:r}),t.jsx($t,{selected:p,payload:e,sourceMode:d}),o.miniMap&&t.jsx(It,{events:S,launches:A,selected:p,onSelect:c}),t.jsx(Tt,{launches:A,events:S,news:e.news,media:e.media||[],layers:o,onSelect:c})]})}const Ft=`
.worldops-root {
  position: relative;
  min-height: 100vh;
  padding-top: 64px;
  overflow: hidden;
  background:
    radial-gradient(circle at 48% 24%, rgba(14,165,233,0.16), transparent 34%),
    radial-gradient(circle at 72% 74%, rgba(124,58,237,0.12), transparent 32%),
    #01030b;
}
.worldops-canvas {
  position: absolute;
  inset: 64px 0 0;
}
.worldops-canvas canvas {
  display: block;
}
.worldops-command-strip {
  position: absolute;
  z-index: 27;
  top: 88px;
  left: 396px;
  right: 396px;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 0.45rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.46rem 0.7rem;
  border: 1px solid rgba(103,232,249,0.22);
  border-radius: 14px;
  background: rgba(3,7,18,0.72);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 70px rgba(0,0,0,0.35);
  color: rgba(255,255,255,0.72);
}
.worldops-command-strip::-webkit-scrollbar {
  display: none;
}
.worldops-command-strip span,
.worldops-command-strip strong {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 24px;
  padding: 0.18rem 0.46rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  font-size: 0.66rem;
  font-weight: 850;
  line-height: 1;
  white-space: nowrap;
}
.worldops-command-strip strong {
  color: #67e8f9;
}
.worldops-panel {
  position: absolute;
  z-index: 24;
  border: 1px solid rgba(148,163,184,0.22);
  background: linear-gradient(180deg, rgba(4,8,18,0.88), rgba(4,7,17,0.72));
  backdrop-filter: blur(18px);
  box-shadow: 0 26px 90px rgba(0,0,0,0.4);
  border-radius: 18px;
  color: rgba(255,255,255,0.76);
}
.worldops-left {
  left: 18px;
  top: 88px;
  width: min(360px, calc(100vw - 36px));
  max-height: min(610px, calc(100vh - 315px));
  overflow: auto;
  padding: 1rem;
}
.worldops-right {
  right: 18px;
  top: 88px;
  width: min(360px, calc(100vw - 36px));
  max-height: min(620px, calc(100vh - 236px));
  overflow: auto;
  padding: 1.05rem;
  border-color: color-mix(in srgb, var(--accent), rgba(148,163,184,0.2) 64%);
}
.worldops-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  color: #67e8f9;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
}
.worldops-left h1 {
  margin: 0 0 0.45rem;
  font-family: 'Space Grotesk', Inter, sans-serif;
  color: white;
  font-size: clamp(1.65rem, 2.6vw, 2.4rem);
  line-height: 1.02;
  letter-spacing: 0;
}
.worldops-left p,
.worldops-detail-heading p {
  margin: 0;
  color: rgba(255,255,255,0.58);
  font-size: 0.87rem;
  line-height: 1.55;
}
.worldops-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.62rem;
  margin: 1rem 0;
}
.worldops-stat-pill {
  min-height: 64px;
  padding: 0.72rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.09);
}
.worldops-stat-pill strong {
  display: block;
  color: var(--accent);
  font-size: 1.35rem;
  line-height: 1;
  font-family: 'Space Grotesk', Inter, sans-serif;
}
.worldops-stat-pill span {
  color: rgba(255,255,255,0.44);
  font-size: 0.73rem;
}
.worldops-control-block {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 0.85rem;
  margin-top: 0.85rem;
}
.worldops-block-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.78);
  font-weight: 900;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.72rem;
}
.worldops-layer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.48rem;
}
.worldops-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.48rem;
}
.worldops-mode-button {
  min-height: 52px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.64);
  display: grid;
  place-items: center;
  gap: 0.22rem;
  padding: 0.45rem 0.28rem;
  cursor: pointer;
  font-size: 0.66rem;
  font-weight: 900;
  text-align: center;
}
.worldops-mode-button[data-active="true"] {
  color: #041014;
  background: linear-gradient(135deg, #67e8f9, #86efac);
  border-color: rgba(255,255,255,0.28);
  box-shadow: 0 0 22px rgba(103,232,249,0.25);
}
.worldops-layer-button {
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.11);
  background: rgba(255,255,255,0.045);
  color: rgba(255,255,255,0.54);
  display: flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0 0.62rem;
  cursor: pointer;
  font-weight: 850;
  font-size: 0.72rem;
  transition: transform 160ms ease, border-color 160ms ease, color 160ms ease, background 160ms ease;
}
.worldops-layer-button svg {
  color: var(--layer-color);
  flex: 0 0 auto;
}
.worldops-layer-button i {
  margin-left: auto;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: rgba(255,255,255,0.22);
}
.worldops-layer-button[aria-pressed="true"] {
  color: rgba(255,255,255,0.9);
  border-color: color-mix(in srgb, var(--layer-color), rgba(255,255,255,0.18) 45%);
  background: color-mix(in srgb, var(--layer-color), rgba(255,255,255,0.045) 88%);
}
.worldops-layer-button[aria-pressed="true"] i {
  background: var(--layer-color);
  box-shadow: 0 0 12px var(--layer-color);
}
.worldops-layer-button:hover {
  transform: translateY(-1px);
}
.worldops-asset-list {
  display: grid;
  gap: 0.4rem;
  max-height: 168px;
  overflow: auto;
  padding-right: 0.2rem;
}
.worldops-asset-list button {
  min-height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  color: rgba(255,255,255,0.76);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.42rem 0.55rem;
  cursor: pointer;
  text-align: left;
}
.worldops-asset-list span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.76rem;
  font-weight: 800;
}
.worldops-asset-list strong {
  color: #67e8f9;
  font-size: 0.72rem;
  white-space: nowrap;
}
.worldops-refresh {
  width: 100%;
  min-height: 42px;
  margin-top: 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(103,232,249,0.32);
  background: rgba(103,232,249,0.1);
  color: #cffafe;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 900;
  cursor: pointer;
}
.worldops-refresh:disabled {
  opacity: 0.64;
  cursor: wait;
}
.worldops-source-note {
  margin-top: 0.65rem;
  color: rgba(255,255,255,0.38);
  font-size: 0.72rem;
  line-height: 1.45;
}
.worldops-detail-heading span {
  display: inline-flex;
  color: var(--accent);
  font-weight: 950;
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  margin-bottom: 0.35rem;
}
.worldops-detail-heading h2 {
  color: white;
  margin: 0 0 0.6rem;
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: 1.55rem;
  line-height: 1.02;
  letter-spacing: 0;
}
.worldops-detail-rows {
  margin-top: 1rem;
}
.worldops-detail-rows div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.075);
  padding: 0.55rem 0;
  font-size: 0.78rem;
}
.worldops-detail-rows span {
  color: rgba(255,255,255,0.42);
}
.worldops-detail-rows strong {
  text-align: right;
  max-width: 58%;
}
.worldops-source-link {
  display: inline-flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  margin-top: 1rem;
  border-radius: 999px;
  text-decoration: none;
  color: white;
  font-size: 0.78rem;
  font-weight: 950;
  border: 1px solid color-mix(in srgb, var(--accent), rgba(255,255,255,0.14) 52%);
  background: color-mix(in srgb, var(--accent), rgba(255,255,255,0.04) 86%);
}
.worldops-media-frame {
  margin-top: 0.85rem;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(103,232,249,0.2);
  background: rgba(0,0,0,0.48);
  aspect-ratio: 16 / 9;
}
.worldops-media-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.worldops-method-note {
  margin-top: 0.8rem;
  padding: 0.74rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  color: rgba(255,255,255,0.45);
  font-size: 0.72rem;
  line-height: 1.55;
}
.worldops-space-label {
  min-width: 126px;
  max-width: 210px;
  padding: 0.38rem 0.5rem;
  border-radius: 9px;
  background: rgba(3,7,18,0.82);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 12px 34px rgba(0,0,0,0.36);
  color: white;
  pointer-events: none;
}
.worldops-space-label span {
  display: block;
  color: rgba(255,255,255,0.48);
  font-size: 0.55rem;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.worldops-space-label strong {
  display: block;
  font-size: 0.68rem;
  line-height: 1.16;
  margin-top: 0.16rem;
}
.worldops-projection-map {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #020617;
}
.worldops-projection-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(2,6,23,0.18), rgba(2,6,23,0.56)),
    url(${k.day});
  background-size: cover;
  background-position: center;
  filter: saturate(1.08) contrast(1.08) brightness(0.72);
}
.worldops-projection-map::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 50%, transparent 0 52%, rgba(1,3,11,0.1) 74%, rgba(1,3,11,0.7) 100%),
    linear-gradient(90deg, rgba(103,232,249,0.06) 1px, transparent 1px),
    linear-gradient(0deg, rgba(103,232,249,0.05) 1px, transparent 1px);
  background-size: auto, 8.333% 100%, 100% 16.66%;
  pointer-events: none;
}
.worldops-projection-map svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.72;
}
.worldops-projection-map line {
  stroke: rgba(191,219,254,0.2);
  stroke-width: 0.08;
}
.worldops-projection-map .terminator {
  fill: none;
  stroke: rgba(250,204,21,0.72);
  stroke-width: 0.18;
  stroke-dasharray: 1.3 1;
}
.worldops-projection-dot {
  position: absolute;
  z-index: 4;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,0.75);
  background: var(--dot-color);
  box-shadow: 0 0 13px var(--dot-color);
  transform: translate(-50%, -50%);
  cursor: pointer;
  padding: 0;
}
.worldops-projection-dot.orbital {
  width: 4px;
  height: 4px;
  opacity: 0.86;
  border: 0;
}
.worldops-projection-dot.debris {
  opacity: 0.72;
}
.worldops-projection-dot.launch {
  width: 11px;
  height: 11px;
  background: transparent;
}
.worldops-projection-dot.launch::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: inherit;
  background: var(--dot-color);
}
.worldops-projection-dot.is-active {
  width: 16px;
  height: 16px;
  z-index: 8;
}
.worldops-map-legend {
  position: absolute;
  z-index: 8;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.42rem;
  padding: 0.42rem 0.62rem;
  border-radius: 999px;
  background: rgba(3,7,18,0.78);
  border: 1px solid rgba(255,255,255,0.12);
}
.worldops-map-legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  color: rgba(255,255,255,0.72);
  font-size: 0.66rem;
  font-weight: 850;
}
.worldops-map-legend i {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  background: var(--dot-color);
  box-shadow: 0 0 10px var(--dot-color);
}
.worldops-mini-map {
  position: absolute;
  z-index: 25;
  left: 396px;
  top: 148px;
  width: min(360px, calc(100vw - 792px));
  height: 188px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 20px 70px rgba(0,0,0,0.36);
}
.worldops-mini-map-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(2,6,23,0.06), rgba(2,6,23,0.54)), url(${k.day});
  background-size: cover;
  background-position: center;
  filter: saturate(0.95) contrast(1.08);
}
.worldops-mini-map svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.worldops-mini-map line {
  stroke: rgba(255,255,255,0.14);
  stroke-width: 0.18;
}
.worldops-mini-map path {
  fill: none;
  stroke: rgba(250,204,21,0.72);
  stroke-width: 0.42;
  stroke-dasharray: 1.8 1.4;
}
.worldops-map-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,0.85);
  transform: translate(-50%, -50%);
  cursor: pointer;
  padding: 0;
}
.worldops-map-dot.launch {
  width: 9px;
  height: 9px;
}
.worldops-map-dot.is-active {
  width: 14px;
  height: 14px;
}
.worldops-mini-label {
  position: absolute;
  left: 14px;
  top: 12px;
  color: white;
}
.worldops-mini-label strong {
  display: block;
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: 0.86rem;
}
.worldops-mini-label span {
  display: block;
  color: rgba(255,255,255,0.56);
  font-size: 0.68rem;
}
.worldops-timeline {
  position: absolute;
  z-index: 26;
  left: 396px;
  right: 396px;
  bottom: 16px;
  transform: none;
  width: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
  gap: 0.72rem;
  border: 1px solid rgba(148,163,184,0.2);
  background: rgba(3,7,18,0.78);
  backdrop-filter: blur(18px);
  border-radius: 22px;
  padding: 0.72rem;
  box-shadow: 0 24px 90px rgba(0,0,0,0.44);
}
.worldops-timeline-group header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.82);
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}
.worldops-timeline-scroll {
  display: grid;
  gap: 0.42rem;
  max-height: 132px;
  overflow: auto;
  padding-right: 0.2rem;
}
.worldops-timeline button {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  color: white;
  padding: 0.52rem 0.58rem;
  text-align: left;
  cursor: pointer;
}
.worldops-timeline button span {
  display: block;
  color: #67e8f9;
  font-size: 0.65rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.worldops-timeline button strong {
  display: block;
  margin-top: 0.12rem;
  font-size: 0.76rem;
  line-height: 1.22;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.worldops-timeline button small {
  display: block;
  margin-top: 0.18rem;
  color: rgba(255,255,255,0.4);
  font-size: 0.66rem;
  line-height: 1.24;
}
.worldops-loading {
  position: absolute;
  z-index: 28;
  inset: 0;
  display: grid;
  place-items: center;
  gap: 0.55rem;
  color: #cffafe;
  font-weight: 900;
  background: radial-gradient(circle, rgba(8,13,31,0.72), rgba(1,3,11,0.15));
}
.worldops-loading svg {
  animation: worldops-spin 2s linear infinite;
}
.worldops-orbit-credit {
  position: absolute;
  right: 20px;
  bottom: 12px;
  z-index: 20;
  color: rgba(255,255,255,0.32);
  font-size: 0.68rem;
}
.worldops-spin {
  animation: worldops-spin 1.1s linear infinite;
}
@keyframes worldops-spin {
  to { transform: rotate(360deg); }
}
@media (max-width: 1180px) {
  .worldops-left,
  .worldops-right {
    width: min(330px, calc(100vw - 36px));
  }
  .worldops-command-strip {
    left: 366px;
    right: 366px;
  }
  .worldops-timeline {
    left: 366px;
    right: 366px;
  }
}
@media (max-width: 1080px) {
  .worldops-root {
    min-height: auto;
    overflow: visible;
    padding: 72px 0 1rem;
  }
  .worldops-canvas {
    position: relative;
    inset: auto;
    height: 62vh;
    min-height: 440px;
  }
  .worldops-command-strip,
  .worldops-left,
  .worldops-right,
  .worldops-mini-map,
  .worldops-timeline {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    transform: none;
    width: min(720px, calc(100vw - 24px));
    margin: 0.8rem auto;
  }
  .worldops-left,
  .worldops-right {
    max-height: none;
    overflow: visible;
  }
  .worldops-timeline {
    grid-template-columns: 1fr;
  }
  .worldops-layer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .worldops-orbit-credit {
    display: none;
  }
}
@media (max-width: 560px) {
  .worldops-canvas {
    height: 56vh;
    min-height: 380px;
  }
  .worldops-left h1 {
    font-size: 2.05rem;
  }
  .worldops-stat-grid,
  .worldops-layer-grid {
    grid-template-columns: 1fr;
  }
  .worldops-panel {
    border-radius: 16px;
  }
}
`;export{Vt as default};
