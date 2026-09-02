import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/app/actions/auth';

export default async function ProtectedLayout({children}:{children:React.ReactNode}) {
  const user=await requireAdmin();
  const links=[['Overview','/admin'],['Homepage','/admin/content/pages'],['Services','/admin/content/services'],['Events','/admin/content/events'],['News','/admin/content/articles'],['Gallery','/admin/content/gallery_items'],['Media','/admin/media'],['Leads','/admin/leads']];
  if(user.role==='super_admin') links.push(['Users','/admin/users']);
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="admin-brand" href="/admin"><span>A</span><span>I</span><span>U</span><span>E</span><span>O</span></Link><nav>{links.map(([label,href])=><Link key={href} href={href}>{label}<span>↗</span></Link>)}</nav><div className="admin-account"><b>{user.name}</b><span>{user.role.replace('_',' ')}</span><Link href="/admin/account">Akun</Link><form action={logoutAction}><button>Keluar</button></form></div></aside><div className="admin-main"><header className="admin-topbar"><div><span className="status-dot"/> Workspace connected</div><a href="/id" target="_blank">Lihat website ↗</a></header>{children}</div></div>;
}
