<script lang="ts">
  import { siteHref, sites, type Lang } from '#lib/site.ts';
  import Photo from './Photo.svelte';
  import Icon from './Icon.svelte';

  let { lang, preview }: { lang: Lang; preview: boolean } = $props();
  const disciplines = ['muaythai', 'kickbox', 'mma'] as const;
  const text = $derived(lang === 'tr' ? {
    first: 'KENDİNE', second: 'HAKİM OL.',
    body: 'Sadece gücünü değil, kendini geliştir. Muay Thai, Kick Box ve MMA ile kendi yolunu bul.',
    cta: 'Antrenmanını keşfet', schedule: 'Ders programı',
    caption: 'Her şey, ilk adımla başlar.', path: 'KENDİ YOLUNU SEÇ',
    photo: 'Ringde antrenör eşliğinde pad antrenmanı', stock: 'TEMSİLİ ANTRENMAN GÖRSELİ'
  } : {
    first: 'MASTER', second: 'YOURSELF.',
    body: 'Build more than strength. Find your own way through Muay Thai, Kick Box and MMA.',
    cta: 'Find your discipline', schedule: 'Class timetable',
    caption: 'It starts with showing up.', path: 'CHOOSE YOUR PATH',
    photo: 'Athlete working pads with a coach in the ring', stock: 'ILLUSTRATIVE TRAINING PHOTO'
  });
</script>

<div class="academy-intro">
  <div class="intro-copy">
    <div class="intro-eyebrow"><span class="intro-rule"></span> SELF CONTROL FIGHT ACADEMY</div>
    <h1 aria-label={`${text.first} ${text.second}`}><span>{text.first}</span><span>{text.second}</span></h1>
    <p>{text.body}</p>
    <div class="intro-actions">
      <a class="intro-primary" href="#training">{text.cta}<Icon name="diagonal" size={20}/></a>
      <a class="intro-secondary" href="#schedule">{text.schedule}<Icon name="arrow" size={18}/></a>
    </div>
    <div class="intro-footnote"><span>01 — 03</span><span>{lang === 'tr' ? 'Üç disiplin. Ortak bir duruş.' : 'Three disciplines. One shared attitude.'}</span></div>
  </div>
  <figure class="intro-visual">
    <div class="intro-photo"><Photo name="training" alt={text.photo} eager position="52% 48%"/></div>
    <div class="photo-topline" aria-hidden="true"><span>THE ART OF SELF CONTROL</span><img src="/brand/mark.svg" width="42" height="31" alt=""/></div>
    <span class="photo-edge" aria-hidden="true">DISCIPLINE / RESPECT / CONTROL</span>
    <figcaption><span class="photo-caption">{text.caption}</span><span class="photo-credit">{text.stock}</span></figcaption>
  </figure>
