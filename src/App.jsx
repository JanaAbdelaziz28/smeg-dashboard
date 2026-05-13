import { useState, useEffect, useRef, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import * as d3 from "d3";

/* ─── DATA ─── */
const IMG = n => `/images/${n}.jpg`;
const AL = a => `https://www.amazon.eg/dp/${a}`;
const CAT = t => {
  const l = t.toLowerCase();
  if (l.includes("toaster")) return "Toasters";
  if (l.includes("kettle")) return "Kettles";
  if (l.includes("espresso") || l.includes("coffee")) return "Coffee Makers";
  if (l.includes("blender")) return "Blenders";
  if (l.includes("mixer") || l.includes("food processor")) return "Mixers";
  return "Others";
};

const RAW = [
  ["Toaster (Black)",11150,4.2,"41pbKPYdawL","B07TYT4PDS"],
  ["Toaster (Black)",10250,4.4,"51cN2CZHy1L","B010TSW0PA"],
  ["Toaster (Cream)",11150,4.5,"41H7vZTF4hL","B011SJYTI0"],
  ["Toaster (Pastel Blue)",10400,4.3,"41zT2t3npDL","B00Y1GXFBK"],
  ["Kettle",4750,4.5,"61NAzkg096L","B09KDTPGN8"],
  ["Toaster (Black)",13280,4.1,"51uCMIVKntL","B010TRZI3M"],
  ["Kettle (Black)",9550,4.6,"51OHSG890hL","B091D2BKVB"],
  ["Kettle (Cream)",9360,4.7,"51Pkf23VvnL","B092DQKKMS"],
  ["Toaster (Emerald)",14999,4.9,"41kDdeL10kL","B0BYMQ8GKT"],
  ["Toaster (Pastel Green)",12530,4.0,"61eJ21xjzKL","B01EHPISEI"],
  ["Toaster (Pink)",13280,4.5,"51VhPTjgwWL","B01EHPISLG"],
  ["Kettle (Red)",12740,4.5,"51PmZW6zzGL","B07939L3F4"],
  ["Milk Frother (Red)",16975,4.2,"616zTdPtBnL","B084GZ3KJ6"],
  ["Toaster (Pink)",10200,3.5,"51znViaAXaL","B0CFQYG7PQ"],
  ["Kettle (Pastel Blue)",9570,4.6,"51TXFtlbtQL","B09D3YPBR8"],
  ["Kettle (Red)",8500,4.6,"51GdVS6nYuL","B09D3ZMLDQ"],
  ["Espresso Machine (Black)",35060,2.9,"51XPqfBWxgL","B0D6CS1SLT"],
  ["Toaster (White)",13200,4.2,"51BAUj3kjbL","B077J65MQM"],
  ["Knife Block (Pastel Blue)",15000,5.0,"51DVZGVJEJL","B0DGB5P7YL"],
  ["Toaster (Pastel Blue)",12779,3.8,"81M62-j6gQL","B00XNUIGD2"],
  ["Mixer (Red)",46000,4.6,"615WWkEKYSL","B07VTVV3Z2"],
  ["Espresso Machine (Pastel Green)",35060,5.0,"512F5F4ih9L","B0D8TQFC3M"],
  ["Blender (Pink)",12900,4.4,"51BiRBfH-eL","B0DM6RTW3T"],
  ["Blender (Red)",13760,4.8,"61xmlPFhUUL","B0CHL7PLS6"],
  ["Blender (White)",16499,4.8,"61HRTH4lq6L","B0CJWM3GHJ"],
  ["Blender (Black)",13288,4.4,"51LoSm8aKuL","B0BYMT2CK8"],
  ["Blender (Pastel Blue)",13760,4.2,"514+jvAtfEL","B0BYMQT52T"],
  ["Mixer (Red)",16941,3.5,"51sG6BgMflL","B0BYMS9QMR"],
  ["Knife Block (Black)",10000,4.5,"61gceMuTLeL","B09BW1MMDS"],
  ["Blender (Pink)",14912,4.0,"41vfUVsNwYL","B0C4PWY2FN"],
  ["Juicer (Pink)",11668,4.6,"51dijSUYX-L","B01MQHN0SW"],
  ["Toaster (D&G Edition)",49900,5.0,"61UB8nMx8wL","B083HS71TD"],
  ["Espresso Machine (Silver)",16290,3.4,"61xTxV4npWL","B004J18S46"],
  ["Espresso Machine",34074,4.1,"51zMR3+k6hL","B0BYMSXD2L"],
  ["Espresso Machine (White)",35060,3.3,"51xmLI1jPZL","B0BYMQSRZQ"],
  ["Espresso Machine",58990,3.7,"61zKBO6LS-L","B0BYMQHBQZ"],
  ["Espresso Machine",79900,4.6,"611k5uknk8L","B0BYMQDQL6"],
  ["Espresso Machine (Red)",58990,3.7,"61-9Z8thMhL","B0BYMQSK1J"],
  ["Espresso Machine (White)",95410,3.4,"61C75+jBVZL","B0BYMS16NV"],
  ["Espresso Machine (Pastel Blue)",42321,2.9,"51oMgolMk1L","B0BYMQ7W31"],
  ["Blender (Pastel Blue)",12598,4.4,"51397E0WbGL","B0CHL9Q7QD"],
  ["Knife Block (Cream)",15000,4.5,"51hv-EuzqwL","B0DG9TMNKG"],
  ["Kettle (Black)",10499,4.5,"61W5Rdmvf5L","B0752R2TPV"],
  ["Kettle (Emerald)",13999,4.6,"51xR8D6UD9L","B0BYMSJ7D9"],
  ["Kettle (Blue)",10999,4.4,"61vPu0AAgEL","B076S7HJN3"],
  ["Kettle (Pink)",15255,4.5,"61PBplPIV3L","B07X9WD1BF"],
  ["Kettle (Cream)",12740,4.1,"512P3XkDR0L","B077QWM1K7"],
  ["Kettle (Pastel Green)",11900,4.0,"51iR52quY8L","B077QWLW7Z"],
  ["Kettle (Pink)",13537,4.4,"51xCBL2MNTL","B077QMDPB7"],
  ["Kettle (Pink)",13999,3.6,"51aH-fZM0aL","B07NDMMHN9"],
  ["Kettle (Beige)",12618,4.5,"61bmLVZ08OL","B01N9ZFCIY"],
  ["Kettle",6918,5.0,"61g11WnLi4L","B09KDJBQN7"],
  ["Kettle (Cream)",11200,4.4,"419HPw30Y1L","B0752MB9PW"],
  ["Kettle (Pink)",11475,4.3,"51z5vjoMKOL","B0752XQ59T"],
  ["Kettle (White)",11039,4.3,"51tRUyeKSLL","B077HYQZ29"],
  ["Kettle (White)",13999,4.4,"51cIRbVr04L","B0777S7QX4"],
  ["Espresso Machine (Grey)",67850,4.4,"518zPnMvzwL","B0FHL3C7KP"],
  ["Blender",5399,4.4,"7146DTzGwdL","B07YN8TNTQ"],
  ["Blender (Cream)",12750,4.4,"61yaf0OCd8L","B0CHKRHN3C"],
  ["Blender (Pastel Green)",12850,4.6,"61JFIIOKE1L","B0CHL7RJZJ"],
  ["Blender (Mini)",270,3.4,"81JNHJIBMWL","B0BHXJY7ZD"],
  ["Kettle (Black)",11199,4.6,"61W5Rdmvf5L","B0771Q5F26"],
  ["Kettle (Gold)",20800,4.6,"61wEXVyAgDL","B08PN3J6T8"],
  ["Kettle (Pink)",10499,4.6,"612Mu2tp4ML","B076SC48GH"],
  ["Kettle (Red)",11499,4.6,"61Kbmas++bL","B076SV8B1H"],
  ["Kettle (Pastel Blue)",11499,4.1,"51s7QbcWXxL","B0CZYQHWBX"],
  ["Electric Oven (Silver)",126650,4.3,"41fP+13CSgS","B07HKLS4DM"],
  ["Mixer (Red)",48150,4.5,"61QHSkgTIHL","B07PC3G5FM"],
  ["Food Processor (Black)",54800,4.6,"613UkYZ4Y0L","B07L3BRKC6"],
  ["Toaster (Pastel Green)",11000,4.5,"41ijwoAHi-L","B00ZVCJ1YS"],
  ["Kettle",2184,4.2,"71yjuVMvv3L","B07XCX7CYQ"],
  ["Kettle",1639,3.5,"614M5qqEGEL","B0GNJ93YY1"],
  ["Toaster (Black)",11667,4.6,"61Rif8kF04L","B00NSUDDOY"],
  ["Toaster (Black)",13550,4.5,"51QC+INJdyL","B00MJ236DK"],
  ["Toaster (Red)",13060,4.5,"51JE3uZEwLL","B00MJ2372K"],
  ["Toaster (Gold)",29900,4.6,"61mDUDzXIUL","B07V3NFH2F"],
  ["Toaster (Rose)",29900,4.6,"51wPvixpa5L","B07V5QDV6W"],
  ["Kettle",16905,4.5,"51MYc3EppzL","B07937HBB7"],
  ["Espresso Machine (Chrome)",41400,4.4,"71vCgRyrG9L","B08CBJ8W9W"],
  ["Kettle (White)",10675,4.1,"51EteXqPwPS","B07SFRR2PW"],
  ["Coffee Grinder",2537,4.2,"71ZEzseTFbL","B002OHDBQC"],
  ["Toaster (Pink)",10536,4.5,"51+KMX70SsL","B00LL0CICG"],
  ["Coffee Machine (Black)",85000,3.8,"61IlqvCMQcL","B0D7TNYNKC"],
];
const DATA = RAW.map(([t,p,r,i,a],n) => ({id:n,title:t,price:p,rating:r,img:IMG(n),link:AL(a),cat:CAT(t)}));

/* ─── THEME ─── */
const BG="#0d0b09", SRF="#17140f", S2="#1e1b14", BDR="#2e2519", TX="#efe6d5", MT="#7a6e5e", AC="#c8102e";
const CC = {"Toasters":"#e8b94a","Kettles":"#5b9bd5","Coffee Makers":"#b07040","Blenders":"#4caf7d","Mixers":"#e8503a","Others":"#9b6bcc"};
const CATS = Object.keys(CC);

/* ─── UTILS ─── */
const Stars = ({r, sz=13}) => (
  <span style={{fontSize:sz, lineHeight:1, letterSpacing:1}}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{color:i<=r?"#e8b94a":i-0.5<=r?"#e8b94a":"#2e2519", opacity:i<=r?1:i-0.5<=r?0.6:1}}>★</span>
    ))}
  </span>
);

