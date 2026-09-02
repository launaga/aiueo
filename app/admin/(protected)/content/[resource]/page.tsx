import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getAdminRows } from '@/lib/data';
import type { ContentResource } from '@/lib/types';
import { ContentEditor } from '@/components/admin/content-editor';

const resources:ContentResource[]=['pages','services','events','articles','gallery_items'];
const labels:Record<ContentResource,string>={pages:'Homepage & pages',services:'Services',events:'Events',articles:'News & articles',gallery_items:'Gallery'};
export default async function ResourcePage({params}:{params:Promise<{resource:string}>}){const {resource:raw}=await params;if(!resources.includes(raw as ContentResource))notFound();const resource=raw as ContentResource;const [user,rows]=await Promise.all([requireAdmin(),getAdminRows(resource)]);return <main className="admin-content"><div className="admin-heading compact"><div><p className="eyebrow">Content management</p><h1>{labels[resource]}</h1></div></div><ContentEditor resource={resource} rows={rows} role={user.role}/></main>}
