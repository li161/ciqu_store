import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, OrbitControls, RoundedBox, Text, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { ArrowDown, ArrowLeft, ArrowRight, ChevronDown, Expand, Heart, Info, Move3D, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';

type Strategy='rotationGrowth'|'drawerExpansion'|'foldingAssembly'|'modularAssembly'|'lightAwakening'|'floatingLanding';
type Furniture={id:string;name:string;en:string;category:string;price:string;condition:string;dimensions:string;location:string;description:string;wear:string;strategy:Strategy;room:string;accent:string;wood:string;};
const pieces:Furniture[]=[
{id:'chair',name:'榫卯老木椅',en:'THE JOINERY CHAIR',category:'木椅',price:'¥ 260',condition:'九成新',dimensions:'58 × 52 × 82 cm',location:'次渠嘉园 · 4区',description:'老榆木手作，榫卯结构依然牢固。椅背被岁月磨出温润的包浆，适合餐桌旁，也适合窗边一隅。',wear:'右侧扶手有细微磕痕；坐面有自然使用光泽。',strategy:'rotationGrowth',room:'客厅 · 午后',accent:'#b66b3e',wood:'#9a6038'},
{id:'dresser',name:'胡桃木抽屉斗柜',en:'THE MEMORY DRESSER',category:'斗柜',price:'¥ 480',condition:'八成新',dimensions:'112 × 42 × 86 cm',location:'次渠锦园 · 2号楼',description:'深色胡桃木纹理清晰，六组抽屉收纳充足。抽屉滑轨顺畅，保留着真实生活的温度。',wear:'台面左后角有浅划痕；下层抽屉内侧有轻微印记。',strategy:'drawerExpansion',room:'卧室 · 晨光',accent:'#aa7957',wood:'#69442f'},
{id:'table',name:'折叠实木餐桌',en:'THE GATHERING TABLE',category:'折叠桌',price:'¥ 350',condition:'九成新',dimensions:'120 × 75 × 74 cm',location:'次渠嘉园 · 7区',description:'可折叠桌面与稳固支撑结构，平时收起不占空间，朋友来访时重新展开。',wear:'桌边有两处细小碰痕；折叠关节工作正常。',strategy:'foldingAssembly',room:'餐厅 · 日光',accent:'#bd8b59',wood:'#b17b49'},
{id:'shelf',name:'复古开放式书架',en:'THE STORY SHELF',category:'书架',price:'¥ 320',condition:'八成新',dimensions:'86 × 30 × 168 cm',location:'次渠锦园 · 5号楼',description:'开放式层板结构，适合书籍、器物与绿植。每一层都能成为生活片段的陈列。',wear:'第三层板前沿有轻微磨损；背板完整。',strategy:'modularAssembly',room:'书房 · 静谧',accent:'#9b714d',wood:'#815638'},
{id:'lamp',name:'黄铜复古落地灯',en:'THE QUIET LIGHT',category:'落地灯',price:'¥ 180',condition:'九成新',dimensions:'38 × 38 × 156 cm',location:'次渠嘉园 · 1区',description:'黄铜灯杆与米白布艺灯罩，暖光柔和。适合在夜晚为阅读角留下一盏灯。',wear:'灯罩边缘有轻微色差；开关与灯座正常。',strategy:'lightAwakening',room:'阅读角 · 暮色',accent:'#d3a35c',wood:'#997143'},
{id:'sofa',name:'奶油色双人沙发',en:'THE SLOW AFTERNOON',category:'沙发',price:'¥ 680',condition:'八成新',dimensions:'178 × 88 × 78 cm',location:'次渠锦园 · 9号楼',description:'柔软布艺与饱满靠垫，坐深舒适。浅奶油色容易融入温暖的家庭空间。',wear:'左侧坐垫有轻微压痕；面料无破损。',strategy:'floatingLanding',room:'家庭客厅 · 黄昏',accent:'#d2bda3',wood:'#b99d80'}
];
const roomColors=['#d8cbbb','#d9c7b5','#dfd0bd','#cfc5b4','#433d35','#d9c8b6'];

function Chair({wood,phase}:{wood:string;phase:number}){return <group scale={phase===0?.72:1}>
  {[[-.42,.42], [.42,.42],[-.42,-.42],[.42,-.42]].map(([x,z],i)=><mesh key={i} position={[x,-.42,z]} castShadow><cylinderGeometry args={[.045,.055,.86,12]}/><meshStandardMaterial color={wood} roughness={.62}/></mesh>)}
  <RoundedBox args={[1.05,.13,.94]} radius={.055} position={[0,.05,0]} castShadow><meshStandardMaterial color={wood} roughness={.65}/></RoundedBox>
  <RoundedBox args={[1.02,.95,.12]} radius={.055} position={[0,.58,-.42]} castShadow><meshStandardMaterial color={wood} roughness={.62}/></RoundedBox>
  {[ -.31,.31 ].map(x=><mesh key={x} position={[x,.23,-.42]} castShadow><boxGeometry args={[.08,.52,.15]}/><meshStandardMaterial color={wood}/></mesh>)}
</group>}
function Dresser({wood,phase}:{wood:string;phase:number}){return <group scale={phase===0?.72:1}>
  <RoundedBox args={[1.55,1.05,.72]} radius={.035} position={[0,.05,0]} castShadow><meshStandardMaterial color={wood} roughness={.45}/></RoundedBox>
  {[0,1,2].map((r)=><group key={r} position={[0,.42-r*.34,.371]}><RoundedBox args={[1.38,.27,.045]} radius={.018} castShadow><meshStandardMaterial color={wood} roughness={.36}/></RoundedBox>{[-.43,.43].map(x=><mesh key={x} position={[x,0,.04]}><sphereGeometry args={[.035,16,12]}/><meshStandardMaterial color="#b78b52" metalness={.72} roughness={.28}/></mesh>)}</group>)}
  {[-.61,.61].map(x=><mesh key={x} position={[x,-.57,0]}><boxGeometry args={[.12,.18,.58]}/><meshStandardMaterial color={wood}/></mesh>)}
</group>}
function Table({wood,phase}:{wood:string;phase:number}){return <group scale={phase===0?.62:1}>
  <RoundedBox args={[1.7,.12,1.08]} radius={.045} position={[0,.63,0]} castShadow><meshStandardMaterial color={wood} roughness={.48}/></RoundedBox>
  {[[-.68,-.38],[-.68,.38],[.68,-.38],[.68,.38]].map(([x,z],i)=><group key={i} position={[x,.23,z]} rotation={[0,0,i%2?.08:-.08]}><mesh castShadow><boxGeometry args={[.09,.72,.09]}/><meshStandardMaterial color={wood}/></mesh></group>)}
  <mesh position={[0,.25,0]}><boxGeometry args={[1.38,.07,.07]}/><meshStandardMaterial color={wood}/></mesh>
</group>}
function Shelf({wood,phase}:{wood:string;phase:number}){return <group scale={phase===0?.6:1}>
  {[-.65,.65].map(x=><mesh key={x} position={[x,.85,0]} castShadow><boxGeometry args={[.12,1.8,.32]}/><meshStandardMaterial color={wood}/></mesh>)}
  {[0,.42,.84,1.26,1.72].map((y,i)=><mesh key={y} position={[0,y,0]} castShadow><boxGeometry args={[1.42,.09,.42]}/><meshStandardMaterial color={wood}/></mesh>)}
  {Array.from({length:9},(_,i)=><group key={i} position={[-.48+(i%4)*.29,.12+Math.floor(i/4)*.42,.03]} rotation={[0,0,(i%3-1)*.04]}><mesh castShadow><boxGeometry args={[.17,.27,.22]}/><meshStandardMaterial color={['#b66a48','#d0b17d','#60766b','#8b6b55'][i%4]} roughness={.9}/></mesh></group>)}
</group>}
function Lamp({wood,phase}:{wood:string;phase:number}){return <group scale={phase===0?.65:1}>
  <mesh position={[0,-.42,0]} castShadow><cylinderGeometry args={[.31,.36,.09,48]}/><meshStandardMaterial color={wood} metalness={.7} roughness={.25}/></mesh>
  <mesh position={[0,.28,0]} castShadow><cylinderGeometry args={[.035,.045,1.35,16]}/><meshStandardMaterial color={wood} metalness={.72} roughness={.25}/></mesh>
  <mesh position={[0,.99,0]} castShadow><cylinderGeometry args={[.18,.36,.42,48,1,true]}/><meshStandardMaterial color="#e8d8bd" roughness={.88} side={THREE.DoubleSide}/></mesh>
  <pointLight position={[0,.92,0]} intensity={phase>0?2.2:.05} color="#ffd59a" distance={5}/>
</group>}
function Sofa({wood,phase}:{wood:string;phase:number}){return <group scale={phase===0?.62:1}>
  <RoundedBox args={[1.8,.35,.82]} radius={.14} position={[0,-.05,0]} castShadow><meshStandardMaterial color={wood} roughness={.94}/></RoundedBox>
  <RoundedBox args={[1.8,.72,.25]} radius={.13} position={[0,.43,-.31]} castShadow><meshStandardMaterial color={wood} roughness={.95}/></RoundedBox>
  {[-.84,.84].map(x=><RoundedBox key={x} args={[.25,.62,.86]} radius={.11} position={[x,.18,0]} castShadow><meshStandardMaterial color={wood} roughness={.94}/></RoundedBox>)}
  {[-.43,.43].map(x=><RoundedBox key={x} args={[.76,.2,.57]} radius={.12} position={[x,.2,.08]} castShadow><meshStandardMaterial color="#e6d8c5" roughness={.98}/></RoundedBox>)}
  {[-.68,.68].map(x=><mesh key={x} position={[x,-.36,.2]}><cylinderGeometry args={[.045,.05,.22,12]}/><meshStandardMaterial color="#654d3b"/></mesh>)}
</group>}

function FurnitureModel({item,phase,rotation,active}:{item:Furniture;phase:number;rotation:number;active:boolean}){
 const ref=useRef<THREE.Group>(null);
 useFrame((_,dt)=>{if(ref.current){ref.current.rotation.y=THREE.MathUtils.damp(ref.current.rotation.y,rotation,2.4,dt);}});
 const model=()=>{const props={wood:item.wood,phase};switch(item.id){case'chair':return <Chair {...props}/>;case'dresser':return <Dresser {...props}/>;case'table':return <Table {...props}/>;case'shelf':return <Shelf {...props}/>;case'lamp':return <Lamp {...props}/>;default:return <Sofa {...props}/>;}};
 return <group ref={ref} position={[0,phase===0?1.25:.04,0]}>{active&&phase===0?<Float speed={1.2} floatIntensity={.22}>{model()}</Float>:model()}</group>
}
function Room({index}:{index:number}){const tone=roomColors[index];return <group>
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.55,0]} receiveShadow><planeGeometry args={[18,18]}/><meshStandardMaterial color={tone} roughness={.84}/></mesh>
 <mesh position={[0,2.25,-3.8]} receiveShadow><boxGeometry args={[12,5.6,.18]}/><meshStandardMaterial color={index===4?'#4b433a':'#e7dfd3'} roughness={.9}/></mesh>
 <mesh position={[-3.4,1.6,-3.68]}><planeGeometry args={[2.7,3.25]}/><meshBasicMaterial color={index===4?'#665747':'#a9c0c2'}/></mesh>
 <mesh position={[-3.4,1.6,-3.64]}><planeGeometry args={[2.48,3.03]}/><meshBasicMaterial color={index===4?'#ad8052':'#d8e3dc'}/></mesh>
 <mesh position={[3.2,1.35,-3.68]}><boxGeometry args={[2.6,2.7,.12]}/><meshStandardMaterial color={index===4?'#77604b':'#c6b49e'}/></mesh>
 <mesh position={[0,4.9,-.2]}><boxGeometry args={[14,.12,9]}/><meshStandardMaterial color={tone}/></mesh>
 <directionalLight position={[-4,7,4]} intensity={index===4?1.1:2.6} color={index===4?'#ffd6a0':'#fff1d9'} castShadow shadow-mapSize={[2048,2048]}/>
 <ambientLight intensity={index===4?.45:1.05}/>
