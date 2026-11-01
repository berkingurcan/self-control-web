<script lang="ts">
  import { getContext } from 'svelte';
  import { contentKey, type ContentState } from '#lib/content-schema.ts';
  import { config as env } from '#lib/config.ts';
  import { siteName, copy, href, siteHref, sites, type SiteId, type Lang } from '#lib/site.ts';
  import { experienceCopy } from '#lib/experience-copy.ts';
  import { editorial } from '#lib/editorial.ts';
  import { reveal, tilt, swipe, modalFocus } from '#lib/effects.ts';
  import Photo from './Photo.svelte';
  import Icon from './Icon.svelte';
  import AcademyHero from './AcademyHero.svelte';
  import TrainingSchedule from './TrainingSchedule.svelte';
  import { coaches, demoCopy, type CoachId } from '#lib/demo.ts';
  let { site, lang }: { site: SiteId; lang: Lang } = $props();
  const t = $derived(copy[lang]), e = $derived(editorial[lang]), identity = $derived(sites[site]);
  const content = getContext<ContentState>(contentKey);
  const ux = $derived(experienceCopy[lang]);
  const academy = $derived(site === 'academy');
  const discipline = $derived(site === 'academy' ? 'mma' : site as Exclude<SiteId, 'academy'>);
  const preview = env.PUBLIC_ENABLE_PREVIEWS === 'true';
  const headProfile = $derived(href('coach', lang, preview ? `/preview/${site}` : ''));
  const ids = ['muaythai', 'kickbox', 'mma'] as const;
  let galleryIndex = $state(0), selectedCoach = $state<CoachId>('head');
  let galleryDialog: HTMLDialogElement, coachDialog: HTMLDialogElement;
  const gallery = ['gym', 'ring', 'coach'];
  const coach = $derived(coaches[selectedCoach]), d = $derived(demoCopy[lang]);
  const email = env.PUBLIC_CONTACT_EMAIL || '', address = env.PUBLIC_ADDRESS || '', instagram = env.PUBLIC_INSTAGRAM || '';
  const whatsapp = (env.PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  function sectionLabel(label: string) { return academy ? label : label.replace(/^0([3-6])/, (_, number) => `0${Number(number) - 1}`); }
  function openGallery(index: number) { galleryIndex = index; galleryDialog.showModal(); }
  function showCoach(id: CoachId) { selectedCoach = id; coachDialog.showModal(); }
  function changePhoto(step: number) { galleryIndex = (galleryIndex + step + gallery.length) % gallery.length; }
</script>

<section id="top" class:academy-hero={academy} class:discipline-hero={!academy} class="landing-hero">
  {#if academy}
    <AcademyHero {lang} {preview}/>
  {:else}
    <div class="discipline-hero-image"><Photo name={identity.image} alt={t.home[site].image} eager position={identity.position}/></div><div class="discipline-hero-shade"></div>
    <div class="discipline-hero-top"><span class="eyebrow">SELF CONTROL / {identity.number}</span><a href={siteHref('academy', lang, preview)} class="eyebrow">{e.website}<Icon name="diagonal" size={15}/></a></div>
    <div class="discipline-hero-content"><span class="eyebrow hero-kicker"><i></i>{e.disciplineStatements[discipline]}</span><h1 lang={lang}>{#if site === 'muaythai'}<span>MUAY</span><span>THAI</span>{:else if site === 'kickbox'}<span>KICK</span><span>{lang === 'tr' ? 'BOKS' : 'BOXING'}</span>{:else}<span>MMA</span>{/if}</h1><p>{t.home[site].sub}</p><div class="hero-actions"><a class="button solid" href="#schedule">{ux.schedule}<Icon name="diagonal"/></a><a class="underlined-link" href="#membership">{ux.memberships}<Icon name="arrow" size={18}/></a></div></div>
    <div class="discipline-hero-seal"><img src="/brand/mark.svg" width="110" height="80" alt=""/><span>{siteName(site, lang)}<br/>{e.teamSignature}</span></div>
    <div class="hero-baseline"><span>{t.home[site].tag}</span><a href="#training">{e.down}<span>↓</span></a><span>{identity.number} / 03</span></div>
  {/if}
</section>

<section id="training" class="section training-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{academy ? e.disciplineLabel : e.techniqueLabel}</span><span class="eyebrow">SELF CONTROL / {e.trainingMarker}</span></div>
  <div class="section-heading"><h2 class="display">{academy ? e.disciplineTitle : e.techniqueTitle}</h2><p>{academy ? e.disciplineBody : e.techniqueBody}</p></div>
  {#if academy}
    <div class="discipline-grid">{#each ids as id}<a class="discipline-card" style={`--card-accent:${sites[id].accent}`} href={siteHref(id, lang, preview)} use:tilt><div class="discipline-photo"><Photo name={sites[id].image} alt={t.home[id].image} position={sites[id].position}/><div class="card-shade"></div><span class="card-index">0{ids.indexOf(id) + 1} / SELF CONTROL</span><div class="discipline-card-title"><h3 lang={id === 'muaythai' ? 'en' : lang}>{#if id === 'kickbox' && lang === 'en'}Kick<br/>boxing{:else}{siteName(id, lang)}{/if}</h3><span class="circle-arrow"><Icon name="diagonal"/></span></div></div><div class="discipline-card-copy"><p>{t.discipline[id].short}</p><span>{e.enter}<Icon name="diagonal" size={16}/></span></div></a>{/each}</div>
  {:else}
    <div class="technique-grid"><div class="technique-photo"><Photo name={identity.image} alt={t.home[site].image} position={identity.position}/><span class="image-label">SELF CONTROL / {identity.label}</span></div><div class="technique-copy"><h3>{t.discipline[discipline].short}</h3><p>{t.discipline[discipline].description}</p><ol>{#each t.discipline[discipline].focus as point, index}<li><span>0{index + 1}</span><p>{point}</p><Icon name="plus" size={17}/></li>{/each}</ol><div class="tag-row">{#each t.discipline[discipline].tags as tag}<span>{tag}</span>{/each}</div></div></div>
  {/if}
</section>

{#if academy}
<section id="academy" class="section approach-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{e.approachLabel}</span><img src="/brand/mark.svg" width="34" height="25" alt=""/></div>
  <div class="approach-grid"><h2 class="display">{e.approachTitle}</h2><div class="approach-copy"><p class="large-body">{e.approachBody}</p><p>{t.introBody}</p><div class="values-list">{#each t.values as value, i}<details open={i === 0}><summary><span>0{i + 1}</span>{value.title}<Icon name="plus" size={18}/></summary><p>{value.body}</p></details>{/each}</div></div></div>
  <div class="type-ribbon" aria-hidden="true"><span>{e.ribbon}</span><span>↗</span></div>
</section>
{/if}

<section id="space" class="section space-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{sectionLabel(e.spaceLabel)}</span><span class="eyebrow">03 / {e.imageCount}</span></div>
  <div class="section-heading"><h2 class="display">{e.spaceTitle}</h2><p>{e.spaceBody}</p></div>
  <div class="gallery-grid" aria-label={e.gallery}>{#each gallery as image, i}<button class="gallery-item gallery-item-{i}" onclick={() => openGallery(i)} aria-label={`${e.openPhoto}: ${e.spaceCaption[i]}`}><Photo name={image} alt={e.spaceCaption[i]}/><span class="gallery-caption"><span><small>0{i + 1} / {e.stock}</small>{e.spaceCaption[i]}</span><span class="circle-arrow"><Icon name="plus"/></span></span></button>{/each}</div>
  <p class="photo-note">{e.stockNote}</p>
</section>

<section id="trainers" class="trainers-section">
  <div class="head-trainer" use:reveal><a class="head-photo head-profile-link" href={headProfile} aria-label={`${coaches.head.title[lang]} — ${e.details}`}><Photo name={coaches.head.image} alt={`${coaches.head.title[lang]} / ${e.trainerNote}`} position={coaches.head.position}/><span class="head-photo-index" aria-hidden="true">SC / 01</span><span class="image-label">{d.coachDemo} / {e.stock}</span><span class="head-profile-arrow"><Icon name="diagonal"/></span></a><div class="head-copy"><span class="eyebrow">{sectionLabel(e.headLabel)}</span><h2 class="display">{e.headTitle}</h2><div class="coach-name"><span>{d.coachDemo} / SELF CONTROL</span><h3><a href={headProfile}>{coaches.head.title[lang]}</a></h3></div><p>{coaches.head.body[lang]}</p><div class="tag-row coach-tags">{#each coaches.head.tags[lang] as tag}<span>{tag}</span>{/each}</div><div class="head-actions"><a class="underlined-link" href={headProfile}>{e.details}<Icon name="diagonal"/></a><a class="quiet-link" href="#team">{e.allTeam}<span aria-hidden="true">↓</span></a></div></div></div>
  <div id="team" class="section team-section" use:reveal><div class="section-top"><span class="eyebrow">{e.teamLabel}</span><span class="eyebrow">SELF CONTROL / {e.teamMarker}</span></div><div class="section-heading"><h2 class="display">{e.teamTitle}</h2><p>{e.teamBody}</p></div><div class="team-grid">{#each ids as id, index}<button class="trainer-card" style={`--coach-accent:${sites[id].accent}`} onclick={() => showCoach(id)} aria-label={`${e.profile}: ${siteName(id, lang)}`}><div class="trainer-photo"><Photo name={coaches[id].image} alt={`${coaches[id].title[lang]} / ${e.trainerNote}`} position={coaches[id].position}/><span class="trainer-stock">{d.coachDemo}</span><span class="trainer-number" aria-hidden="true">0{index + 2}</span><span class="circle-arrow"><Icon name="diagonal"/></span></div><div class="trainer-card-copy"><span class="eyebrow" lang={id === 'muaythai' ? 'en' : lang}>SELF CONTROL / {siteName(id, lang)}</span><h3 lang={id === 'muaythai' ? 'en' : lang}>{coaches[id].title[lang]}</h3><p>{coaches[id].subtitle[lang]}</p><span class="trainer-profile-link">{e.details}<Icon name="diagonal" size={14}/></span></div></button>{/each}</div><p class="photo-note team-demo-note">{d.coachNote}</p></div>
</section>

<TrainingSchedule {site} {lang} label={sectionLabel(e.scheduleLabel)}/>

<section id="first-session" class="section first-session" use:reveal>
  <div class="first-intro"><span class="eyebrow">{ux.firstLabel}</span><h2 class="display">{ux.firstTitle}</h2><p>{ux.firstBody}</p><a class="underlined-link" href="#start">{ux.firstCta}<Icon name="diagonal" size={20}/></a></div>
  <ol class="first-steps">{#each ux.firstSteps as step, i}<li><span class="first-step-number">0{i + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div><Icon name={i === 0 ? 'training' : i === 1 ? 'calendar' : 'check'} size={22}/></li>{/each}</ol>
</section>

<section class="section faq-section" use:reveal><div class="faq-grid"><div><span class="eyebrow">{e.faqLabel}</span><h2 class="display">{t.faqTitle}</h2></div><div>{#each t.faqs as faq, faqIndex}<details><summary>{faq.q}<Icon name="plus" size={18}/></summary><p>{faqIndex === 3 && content.data.catalog.status === 'published' ? lang === 'tr' ? 'Program bölümünden haftalık ders saatlerine, Üyelik bölümünden grup ve özel ders paketlerine ulaşabilirsiniz. Güncel bilgileri katılmadan önce akademiden teyit edin.' : 'The Timetable section lists weekly classes, and Memberships covers group and private lesson packages. Confirm current details with the academy before attending.' : faq.a}</p></details>{/each}</div></div></section>

<section id="start" class="section start-section contact-only" use:reveal><div class="start-intro"><div class="contact-heading"><span class="eyebrow">{sectionLabel(e.contactLabel)}</span><h2 class="display">{e.contactTitle}</h2><p class="large-body">{e.contactBody}</p></div><div class="contact-list"><div><Icon name="pin"/><div><span>{t.address}</span>{#if address}<a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}>{address}<Icon name="diagonal" size={16}/></a>{:else}<p>{t.addressPending}</p>{/if}</div></div><div><Icon name="mail"/><div><span>{t.contact}</span>{#if email}<a href={`mailto:${email}`}>{email}</a>{/if}{#if whatsapp}<a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp<Icon name="diagonal" size={16}/></a>{/if}{#if !email && !whatsapp}<p>{t.contactPending}</p>{/if}</div></div><div><Icon name="globe"/><div><span>Instagram</span>{#if instagram}<a href={`https://www.instagram.com/${instagram.replace(/^@/, '')}/`} target="_blank" rel="noopener noreferrer">@{instagram.replace(/^@/, '')}<Icon name="diagonal" size={16}/></a>{:else}<p>{t.instagramPending}</p>{/if}</div></div></div></div></section>

<dialog use:modalFocus class="gallery-dialog" use:swipe={changePhoto} bind:this={galleryDialog} aria-label={e.gallery} onclick={(event) => { if (event.target === galleryDialog) galleryDialog.close(); }} onkeydown={(event) => { if (event.key === 'ArrowRight') changePhoto(1); if (event.key === 'ArrowLeft') changePhoto(-1); }}><div class="gallery-dialog-top"><span class="eyebrow">SELF CONTROL / {e.stock}</span><button aria-label={e.close} class="dialog-close" onclick={() => galleryDialog.close()}><Icon name="close"/></button></div><Photo name={gallery[galleryIndex]} alt={e.spaceCaption[galleryIndex]} eager/><div class="gallery-dialog-bottom"><button aria-label={e.previous} onclick={() => changePhoto(-1)}><span>←</span></button><span>0{galleryIndex + 1} / 03 — {e.spaceCaption[galleryIndex]}</span><button aria-label={e.next} onclick={() => changePhoto(1)}><span>→</span></button></div><p class="photo-note">{e.stockNote}</p></dialog>
<dialog use:modalFocus class="coach-dialog" bind:this={coachDialog} aria-labelledby="coach-title" onclick={(event) => { if (event.target === coachDialog) coachDialog.close(); }} onkeydown={(event) => { if (event.key === 'Escape') coachDialog.close(); }}><button aria-label={e.close} class="dialog-close" onclick={() => coachDialog.close()}><Icon name="close"/></button><div class="coach-dialog-photo"><Photo name={coach.image} alt={e.trainerNote} position={coach.position}/><span class="image-label">{d.coachDemo} / {e.stock}</span></div><div class="dialog-inner"><span class="eyebrow">SELF CONTROL / {d.coachDemo}</span><h2 id="coach-title">{coach.title[lang]}</h2><p>{coach.body[lang]}</p><div class="tag-row"><span class="sr-only">{d.focus}</span>{#each coach.tags[lang] as tag}<span>{tag}</span>{/each}</div><p class="coach-disclaimer">{d.coachNote}</p><a class="underlined-link" href="#start" onclick={() => coachDialog.close()}>{e.coachContact}<Icon name="diagonal"/></a></div></dialog>
