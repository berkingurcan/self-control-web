<script lang="ts">
  import { page } from '$app/state';
  import { selectedSite } from '#lib/site.ts';
  import '../app.css';
  import '../experience.css';
  let { children } = $props();
  const site = $derived(page.data.site ?? selectedSite);
</script>
<svelte:head><link rel="icon" href={`/icons/${site}/favicon.svg`} type="image/svg+xml" sizes="any"/></svelte:head>
{@render children()}
