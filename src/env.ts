import { defineEnvVars } from '@sveltejs/kit/env';
export const variables = defineEnvVars({
  SHEETS_SPREADSHEET_URL: { schema: (value: string | undefined) => value?.trim() || '' }
});
