<script lang="ts">
  import { sites, type Lang } from '#lib/site.ts';
  import { academyHomeCopy } from '#lib/academy-home-copy.ts';
  import Icon from './Icon.svelte';
  import Photo from './Photo.svelte';

  let { lang }: { lang: Lang } = $props();
  const text = $derived(academyHomeCopy[lang]);
  const photo = sites.kickbox;
</script>

<div class="academy-stage">
  <p class="academy-location"><span aria-hidden="true"></span>{text.heroLabel}</p>
  <h1 class="campaign-title"><span>Self</span> <span>Control</span><span class="sr-only"> Fight Academy</span></h1>

  <figure class="campaign-visual">
    <Photo name={photo.image} height={photo.imageHeight} alt={text.photoAlt} eager
      position="var(--hero-crop)" sizes="(max-width: 700px) 92vw, 53vw"/>
  </figure>

  <div class="campaign-copy">
    <p class="campaign-disciplines">{text.heroDisciplines}</p>
    <p class="campaign-body">{text.heroBody}</p>
    <div class="campaign-actions">
      <a class="button solid campaign-primary" href="#first-session">{text.firstCta}<Icon name="arrow-down" size={19}/></a>
      <a class="campaign-secondary" href="#schedule">{text.timetable}<Icon name="arrow-down" size={17}/></a>
    </div>
  </div>
</div>

<style>
  :global(.landing-hero.academy-hero) {
    display: block;
    padding: clamp(24px,4.5vw,68px) max(5.5vw,24px) 0;
    max-width: 1800px;
    margin: auto;
  }
  .academy-stage {
    display: grid;
    grid-template-columns: minmax(0,.72fr) minmax(0,1fr);
    grid-template-rows: auto 1fr auto;
    align-items: start;
    position: relative;
    isolation: isolate;
    background: #fff;
  }
  .academy-location {
    grid-area: 1 / 1;
    display: flex;
    align-items: center;
    gap: 11px;
    padding-top: 6px;
    font-size: 11px;
    letter-spacing: .09em;
    text-transform: uppercase;
  }
  .academy-location span { flex: 0 0 6px; height: 6px; background: currentColor; }
  .campaign-title {
    grid-area: 2 / 1 / 3 / 3;
    z-index: 1;
    align-self: center;
    justify-self: start;
    color: #fff;
    mix-blend-mode: difference;
    pointer-events: none;
    font: 800 clamp(75px,11.1vw,195px)/.82 Barlow,Impact,sans-serif;
    letter-spacing: -.025em;
    text-transform: uppercase;
    margin: 24px 0;
  }
  .campaign-title > span:not(.sr-only) { display: block; }
  .campaign-title > span:nth-child(2) { margin-left: .55em; }
  .campaign-visual {
    grid-area: 1 / 2 / 4 / 3;
    min-height: clamp(475px,40vw,630px);
    height: 100%;
    margin: 0;
    position: relative;
    overflow: hidden;
    background: #262625;
    --hero-crop: 50% 28%;
  }
  .campaign-visual :global(img) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.05);
  }
  .campaign-visual::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(90deg,#08080855,transparent 43%);
  }
  .campaign-copy { grid-area: 3 / 1; padding: 0 clamp(18px,3vw,52px) 12px 0; }
  .campaign-disciplines { font-size: clamp(15px,1.42vw,21px); line-height: 1.45; color: var(--fg); }
  .campaign-body { font-size: 14px; line-height: 1.7; color: var(--muted); max-width: 39ch; margin-top: 7px; }
  .campaign-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 20px; margin-top: 19px; }
  .campaign-primary { min-height: 52px; padding: 13px 17px; gap: 12px; font-size: 13px; }
  .campaign-secondary {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border-bottom: 1px solid var(--line);
    font-size: 13px;
  }
  .campaign-secondary:hover { border-color: currentColor; }

  @media (min-width: 701px) and (max-width: 1000px) {
    .campaign-visual { min-height: 445px; }
    .campaign-title { font-size: 10.8vw; }
    .campaign-actions { align-items: start; flex-direction: column; }
  }
  @media (max-width: 700px) {
    :global(.landing-hero.academy-hero) { padding: 19px clamp(18px,5.6vw,26px) 0; }
    .academy-stage { display: flex; flex-direction: column; align-items: stretch; }
    .academy-location { padding: 0; font-size: 10px; }
    .campaign-title {
      align-self: start;
      color: var(--fg);
      mix-blend-mode: normal;
      font-size: clamp(45px,12.8vw,88px);
      line-height: .96;
      margin: 10px 0 14px;
    }
    .campaign-title > span:not(.sr-only) { display: inline; }
    .campaign-title > span:nth-child(2) { margin-left: 0; }
    .campaign-visual { min-height: 0; height: clamp(160px,49vw,320px); --hero-crop: 50% 25%; }
    .campaign-visual::after { content: none; }
    .campaign-copy { padding: 0; margin-top: 15px; }
    .campaign-disciplines { font-size: 16px; }
    .campaign-body { font-size: 13px; max-width: 46ch; margin-top: 5px; }
    .campaign-actions { display: grid; justify-items: stretch; gap: 4px; margin-top: 13px; }
    .campaign-primary { justify-content: space-between; min-height: 48px; }
    .campaign-secondary { justify-self: start; }
  }
  @media (forced-colors: active) {
    .campaign-title { color: CanvasText; background: Canvas; mix-blend-mode: normal; }
  }
  @media (max-width: 700px) and (max-height: 700px) {
    .campaign-visual { height: clamp(145px,45vw,210px); }
  }
</style>