</div>
<nav class="intro-paths" aria-label={text.path}>
  <div class="path-label"><span>{text.path}</span><Icon name="arrow" size={20}/></div>
  {#each disciplines as id, index}
    <a href={siteHref(id, lang, preview)} aria-label={`${sites[id].name} — ${lang === 'tr' ? 'Disiplini keşfet' : 'Explore discipline'}`}><span class="path-index" aria-hidden="true">0{index + 1}</span><span class="path-name" lang="en">{sites[id].name}</span><Icon name="diagonal" size={19}/></a>
  {/each}
</nav>

<style>
  :global(.landing-hero.academy-hero){display:block;padding:40px max(5.5vw,24px) 0;max-width:1800px;margin:auto}
  .academy-intro{display:grid;grid-template-columns:1.08fr 1fr;gap:5vw;min-height:540px}
  .intro-copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:30px 0}
  .intro-eyebrow{display:flex;align-items:center;gap:12px;font-size:10px;letter-spacing:.12em;line-height:1.6}
  .intro-rule{height:1px;width:30px;background:currentColor}
  h1{font:800 clamp(80px,8.5vw,150px)/.9 Barlow,Impact,sans-serif;letter-spacing:-.025em;margin:30px 0 26px}
  h1 span{display:block;white-space:nowrap}
  h1 span:last-child{color:#777773}
  .intro-copy>p{font-size:14px;line-height:1.9;max-width:370px;color:var(--muted)}
  .intro-actions{display:flex;align-items:center;gap:26px;margin-top:30px;flex-wrap:wrap}
  .intro-primary,.intro-secondary{display:inline-flex;align-items:center;justify-content:space-between;gap:20px;font-size:13px;min-height:54px}
  .intro-primary{background:#101010;color:#fff;padding:16px 20px;transition:background .2s}
  .intro-primary:hover{background:#353535}
  .intro-secondary{border-bottom:1px solid #aaa;min-height:48px}
  .intro-actions :global(svg),.intro-paths :global(svg){transition:transform .25s}
  .intro-actions a:hover :global(svg),.intro-paths a:hover :global(svg){transform:translate(3px,-3px)}
  .intro-footnote{display:flex;gap:14px;align-items:center;margin-top:42px;font-size:10px;color:var(--muted)}
  .intro-footnote>span:first-child{font-variant-numeric:tabular-nums;letter-spacing:.08em;border-right:1px solid var(--line);padding-right:14px}
  .intro-visual{position:relative;margin:0;overflow:hidden;min-width:0;background:#161616;color:#fff}
  .intro-photo{position:absolute;inset:0}
  .intro-photo :global(img){width:100%;height:100%;object-fit:cover;filter:grayscale(1) brightness(.77);transition:transform 1s cubic-bezier(.2,.6,.3,1)}
  .intro-visual:hover .intro-photo :global(img){transform:scale(1.035)}
  .intro-visual:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.32),transparent 35%,transparent 55%,rgba(0,0,0,.85));pointer-events:none}
  .photo-topline{position:absolute;z-index:1;top:26px;left:26px;right:26px;display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:9px;letter-spacing:.12em}
  figcaption{position:absolute;z-index:1;bottom:30px;left:28px;right:28px;display:flex;flex-direction:column;gap:14px}
  .photo-caption{font:800 clamp(28px,3vw,44px)/1 Barlow,Impact,sans-serif;max-width:260px;text-transform:uppercase}
  .photo-credit{font-size:8px;letter-spacing:.09em;color:#c6c6c1}
  .photo-edge{position:absolute;right:17px;top:50%;z-index:1;writing-mode:vertical-rl;font-size:8px;letter-spacing:.2em}
  .intro-paths{display:grid;grid-template-columns:1.08fr repeat(3,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:40px}
  .path-label{display:flex;align-items:center;gap:24px;font-size:10px;letter-spacing:.08em;padding:26px 24px 26px 0}
  .intro-paths a{display:flex;align-items:center;gap:14px;padding:25px 24px;border-left:1px solid var(--line);min-width:0;transition:background .2s}
  .intro-paths a:hover{background:var(--surface)}
  .path-index{color:var(--muted);font-size:10px}
  .path-name{font-size:16px;flex:1}
  @media(min-width:1400px){.academy-intro{min-height:620px}}
  @media(max-width:1050px) and (min-width:701px){.academy-intro{gap:30px;grid-template-columns:1.1fr 1fr;min-height:480px}h1{font-size:8.8vw}.intro-actions{gap:14px}.intro-footnote{margin-top:28px}.intro-paths a{padding:22px 16px;gap:10px}.path-name{font-size:14px}.path-label{font-size:9px;gap:12px}}
  @media(max-width:700px){
    :global(.landing-hero.academy-hero){padding:30px 24px 0}
    .academy-intro{grid-template-columns:1fr;gap:28px;min-height:0}
    .intro-copy{padding:0}
    .intro-eyebrow{font-size:9px;letter-spacing:.09em;gap:10px}.intro-rule{width:20px}
    h1{font-size:clamp(64px,18.2vw,112px);margin:24px 0 20px;line-height:.9}
    .intro-copy>p{font-size:13px;line-height:1.8;max-width:350px}
    .intro-actions{width:100%;gap:20px;margin-top:24px;flex-wrap:nowrap}
    .intro-primary{font-size:12px;min-height:52px;gap:14px;padding:14px 16px;flex:1}
    .intro-secondary{font-size:11px;gap:8px;min-height:46px;white-space:nowrap}
    .intro-footnote{display:none}
    .intro-visual{height:230px}
    .intro-photo :global(img){object-position:50% 43%!important}
    .photo-topline{top:16px;left:18px;right:18px;font-size:8px}.photo-topline img{width:30px;height:auto}
    figcaption{bottom:20px;left:18px;right:30px;gap:9px}.photo-caption{font-size:30px;max-width:210px}.photo-credit{font-size:7px}.photo-edge{right:12px;font-size:7px}
    .intro-paths{grid-template-columns:repeat(3,1fr);margin-top:24px}.path-label{display:none}
    .intro-paths a{padding:20px 12px;gap:7px;flex-wrap:wrap;justify-content:space-between}.intro-paths a:first-of-type{border-left:0;padding-left:0}.intro-paths a:last-child{padding-right:0}
    .path-name{font-size:13px;flex-basis:100%;order:1}.path-index{font-size:9px}.intro-paths a :global(svg){width:16px;height:16px}
  }
  @media(max-width:360px){:global(.landing-hero.academy-hero){padding-inline:20px}.intro-actions{gap:12px}.intro-primary{font-size:11px;padding-inline:12px;gap:8px}.intro-secondary{font-size:10px}.intro-visual{height:210px}}
  @media(prefers-reduced-motion:no-preference){.intro-copy{animation:intro-enter .7s ease-out both}.intro-visual{animation:intro-enter .9s .1s ease-out both}@keyframes intro-enter{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}}
  @media(prefers-reduced-motion:reduce){.intro-photo :global(img),.intro-actions :global(svg),.intro-paths :global(svg){transition:none}}
</style>
