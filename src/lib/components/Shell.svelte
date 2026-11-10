<script lang="ts">
  import { academyHomeCopy } from '#lib/academy-home-copy.ts';
  import { siteOrder } from '#lib/discipline-order.ts';
  import { onMount, setContext, tick, untrack } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { contactKey, contactConfig, loadContact, type ContactConfig } from '#lib/contact-config.ts';
  import { config as env } from '#lib/config.ts';
  import { siteName, copy, href, siteHref, sites, type Lang, type PageId, type SiteId } from '#lib/site.ts';
  import { editorial } from '#lib/editorial.ts';
  import Icon from './Icon.svelte';
  import { modalFocus } from '#lib/effects.ts';
  import PackageEnquiry from './PackageEnquiry.svelte';
  import { demoContent } from '#lib/content.ts';
  import { contentKey, FRESH_MS, type ContentState } from '#lib/content-schema.ts';
  import { loadContent } from '#lib/content-client.ts';
  import { experienceCopy } from '#lib/experience-copy.ts';
  import { experienceKey, initialSelection, restoreSelection, selectionQuery, selectedOffer, packageLabel, formatMoney, type Experience } from '#lib/selection.ts';
  import type { Snippet } from 'svelte';
  let { site, lang, page, prefix, children }: { site: SiteId; lang: Lang; page: PageId; prefix: string; children: Snippet } = $props();
  const experience = $state<Experience>({ selection: untrack(() => initialSelection(site)), inMembership: false, enquiryOpen: false, explicit: false });
  setContext(experienceKey, experience);
  const content = $state<ContentState>({ data: demoContent, phase: 'loading' });
  setContext(contentKey, content);
  const contact = $state<ContactConfig>(contactConfig({}, env));
  setContext(contactKey, contact);
  const catalog = $derived(content.data.catalog);
  $effect(() => {
    if (content.data.source !== 'sheets' || !content.data.checkedAt) return;
    const remaining = Date.parse(content.data.checkedAt) + 60 * 60_000 - Date.now();
    const expiry = setTimeout(() => { content.phase = 'unavailable'; experience.enquiryOpen = false; }, Math.max(0,remaining));
    return () => clearTimeout(expiry);
  });
  const home = $derived(academyHomeCopy[lang]);
  const ux = $derived(experienceCopy[lang]);
  const offer = $derived(selectedOffer(experience.selection, catalog));
  let menuOpen = $state(false), offline = $state(false), installed = $state(false);
  let active = $state('top'), progress = $state(0);
  let installDialog: HTMLDialogElement, privacyDialog: HTMLDialogElement, menuDialog: HTMLDialogElement;
  type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
  let installEvent = $state<InstallPrompt | null>(null);
  const t = $derived(copy[lang]), e = $derived(editorial[lang]), identity = $derived(sites[site]);
  const preview = env.PUBLIC_ENABLE_PREVIEWS === 'true';
  const nav = $derived(site === 'academy' ? ['training', 'schedule', 'membership', 'academy', 'space', 'trainers'] as const : ['training', 'space', 'schedule', 'membership'] as const);
  const scrollSections = $derived(site === 'academy' ? ['training', 'first-session', ...nav.slice(1), 'start'] : [...nav, 'start']);
  const quick = [{ id: 'training', icon: 'training' }, { id: 'schedule', icon: 'calendar' }, { id: 'membership', icon: 'plans' }, { id: 'start', icon: 'diagonal' }];
  const anchor = (id: string) => `${page === 'coach' ? href('home', lang, prefix) : ''}#${id}`;
  const languageHref = $derived(page === 'coach' ? href('coach', lang === 'tr' ? 'en' : 'tr', prefix) : `${href('home', lang === 'tr' ? 'en' : 'tr', prefix)}${experience.explicit ? '?' + selectionQuery(experience.selection) : ''}${active === 'top' ? '' : `#${active}`}`);
  afterNavigate(() => { menuOpen = false; });
  $effect(() => { document.documentElement.lang = lang; });
  $effect(() => { if (menuDialog) { if (menuOpen && !menuDialog.open) menuDialog.showModal(); else if (!menuOpen && menuDialog.open) menuDialog.close(); } });
  $effect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; });
  async function install() { if (installEvent) { await installEvent.prompt(); await installEvent.userChoice; installEvent = null; } }
  onMount(() => {
    const initialParams = new URLSearchParams(window.location.search);
    const initialHash = window.location.hash;
    const initialAnchor = page === 'home' ? document.getElementById(initialHash.slice(1)) : null;
    const anchorInputs = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    let anchorPending = !!initialAnchor;
    const cancelAnchor = () => {
      anchorPending = false;
      for (const event of anchorInputs) window.removeEventListener(event, cancelAnchor);
    };
    if (anchorPending) for (const event of anchorInputs) window.addEventListener(event, cancelAnchor, { passive: true });
    let selectionInitialized = false;
    let stopped = false, refreshing = false;
    async function refreshContent() {
      if (refreshing || page !== 'home') return;
      refreshing = true;
      let storage: Storage | null = null;
      try { storage = window.localStorage; } catch { /* Optional browser cache. */ }
      const result = await loadContent(fetch, storage, demoContent);
      if (!stopped) {
        content.data = result.data; content.phase = result.phase;
        if (result.phase === 'ready' || result.phase === 'stale') {
          const params = selectionInitialized ? new URLSearchParams(selectionQuery(experience.selection)) : initialParams;
          const restored = restoreSelection(params, site, result.data.catalog);
          const keepsChoice = params.get('plan') === restored.type
            && (site !== 'academy' || params.get('discipline') === restored.discipline)
            && (restored.type === 'group'
              ? Number(params.get('months')) === restored.months
              : Number(params.get('people')) === restored.participants && Number(params.get('lessons')) === restored.lessons)
            && !!selectedOffer(restored, result.data.catalog);
          if (site === 'academy' && experience.explicit && !keepsChoice) experience.enquiryOpen = false;
          experience.explicit = (!selectionInitialized || experience.explicit) && keepsChoice;
          experience.selection = restored;
          selectionInitialized = true;
        }
        if (result.phase === 'unavailable' || !selectedOffer(experience.selection, result.data.catalog)) experience.enquiryOpen = false;
        if (anchorPending) {
          // The timetable expands on hydration and can move a deep-linked section.
          await tick();
          if (anchorPending && !stopped && window.location.hash === initialHash) initialAnchor?.scrollIntoView({ behavior: 'instant' });
          cancelAnchor();
        }
      }
      refreshing = false;
    }
    async function refreshContact() {
      try {
        const result = await loadContact(fetch);
        if (!stopped) Object.assign(contact, result);
      } catch { /* Keep the last known or build-time contact details when offline. */ }
    }
    const visible = () => { if (document.visibilityState === 'visible') { void refreshContent(); void refreshContact(); } };
    const contentTimer = setInterval(visible, FRESH_MS);
    document.addEventListener('visibilitychange', visible); window.addEventListener('online', visible);
    void refreshContent();
    void refreshContact();
    const network = () => { offline = !navigator.onLine; }; network();
    const prompt = (event: Event) => { event.preventDefault(); installEvent = event as InstallPrompt; };
    const complete = () => { installed = true; installEvent = null; };
    installed = window.matchMedia('(display-mode: standalone)').matches;
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
      let current = page === 'coach' ? 'trainers' : 'top';
      for (const id of scrollSections) { const section = document.getElementById(id); if (section && section.getBoundingClientRect().top <= window.innerHeight * .36) current = id; }
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
    return () => { stopped = true; cancelAnchor(); clearInterval(contentTimer); document.removeEventListener('visibilitychange', visible); window.removeEventListener('online', visible); cancelAnimationFrame(firstFrame); cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); window.removeEventListener('hashchange', hash); window.removeEventListener('online', network); window.removeEventListener('offline', network); window.removeEventListener('beforeinstallprompt', prompt); window.removeEventListener('appinstalled', complete); };
  });
