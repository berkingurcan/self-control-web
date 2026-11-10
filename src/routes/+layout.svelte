<script lang="ts">
  import { page } from '$app/state';
  import { siteForHostname } from '#lib/site.ts';
  import '../app.css';
  import '../experience.css';
  let { children } = $props();
  const site = $derived(page.data.site ?? siteForHostname(page.url.hostname));
  const faviconVersion = $derived(site === 'academy' ? '' : '?v=2');
</script>
<svelte:head>
  <link rel="icon" href={`/icons/${site}/favicon.svg${faviconVersion}`} type="image/svg+xml" sizes="any"/>
  <link rel="apple-touch-icon" href={`/icons/${site}/apple-touch-icon.png`}/>
</svelte:head>
{@render children()}
