import test from 'node:test';
import assert from 'node:assert/strict';
import { contactConfig, loadContact } from '../src/lib/contact-config.ts';

test('runtime contact bindings override build values without exposing other bindings', () => {
  const result = contactConfig({ PUBLIC_ADDRESS: '  Denizli adresi  ', PUBLIC_WHATSAPP: '', API_SECRET: 'private', ASSETS: {} }, { PUBLIC_ADDRESS: 'old', PUBLIC_WHATSAPP: '905551111111', PUBLIC_CONTACT_EMAIL: 'hello@example.com' });
  assert.deepEqual(result, { PUBLIC_ADDRESS: 'Denizli adresi', PUBLIC_WHATSAPP: '', PUBLIC_CONTACT_EMAIL: 'hello@example.com', PUBLIC_INSTAGRAM: '' });
  assert.equal(contactConfig().PUBLIC_ADDRESS, '');
});

test('client requests uncached runtime values and rejects malformed responses', async () => {
  const data = contactConfig({ PUBLIC_INSTAGRAM: 'selfcontrol' });
  const result = await loadContact(async (url, options) => {
    assert.equal(url, '/api/config'); assert.equal(options.cache, 'no-store');
    return Response.json({ ...data, API_SECRET: 'not-for-client-state' });
  });
  assert.deepEqual(result, data);
  await assert.rejects(loadContact(async () => Response.json({ PUBLIC_ADDRESS: 'missing fields' })));
  await assert.rejects(loadContact(async () => new Response('', { status: 503 })));
});
