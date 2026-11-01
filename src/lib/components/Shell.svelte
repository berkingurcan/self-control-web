<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { config as env } from '#lib/config.ts';
  import { copy, href, siteHref, sites, type Lang, type PageId, type SiteId } from '#lib/site.ts';
  import { editorial } from '#lib/editorial.ts';
  import Icon from './Icon.svelte';
  import type { Snippet } from 'svelte';
  let { site, lang, page, prefix, children }: { site: SiteId; lang: Lang; page: PageId; prefix: string; children: Snippet } = $props();
  let menuOpen = $state(false), offline = $state(false), installed = $state(false);
  let active = $state('top'), progress = $state(0);
  let installDialog: HTMLDialogElement, privacyDialog: HTMLDialogElement;
  type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
  let installEvent = $state<InstallPrompt | null>(null);
  const t = $derived(copy[lang]), e = $derived(editorial[lang]), identity = $derived(sites[site]);
  const preview = env.PUBLIC_ENABLE_PREVIEWS === 'true';
  const nav = $derived(site === 'academy' ? ['training', 'academy', 'space', 'trainers', 'schedule'] as const : ['training', 'space', 'trainers', 'schedule'] as const);
  const quick = [{ id: 'top', icon: 'home' }, { id: 'training', icon: 'training' }, { id: 'schedule', icon: 'calendar' }, { id: 'start', icon: 'diagonal' }];
  const anchor = (id: string) => `${page === 'coach' ? href('home', lang, prefix) : ''}#${id}`;
  const languageHref = $derived(page === 'coach' ? href('coach', lang === 'tr' ? 'en' : 'tr', prefix) : `${href('home', lang === 'tr' ? 'en' : 'tr', prefix)}${active === 'top' ? '' : `#${active}`}`);
  afterNavigate(() => { menuOpen = false; });
  $effect(() => { document.documentElement.lang = lang; });
  $effect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; });
  async function install() { if (installEvent) { await installEvent.prompt(); await installEvent.userChoice; installEvent = null; } }
  onMount(() => {
    const network = () => { offline = !navigator.onLine; }; network();
    const prompt = (event: Event) => { event.preventDefault(); installEvent = event as InstallPrompt; };
    const complete = () => { installed = true; installEvent = null; };
    installed = window.matchMedia('(display-mode: standalone)').matches;
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
      let current = page === 'coach' ? 'trainers' : 'top';
      for (const id of [...nav, 'start']) { const section = document.getElementById(id); if (section && section.getBoundingClientRect().top <= window.innerHeight * .36) current = id; }
      active = current;
    };
    const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const hash = () => { if (window.location.hash === '#privacy' && !privacyDialog.open) privacyDialog.showModal(); };
    update(); hash();
    const firstFrame = requestAnimationFrame(update);
    window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', scroll); window.addEventListener('hashchange', hash);
    window.addEventListener('online', network); window.addEventListener('offline', network);
    window.addEventListener('beforeinstallprompt', prompt); window.addEventListener('appinstalled', complete);
    if ('serviceWorker' in navigator && !import.meta.env.DEV) navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    return () => { cancelAnimationFrame(firstFrame); cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); window.removeEventListener('hashchange', hash); window.removeEventListener('online', network); window.removeEventListener('offline', network); window.removeEventListener('beforeinstallprompt', prompt); window.removeEventListener('appinstalled', complete); };
  });
