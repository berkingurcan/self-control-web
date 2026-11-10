<script lang="ts">
  import { getContext } from 'svelte';
  import { academyHomeCopy } from '#lib/academy-home-copy.ts';
  import { contactKey, type ContactConfig } from '#lib/contact-config.ts';
  import { experienceCopy } from '#lib/experience-copy.ts';
  import { headTrainerAcademyPhoto, headTrainerName } from '#lib/head-trainer.ts';
  import { whatsappHref } from '#lib/selection.ts';
  import type { Lang } from '#lib/site.ts';
  import Icon from './Icon.svelte';
  import Photo from './Photo.svelte';

  let { lang, headProfile }: { lang: Lang; headProfile: string } = $props();
  const contact = getContext<ContactConfig>(contactKey);
  const text = $derived(academyHomeCopy[lang]);
  const ux = $derived(experienceCopy[lang]);
  const whatsapp = $derived(whatsappHref(contact.PUBLIC_WHATSAPP, text.message));
  const steps = $derived(lang === 'tr' ? [
    { title: 'Size uygun grubu bulun', body: 'Hedefinizi ve deneyiminizi paylaşın.' },
    { title: 'Ders saatinizi teyit edin', body: 'Programdan bir gün seçin; saati ve kontenjanı gelmeden önce sorun.' },
    { title: 'Çantanızı hazırlayın', body: 'Spor kıyafeti ve su getirin. Eldiven ve bandaj gereksinimini önceden sorun.' }
  ] : [
    { title: 'Find the right group', body: 'Share your goals and experience.' },
    { title: 'Confirm a class time', body: 'Pick a day from the timetable and check the time and availability before you visit.' },
    { title: 'Pack for training', body: 'Bring sportswear and water. Ask ahead about gloves and wraps.' }
  ]);
</script>

<section id="first-session" class="section academy-first" aria-labelledby="academy-first-title">
  <div class="guide-panel">
    <div class="guide-intro">
      <p class="eyebrow">{text.guideLabel}</p>
      <h2 class="display" id="academy-first-title">{text.guideTitle}</h2>
      <p>{text.guideBody}</p>
      <a class="guide-action" href={whatsapp ?? '#start'} target={whatsapp ? '_blank' : undefined} rel={whatsapp ? 'noopener noreferrer' : undefined}>
        {whatsapp ? text.messageCta : ux.firstCta}<Icon name={whatsapp ? 'diagonal' : 'arrow-down'} size={19}/>
      </a>
    </div>
    <ol class="guide-steps">
      {#each steps as step, i}
        <li>
          <span class="step-index" aria-hidden="true">0{i + 1}</span>
          <div><h3>{step.title}</h3><p>{step.body}</p></div>
        </li>
      {/each}
    </ol>
  </div>
  <div class="guide-proof">
    <a class="proof-link" href={headProfile}>
      <span class="proof-image"><Photo name={headTrainerAcademyPhoto} alt="" position="50% 67%" sizes="(max-width: 420px) 90px, 140px"/></span>
      <span class="proof-copy"><span>{text.coachLabel}</span><strong>{headTrainerName}</strong></span>
      <Icon name="diagonal" size={19}/>
    </a>
    <a class="proof-link" href="#space">
      <span class="proof-image"><Photo name="salon/main-floor" alt="" sizes="(max-width: 420px) 90px, 140px"/></span>
      <span class="proof-copy"><span>{text.gymLabel}</span><strong>{text.gymTitle}</strong></span>
      <Icon name="arrow-down" size={19}/>
    </a>
  </div>
</section>

<style>
  .academy-first { padding-block: 0 clamp(48px,7vw,96px); }
  .guide-panel {
    display: grid;
    grid-template-columns: minmax(0,1fr) minmax(0,1fr);
    align-items: center;
    gap: clamp(24px,5vw,80px);
    padding: clamp(24px,4.2vw,64px);
    background: #111;
    color: #fff;
  }
  .guide-intro .eyebrow { color: #ccc; font-size: 11px; }
  .guide-intro h2 { margin: 12px 0 14px; font-size: clamp(42px,5.3vw,77px); }
  .guide-intro > p:not(.eyebrow), .guide-steps p { color: #d2d2d2; font-size: 14px; line-height: 1.65; }
  .guide-intro > p:not(.eyebrow) { max-width: 39ch; }
  .guide-action {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    min-height: 48px;
    padding: 10px 15px;
    margin-top: 19px;
    background: #fff;
    color: #111;
    font-size: 13px;
  }
  .guide-action:hover { background: #e4e4e4; }
  .guide-action:focus-visible { outline-color: #fff; }
  .guide-steps { list-style: none; margin: 0; padding: 0; border-top: 1px solid #555; }
  .guide-steps li { display: grid; grid-template-columns: 28px 1fr; gap: 13px; padding: 16px 0; border-bottom: 1px solid #555; }
  .step-index { font: 800 23px/1 Barlow,Impact,sans-serif; color: #c2c2c2; }
  .guide-steps h3 { margin-bottom: 3px; font-size: 15px; line-height: 1.35; }
  .guide-proof { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; margin-top: 14px; }
  .proof-link {
    display: grid;
    grid-template-columns: clamp(84px,11vw,140px) minmax(0,1fr) auto;
    align-items: center;
    gap: clamp(10px,2vw,24px);
    padding-right: clamp(12px,2vw,25px);
    border: 1px solid var(--line);
    min-height: 74px;
  }
  .proof-image { height: 100%; min-height: 86px; position: relative; overflow: hidden; background: #222; }
  .proof-image :global(img) { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); }
  .proof-copy { display: grid; gap: 2px; padding-block: 9px; }
  .proof-copy span { color: var(--muted); font-size: 12px; }
  .proof-copy strong { font: 800 clamp(21px,2.25vw,32px)/1.05 Barlow,Impact,sans-serif; }
  .proof-link:hover .proof-copy strong { text-decoration: underline; text-underline-offset: 4px; }

  @media (max-width: 700px) {
    .guide-panel { grid-template-columns: 1fr; }
    .guide-proof { gap: 10px; }
    .proof-image { min-height: 72px; }
  }
  @media (max-width: 540px) {
    .guide-proof { grid-template-columns: 1fr; }
  }
</style>