</script>
<svelte:window onkeydown={(event) => { if (event.key === 'Escape') menuOpen = false; }}/>
<div class="site-shell" style={`--accent:${identity.accent};--accent-dark:${identity.dark};--progress:${progress}%`} data-identity={site}>
  <a class="skip-link" href="#main">{t.skip}</a>
  <header class="site-header">
    <a class="brand" href={anchor('top')} aria-label={`Self Control Fight Academy — ${t.nav.home}`} onclick={() => menuOpen = false}>
      <img class="brand-mark" src="/brand/mark.svg" width="46" height="36" alt=""/>
      <span class="brand-type"><img src={site === 'academy' ? '/brand/wordmark.svg' : '/brand/wordmark-team.svg'} alt={site === 'academy' ? 'Self Control Fight Academy' : 'Self Control'} width="180" height={site === 'academy' ? 25 : 15}/>{#if site !== 'academy'}<span class="brand-discipline" lang={lang}>{siteName(site, lang)}</span>{/if}</span>
    </a>
    <nav class="desktop-nav" aria-label={lang === 'tr' ? 'Ana menü' : 'Main navigation'}>
      {#each nav as id}<a class:active={active === id} aria-current={active === id ? 'location' : undefined} href={anchor(id)}>{id === 'membership' ? ux.plans : id === 'training' && site !== 'academy' ? t.nav.training : e.nav[id]}</a>{/each}
    </nav>
    <div class="header-actions"><a class="language" hreflang={lang === 'tr' ? 'en' : 'tr'} lang={lang === 'tr' ? 'en' : 'tr'} href={languageHref} aria-label={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}>{lang === 'tr' ? 'EN' : 'TR'}</a><a class="button small solid header-start" href={anchor('start')}>{t.start}<Icon name="diagonal" size={16}/></a><button class="menu-toggle" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} aria-controls="mobile-menu" onclick={() => menuOpen = !menuOpen}><Icon name={menuOpen ? 'close' : 'menu'}/></button></div>
    <div class="reading-progress" aria-hidden="true"></div>
  </header>
  <dialog use:modalFocus class="menu-panel" id="mobile-menu" bind:this={menuDialog} aria-label={lang === 'tr' ? 'Ana menü' : 'Main navigation'} onclose={() => menuOpen = false}>
      <div class="menu-panel-top"><span class="eyebrow">SELF CONTROL / {siteName(site, lang)}</span><button class="menu-close" aria-label={t.close} onclick={() => menuOpen = false}><Icon name="close"/></button></div>
      <nav aria-label={t.menu}>{#each [...nav, 'start'] as id, i}<a href={anchor(id)} onclick={() => menuOpen = false}><span>0{i + 1}</span>{id === 'membership' ? ux.plans : id === 'training' && site !== 'academy' ? ux.training : e.nav[id as keyof typeof e.nav]}<Icon name="diagonal"/></a>{/each}</nav>
      {#if site !== 'academy'}<a class="quiet-link" href={siteHref('academy', lang, preview)}>{t.academyLink}<Icon name="diagonal"/></a>{/if}
      <button class="text-button" onclick={() => { menuOpen = false; installDialog.showModal(); }}><Icon name="phone"/>{t.install}</button>
  </dialog>
  {#if offline}<div class="offline-banner" role="status">{t.offline}</div>{/if}
  <main id="main" tabindex="-1" inert={menuOpen}>{@render children()}</main>
  <footer class="site-footer" inert={menuOpen}>
    <div class="footer-statement"><img src="/brand/mark.svg" width="90" height="66" alt=""/><div><p>{e.footer}</p><span>{e.footerSub}</span></div><a href="#top" class="back-top" aria-label={t.nav.home}><Icon name="diagonal" size={25}/></a></div>
    <div class="footer-grid"><div><h3>{t.exploreLabel}</h3>{#each nav as id}<a href={anchor(id)}>{id === 'membership' ? ux.plans : id === 'training' && site !== 'academy' ? ux.training : e.nav[id]}</a>{/each}</div><div><h3>{t.identities}</h3>{#each siteOrder as id}<a href={siteHref(id as SiteId, lang, preview)} aria-current={site === id ? 'page' : undefined}>{siteName(id as SiteId, lang)}<Icon name="diagonal" size={14}/></a>{/each}</div><div class="footer-note">{#if page !== 'coach'}<p>{e.photoNote}</p>{/if}<button class="install-link" onclick={() => installDialog.showModal()}><Icon name="phone" size={17}/>{t.install}<Icon name="plus" size={14}/></button></div></div>
    <div class="footer-bottom"><span>© 2026 Self Control Fight Academy</span><button onclick={() => privacyDialog.showModal()}>{t.nav.privacy}</button><span>DENİZLİ / {identity.number}</span></div>
  </footer>
  <div class="mobile-dock" inert={menuOpen}>
    {#if experience.inMembership && page !== 'coach' && offer && (site !== 'academy' || experience.explicit) && ['ready','stale'].includes(content.phase)}
      <div class="selection-dock" aria-label={ux.selected}>
        <button class="dock-menu" aria-label={ux.menu} onclick={() => menuOpen = true}><Icon name="menu"/></button>
        <a href="#membership" class="dock-selection"><span>{packageLabel(experience.selection, lang, catalog)}</span><strong>{formatMoney(offer.price, lang, catalog.currency)} <small>/ {lang === 'tr' ? 'kişi' : 'person'}</small>{#if catalog.status === 'sample'}<span class="dock-sample">{home.sample}</span>{/if}</strong></a>
        <button class="dock-enquire" onclick={() => experience.enquiryOpen = true}>{ux.ask}<Icon name="diagonal" size={18}/></button>
      </div>
    {:else}
      <nav class="mobile-bottom" aria-label={lang === 'tr' ? 'Hızlı erişim' : 'Quick navigation'}>{#each quick as item}<a href={anchor(item.id)} class:active={active === item.id} aria-current={active === item.id ? 'location' : undefined}><Icon name={item.icon}/><span>{item.id === 'membership' ? ux.plans : item.id === 'start' ? ux.contact : item.id === 'training' ? ux.training : e.nav.schedule}</span></a>{/each}</nav>
    {/if}
  </div>
  <PackageEnquiry {lang}/>

  <dialog use:modalFocus class="install-dialog" bind:this={installDialog} onclick={(event) => { if (event.target === installDialog) installDialog.close(); }} onkeydown={(event) => { if (event.key === 'Escape') installDialog.close(); }} aria-labelledby="install-title"><div class="dialog-inner"><button class="dialog-close" aria-label={t.close} onclick={() => installDialog.close()}><Icon name="close"/></button><img src="/brand/mark.svg" width="65" height="48" alt=""/><h2 id="install-title">{t.installTitle}</h2><p>{t.installBody}</p>{#if installed}<p class="install-ready"><Icon name="check"/>{t.installed}</p>{:else}{#if installEvent}<button class="button solid wide" onclick={install}>{t.installNative}<Icon name="download"/></button>{/if}<div class="install-instructions"><h3>{t.ios}</h3><p>{t.iosInstructions}</p><h3>{t.android}</h3><p>{t.androidInstructions}</p></div>{/if}</div></dialog>
  <dialog use:modalFocus class="privacy-dialog" bind:this={privacyDialog} onclick={(event) => { if (event.target === privacyDialog) privacyDialog.close(); }} onkeydown={(event) => { if (event.key === 'Escape') privacyDialog.close(); }} aria-labelledby="privacy-title"><div class="dialog-inner"><button class="dialog-close" aria-label={t.close} onclick={() => privacyDialog.close()}><Icon name="close"/></button><span class="eyebrow">SELF CONTROL</span><h2 id="privacy-title">{t.privacyTitle}</h2><p>{t.privacyBody}</p><p class="muted">{t.privacyPending}</p></div></dialog>
</div>

<style>
  .dock-sample { padding: 2px 5px; border: 1px solid var(--line); color: var(--fg); font: 500 10px/1.2 Poppins,Arial,sans-serif; }
</style>
