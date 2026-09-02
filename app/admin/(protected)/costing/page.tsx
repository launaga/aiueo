import { redirect } from 'next/navigation';
import { CostingCalculator } from '@/components/admin/costing-calculator';
import { requireAdmin } from '@/lib/auth';

export default async function CostingPage() {
  const user=await requireAdmin();
  if(user.role==='viewer') redirect('/admin?denied=1');
  return <main className="admin-content costing-page"><div className="admin-heading compact"><div><p className="eyebrow">Internal only · local state</p><h1>Quote &amp; Costing</h1><p>Guardrail fully-loaded sebelum penawaran dikirim.</p></div></div><CostingCalculator/></main>;
}
