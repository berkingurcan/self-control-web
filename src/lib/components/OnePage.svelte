<script lang="ts">
  import { academyHomeCopy } from '#lib/academy-home-copy.ts';
  import { disciplineOrder } from '#lib/discipline-order.ts';
  import { getContext } from 'svelte';
  import { contactKey, type ContactConfig } from '#lib/contact-config.ts';
  import { config as env } from '#lib/config.ts';
  import { siteName, copy, href, siteHref, sites, type SiteId, type Lang } from '#lib/site.ts';
  import { experienceCopy } from '#lib/experience-copy.ts';
  import { editorial } from '#lib/editorial.ts';
  import { reveal, tilt } from '#lib/effects.ts';
  import Photo from './Photo.svelte';
  import Facilities from './Facilities.svelte';
  import Icon from './Icon.svelte';
  import AcademyFirstSession from './AcademyFirstSession.svelte';
  import AcademyHero from './AcademyHero.svelte';
  import DisciplineHero from './DisciplineHero.svelte';
  import DisciplineTraining from './DisciplineTraining.svelte';
  import TrainingSchedule from './TrainingSchedule.svelte';
  import { headTrainerAcademyPhoto, headTrainerCopy, headTrainerName } from '#lib/head-trainer.ts';
  let { site, lang }: { site: SiteId; lang: Lang } = $props();
  const t = $derived(copy[lang]), e = $derived(editorial[lang]);
  const contact = getContext<ContactConfig>(contactKey);
  const home = $derived(academyHomeCopy[lang]);
  const ux = $derived(experienceCopy[lang]);
  const coach = $derived(headTrainerCopy[lang]);
  const academy = $derived(site === 'academy');
  const preview = env.PUBLIC_ENABLE_PREVIEWS === 'true';
  const headProfile = $derived(href('coach', lang, preview ? `/preview/${site}` : ''));
  const ids = disciplineOrder;
  const email = $derived(contact.PUBLIC_CONTACT_EMAIL);
  const address = $derived(contact.PUBLIC_ADDRESS);
  const instagram = $derived(contact.PUBLIC_INSTAGRAM);
  const whatsapp = $derived(contact.PUBLIC_WHATSAPP.replace(/\D/g, ''));
  function sectionLabel(label: string, academyNumber: string) { return academy ? label.replace(/^\d{2}/, academyNumber) : label.replace(/^0([3-6])/, (_, number) => `0${Number(number) - (Number(number) >= 5 ? 2 : 1)}`); }
</script>

