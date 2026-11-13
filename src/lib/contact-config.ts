/** Only these public business details may be sent to the browser. */
export const contactKeys = ['PUBLIC_CONTACT_EMAIL', 'PUBLIC_WHATSAPP', 'PUBLIC_INSTAGRAM', 'PUBLIC_ADDRESS'] as const;
export type ContactConfig = Record<typeof contactKeys[number], string>;
export const contactKey = Symbol('academy-contact');
export const academyMapsUrl = 'https://maps.app.goo.gl/7gwWY2M8u2Z7pP8x9';
export function contactConfig(runtime: Record<string, unknown> = {}, fallback: Partial<ContactConfig> = {}): ContactConfig {
  return Object.fromEntries(contactKeys.map(key => [key,
    typeof runtime[key] === 'string' ? runtime[key].trim() : fallback[key] ?? ''
  ])) as ContactConfig;
}
export async function loadContact(fetcher: typeof fetch): Promise<ContactConfig> {
  const response = await fetcher('/api/config', { credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error('Contact configuration unavailable');
  const body = await response.json();
  if (!body || contactKeys.some(key => typeof body[key] !== 'string')) throw new Error('Invalid contact configuration');
  return contactConfig(body);
}
