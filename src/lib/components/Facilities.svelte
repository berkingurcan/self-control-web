<script lang="ts">
  import type { Lang } from '#lib/site.ts';
  import { editorial } from '#lib/editorial.ts';
  import { reveal, swipe, modalFocus } from '#lib/effects.ts';
  import Icon from './Icon.svelte';

  let { lang, label }: { lang: Lang; label: string } = $props();
  const e = $derived(editorial[lang]);
  const text = $derived(lang === 'tr' ? {
    floors: '3 KAT / ANTRENMAN ALANLARI', signature: 'SELF CONTROL / SALON',
    note: 'Fotoğraflar Self Control Fight Academy’nin kendi antrenman alanlarına aittir.',
    areas: [
      { level: 'ANA SALON', title: 'Teknik ve uygulama', body: 'Ana antrenman alanı ve MMA kafesi, teknik çalışmalar ile uygulama antrenmanlarını bir araya getirir.' },
      { level: 'ÜST KAT', title: 'Grappling', body: 'Minder kaplı grappling alanı; yer teknikleri, pozisyon ve geçiş çalışmaları için ayrılmıştır.' },
      { level: 'ALT KAT', title: 'Kum torbası ve CrossFit', body: 'Kum torbalarıyla vuruş çalışmaları; CrossFit alanında kuvvet ve kondisyon antrenmanları.' }
    ],
    captions: ['Ana salon', 'Üst kat · Grappling alanı', 'Alt kat · Kum torbası alanı', 'MMA kafesi', 'Alt kat · CrossFit ve kondisyon']
  } : {
    floors: '3 FLOORS / TRAINING AREAS', signature: 'SELF CONTROL / FACILITIES',
    note: 'These photographs show Self Control Fight Academy’s own training facilities.',
    areas: [
      { level: 'MAIN HALL', title: 'Technique and practice', body: 'The main training floor and MMA cage bring technical drills and practical training together.' },
      { level: 'UPPER FLOOR', title: 'Grappling', body: 'A dedicated matted grappling area for ground techniques, positional work and transitions.' },
      { level: 'LOWER FLOOR', title: 'Heavy bags and CrossFit', body: 'Heavy bags for striking drills, alongside a CrossFit area for strength and conditioning.' }
    ],
    captions: ['Main training hall', 'Upper floor · Grappling area', 'Lower floor · Heavy bag area', 'MMA cage', 'Lower floor · CrossFit and conditioning']
  });
  const photos = [
    { name: 'main-floor', height: 960, position: 'center' },
    { name: 'grappling', height: 960, position: 'center' },
    { name: 'heavy-bags', height: 960, position: 'center' },
    { name: 'mma-cage', height: 960, position: 'center' },
    { name: 'crossfit', height: 1707, position: 'center 58%' }
  ];
  let galleryIndex = $state(0);
  let dialog: HTMLDialogElement;
  const selected = $derived(photos[galleryIndex]);
  function open(index: number) { galleryIndex = index; dialog.showModal(); }
  function change(step: number) { galleryIndex = (galleryIndex + step + photos.length) % photos.length; }
</script>

