<script lang="ts">
  import { config as env } from '#lib/config.ts';
  import { copy, href, sites, siteName } from '#lib/site.ts';
  import Shell from '#lib/components/Shell.svelte';
  import OnePage from '#lib/components/OnePage.svelte';
  import HeadTrainer from '#lib/components/HeadTrainer.svelte';
  import { headTrainerCopy } from '#lib/head-trainer.ts';
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  const identity = $derived(sites[data.site]);
  const profile = $derived(data.page === 'coach');
  const description = $derived(profile ? headTrainerCopy[data.lang].description : copy[data.lang].home[data.site].sub);
  const canonical = $derived(`https://${identity.domain}${href(profile ? 'coach' : 'home', data.lang)}`);
  const title = $derived(profile ? `Gökhan Denizli | ${headTrainerCopy[data.lang].role} — Self Control Fight Academy` : data.site === 'academy' ? 'Self Control Fight Academy | Denizli' : `${siteName(data.site, data.lang)} | Self Control Fight Academy, Denizli`);
</script>
<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description}/>
  <meta name="theme-color" content={data.site === 'academy' ? '#ffffff' : '#080808'}/>
  <meta name="robots" content={env.PUBLIC_INDEXABLE === 'true' && !data.prefix ? 'index,follow' : 'noindex,nofollow'}/>
  <link rel="canonical" href={canonical}/>
  <link rel="alternate" hreflang="tr" href={`https://${identity.domain}${href(profile ? 'coach' : 'home', 'tr')}`}/>
  <link rel="alternate" hreflang="en" href={`https://${identity.domain}${href(profile ? 'coach' : 'home', 'en')}`}/>
  <link rel="alternate" hreflang="x-default" href={`https://${identity.domain}${href(profile ? 'coach' : 'home', 'tr')}`}/>
  <meta property="og:type" content="website"/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:url" content={canonical}/><meta property="og:locale" content={data.lang === 'tr' ? 'tr_TR' : 'en_GB'}/><meta property="og:site_name" content="Self Control Fight Academy"/><meta property="og:image" content={`https://${identity.domain}/social/${data.site}.jpg`}/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:card" content="summary_large_image"/>
</svelte:head>
{#key `${data.site}-${data.lang}-${data.page}`}
  <Shell site={data.site} lang={data.lang} page={data.page} prefix={data.prefix}>
    {#if profile}<HeadTrainer site={data.site} lang={data.lang} prefix={data.prefix}/>{:else}<OnePage site={data.site} lang={data.lang}/>{/if}
  </Shell>
{/key}
