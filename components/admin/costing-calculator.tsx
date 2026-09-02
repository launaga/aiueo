'use client';

import { useMemo, useState } from 'react';
import { calculateCosting, isVendorPriceStale, type CostLine, type CostLineType } from '@/lib/costing';

const initialLines: CostLine[] = [
  {id:'bus',name:'Transport bus (45 seat)',type:'per_unit',units:2,cost:4500000},
  {id:'stay',name:'Akomodasi / penginapan',type:'per_pax',cost:250000},
  {id:'meal',name:'Makan (4x) + snack',type:'per_pax',cost:180000},
  {id:'activity',name:'Aktivitas utama',type:'per_pax',cost:175000},
  {id:'sound',name:'Sound + live music',type:'per_event',cost:3500000},
  {id:'facilitator',name:'Fasilitator + fun games',type:'per_event',cost:4000000},
  {id:'documentation',name:'Dokumentasi foto/video',type:'per_event',cost:2500000},
  {id:'safety',name:'P3K / medic standby',type:'per_event',cost:1000000},
];

const idr=(value:number|null)=>value===null||!Number.isFinite(value)?'—':`Rp ${Math.round(value).toLocaleString('id-ID')}`;
const percent=(value:number|null)=>value===null||!Number.isFinite(value)?'—':`${(value*100).toFixed(1)}%`;

