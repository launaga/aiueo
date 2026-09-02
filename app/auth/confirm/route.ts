import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request:NextRequest){const {searchParams,origin}=new URL(request.url);const tokenHash=searchParams.get('token_hash');const type=searchParams.get('type') as EmailOtpType|null;const code=searchParams.get('code');const next=searchParams.get('next')?.startsWith('/')?searchParams.get('next')!:'/admin';const supabase=await createClient();let error:Error|null=null;if(code){({error}=await supabase.auth.exchangeCodeForSession(code));}else if(tokenHash&&type){({error}=await supabase.auth.verifyOtp({type,token_hash:tokenHash}));}else error=new Error('Invalid confirmation link');return NextResponse.redirect(`${origin}${error?'/admin/login?error=Link konfirmasi tidak valid.':next}`)}
