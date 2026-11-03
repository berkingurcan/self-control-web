import { json } from '@sveltejs/kit';
import { PUBLIC_CONTACT_EMAIL, PUBLIC_WHATSAPP, PUBLIC_INSTAGRAM, PUBLIC_ADDRESS } from '$app/env/private';
import { config } from '#lib/config.ts';
import { contactConfig } from '#lib/contact-config.ts';
import type { RequestHandler } from './$types';
export const prerender = false;
export const GET: RequestHandler = () => {
  const runtime = { PUBLIC_CONTACT_EMAIL, PUBLIC_WHATSAPP, PUBLIC_INSTAGRAM, PUBLIC_ADDRESS };
  return json(contactConfig(runtime, config), { headers: { 'Cache-Control': 'no-store' } });
};
