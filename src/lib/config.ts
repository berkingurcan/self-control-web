/** Public build-time configuration. API secrets must never be added here. */
export const config = {
  PUBLIC_SITE_ID: import.meta.env.PUBLIC_SITE_ID || 'academy',
  PUBLIC_ENABLE_PREVIEWS: import.meta.env.PUBLIC_ENABLE_PREVIEWS || 'false',
  PUBLIC_INDEXABLE: import.meta.env.PUBLIC_INDEXABLE || 'false',
  PUBLIC_CONTACT_EMAIL: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
  PUBLIC_WHATSAPP: import.meta.env.PUBLIC_WHATSAPP || '905348589765',
  PUBLIC_INSTAGRAM: import.meta.env.PUBLIC_INSTAGRAM || '',
  PUBLIC_ADDRESS: import.meta.env.PUBLIC_ADDRESS || ''
};