const Tip = ({active,payload,label}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:SRF,border:`1px solid ${BDR}`,padding:"7px 11px",borderRadius:8,fontSize:12}}>
      {label && <div style={{color:MT,marginBottom:3}}>{label}</div>}
      {payload.map((p,i) => <div key={i} style={{color:p.color||TX}}>{p.name}: {typeof p.value==="number"?p.value.toLocaleString():p.value}</div>)}
    </div>
  );
};

const ProductImg = ({cat, size=120, title="", img=""}) => {
  const color = CC[cat]||"#888";
  const initials = title.replace(/\(.*\)/,"").trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const [err, setErr] = useState(false);
  if (img && !err) return (
    <div style={{width:"100%",height:size,background:S2,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <img
        src={img} alt={title}
        onError={()=>setErr(true)}
        style={{width:"100%",height:"100%",objectFit:"contain",padding:size*0.06}}
      />
    </div>
  );
  return (
    <div style={{width:"100%",height:size,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",gap:6,background:`${color}12`,borderBottom:`1px solid ${color}30`}}>
      <div style={{width:size*0.45,height:size*0.45,borderRadius:"50%",
        background:`${color}22`,border:`2px solid ${color}55`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:size*0.2,fontWeight:700,color,letterSpacing:1}}>
        {initials||"SM"}
      </div>
      <div style={{fontSize:9,color:`${color}99`,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600}}>{cat}</div>
    </div>
  );
};

const NAV = [
  {k:"dashboard", l:"Dashboard", ic:"⊞"},
  {k:"products",  l:"Products",  ic:"◫"},
  {k:"network",   l:"Network Graph", ic:"⬡"},
  {k:"heatmap",   l:"Heatmaps",  ic:"▦"},
  {k:"analysis",  l:"3D Analysis", ic:"◈"},
];

const Sidebar = ({page, onNav}) => (
  <nav style={{width:210,background:SRF,borderRight:`1px solid ${BDR}`,display:"flex",flexDirection:"column",flexShrink:0,minHeight:"100vh"}}>
    <div style={{padding:"22px 20px 18px",borderBottom:`1px solid ${BDR}`}}>
      <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:18,letterSpacing:6,color:TX}}>SMEG</div>
      <div style={{fontSize:9,color:MT,letterSpacing:2,marginTop:3,textTransform:"uppercase"}}>Technology with Style</div>
    </div>
    <div style={{flex:1,padding:"10px 10px"}}>
      {NAV.map(({k,l,ic}) => {
        const a = page===k || (page==="detail" && k==="products");
        return (
          <button key={k} onClick={() => onNav(k)}
            style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",marginBottom:2,
              borderRadius:8,border:"none",background:a?`${AC}18`:"transparent",
              color:a?AC:MT,cursor:"pointer",fontSize:13,textAlign:"left",
              borderLeft:`3px solid ${a?AC:"transparent"}`,transition:"all .15s"}}
            onMouseEnter={e => { if(!a){e.currentTarget.style.background=`${TX}08`;e.currentTarget.style.color=TX;} }}
            onMouseLeave={e => { if(!a){e.currentTarget.style.background="transparent";e.currentTarget.style.color=MT;} }}>
            <span style={{fontSize:14}}>{ic}</span>
            <span>{l}</span>
          </button>
        );
      })}
    </div>
    <div style={{padding:"14px 18px",borderTop:`1px solid ${BDR}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:`${AC}30`,border:`1px solid ${AC}50`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:AC,fontWeight:700}}>J</div>
        <div>
          <div style={{fontSize:12,color:TX,fontWeight:500}}>Jana</div>
          <div style={{fontSize:10,color:MT}}>Data Analyst</div>
        </div>
      </div>
    </div>
  </nav>
);

/* ─── DASHBOARD ─── */
const Dashboard = () => {
  const total = DATA.length;
  const avgP = Math.round(DATA.reduce((s,p) => s+p.price,0)/DATA.length);
  const avgR = (DATA.reduce((s,p) => s+p.rating,0)/DATA.length).toFixed(1);
  const cats = CATS.map(c => {
    const d = DATA.filter(p=>p.cat===c);
    return {name:c, count:d.length, avgP:Math.round(d.reduce((s,p)=>s+p.price,0)/(d.length||1)), color:CC[c]};
  });
  const topC = cats.reduce((a,b) => b.count>a.count?b:a);
  const rbuckets = [
    {name:"Under 3 ★", v:DATA.filter(p=>p.rating<3).length, c:"#ef4444"},
    {name:"3–4 ★", v:DATA.filter(p=>p.rating>=3&&p.rating<4).length, c:"#f97316"},
    {name:"4–4.5 ★", v:DATA.filter(p=>p.rating>=4&&p.rating<4.5).length, c:"#e8b94a"},
    {name:"4.5+ ★", v:DATA.filter(p=>p.rating>=4.5).length, c:"#22c55e"},
  ];
  const card = {background:S2,borderRadius:12,border:`1px solid ${BDR}`,padding:"18px 22px"};
  return (
    <div style={{padding:28,overflowY:"auto",height:"100vh",boxSizing:"border-box",background:BG}}>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:10,color:MT,letterSpacing:2,textTransform:"uppercase"}}>Dashboard</div>
        <div style={{fontSize:22,fontWeight:700,color:TX,marginTop:3}}>Overview</div>
        <div style={{fontSize:12,color:MT}}>A quick look at all SMEG product data · Jan 1–May 2, 2026</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
        {[
          {l:"Total Products", v:total, s:"+12% vs last month"},
          {l:"Average Price", v:`${avgP.toLocaleString()} EGP`, s:"+5.2% vs last month"},
          {l:"Average Rating", v:avgR, s:"+4% vs last month"},
          {l:"Top Category", v:topC.name, s:`${topC.count} Products`, c:CC[topC.name]},
        ].map(({l,v,s,c}) => (
          <div key={l} style={card}>
            <div style={{fontSize:9,color:MT,letterSpacing:1.5,textTransform:"uppercase",marginBottom:7}}>{l}</div>
            <div style={{fontSize:24,fontWeight:700,color:c||TX,marginBottom:3}}>{v}</div>
            <div style={{fontSize:10,color:MT}}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:14,marginBottom:14}}>
        <div style={card}>
          <div style={{fontSize:13,fontWeight:600,color:TX,marginBottom:14}}>Products by Category</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={cats} margin={{top:0,right:0,bottom:0,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={BDR} vertical={false}/>
              <XAxis dataKey="name" tick={{fill:MT,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:MT,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="count" radius={[5,5,0,0]} name="Count">
                {cats.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{...card,display:"flex",flexDirection:"column"}}>
          <div style={{fontSize:13,fontWeight:600,color:TX,marginBottom:10}}>Products by Rating</div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <PieChart width={170} height={170}>
              <Pie data={rbuckets.map(b=>({name:b.name,value:b.v,color:b.c}))}
                cx={85} cy={85} innerRadius={50} outerRadius={82} dataKey="value" strokeWidth={0}>
                {rbuckets.map((b,i) => <Cell key={i} fill={b.c}/>)}
              </Pie>
              <Tooltip content={<Tip/>}/>
            </PieChart>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6}}>
            {rbuckets.map((b,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:11}}>
                <div style={{width:8,height:8,borderRadius:2,background:b.c,flexShrink:0}}/>
                <span style={{color:MT,flex:1}}>{b.name}</span>
                <span style={{color:TX,fontWeight:600}}>{b.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{fontSize:13,fontWeight:600,color:TX,marginBottom:14}}>Average Price by Category (EGP)</div>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={cats} margin={{top:0,right:0,bottom:0,left:10}}>
            <defs>
              <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AC} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={AC} stopOpacity={0.25}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BDR} vertical={false}/>
            <XAxis dataKey="name" tick={{fill:MT,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:MT,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${Math.round(v/1000)}K`}/>
            <Tooltip content={<Tip/>} formatter={v=>[`${v.toLocaleString()} EGP`,"Avg Price"]}/>
            <Bar dataKey="avgP" name="Avg Price" fill="url(#pGrad)" radius={[5,5,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─── PRODUCTS ─── */
const Products = ({onSelect}) => {
  const [search, setSearch] = useState("");
  const [cf, setCf] = useState("All");
  const [sort, setSort] = useState("price-h");
  const filtered = useMemo(() => {
    let r = DATA;
    if (cf !== "All") r = r.filter(p => p.cat === cf);
    if (search.trim()) r = r.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (sort === "price-h") return [...r].sort((a,b) => b.price-a.price);
    if (sort === "price-l") return [...r].sort((a,b) => a.price-b.price);
    if (sort === "rating")  return [...r].sort((a,b) => b.rating-a.rating);
    return r;
  }, [search, cf, sort]);

  return (
    <div style={{padding:28,overflowY:"auto",height:"100vh",boxSizing:"border-box",background:BG}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:MT,letterSpacing:2,textTransform:"uppercase"}}>Products</div>
        <div style={{fontSize:22,fontWeight:700,color:TX,marginTop:3}}>All SMEG Products</div>
        <div style={{fontSize:12,color:MT}}>{filtered.length} products found</div>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{background:S2,border:`1px solid ${BDR}`,borderRadius:8,padding:"8px 14px",
            color:TX,fontSize:12,flex:1,minWidth:200,outline:"none"}}
          onFocus={e=>e.target.style.borderColor=`${AC}88`}
          onBlur={e=>e.target.style.borderColor=BDR}/>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{background:S2,border:`1px solid ${BDR}`,borderRadius:8,padding:"8px 12px",color:TX,fontSize:12,cursor:"pointer",outline:"none"}}>
          <option value="price-h">Price: High → Low</option>
          <option value="price-l">Price: Low → High</option>
          <option value="rating">Rating: High → Low</option>
        </select>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {["All",...CATS].map(c => (
          <button key={c} onClick={() => setCf(c)}
            style={{padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,
              border:`1px solid ${cf===c?(CC[c]||AC):BDR}`,
              background:cf===c?(CC[c]||AC)+"22":"transparent",
              color:cf===c?(CC[c]||AC):MT,transition:"all .15s"}}>
            {c}{c!=="All"?` (${DATA.filter(p=>p.cat===c).length})`:""}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:13}}>
        {filtered.map(p => (
          <div key={p.id} onClick={() => onSelect(p)}
            style={{background:S2,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",overflow:"hidden",transition:"transform .15s, border-color .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=CC[p.cat]+"55";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=BDR;}}>
            <ProductImg cat={p.cat} size={160} title={p.title} img={p.img}/>
            <div style={{padding:"12px 13px"}}>
              <div style={{fontSize:9,color:CC[p.cat],fontWeight:700,marginBottom:3,letterSpacing:1,textTransform:"uppercase"}}>{p.cat}</div>
              <div style={{fontSize:12,color:TX,fontWeight:500,marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={p.title}>{p.title}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:14,fontWeight:700,color:AC}}>{p.price.toLocaleString()}</div>
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <Stars r={p.rating} sz={10}/>
                  <span style={{fontSize:10,color:MT}}>{p.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{gridColumn:"1/-1",textAlign:"center",color:MT,padding:60,fontSize:14}}>No products found</div>}
      </div>
    </div>
  );
};

/* ─── PRODUCT DETAIL ─── */
const ProductDetail = ({product, onBack}) => {
  if (!product) return null;
  const sim = DATA.filter(p => p.cat===product.cat && p.id!==product.id)
    .sort((a,b) => Math.abs(a.price-product.price)-Math.abs(b.price-product.price)).slice(0,5);
  const demand = product.rating>=4.5 ? "High Demand" : product.rating>=4 ? "Good Demand" : "Average";
  const dc = product.rating>=4.5 ? "#22c55e" : product.rating>=4 ? "#e8b94a" : MT;
  const color = product.title.match(/\(([^)]+)\)/)?.[1] || "—";
  const tier = product.price<10000?"Budget":product.price<30000?"Mid-Range":"Premium";
  return (
    <div style={{padding:28,overflowY:"auto",height:"100vh",boxSizing:"border-box",background:BG}}>
      <button onClick={onBack}
        style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:`1px solid ${BDR}`,
          color:MT,padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,marginBottom:22}}>
        ← Back to Products
      </button>

      <div style={{display:"grid",gridTemplateColumns:"350px 1fr",gap:24}}>
        <div>
          <div style={{background:S2,borderRadius:12,border:`1px solid ${BDR}`,height:330,overflow:"hidden",
            display:"flex",alignItems:"center",justifyContent:"center",position:"relative",marginBottom:12}}>
            <div style={{position:"absolute",top:10,right:10,background:CC[product.cat]+"25",
              border:`1px solid ${CC[product.cat]}60`,borderRadius:5,padding:"2px 8px",
              fontSize:9,color:CC[product.cat],fontWeight:700,letterSpacing:1}}>TOP RATED</div>
            <ProductImg cat={product.cat} size={260} title={product.title} img={product.img}/>
          </div>
        </div>

        <div>
          <div style={{fontSize:9,color:CC[product.cat],fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:7}}>{product.cat}</div>
          <div style={{fontSize:20,fontWeight:700,color:TX,lineHeight:1.35,marginBottom:12}}>{product.title}</div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <Stars r={product.rating} sz={17}/>
            <span style={{fontSize:14,color:TX,fontWeight:600}}>{product.rating}</span>
            <span style={{fontSize:11,color:MT}}>(328 Reviews)</span>
            <span style={{background:`${dc}22`,border:`1px solid ${dc}55`,color:dc,
              padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700}}>{demand}</span>
          </div>
          <div style={{fontSize:28,fontWeight:700,color:AC,marginBottom:20}}>{product.price.toLocaleString()} EGP</div>

          <div style={{background:S2,borderRadius:10,border:`1px solid ${BDR}`,padding:16,marginBottom:20}}>
            {[["Category",product.cat],["Rating",`${product.rating} / 5.0`],["Price Tier",tier],["Color / Variant",color]].map(([k,v]) => (
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BDR}`,fontSize:12}}>
                <span style={{color:MT}}>{k}</span>
                <span style={{color:TX,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:12}}>
            <a href={product.link} target="_blank" rel="noreferrer"
              style={{background:AC,color:"#fff",padding:"10px 22px",borderRadius:8,
                textDecoration:"none",fontSize:13,fontWeight:600,display:"inline-block",transition:"opacity .15s"}}
              onMouseEnter={e=>e.target.style.opacity="0.9"} onMouseLeave={e=>e.target.style.opacity="1"}>
              View on Store
            </a>
            <button style={{background:S2,color:TX,border:`1px solid ${BDR}`,padding:"10px 18px",
              borderRadius:8,cursor:"pointer",fontSize:13}}>Add to Compare</button>
          </div>
        </div>
      </div>

      <div style={{marginTop:30}}>
        <div style={{fontSize:15,fontWeight:600,color:TX,marginBottom:14}}>Similar Products</div>
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
          {sim.map(p => (
            <div key={p.id} style={{background:S2,borderRadius:10,border:`1px solid ${BDR}`,width:148,flexShrink:0,overflow:"hidden"}}>
              <ProductImg cat={p.cat} size={95} title={p.title} img={p.img}/>
              <div style={{padding:"8px 10px"}}>
                <div style={{fontSize:10,color:TX,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>
                <Stars r={p.rating} sz={10}/>
                <div style={{fontSize:12,fontWeight:700,color:AC,marginTop:3}}>{p.price.toLocaleString()} EGP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── NETWORK GRAPH ─── */
const NetworkGraph = () => {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!svgRef.current || !wrapRef.current) return;
    const W = wrapRef.current.offsetWidth || 700, H = 480;
    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3.select(svgRef.current).attr("width",W).attr("height",H);
    svg.append("rect").attr("width",W).attr("height",H).attr("fill",S2).attr("rx",12);

    const nodes = CATS.filter(c => DATA.some(p=>p.cat===c)).map((cat, i, arr) => {
      const d = DATA.filter(p=>p.cat===cat);
      return {
        id:cat, count:d.length, color:CC[cat],
        avgP: d.reduce((s,p)=>s+p.price,0)/(d.length||1),
        avgR: d.reduce((s,p)=>s+p.rating,0)/(d.length||1),
        x: W/2+Math.cos(i*Math.PI*2/arr.length-Math.PI/2)*190,
        y: H/2+Math.sin(i*Math.PI*2/arr.length-Math.PI/2)*160,
      };
    });

    const links = [];
    for (let i=0; i<nodes.length; i++)
      for (let j=i+1; j<nodes.length; j++)
        links.push({source:nodes[i], target:nodes[j], w: Math.abs(nodes[i].avgR-nodes[j].avgR)<0.4?2:0.7});

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(180))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(W/2, H/2))
      .force("collision", d3.forceCollide(80));

    const defs = svg.append("defs");
    nodes.forEach(n => {
      const gid = `gn${n.id.replace(/\W/g,"")}`;
      const g = defs.append("radialGradient").attr("id",gid).attr("cx","50%").attr("cy","50%").attr("r","50%");
      g.append("stop").attr("offset","0%").attr("stop-color",n.color).attr("stop-opacity","0.45");
      g.append("stop").attr("offset","100%").attr("stop-color",n.color).attr("stop-opacity","0.04");
    });

    const link = svg.append("g").selectAll("line").data(links).join("line")
      .attr("stroke","#3a3020").attr("stroke-width",d=>d.w)
      .attr("stroke-dasharray",d=>d.w<1?"6,6":"none").attr("opacity",0.7);

    const rad = d => Math.sqrt(d.count)*14;
    const node = svg.append("g").selectAll("g").data(nodes).join("g").attr("cursor","grab")
      .call(d3.drag()
        .on("start",(e,d) => { if(!e.active) sim.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; })
        .on("drag", (e,d) => { d.fx=e.x; d.fy=e.y; })
        .on("end",  (e,d) => { if(!e.active) sim.alphaTarget(0); d.fx=null; d.fy=null; }));

    node.append("circle").attr("r",rad)
      .attr("fill",d=>`url(#gn${d.id.replace(/\W/g,"")})`)
      .attr("stroke",d=>d.color).attr("stroke-width",2);
    node.append("text").text(d=>d.id).attr("text-anchor","middle").attr("dy","0.2em")
      .attr("fill",TX).attr("font-size",13).attr("font-weight","600").attr("pointer-events","none");
    node.append("text").text(d=>`${d.count} items`).attr("text-anchor","middle").attr("dy","1.6em")
      .attr("fill",MT).attr("font-size",10).attr("pointer-events","none");

    sim.on("tick", () => {
      link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y)
          .attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
      node.attr("transform",d=>`translate(${Math.max(rad(d),Math.min(W-rad(d),d.x))},${Math.max(rad(d),Math.min(H-rad(d),d.y))})`);
    });

    return () => sim.stop();
  }, []);

  return (
    <div style={{padding:28,overflowY:"auto",background:BG}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:MT,letterSpacing:2,textTransform:"uppercase"}}>Network Graph</div>
        <div style={{fontSize:22,fontWeight:700,color:TX,marginTop:3}}>Product Network Graph</div>
        <div style={{fontSize:12,color:MT}}>Visualise relationships between categories based on pricing and ratings · Drag nodes to explore</div>
      </div>
      <div ref={wrapRef} style={{borderRadius:12,border:`1px solid ${BDR}`,overflow:"hidden"}}>
        <svg ref={svgRef} style={{display:"block",width:"100%"}}/>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
        {CATS.map(cat => {
          const d = DATA.filter(p=>p.cat===cat);
          if (!d.length) return null;
          return (
            <div key={cat} style={{background:S2,borderRadius:8,border:`1px solid ${BDR}`,
              padding:"10px 14px",flex:"1 1 120px",borderTop:`2px solid ${CC[cat]}`}}>
              <div style={{fontSize:9,color:CC[cat],fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{cat}</div>
              <div style={{fontSize:18,color:TX,fontWeight:700,marginTop:2}}>{d.length}</div>
              <div style={{fontSize:10,color:MT}}>Avg {Math.round(d.reduce((s,p)=>s+p.price,0)/d.length/1000)}K EGP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── HEATMAP ─── */
const Heatmap = () => {
  const [metric, setMetric] = useState("count");
  const ranges = [
    {l:"0–5K",min:0,max:5000},{l:"5K–10K",min:5000,max:10000},
    {l:"10K–15K",min:10000,max:15000},{l:"15K–20K",min:15000,max:20000},
    {l:"20K–30K",min:20000,max:30000},{l:"30K–50K",min:30000,max:50000},{l:"50K+",min:50000,max:Infinity},
  ];
  const matrix = CATS.map(cat => ({
    cat,
    vals: ranges.map(r => {
      const p = DATA.filter(q=>q.cat===cat && q.price>=r.min && q.price<r.max);
      return {count:p.length, avg: p.length ? +(p.reduce((s,q)=>s+q.rating,0)/p.length).toFixed(1) : 0};
    }),
  }));
  const maxC = Math.max(...matrix.flatMap(r=>r.vals.map(v=>v.count)));
  const cellBg = (cell, m) => {
    if (cell.count === 0) return "transparent";
    if (m === "count") { const t=cell.count/maxC; return `rgba(91,155,213,${t*0.85+0.1})`; }
    const t = (cell.avg-2.5)/2.5;
    return `rgba(${Math.round(240*(1-t))},${Math.round(170*t+50)},60,${Math.max(0.15,t*0.85+0.1)})`;
  };
  const topCat = CATS.reduce((best,c) => {
    const d=DATA.filter(p=>p.cat===c);
    const avg=d.reduce((s,p)=>s+p.price,0)/(d.length||1);
    const bAvg=DATA.filter(p=>p.cat===best).reduce((s,p)=>s+p.price,0)/(DATA.filter(p=>p.cat===best).length||1);
    return avg>bAvg?c:best;
  }, CATS[0]);

  return (
    <div style={{padding:28,overflowY:"auto",background:BG}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:10,color:MT,letterSpacing:2,textTransform:"uppercase"}}>Heatmaps</div>
          <div style={{fontSize:22,fontWeight:700,color:TX,marginTop:3}}>Pricing Heatmap</div>
          <div style={{fontSize:12,color:MT}}>Category vs Price Range</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {[{v:"count",l:"Count"},{v:"avg",l:"Avg Rating"}].map(({v,l}) => (
            <button key={v} onClick={() => setMetric(v)}
              style={{padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:12,transition:"all .15s",
                background:metric===v?AC:S2, color:metric===v?"#fff":MT, border:`1px solid ${metric===v?AC:BDR}`}}>
              {l}
            </button>
          ))}
          <button style={{padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:12,background:S2,color:MT,border:`1px solid ${BDR}`}}>
            ↑ Export
          </button>
        </div>
      </div>

      <div style={{background:S2,borderRadius:12,border:`1px solid ${BDR}`,padding:20,overflowX:"auto"}}>
        <table style={{borderCollapse:"separate",borderSpacing:"4px 4px",minWidth:580}}>
          <thead>
            <tr>
              <th style={{color:MT,fontSize:11,padding:"6px 12px",textAlign:"left",fontWeight:500,width:120}}>Category</th>
              {ranges.map(r => <th key={r.l} style={{color:MT,fontSize:10,padding:"6px 4px",textAlign:"center",fontWeight:400,minWidth:65}}>{r.l}</th>)}
            </tr>
          </thead>
          <tbody>
            {matrix.map(({cat,vals}) => (
              <tr key={cat}>
                <td style={{padding:"4px 12px"}}><span style={{color:CC[cat],fontSize:12,fontWeight:600}}>{cat}</span></td>
                {vals.map((cell,j) => {
                  const val = metric==="count"?cell.count:cell.avg;
                  return (
                    <td key={j} style={{padding:2}}>
                      <div title={`${cat} · ${ranges[j].l}: ${metric==="count"?cell.count+" items":cell.avg+" ★"}`}
                        style={{background:cellBg(cell,metric),border:`1px solid ${BDR}`,borderRadius:6,
                          padding:"8px 4px",textAlign:"center",color:cell.count>0?TX:`${MT}50`,
                          fontSize:12,fontWeight:600,minWidth:62}}>
                        {cell.count>0?(metric==="count"?cell.count:cell.avg):"—"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:16,fontSize:11,color:MT}}>
          <span style={{fontSize:9,letterSpacing:1.5,textTransform:"uppercase"}}>Scale:</span>
          <span>Low</span>
          <div style={{height:8,width:180,borderRadius:4,background:metric==="count"
            ?"linear-gradient(to right,rgba(91,155,213,0.1),rgba(91,155,213,1))"
            :"linear-gradient(to right,rgba(240,50,60,0.3),rgba(60,190,60,0.85))"}}/>
          <span>High</span>
        </div>
      </div>

      <div style={{marginTop:14,background:S2,borderRadius:10,border:`1px solid ${BDR}`,padding:"12px 16px"}}>
        <div style={{fontSize:9,color:MT,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>Heatmap Insights</div>
        <div style={{fontSize:13,color:TX}}><span style={{color:CC[topCat],fontWeight:600}}>{topCat}</span> category has the highest average prices across all ranges.</div>
      </div>
    </div>
  );
};

/* ─── 3D ANALYSIS ─── */
const Analysis3D = () => {
  const divRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.Plotly) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/plotly.js-dist@2.27.0/plotly.min.js";
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!loaded || !divRef.current) return;
    const Plotly = window.Plotly;
    const traces = CATS.map(cat => {
      const pts = DATA.filter(p => p.cat === cat);
      return {
        type:"scatter3d", mode:"markers", name:cat,
        x: pts.map(p => p.price),
        y: pts.map(p => p.rating),
        z: pts.map(p => {
          const rank = {"Toasters":1,"Kettles":2,"Coffee Makers":3,"Blenders":4,"Mixers":5,"Others":6};
          return rank[p.cat] || 0;
        }),
        text: pts.map(p => `${p.title}<br>${p.price.toLocaleString()} EGP<br>★ ${p.rating}`),
        hovertemplate: "%{text}<extra></extra>",
        marker:{
          size: pts.map(p => 5 + (p.rating/5)*5),
          color: CC[cat],
          opacity: 0.82,
          line:{color:"rgba(255,255,255,0.25)",width:0.5},
        },
      };
    });

    const layout = {
      paper_bgcolor:"transparent",
      plot_bgcolor:"transparent",
      margin:{l:0,r:0,t:0,b:0},
      legend:{
        x:0.01, y:0.98, font:{color:TX,size:11},
        bgcolor:"rgba(30,27,20,0.8)", bordercolor:BDR, borderwidth:1,
      },
      scene:{
        bgcolor:S2,
        xaxis:{title:{text:"Price (EGP)",font:{color:MT,size:11}},
          gridcolor:BDR,zerolinecolor:BDR,tickfont:{color:MT,size:9},
          tickformat:",.0f"},
        yaxis:{title:{text:"Rating",font:{color:MT,size:11}},
          gridcolor:BDR,zerolinecolor:BDR,tickfont:{color:MT,size:9},range:[0,5.5]},
        zaxis:{title:{text:"Category",font:{color:MT,size:11}},
          gridcolor:BDR,zerolinecolor:BDR,tickfont:{color:MT,size:9},
          tickvals:[1,2,3,4,5,6],
          ticktext:["Toasters","Kettles","Coffee","Blenders","Mixers","Others"]},
        camera:{eye:{x:1.5,y:1.5,z:1.0}},
      },
    };

    Plotly.newPlot(divRef.current, traces, layout, {
      responsive:true, displayModeBar:true,
      modeBarButtonsToRemove:["toImage","sendDataToCloud","editInChartStudio"],
      displaylogo:false,
    });
    return () => { if(divRef.current && window.Plotly) window.Plotly.purge(divRef.current); };
  }, [loaded]);

  const catStats = CATS.map(cat => {
    const d = DATA.filter(p => p.cat===cat);
    return {
      cat, count:d.length, color:CC[cat],
      avgP: Math.round(d.reduce((s,p)=>s+p.price,0)/(d.length||1)),
      avgR: (d.reduce((s,p)=>s+p.rating,0)/(d.length||1)).toFixed(1),
    };
  });

  return (
    <div style={{padding:28,overflowY:"auto",background:BG}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <div style={{fontSize:10,color:MT,letterSpacing:2,textTransform:"uppercase"}}>3D Analysis</div>
          <div style={{fontSize:22,fontWeight:700,color:TX,marginTop:3}}>3D Point Cloud Analysis</div>
          <div style={{fontSize:12,color:MT}}>Explore products in 3D space · Price × Rating × Category · Drag to rotate</div>
        </div>
        <div style={{background:S2,border:`1px solid ${BDR}`,borderRadius:8,padding:"5px 14px",fontSize:11,color:MT}}>3D Scatter</div>
      </div>

      <div style={{background:S2,borderRadius:12,border:`1px solid ${BDR}`,overflow:"hidden",marginBottom:14}}>
        {!loaded ? (
          <div style={{height:480,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
            <div style={{width:30,height:30,border:`2px solid ${AC}`,borderTopColor:"transparent",borderRadius:"50%",
              animation:"spin 0.8s linear infinite"}}/>
            <div style={{color:MT,fontSize:12}}>Loading 3D engine…</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <div ref={divRef} style={{height:480,width:"100%"}}/>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
        {catStats.map(({cat,count,color,avgP,avgR}) => (
          <div key={cat} style={{background:S2,borderRadius:10,border:`1px solid ${BDR}`,
            padding:"12px 14px",borderTop:`2px solid ${color}`}}>
            <div style={{fontSize:9,color,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{cat}</div>
            <div style={{fontSize:20,color:TX,fontWeight:700}}>{count}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:10,color:MT}}>{Math.round(avgP/1000)}K EGP avg</span>
              <span style={{fontSize:10,color:"#e8b94a"}}>★ {avgR}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


/* ─── APP ─── */
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const link = document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  const nav = p => { setSelected(null); setPage(p); };
  return (
    <div style={{display:"flex",minHeight:"100vh",background:BG,color:TX,fontFamily:"'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif",overflow:"hidden"}}>
      <Sidebar page={page} onNav={nav}/>
      <main style={{flex:1,overflow:"auto",minHeight:"100vh"}}>
        {page==="dashboard" && <Dashboard/>}
        {page==="products"  && <Products onSelect={p=>{setSelected(p);setPage("detail");}}/>}
        {page==="detail"    && <ProductDetail product={selected} onBack={()=>setPage("products")}/>}
        {page==="network"   && <NetworkGraph/>}
        {page==="heatmap"   && <Heatmap/>}
        {page==="analysis"  && <Analysis3D/>}
      </main>
    </div>
  );
}