<section id="top" class:academy-hero={academy} class:branch-hero={!academy} class="landing-hero">
  {#if academy}
    <AcademyHero {lang}/>
  {:else}
    <DisciplineHero site={site as Exclude<SiteId, 'academy'>} {lang} {preview}/>
  {/if}
</section>

{#if academy}
<section id="training" class="section training-section academy-training" use:reveal>
  <div class="section-top"><span class="eyebrow">{e.disciplineLabel}</span><span class="eyebrow">SELF CONTROL / {e.trainingMarker}</span></div>
  <div class="section-heading"><h2 class="display">{e.disciplineTitle}</h2><p>{home.disciplineIntro}</p></div>
  <div class="discipline-grid">
    {#each ids as id}
      <a class="discipline-card" style={`--card-accent:${sites[id].accent}`} href={siteHref(id, lang, preview)} use:tilt aria-labelledby={`discipline-${id}`} aria-describedby={`discipline-desc-${id}`}>
        <div class="discipline-photo">
          <Photo name={sites[id].image} height={sites[id].imageHeight} alt="" position={sites[id].position} sizes="(max-width: 700px) 32vw, 30vw"/>
          <div class="card-shade"></div>
        </div>
        <div class="discipline-card-copy">
          <div><h3 id={`discipline-${id}`}>{siteName(id, lang)}</h3><p id={`discipline-desc-${id}`}>{home.disciplines[id]}</p></div>
          <span class="discipline-arrow"><Icon name="diagonal" size={20}/></span>
        </div>
      </a>
    {/each}
  </div>
</section>
{:else}
  <DisciplineTraining site={site as Exclude<SiteId, 'academy'>} {lang}/>
{/if}

{#if academy}
  <AcademyFirstSession {lang} {headProfile}/>
  <TrainingSchedule {site} {lang} label={sectionLabel(e.scheduleLabel, '03')}/>
{/if}

{#if academy}
<section id="academy" class="section approach-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{sectionLabel(e.approachLabel, '04')}</span><img src="/brand/mark.svg" width="34" height="25" alt=""/></div>
  <div class="approach-grid">
    <h2 class="display">{e.approachTitle}</h2>
    <div class="approach-copy">
      <p class="large-body">{coach.academy[0]}</p>
      {#each coach.academy.slice(1) as paragraph}<p>{paragraph}</p>{/each}
      <h3 class="academy-camps-title">{e.campsTitle}</h3>
      {#each coach.camps as paragraph}<p>{paragraph}</p>{/each}
      <p>{t.introBody}</p>
      <div class="values-list">{#each t.values as value, i}<details open={i === 0}><summary><span>0{i + 1}</span>{value.title}<Icon name="plus" size={18}/></summary><p>{value.body}</p></details>{/each}</div>
    </div>
  </div>
</section>
{/if}

<Facilities {lang} label={sectionLabel(e.spaceLabel, '05')}/>

{#if academy}
<section id="trainers" class="trainers-section">
  <div class="head-trainer" use:reveal>
    <a class="head-photo head-profile-link" href={headProfile} aria-label={`${headTrainerName} — ${e.details}`}>
      <Photo name={headTrainerAcademyPhoto} alt={coach.academyPhotoAlt} position="50% 72%" sizes="(max-width: 700px) 100vw, 50vw"/>
      <span class="head-photo-index" aria-hidden="true">SC / 01</span>
      <span class="image-label">{headTrainerName} / {coach.profileMarker}</span>
      <span class="head-profile-arrow"><Icon name="diagonal"/></span>
    </a>
    <div class="head-copy">
      <span class="eyebrow">{sectionLabel(e.headLabel, '06')}</span>
      <h2 class="display"><a href={headProfile}>{headTrainerName}</a></h2>
      <p>{coach.academyProfile}</p>
      <p>{coach.athletes[1]}</p>
      <ul class="tag-row coach-tags">{#each coach.credentials as credential}<li>{credential}</li>{/each}</ul>
      <div class="head-actions"><a class="underlined-link" href={headProfile}>{e.details}<Icon name="diagonal"/></a></div>
    </div>
  </div>
</section>
{/if}

{#if !academy}
<TrainingSchedule {site} {lang} label={sectionLabel(e.scheduleLabel, '03')}/>

<section id="first-session" class="section first-session" use:reveal>
  <div class="first-intro"><span class="eyebrow">{ux.firstLabel}</span><h2 class="display">{ux.firstTitle}</h2><p>{ux.firstBody}</p><a class="underlined-link" href="#start">{ux.firstCta}<Icon name="diagonal" size={20}/></a></div>
  <ol class="first-steps">{#each ux.firstSteps as step, i}<li><span class="first-step-number">0{i + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div><Icon name={i === 0 ? 'training' : i === 1 ? 'calendar' : 'check'} size={22}/></li>{/each}</ol>
</section>
{/if}

<section id="start" class="section start-section contact-only" use:reveal>
  <div class="start-intro">
    <div class="contact-heading"><span class="eyebrow">{sectionLabel(e.contactLabel, '07')}</span><h2 class="display">{e.contactTitle}</h2><p class="large-body">{e.contactBody}</p></div>
    <div class="contact-list">
      {#if whatsapp}
        <div><Icon name="chat"/><div><span>WhatsApp</span><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">{lang === 'tr' ? 'WhatsApp’tan yazın' : 'Message us on WhatsApp'}<Icon name="diagonal" size={16}/></a></div></div>
        <div><Icon name="call"/><div><span>{lang === 'tr' ? 'Telefon' : 'Phone'}</span><a href={`tel:+${whatsapp}`}>{whatsapp === '905348589765' ? '+90 534 858 97 65' : `+${whatsapp}`}</a></div></div>
      {/if}
      {#if email}<div><Icon name="mail"/><div><span>{lang === 'tr' ? 'E-posta' : 'Email'}</span><a href={`mailto:${email}`}>{email}</a></div></div>{/if}
      {#if address}<div><Icon name="pin"/><div><span>{t.address}</span><a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}>{address}<Icon name="diagonal" size={16}/></a></div></div>{/if}
      {#if instagram}<div><Icon name="globe"/><div><span>Instagram</span><a href={`https://www.instagram.com/${instagram.replace(/^@/, '')}/`} target="_blank" rel="noopener noreferrer">@{instagram.replace(/^@/, '')}<Icon name="diagonal" size={16}/></a></div></div>{/if}
      {#if !whatsapp && !email && !address && !instagram}<p>{t.contactPending}</p>{/if}
    </div>
  </div>
</section>

<style>
  .academy-training { padding-block: clamp(48px,6vw,90px); }
  .academy-training .section-top > :last-child { text-align: right; }
  .academy-training .discipline-card { display: grid; grid-template-rows: auto 1fr; border: 1px solid var(--line); }
  .academy-training .discipline-photo { height: auto; aspect-ratio: 4 / 3; }
  .academy-training .card-shade { background: linear-gradient(0deg,#08080820,transparent 45%); }
  .academy-training .discipline-card-copy {
    display: grid;
    grid-template-columns: minmax(0,1fr) auto;
    align-items: center;
    gap: 12px;
    padding: clamp(14px,2vw,26px);
  }
  .discipline-card-copy h3 { font: 800 clamp(28px,3.3vw,53px)/1 Barlow,Impact,sans-serif; }
  .discipline-card-copy div p { margin-top: 7px; color: var(--muted); font-size: 14px; line-height: 1.55; }
  .academy-training .discipline-arrow {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    margin: 0;
    border: 1px solid var(--line);
    color: var(--fg);
  }
  .discipline-card:hover .discipline-arrow { background: var(--fg); color: var(--bg); }
  @media (max-width: 700px) {
    .academy-training .discipline-grid { gap: 10px; }
    .academy-training .discipline-card { grid-template: 1fr / minmax(82px,30%) minmax(0,1fr); min-height: 105px; }
    .academy-training .discipline-photo { aspect-ratio: auto; }
    .academy-training .discipline-card-copy { gap: 7px; }
    .discipline-card-copy div p { margin-top: 5px; font-size: 12px; }
    .academy-training .discipline-arrow { width: 30px; height: 30px; }
    .academy-training .section-top > :last-child { display: none; }
  }
  .academy-camps-title{margin-top:28px;font-size:18px}
  .academy-camps-title+p{margin-top:12px;font-size:13px;color:var(--muted)}
  .head-copy h2{font-size:clamp(44px,5.8vw,90px);overflow-wrap:anywhere}
  .coach-tags{list-style:none;margin:0;padding:0}
  .coach-tags li{padding:8px 10px;border:1px solid #c7c7c1;font-size:11px;line-height:1.4}
</style>
