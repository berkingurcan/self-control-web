import { defineEnvVars } from '@sveltejs/kit/env';
export const variables = defineEnvVars({
  // Server-only imports; /api/config explicitly publishes just these business fields.
  PUBLIC_CONTACT_EMAIL: { schema: (value: string | undefined) => value?.trim() },
  PUBLIC_WHATSAPP: { schema: (value: string | undefined) => value?.trim() },
  PUBLIC_INSTAGRAM: { schema: (value: string | undefined) => value?.trim() },
  PUBLIC_ADDRESS: { schema: (value: string | undefined) => value?.trim() },
  SHEETS_SPREADSHEET_URL: { schema: (value: string | undefined) => value?.trim() || '' }
});
