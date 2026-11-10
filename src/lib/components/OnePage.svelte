<script lang="ts">
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
  import AcademyHero from './AcademyHero.svelte';
  import DisciplineHero from './DisciplineHero.svelte';
  import DisciplineTraining from './DisciplineTraining.svelte';
  import TrainingSchedule from './TrainingSchedule.svelte';
  import { headTrainerAcademyPhoto, headTrainerCopy, headTrainerName } from '#lib/head-trainer.ts';
  let { site, lang }: { site: SiteId; lang: Lang } = $props();
  const t = $derived(copy[lang]), e = $derived(editorial[lang]);
  const contact = getContext<ContactConfig>(contactKey);
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
  function sectionLabel(label: string) { return academy ? label : label.replace(/^0([3-6])/, (_, number) => `0${Number(number) - (Number(number) >= 5 ? 2 : 1)}`); }
</script>

<section id="top" class:academy-hero={academy} class:branch-hero={!academy} class="landing-hero">
  {#if academy}
    <AcademyHero {lang} {preview}/>
  {:else}
    <DisciplineHero site={site as Exclude<SiteId, 'academy'>} {lang} {preview}/>
  {/if}
</section>

{#if academy}
<section id="training" class="section training-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{e.disciplineLabel}</span><span class="eyebrow">SELF CONTROL / {e.trainingMarker}</span></div>
  <div class="section-heading"><h2 class="display">{e.disciplineTitle}</h2><p>{e.disciplineBody}</p></div>
    <div class="discipline-grid">{#each ids as id}<a class="discipline-card" style={`--card-accent:${sites[id].accent}`} href={siteHref(id, lang, preview)} use:tilt><div class="discipline-photo"><Photo name={sites[id].image} height={sites[id].imageHeight} alt={t.home[id].image} position={sites[id].position} sizes="(max-width: 700px) 100vw, 30vw"/><div class="card-shade"></div><span class="card-index">0{ids.indexOf(id) + 1} / SELF CONTROL</span><div class="discipline-card-title"><h3 lang={id === 'muaythai' ? 'en' : lang}>{#if id === 'kickbox' && lang === 'en'}Kick<br/>boxing{:else}{siteName(id, lang)}{/if}</h3><span class="circle-arrow"><Icon name="diagonal"/></span></div></div><div class="discipline-card-copy"><p>{t.discipline[id].short}</p><span>{e.enter}<Icon name="diagonal" size={16}/></span></div></a>{/each}</div>

</section>
{:else}
  <DisciplineTraining site={site as Exclude<SiteId, 'academy'>} {lang}/>
{/if}

{#if academy}
<section id="academy" class="section approach-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{e.approachLabel}</span><img src="/brand/mark.svg" width="34" height="25" alt=""/></div>
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

<Facilities {lang} label={sectionLabel(e.spaceLabel)}/>

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
      <span class="eyebrow">{sectionLabel(e.headLabel)}</span>
      <h2 class="display"><a href={headProfile}>{headTrainerName}</a></h2>
      <p>{coach.academyProfile}</p>
      <p>{coach.athletes[1]}</p>
      <ul class="tag-row coach-tags">{#each coach.credentials as credential}<li>{credential}</li>{/each}</ul>
      <div class="head-actions"><a class="underlined-link" href={headProfile}>{e.details}<Icon name="diagonal"/></a></div>
    </div>
  </div>
</section>
{/if}

<TrainingSchedule {site} {lang} label={sectionLabel(e.scheduleLabel)}/>

<section id="first-session" class="section first-session" use:reveal>
  <div class="first-intro"><span class="eyebrow">{ux.firstLabel}</span><h2 class="display">{ux.firstTitle}</h2><p>{ux.firstBody}</p><a class="underlined-link" href="#start">{ux.firstCta}<Icon name="diagonal" size={20}/></a></div>
  <ol class="first-steps">{#each ux.firstSteps as step, i}<li><span class="first-step-number">0{i + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div><Icon name={i === 0 ? 'training' : i === 1 ? 'calendar' : 'check'} size={22}/></li>{/each}</ol>
</section>



<section id="start" class="section start-section contact-only" use:reveal>
  <div class="start-intro">
    <div class="contact-heading"><span class="eyebrow">{sectionLabel(e.contactLabel)}</span><h2 class="display">{e.contactTitle}</h2><p class="large-body">{e.contactBody}</p></div>
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
  .academy-camps-title{margin-top:28px;font-size:18px}
  .academy-camps-title+p{margin-top:12px;font-size:13px;color:var(--muted)}
  .head-copy h2{font-size:clamp(44px,5.8vw,90px);overflow-wrap:anywhere}
  .coach-tags{list-style:none;margin:0;padding:0}
  .coach-tags li{padding:8px 10px;border:1px solid #c7c7c1;font-size:11px;line-height:1.4}
</style>
