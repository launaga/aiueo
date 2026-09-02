import type { Metadata } from 'next';
import './admin.css';

export const metadata:Metadata={title:{default:'AIUEO Admin',template:'%s | AIUEO Admin'},robots:{index:false,follow:false}};
export default function AdminRootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}