</script>
<svelte:window onkeydown={(event) => { if (event.key === 'Escape') menuOpen = false; }}/>
<div class="site-shell" style={`--accent:${identity.accent};--accent-dark:${identity.dark};--progress:${progress}%`} data-identity={site}>
  <a class="skip-link" href="#main">{t.skip}</a>
  <header class="site-header">
    <a class="brand" href={anchor('top')} aria-label={`Self Control Fight Academy — ${t.nav.home}`} onclick={() => menuOpen = false}>
      <img class="brand-mark" src="/brand/mark.svg" width="46" height="36" alt=""/>
      <span class="brand-type"><img src={site === 'academy' ? '/brand/wordmark.svg' : '/brand/wordmark-team.svg'} alt={site === 'academy' ? 'Self Control Fight Academy' : 'Self Control'} width="180" height={site === 'academy' ? 25 : 15}/>{#if site !== 'academy'}<span class="brand-discipline" lang="en">{identity.name}</span>{/if}</span>
    </a>
    <nav class="desktop-nav" aria-label={lang === 'tr' ? 'Ana navigasyon' : 'Main navigation'}>
      {#each nav as id}<a class:active={active === id} aria-current={active === id ? 'location' : undefined} href={anchor(id)}>{id === 'training' && site !== 'academy' ? t.nav.training : e.nav[id]}</a>{/each}
    </nav>
    <div class="header-actions"><a class="language" hreflang={lang === 'tr' ? 'en' : 'tr'} lang={lang === 'tr' ? 'en' : 'tr'} href={languageHref} aria-label={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}>{lang === 'tr' ? 'EN' : 'TR'}</a><a class="button small solid header-start" href={anchor('start')}>{t.start}<Icon name="diagonal" size={16}/></a><button class="menu-toggle" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} aria-controls="mobile-menu" onclick={() => menuOpen = !menuOpen}><Icon name={menuOpen ? 'close' : 'menu'}/></button></div>
    <div class="reading-progress" aria-hidden="true"></div>
  </header>
  {#if menuOpen}
    <div class="menu-panel" id="mobile-menu">
      <span class="eyebrow">SELF CONTROL / {identity.label}</span>
      <nav aria-label={t.menu}>{#each [...nav, 'start'] as id, i}<a href={anchor(id)} onclick={() => menuOpen = false}><span>0{i + 1}</span>{e.nav[id as keyof typeof e.nav]}<Icon name="diagonal"/></a>{/each}</nav>
      {#if site !== 'academy'}<a class="quiet-link" href={siteHref('academy', lang, preview)}>{t.academyLink}<Icon name="diagonal"/></a>{/if}
      <button class="text-button" onclick={() => { menuOpen = false; installDialog.showModal(); }}><Icon name="phone"/>{t.install}</button>
    </div>
  {/if}
  {#if offline}<div class="offline-banner" role="status">{t.offline}</div>{/if}
  <main id="main" tabindex="-1" inert={menuOpen}>{@render children()}</main>
  <footer class="site-footer" inert={menuOpen}>
    <div class="footer-statement"><img src="/brand/mark.svg" width="90" height="66" alt=""/><div><p>{e.footer}</p><span>{e.footerSub}</span></div><a href="#top" class="back-top" aria-label={t.nav.home}><Icon name="diagonal" size={25}/></a></div>
    <div class="footer-grid"><div><h3>{t.exploreLabel}</h3>{#each nav as id}<a href={anchor(id)}>{e.nav[id]}</a>{/each}</div><div><h3>{t.identities}</h3>{#each ['academy', 'muaythai', 'kickbox', 'mma'] as id}<a href={siteHref(id as SiteId, lang, preview)} aria-current={site === id ? 'page' : undefined}>{sites[id as SiteId].name}<Icon name="diagonal" size={14}/></a>{/each}</div><div class="footer-note"><span class="eyebrow">{t.designPreview}</span><p>{t.previewNote}</p><p>{e.stockNote}</p><details><summary>{t.photoCredits}</summary><a href="https://www.pexels.com/photo/two-men-practicing-martial-arts-2628210/" target="_blank" rel="noreferrer">Gleb Krasnoborov / Pexels</a><a href="https://www.pexels.com/photo/woman-doing-muay-thai-training-12121709/" target="_blank" rel="noreferrer">Juliia Abramova / Pexels</a><a href="https://www.pexels.com/photo/female-fighter-training-with-kickboxing-techniques-34990409/" target="_blank" rel="noreferrer">Daniel Lee / Pexels</a><a href="https://www.pexels.com/photo/two-men-wrestling-11391987/" target="_blank" rel="noreferrer">Duren Williams / Pexels</a><a href="https://www.pexels.com/photo/empty-boxing-gym-8611244/" target="_blank" rel="noreferrer">RDNE Stock project / Pexels</a><a href="https://www.pexels.com/photo/empty-boxing-ring-8744796/" target="_blank" rel="noreferrer">Ron Lach / Pexels</a><a href="https://www.pexels.com/photo/man-training-a-woman-in-boxing-6740346/" target="_blank" rel="noreferrer">Mikhail Nilov / Pexels</a><a href="https://www.pexels.com/photo/a-man-with-clenched-fists-8611936/" target="_blank" rel="noreferrer">RDNE Stock project / Portrait</a><a href="https://www.pexels.com/photo/portrait-of-boxer-during-training-6699099/" target="_blank" rel="noreferrer">Gustavo Fring / Pexels</a><a href="https://www.pexels.com/photo/portrait-of-boxer-on-ring-7991903/" target="_blank" rel="noreferrer">Annushka Ahuja / Pexels</a><a href="https://www.pexels.com/photo/black-and-white-boxer-in-training-pose-30323312/" target="_blank" rel="noreferrer">Amirr Zolfaghari / Pexels</a></details><button class="install-link" onclick={() => installDialog.showModal()}><Icon name="phone" size={17}/>{t.install}<Icon name="plus" size={14}/></button></div></div>
    <div class="footer-bottom"><span>© 2026 Self Control Fight Academy</span><button onclick={() => privacyDialog.showModal()}>{t.nav.privacy}</button><span>AURUM ARENA / {identity.number}</span></div>
  </footer>
  <nav class="mobile-bottom" inert={menuOpen} aria-label={lang === 'tr' ? 'Hızlı navigasyon' : 'Quick navigation'}>{#each quick as item}<a href={anchor(item.id)} class:active={active === item.id} aria-current={active === item.id ? 'location' : undefined}><Icon name={item.icon}/><span>{item.id === 'top' ? t.nav.home : item.id === 'start' ? t.nav.start : item.id === 'training' ? (site === 'academy' ? e.nav.training : t.nav.training) : e.nav.schedule}</span></a>{/each}</nav>
  <dialog class="install-dialog" bind:this={installDialog} onclick={(event) => { if (event.target === installDialog) installDialog.close(); }} onkeydown={(event) => { if (event.key === 'Escape') installDialog.close(); }} aria-labelledby="install-title"><div class="dialog-inner"><button class="dialog-close" aria-label={t.close} onclick={() => installDialog.close()}><Icon name="close"/></button><img src="/brand/mark.svg" width="65" height="48" alt=""/><h2 id="install-title">{t.installTitle}</h2><p>{t.installBody}</p>{#if installed}<p class="install-ready"><Icon name="check"/>{t.installed}</p>{:else}{#if installEvent}<button class="button solid wide" onclick={install}>{t.installNative}<Icon name="download"/></button>{/if}<div class="install-instructions"><h3>{t.ios}</h3><p>{t.iosInstructions}</p><h3>{t.android}</h3><p>{t.androidInstructions}</p></div>{/if}</div></dialog>
  <dialog class="privacy-dialog" bind:this={privacyDialog} onclick={(event) => { if (event.target === privacyDialog) privacyDialog.close(); }} onkeydown={(event) => { if (event.key === 'Escape') privacyDialog.close(); }} aria-labelledby="privacy-title"><div class="dialog-inner"><button class="dialog-close" aria-label={t.close} onclick={() => privacyDialog.close()}><Icon name="close"/></button><span class="eyebrow">SELF CONTROL</span><h2 id="privacy-title">{t.privacyTitle}</h2><p>{t.privacyBody}</p><p class="muted">{t.privacyPending}</p></div></dialog>
</div>