</group>}
function Scene({item,index,phase,rotation}:{item:Furniture;index:number;phase:number;rotation:number}){return <>
 <color attach="background" args={[index===4?'#39342e':'#d8d0c4']}/>
 <fog attach="fog" args={[index===4?'#39342e':'#d8d0c4',9,19]}/>
 <Room index={index}/>
 <FurnitureModel item={item} phase={phase} rotation={rotation} active={phase===0}/>
 <ContactShadows position={[0,-.53,0]} opacity={.38} scale={8} blur={2.5} far={3}/>
 <Environment preset="apartment" environmentIntensity={index===4?.35:.65}/>
 <EffectComposer><Bloom intensity={.22} luminanceThreshold={.78}/><Vignette eskil={false} offset={.25} darkness={.36}/></EffectComposer>
 </>}
function Loader(){const {progress}=useProgress();return <div className="loader"><div className="loader-mark">FA</div><span>正在唤醒空间 {Math.round(progress)}%</span></div>}

export default function App(){
 const [index,setIndex]=useState(0),[phase,setPhase]=useState(0),[details,setDetails]=useState(false),[sound,setSound]=useState(false),[rotation,setRotation]=useState(0),[busy,setBusy]=useState(false),[intro,setIntro]=useState(true);
 const item=pieces[index],next=pieces[(index+1)%pieces.length],timeline=useRef<gsap.core.Timeline|null>(null),touchY=useRef(0),wheelLock=useRef(false);
 const activate=()=>{if(busy||phase===1)return;setBusy(true);timeline.current?.kill();setPhase(0);timeline.current=gsap.timeline({onUpdate:()=>{},onComplete:()=>{setPhase(1);setBusy(false);}}).to({}, {duration:.3}).to({}, {duration:1.55,onUpdate:function(){setPhase(.15+this.progress()*.85);}});};
 const switchItem=(dir:number)=>{if(busy)return;setBusy(true);timeline.current?.kill();gsap.timeline({onComplete:()=>{setIndex((i)=>(i+dir+pieces.length)%pieces.length);setPhase(0);setRotation(0);setDetails(false);setBusy(false);}}).to('.scene-wipe',{opacity:1,duration:.45,ease:'power2.in'}).to('.scene-wipe',{opacity:0,duration:.8,ease:'power2.out'});};
 useEffect(()=>{const onWheel=(e:WheelEvent)=>{if(Math.abs(e.deltaY)<12||wheelLock.current)return;e.preventDefault();wheelLock.current=true;setTimeout(()=>wheelLock.current=false,1250);switchItem(e.deltaY>0?1:-1);};window.addEventListener('wheel',onWheel,{passive:false});return()=>window.removeEventListener('wheel',onWheel);},[busy]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='ArrowDown'||e.key==='ArrowRight')switchItem(1);if(e.key==='ArrowUp'||e.key==='ArrowLeft')switchItem(-1);if(e.key==='Enter')activate();if(e.key==='Escape')setDetails(false);};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);});
 useEffect(()=>()=>{timeline.current?.kill();},[]);
 return <main className="app" onTouchStart={e=>{touchY.current=e.touches[0].clientY;}} onTouchEnd={e=>{const d=touchY.current-e.changedTouches[0].clientY;if(Math.abs(d)>55)switchItem(d>0?1:-1);}}>
  <header className="topbar"><a className="brand" href="#"><span className="brand-symbol">F</span><span>FURNITURE<br/>AWAKENING</span></a><div className="top-center"><span className="eyebrow">SECOND LIFE · DIGITAL SHOWROOM</span><span className="top-sub">旧物新生 · 次渠社区家具档案</span></div><button className="sound-btn" onClick={()=>setSound(!sound)}>{sound?<Volume2 size={16}/>:<VolumeX size={16}/>}<span>{sound?'声音开启':'声音关闭'}</span></button></header>
  <section className="stage">
   <div className="room-caption"><span>SCENE 0{index+1} / 06</span><i/> <span>{item.room}</span></div>
   <div className="scene-wrap"><Canvas shadows dpr={[1,1.65]} camera={{position:[4.2,3.15,6.4],fov:38}} gl={{antialias:true, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.08}}>
    <Suspense fallback={null}><Scene item={item} index={index} phase={phase} rotation={rotation}/></Suspense>
    <OrbitControls enablePan={false} minDistance={3.5} maxDistance={9} minPolarAngle={.55} maxPolarAngle={1.42} target={[0,.35,0]} enableDamping dampingFactor={.06}/>
   </Canvas><div className="scene-wipe"/><Suspense fallback={<Loader/>}><Loader/></Suspense></div>
   <div className="hero-copy"><span className="hero-index">COLLECTIBLE NO. 00{index+1}</span><h1>{item.name}</h1><p>{item.en}</p><div className="hero-rule"/></div>
   <div className="mini-awakening" onClick={activate} role="button" tabIndex={0}><div className="mini-orbit"><span className="orbit-dot"/></div><div className="mini-object"><span>{next.category}</span><b>{next.name}</b><small>点击唤醒下一件</small></div><div className="mini-arrow"><ArrowRight size={18}/></div></div>
   <div className="bottom-hint"><Move3D size={14}/><span>拖动旋转 · 滚轮切换 · 点击微缩家具唤醒</span></div>
   <div className="scene-controls"><button onClick={()=>setRotation(r=>r+Math.PI/2)} title="旋转"><RotateCcw size={16}/></button><button onClick={()=>setDetails(true)} title="查看详情"><Info size={16}/></button><button onClick={()=>setPhase(phase===0?1:0)} title="微缩/展开"><Expand size={16}/></button></div>
  </section>
  <aside className="product-panel"><div className="panel-top"><span className="eyebrow">A PIECE OF HISTORY</span><span className="status"><i/>可预约看货</span></div><div className="product-title"><div><span className="category">{item.category} / SECOND HAND</span><h2>{item.name}</h2></div><button className="heart"><Heart size={18}/></button></div><div className="price-row"><strong>{item.price}</strong><span>{item.condition}</span></div><p className="description">{item.description}</p><div className="spec-grid"><div><small>尺寸 DIMENSIONS</small><b>{item.dimensions}</b></div><div><small>所在位置 LOCATION</small><b>{item.location}</b></div></div><div className="wear-note"><span>使用痕迹 / CONDITION NOTES</span><p>{item.wear}</p></div><button className="contact-btn" onClick={()=>setDetails(true)}>联系卖家 <ArrowRight size={17}/></button><div className="panel-foot"><span>LOCAL FINDS, NEW STORIES.</span><span>01 — 06</span></div></aside>
  <footer className="footer"><span>© 2026 FURNITURE AWAKENING</span><span>MADE FOR A SECOND LIFE</span><span>次渠集市 · 旧物新生计划</span></footer>
  <nav className="switch-nav"><button onClick={()=>switchItem(-1)} disabled={busy}><ArrowLeft size={17}/><span>上一件</span></button><div className="progress-dots">{pieces.map((p,i)=><button key={p.id} className={i===index?'active':''} onClick={()=>{if(i!==index){setBusy(false);setIndex(i);setPhase(0);}}} aria-label={p.name}/>)}</div><button onClick={()=>switchItem(1)} disabled={busy}><span>下一件</span><ArrowRight size={17}/></button></nav>
  {details&&<div className="modal-backdrop" onClick={()=>setDetails(false)}><section className="detail-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetails(false)}><X/></button><span className="eyebrow">FURNITURE STORY / 0{index+1}</span><h2>{item.name}</h2><p>{item.description}</p><div className="modal-spec"><span>价格 <b>{item.price}</b></span><span>成色 <b>{item.condition}</b></span><span>尺寸 <b>{item.dimensions}</b></span><span>位置 <b>{item.location}</b></span></div><div className="wear-note"><span>真实瑕疵说明</span><p>{item.wear}</p></div><button className="contact-btn" onClick={()=>{setDetails(false);}}>我想了解这件家具 <ArrowRight size={17}/></button><small className="modal-disclaimer">演示商品信息 · 联系卖家功能待接入社区交易后端</small></section></div>}
  {intro&&<div className="intro-cover"><span className="eyebrow">A NEW LIFE BEGINS</span><h2>每一件旧物，<br/>都值得再次被看见。</h2><p>THE ART OF SECOND LIFE</p><button onClick={()=>setIntro(false)}>进入展厅 <ArrowDown size={16}/></button></div>}
 </main>
}
