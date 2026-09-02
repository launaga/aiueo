import Link from 'next/link';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { isDemoMode } from '@/lib/demo-auth';

export default async function ProtectedLayout({children}:{children:React.ReactNode}) {
  await connection();
  const user=await requireAdmin();
  const links=[['Overview','/admin'],['Homepage','/admin/content/pages'],['Services','/admin/content/services'],['Events','/admin/content/events'],['News','/admin/content/articles'],['Gallery','/admin/content/gallery_items'],['Media','/admin/media'],['Leads','/admin/leads']];
  if(user.role!=='viewer') links.splice(1,0,['Costing','/admin/costing']);
  if(user.role==='super_admin') links.push(['Users','/admin/users']);
  const demo=isDemoMode();
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="sidebar-head"><Link className="admin-brand" href="/admin"><span>A</span><span>I</span><span>U</span><span>E</span><span>O</span></Link><span className="role-chip">{user.role.replace('_',' ')}</span></div><nav aria-label="Admin navigation">{links.map(([label,href])=><Link key={href} href={href}>{label}<span>↗</span></Link>)}</nav><div className="admin-account"><b>{user.name}</b><span>{user.email}</span><span>{user.role.replace('_',' ')}</span><Link href="/admin/account">Akun</Link><form action={logoutAction}><button>Keluar</button></form></div></aside><div className="admin-main"><header className="admin-topbar"><div><span className="status-dot"/> {demo?'Sandbox demo · isolated':'Workspace connected'}</div><div className="topbar-actions"><span className="role-chip">{user.role.replace('_',' ')}</span><form action={logoutAction}><button>Keluar</button></form><a href="/id" target="_blank">Website ↗</a></div></header>{user.role==='viewer'&&<div className="readonly-banner" role="status"><b>Mode Viewer</b><span>Dashboard ini read-only. Tombol perubahan dan user management tidak tersedia.</span></div>}{children}</div></div>;
}