export function CostingCalculator() {
  const [lines,setLines]=useState(initialLines);
  const [payingPax,setPayingPax]=useState(100);
  const [compPax,setCompPax]=useState(8);
  const [contingencyPct,setContingencyPct]=useState(5);
  const [adhocPct,setAdhocPct]=useState(5);
  const [overheadPct,setOverheadPct]=useState(15);
  const [priceMode,setPriceMode]=useState<'margin'|'markup'>('margin');
  const [priceValuePct,setPriceValuePct]=useState(25);
  const [ppnPct,setPpnPct]=useState(0);
  const [monthlyOverhead,setMonthlyOverhead]=useState(0);
  const [eventsPerMonth,setEventsPerMonth]=useState(.17);
  const result=useMemo(()=>calculateCosting({lines,payingPax,compPax,contingencyPct,adhocPct,overheadPct,priceMode,priceValuePct,ppnPct,monthlyOverhead,eventsPerMonth}),[lines,payingPax,compPax,contingencyPct,adhocPct,overheadPct,priceMode,priceValuePct,ppnPct,monthlyOverhead,eventsPerMonth]);
  const staleCount=lines.filter((line)=>isVendorPriceStale(line.priceLockedDate)).length;
  const belowBreakEven=payingPax<result.breakEven;
  const danger=belowBreakEven||result.netMargin<.2;
  const caution=!danger&&result.netMargin<.25;

  function updateLine(id:string,patch:Partial<CostLine>){setLines((current)=>current.map((line)=>line.id===id?{...line,...patch}:line))}
  function addLine(){setLines((current)=>[...current,{id:crypto.randomUUID(),name:'Item baru',type:'per_pax',cost:0}])}

  return <div className="costing-shell">
    <section className="costing-summary panel">
      <div><p className="eyebrow">Harga jual / pax</p><strong>{idr(result.pricePerPax)}</strong>{ppnPct>0&&<small>Dengan pajak {ppnPct}%: {idr(result.priceWithPpn)}</small>}</div>
      <dl><Metric label="Modal / pax" value={idr(result.costPerPaying)}/><Metric label="Untung / pax" value={idr(result.profitPerPax)}/><Metric label="Net margin" value={percent(result.netMargin)}/><Metric label="Break-even" value={Number.isFinite(result.breakEven)?`${Math.ceil(result.breakEven)} pax`:'—'}/></dl>
      <div className={danger?'costing-alert danger':caution?'costing-alert caution':'costing-alert healthy'} role="status">{danger?<><b>Jangan kirim quote ini.</b> Margin di bawah lantai 20% atau pax belum menutup break-even.</>:caution?<><b>Aman minimum, belum sehat.</b> Target internal 25–30%.</>:<><b>Guardrail lolos.</b> Margin sehat dan di atas break-even.</>}</div>
      <button type="button" className="secondary-action" onClick={()=>window.print()}>Cetak / simpan PDF</button>
    </section>

    <div className="costing-main">
      <section className="panel costing-settings">
        <div className="panel-head"><div><p className="eyebrow">Input dasar</p><h2>Pax &amp; lapisan biaya</h2></div></div>
        <div className="costing-fields">
          <NumberField label="Pax membayar" value={payingPax} onChange={setPayingPax} min={1}/>
          <NumberField label="Pax komplimen" value={compPax} onChange={setCompPax} min={0} hint="TL/crew/driver ikut makan & menginap, tetapi tidak ditagih."/>
          <NumberField label="Contingency %" value={contingencyPct} onChange={setContingencyPct} min={0}/>
          <NumberField label="Dadakan / ad-hoc %" value={adhocPct} onChange={setAdhocPct} min={0}/>
          <NumberField label="Overhead %" value={overheadPct} onChange={setOverheadPct} min={0}/>
          <NumberField label="Pajak tampil %" value={ppnPct} onChange={setPpnPct} min={0} hint="Verifikasi tarif aktual dengan konsultan pajak; 0 = tidak ditampilkan."/>
        </div>
      </section>

      <section className="panel costing-lines">
        <div className="panel-head"><div><p className="eyebrow">Cost stack</p><h2>Komponen biaya langsung</h2><p>{staleCount} baris belum memiliki harga NET terkunci ≤90 hari.</p></div><button type="button" className="secondary-action" onClick={addLine}>+ Tambah baris</button></div>
        <div className="cost-table" role="table" aria-label="Komponen biaya">
          {lines.map((line)=><div className="cost-row" role="row" key={line.id}>
            <label>Item<input value={line.name} onChange={(event)=>updateLine(line.id,{name:event.target.value})}/></label>
            <label>Tipe<select value={line.type} onChange={(event)=>updateLine(line.id,{type:event.target.value as CostLineType})}><option value="per_pax">Per pax</option><option value="per_event">Per event</option><option value="per_unit">Per unit</option></select></label>
            {line.type==='per_unit'&&<NumberField label="Unit" value={line.units||0} onChange={(units)=>updateLine(line.id,{units})} min={0}/>}
            <NumberField label="Harga NET" value={line.cost} onChange={(cost)=>updateLine(line.id,{cost})} min={0}/>
            <label className={isVendorPriceStale(line.priceLockedDate)?'stale-price':''}>Tanggal kunci<input type="date" value={line.priceLockedDate||''} onChange={(event)=>updateLine(line.id,{priceLockedDate:event.target.value})}/><small>{isVendorPriceStale(line.priceLockedDate)?'Konfirmasi ulang':'Masih berlaku'}</small></label>
            <button type="button" className="icon-action" aria-label={`Hapus ${line.name}`} onClick={()=>setLines((current)=>current.filter((item)=>item.id!==line.id))}>×</button>
          </div>)}
        </div>
        <dl className="cost-stack"><Metric label="Biaya langsung" value={idr(result.directCost)}/><Metric label={`+ Contingency ${contingencyPct}%`} value={idr(result.contingencyAmount)}/><Metric label={`+ Dadakan ${adhocPct}%`} value={idr(result.adhocAmount)}/><Metric label={`+ Overhead ${overheadPct}%`} value={idr(result.overheadAmount)}/><Metric label="Total modal fully-loaded" value={idr(result.totalCost)}/></dl>
      </section>

      <section className="panel">
        <div className="panel-head"><div><p className="eyebrow">Pricing</p><h2>Margin ≠ markup</h2></div></div>
        <div className="pricing-controls"><div className="segmented"><button type="button" className={priceMode==='margin'?'active':''} onClick={()=>setPriceMode('margin')}>Target margin</button><button type="button" className={priceMode==='markup'?'active':''} onClick={()=>setPriceMode('markup')}>Markup modal</button></div><NumberField label="Target %" value={priceValuePct} onChange={setPriceValuePct} min={0}/></div>
        <p>Target ini setara dengan <b>{percent(result.netMargin)} margin</b> dan <b>{percent(result.markupEquivalent)} markup</b>. Harga di bawah biaya variabel menghasilkan break-even tak hingga dan tidak boleh dikirim.</p>
        <dl className="cost-stack"><Metric label="Omzet event" value={idr(result.revenue)}/><Metric label="Laba event" value={idr(result.profit)}/><Metric label={`Uji kerapuhan: margin saat pax turun ke ${result.lowPayingPax}`} value={percent(result.lowMargin)}/></dl>
      </section>

      <section className="panel reality-panel">
        <div className="panel-head"><div><p className="eyebrow">Reality check</p><h2>Untung per event belum tentu untung per bulan.</h2></div></div>
        <div className="costing-fields two"><NumberField label="Overhead bulanan" value={monthlyOverhead} onChange={setMonthlyOverhead} min={0}/><NumberField label="Event per bulan" value={eventsPerMonth} onChange={setEventsPerMonth} min={.01} step={.01}/></div>
        <dl className="cost-stack"><Metric label="Overhead riil / event" value={idr(result.trueOverheadPerEvent)}/><Metric label="Selisih overhead belum tertutup" value={idr(result.overheadGap)}/><Metric label="Margin jujur" value={percent(result.trueMargin)}/><Metric label="Laba jujur" value={idr(result.trueProfit)}/></dl>
        <p>Panel ini mengganti proxy overhead persen dengan overhead absolut ÷ event per bulan. Isi angka riil sebelum menyetujui quote.</p>
      </section>
    </div>
    <p className="costing-footnote">Alat internal, single-user, tanpa cloud persistence. Angka awal hanya contoh; ganti semua baris dengan harga NET vendor yang dikunci. Permintaan di luar quote tetap wajib Change Order tertulis.</p>
  </div>;
}

function NumberField({label,value,onChange,min,step=1,hint}:{label:string;value:number;onChange:(value:number)=>void;min:number;step?:number;hint?:string}) {
  return <label>{label}<input type="number" value={value} min={min} step={step} onChange={(event)=>onChange(Number(event.target.value))}/>{hint&&<small>{hint}</small>}</label>;
}

function Metric({label,value}:{label:string;value:string}) {return <div><dt>{label}</dt><dd>{value}</dd></div>}
