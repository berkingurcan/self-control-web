export const siteDomains = {
  academy: 'selfcontrolfightacademy.com',
  muaythai: 'muaythai.selfcontrolfightacademy.com',
  kickbox: 'kickbox.selfcontrolfightacademy.com',
  mma: 'mma.selfcontrolfightacademy.com'
} as const;

export type SiteId = keyof typeof siteDomains;

export const sitesByHostname = new Map<string, SiteId>([
  ...Object.entries(siteDomains).map(([site, domain]) => [domain, site as SiteId] as const),
  [`www.${siteDomains.academy}`, 'academy']
]);

export function sitePagePaths(site: SiteId) {
  return site === 'academy' ? ['/', '/en', '/gokhandenizli', '/en/gokhandenizli'] : ['/', '/en'];
}
