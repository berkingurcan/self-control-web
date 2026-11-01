<script lang="ts">
  import { page } from '$app/state';
  import { copy } from '#lib/site.ts';
  const lang = $derived(/\/en(?:\/|$)/.test(page.url.pathname) ? 'en' : 'tr');
  const t = $derived(copy[lang]);
</script>
<svelte:head><title>{page.status} — Self Control Fight Academy</title><meta name="robots" content="noindex"/></svelte:head>
<main class="error-page"><img src="/brand/mark.svg" width="90" height="65" alt="Self Control"/><span class="eyebrow">SELF CONTROL / {page.status}</span><h1 class="display">{t.notFound}</h1><p>{t.notFoundBody}</p><a class="button solid" style="--accent:#fff" href={lang === 'en' ? '/en' : '/'}>{t.back} ↗</a></main>