<section id="space" class="section space-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{label}</span><span class="eyebrow">{text.floors}</span></div>
  <div class="section-heading"><h2 class="display">{e.spaceTitle}</h2><p>{e.spaceBody}</p></div>
  <div class="floor-overview">{#each text.areas as area}<div><span class="eyebrow">{area.level}</span><h3>{area.title}</h3><p>{area.body}</p></div>{/each}</div>
  <div class="facility-grid" aria-label={e.gallery}>
    {#each photos as photo, i}
      <button class="facility-photo" class:main-photo={i === 0} class:detail-photo={i > 2} onclick={() => open(i)} aria-label={`${e.openPhoto}: ${text.captions[i]}`}>
        <img src={`/images/salon/${photo.name}-1280.webp`} srcset={`/images/salon/${photo.name}-640.webp 640w, /images/salon/${photo.name}-1280.webp 1280w`} sizes="(max-width: 700px) 100vw, 50vw" alt={text.captions[i]} width="1280" height={photo.height} loading="lazy" decoding="async" style={`object-position:${photo.position}`}/>
        <span class="gallery-caption"><span><small>0{i + 1} / SELF CONTROL</small>{text.captions[i]}</span><span class="circle-arrow"><Icon name="plus"/></span></span>
      </button>
    {/each}
  </div>
  <p class="photo-note">{text.note}</p>
</section>

<dialog use:modalFocus use:swipe={change} class="gallery-dialog" bind:this={dialog} aria-label={e.gallery} onclick={(event) => { if (event.target === dialog) dialog.close(); }} onkeydown={(event) => { if (event.key === 'ArrowRight') change(1); if (event.key === 'ArrowLeft') change(-1); }}>
  <div class="gallery-dialog-top"><span class="eyebrow">{text.signature}</span><button aria-label={e.close} class="dialog-close" onclick={() => dialog.close()}><Icon name="close"/></button></div>
  <img src={`/images/salon/${selected.name}-1280.webp`} alt={text.captions[galleryIndex]} width="1280" height={selected.height} decoding="async"/>
  <div class="gallery-dialog-bottom"><button aria-label={e.previous} onclick={() => change(-1)}><Icon name="arrow-left" size={24}/></button><span>0{galleryIndex + 1} / 0{photos.length} — {text.captions[galleryIndex]}</span><button aria-label={e.next} onclick={() => change(1)}><Icon name="arrow" size={24}/></button></div>
  <p class="photo-note">{text.note}</p>
</dialog>

<style>
  .floor-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;margin-bottom:36px}
  .floor-overview>div{border-top:1px solid var(--line);padding-top:20px}
  .floor-overview .eyebrow{color:var(--muted);font-size:9px}
  .floor-overview h3{font:800 clamp(25px,2.6vw,38px)/1.15 Barlow,Impact,sans-serif;margin:12px 0}
  .floor-overview p{font-size:12px;color:var(--muted);max-width:340px}
  .facility-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:240px 240px 280px;gap:20px}
  .facility-photo{position:relative;overflow:hidden;background:#171717;text-align:left;padding:0;color:#fff;min-width:0}
  .main-photo{grid-row:span 2}
  .facility-photo>img{width:100%;height:100%;object-fit:cover;filter:grayscale(1);transition:transform .75s,filter .45s}
  .facility-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,#000b,transparent 55%);pointer-events:none}
  .facility-photo:hover>img{transform:scale(1.04);filter:grayscale(0)}
  .facility-photo:focus-visible>img{filter:grayscale(0)}
  .facility-photo:hover .circle-arrow{background:white;color:black}
  .gallery-dialog>img{display:block;width:100%;height:auto;max-height:65svh;object-fit:contain;background:#080808;filter:none}
  @media(max-width:1000px) and (min-width:701px){.floor-overview{gap:22px}.facility-grid{grid-template-rows:200px 200px 240px}.gallery-caption{inset:auto 18px 18px}.gallery-caption>span:first-child{font-size:13px}}
  @media(max-width:700px){
    .floor-overview{grid-template-columns:1fr;gap:20px;margin-bottom:28px}
    .floor-overview>div{padding-top:16px}.floor-overview h3{font-size:29px;margin:9px 0}.floor-overview p{max-width:unset}
    .facility-grid{grid-template-columns:1fr;grid-template-rows:none;gap:14px}
    .main-photo{grid-row:auto}.facility-photo{aspect-ratio:4/3}.detail-photo{aspect-ratio:3/2}
    .gallery-caption{inset:auto 18px 18px}.gallery-caption>span:first-child{font-size:14px}.gallery-caption .circle-arrow{width:34px;height:34px}
    .section-top{gap:12px}.section-top>.eyebrow:last-child{font-size:8px;text-align:right}
    .gallery-dialog>img{height:auto;max-height:60svh}
  }
</style>
