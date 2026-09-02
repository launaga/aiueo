'use client';

import { useActionState, useState, useTransition } from 'react';
import { deleteContent, saveContent, type ActionResult } from '@/app/actions/content';
import type { ContentRecord, ContentResource, UserRole } from '@/lib/types';
import { translationComplete } from '@/lib/types';

const initial:ActionResult={ok:false,message:''};

export function ContentEditor({resource,rows,role}:{resource:ContentResource;rows:ContentRecord[];role:UserRole}) {
  const [editing,setEditing]=useState<ContentRecord|null>(null);
  const [creating,setCreating]=useState(false);
  const [deleting,startDeleting]=useTransition();
  const canEdit=role!=='viewer'; const showForm=canEdit&&(creating||editing);
  function remove(id:string,title:string){if(!window.confirm(`Hapus “${title}”? Tindakan ini dicatat di audit log.`))return;startDeleting(()=>deleteContent(resource,id));}
  return <>
    <div className="resource-toolbar"><p>{rows.length} record</p>{canEdit&&<button className="primary-action" onClick={()=>{setEditing(null);setCreating(true)}}>Konten baru <span>+</span></button>}</div>
    {showForm&&<EditorForm resource={resource} value={editing} close={()=>{setCreating(false);setEditing(null)}}/>}
    <div className="content-table" role="table" aria-label={`Daftar ${resource}`}>
      <div className="table-row table-head" role="row"><span>Konten</span><span>Status</span><span>Terjemahan</span><span>Diperbarui</span><span>Aksi</span></div>
      {rows.map(row=><div className="table-row" role="row" key={row.id}>
        <div><b>{row.title_id}</b><small>{row.title_en}</small></div>
        <span className={`badge ${row.status}`}>{row.status}</span>
        <span className={`translation-status ${translationComplete(row)?'complete':'missing'}`}>{translationComplete(row)?'ID + EN lengkap':'Belum lengkap'}</span>
        <time>{new Date(row.updated_at).toLocaleDateString('id-ID')}</time>
        <div className="inline-actions"><a href={`/admin/preview/${resource}/${row.id}`} target="_blank">Preview</a>{canEdit&&<button onClick={()=>setEditing(row)}>Edit</button>}{role==='super_admin'&&<button disabled={deleting} onClick={()=>remove(row.id,row.title_id)}>Hapus</button>}</div>
      </div>)}
    </div>
    {!rows.length&&<div className="empty-admin">Belum ada konten. {canEdit?'Buat record pertama untuk memulai.':''}</div>}
  </>;
}

function EditorForm({resource,value,close}:{resource:ContentResource;value:ContentRecord|null;close:()=>void}) {
  const [state,action,pending]=useActionState(saveContent,initial);
  return <section className="editor-panel"><div className="editor-head"><div><p className="eyebrow">{value?'Edit record':'Record baru'}</p><h2>ID &amp; EN berdampingan</h2></div><button type="button" onClick={close} aria-label="Tutup editor">×</button></div><form action={action}>
    <input type="hidden" name="resource" value={resource}/>{value&&<input type="hidden" name="id" value={value.id}/>}<div className="bilingual-grid">
      <fieldset><legend>Bahasa Indonesia</legend><label>Judul<input name="title_id" defaultValue={value?.title_id} required/></label><label>Slug<input name="slug_id" defaultValue={value?.slug_id} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required/></label><label>Deskripsi<textarea name="description_id" defaultValue={value?.description_id} rows={3} required/></label><label>Isi<textarea name="body_id" defaultValue={value?.body_id} rows={8}/></label></fieldset>
      <fieldset><legend>English</legend><label>Title<input name="title_en" defaultValue={value?.title_en} required/></label><label>Slug<input name="slug_en" defaultValue={value?.slug_en} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required/></label><label>Description<textarea name="description_en" defaultValue={value?.description_en} rows={3} required/></label><label>Body<textarea name="body_en" defaultValue={value?.body_en} rows={8}/></label></fieldset>
    </div><div className="editor-meta"><label>Image / video URL<input name="featured_image_url" defaultValue={value?.featured_image_url??''}/></label><label>Urutan<input type="number" name="sort_order" min="0" defaultValue={value?.sort_order??0}/></label><label>Status<select name="status" defaultValue={value?.status??'draft'}><option value="draft">Draft</option><option value="published">Published</option></select></label></div>
    <div className="editor-actions"><button type="button" onClick={close}>Batal</button>{value&&<a href={`/admin/preview/${resource}/${value.id}`} target="_blank">Preview ID + EN ↗</a>}<button className="primary-action" disabled={pending}>{pending?'Menyimpan…':'Simpan konten'}</button></div>{state.message&&<p className={state.ok?'alert':'alert error'} role="status">{state.message}</p>}
  </form></section>;
}
