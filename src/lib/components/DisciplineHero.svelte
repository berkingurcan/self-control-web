<script lang="ts">
  import { disciplineOrder } from '#lib/discipline-order.ts';
  import { copy, siteName, siteHref, sites, type Lang } from '#lib/site.ts';
  import { disciplineCopy, type DisciplineId } from '#lib/discipline-copy.ts';
  import { heroDepth } from '#lib/effects.ts';
  import Photo from './Photo.svelte';
  import Icon from './Icon.svelte';

  let { site, lang, preview }: { site: DisciplineId; lang: Lang; preview: boolean } = $props();
  const identity = $derived(sites[site]);
  const content = $derived(disciplineCopy[lang][site]);
  const ids = disciplineOrder;
  const positions = {
    kickbox: { desktop: '50% 56%', mobile: '50% 56%' },
    mma: { desktop: '50% 50%', mobile: '50% 49%' },
    muaythai: { desktop: '50% 48%', mobile: '50% 46%' }
  };
  const text = $derived(lang === 'tr' ? {
    academy: 'Akademi', location: 'FIGHT ACADEMY · DENİZLİ',
    training: 'Antrenman içeriği', schedule: 'Ders programı', prices: 'Üyelik ve ücretler',
    disciplines: 'Branşlar', group: 'Grup ve özel ders',
    mixed: 'Karma dövüş sanatları'
  } : {
    academy: 'Academy home', location: 'FIGHT ACADEMY · DENİZLİ',
    training: 'Explore training', schedule: 'Class timetable', prices: 'Memberships and prices',
    disciplines: 'Disciplines', group: 'Group and private lessons',
    mixed: 'Mixed martial arts'
  });
</script>

<div class="branch-masthead">
  <span><i aria-hidden="true"></i>{text.location}</span>
  <a href={siteHref('academy', lang, preview)}>{text.academy}<Icon name="diagonal" size={15}/></a>
</div>

<div class="branch-stage" class:mixed={site === 'mma'} use:heroDepth>
  <div class="branch-content">
    <div class="branch-heading">
      <span class="branch-category">{site === 'mma' ? text.mixed : text.group}</span>
      <h1 class="branch-title" class:compound={site === 'kickbox' && lang === 'en'} lang={site === 'muaythai' ? 'en' : lang} aria-label={siteName(site, lang)}>
        {#if site === 'muaythai'}<span>MUAY</span><span>THAI</span>
        {:else if site === 'kickbox'}<span>{lang === 'tr' ? 'KİCK' : 'KICK'}</span><span>{lang === 'tr' ? 'BOKS' : 'BOXING'}</span>
        {:else}<span>MMA</span>{/if}
      </h1>
    </div>
    <p class="branch-description">{content.body}</p>
    <div class="branch-actions">
      <a class="branch-primary" href="#training">{text.training}<Icon name="diagonal" size={19}/></a>
      <a class="branch-secondary" href="#schedule">{text.schedule}<Icon name="arrow" size={17}/></a>
    </div>
    <a class="branch-membership" href="#membership">{text.prices}<Icon name="diagonal" size={15}/></a>
  </div>
  <figure class="branch-visual" class:muay-thai={site === 'muaythai'} style:--desktop-position={positions[site].desktop} style:--mobile-position={positions[site].mobile}>
    <div class="branch-photo">
      <Photo name={identity.image} height={identity.imageHeight} alt={copy[lang].home[site].image} eager position="var(--photo-position)"/>
      <span class="photo-accent" aria-hidden="true"></span>
    </div>
    <figcaption>SELF CONTROL / {identity.number}</figcaption>
  </figure>
</div>

<nav class="branch-navigation" aria-label={text.disciplines}>
  <span class="nav-label">{text.disciplines}</span>
  {#each ids as id}
    <a class:current={site === id} aria-current={site === id ? 'page' : undefined} href={site === id ? '#top' : siteHref(id, lang, preview)} style={`--branch-accent:${sites[id].accent}`}>
      <span class="nav-index">{sites[id].number}</span><span lang={id === 'muaythai' ? 'en' : lang}>{siteName(id, lang)}</span>
      {#if site === id}<span class="current-dot" aria-hidden="true"></span>{:else}<Icon name="diagonal" size={17}/>{/if}
    </a>
  {/each}
</nav>

<style>
  :global(.landing-hero.branch-hero){display:block;padding:0 max(5.5vw,24px);max-width:1600px;margin:auto}
  .branch-masthead{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:69px;font-size:9px;letter-spacing:.08em}
  .branch-masthead>span,.branch-masthead>a{display:flex;align-items:center;gap:11px}
  .branch-masthead i{width:5px;height:5px;background:var(--accent)}
  .branch-masthead>a{color:#b5b5ad;min-height:44px;font-size:11px;letter-spacing:0}
  .branch-masthead>a:hover{color:#fff}
  .branch-stage{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:6vw;padding:16px 0 29px;--drift-x:0px;--drift-y:0px}
  .branch-content{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;min-width:0;padding:16px 0 28px}
  .branch-category{display:block;color:var(--accent);font-size:10px;line-height:1.6;letter-spacing:.1em;text-transform:uppercase;margin-bottom:22px}
  .branch-title{font:800 clamp(110px,11.3vw,164px)/.86 Barlow,Impact,sans-serif;letter-spacing:-.025em;margin:0;color:#f5f5f0}
  .branch-title>span{display:block}
  .branch-title>span+span{color:var(--accent)}
  .mixed .branch-title{font-size:clamp(160px,18vw,260px);line-height:.9}
  .branch-description{font-size:14px;color:#bcbdb4;line-height:1.9;max-width:390px;margin-top:28px;text-wrap:pretty}
  .branch-actions{display:flex;align-items:center;gap:24px;margin-top:29px;flex-wrap:wrap}
  .branch-primary{display:flex;align-items:center;justify-content:space-between;gap:25px;min-height:54px;padding:16px 19px;font-size:12px;background:var(--accent);color:#11120f;transition:background .2s}
  .branch-primary:hover{background:color-mix(in srgb,var(--accent) 80%,white)}
  .branch-secondary{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:48px;border-bottom:1px solid #595c51;font-size:12px;color:#deded6}
  .branch-primary :global(svg),.branch-secondary :global(svg),.branch-masthead :global(svg),.branch-membership :global(svg){transition:transform .25s}
  .branch-primary:hover :global(svg),.branch-masthead>a:hover :global(svg),.branch-membership:hover :global(svg){transform:translate(2px,-2px)}
  .branch-secondary:hover :global(svg){transform:translateX(3px)}
  .branch-membership{display:flex;align-items:center;gap:13px;min-height:44px;font-size:11px;color:#a9ab9f;margin-top:11px}
  .branch-membership:hover{color:var(--accent)}
  .branch-visual{display:flex;flex-direction:column;min-width:0;margin:0}
  .branch-photo{position:relative;overflow:hidden;flex:1;min-height:490px;background:#252621;--photo-position:var(--desktop-position)}
  .branch-photo :global(img){position:absolute;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(var(--photo-contrast,1.05)) brightness(var(--photo-brightness,.98));transform:translate(var(--drift-x),var(--drift-y)) scale(1.045);transition:transform .9s cubic-bezier(.2,.7,.3,1)}
  .mixed .branch-photo{--photo-contrast:1.02;--photo-brightness:1.13}
  .muay-thai .branch-photo{--photo-contrast:1.02}
  .photo-accent{position:absolute;left:0;bottom:0;width:50px;height:3px;background:var(--accent)}
  figcaption{padding-top:13px;min-height:30px;font-size:8px;letter-spacing:.07em;color:#93968b}
  .branch-navigation{display:grid;grid-template-columns:1fr repeat(3,1.1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line);min-height:71px}
  .nav-label{display:flex;align-items:center;font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#96998d}
  .branch-navigation>a{display:flex;position:relative;align-items:center;gap:18px;padding:0 23px;color:#a5a59c;font-size:13px;border-left:1px solid var(--line);transition:background .2s,color .2s}
  .branch-navigation>a:after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--branch-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s}
  .branch-navigation>a.current{color:var(--branch-accent)}
  .branch-navigation>a.current:after,.branch-navigation>a:hover:after{transform:scaleX(1)}
  .branch-navigation>a:hover{color:var(--branch-accent);background:#ffffff06}
  .branch-navigation>a>span:nth-child(2){white-space:nowrap}
  .nav-index{font-size:9px;color:#85897c;font-variant-numeric:tabular-nums}
  .branch-navigation :global(svg),.current-dot{margin-left:auto}
  .current-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
  @media(min-width:701px) and (max-width:1100px){
    .branch-stage{gap:5vw;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr)}.branch-title{font-size:12vw}.mixed .branch-title{font-size:20vw}.branch-description{font-size:13px}.branch-actions{gap:10px 20px}.branch-primary{font-size:11px;padding:15px;gap:17px}.branch-secondary{font-size:11px;gap:14px}.branch-photo{min-height:470px}.branch-navigation{grid-template-columns:.65fr repeat(3,1.1fr)}.branch-navigation>a{padding-inline:16px;gap:12px;font-size:12px}
  }
  @media(max-width:700px){
    :global(.landing-hero.branch-hero){padding:0 22px}
    .branch-masthead{min-height:55px;font-size:8px;letter-spacing:.05em}.branch-masthead>span{gap:8px}.branch-masthead>a{font-size:10px;gap:9px}.branch-masthead>a :global(svg){width:13px;height:13px}
    .branch-stage{display:flex;flex-direction:column;gap:0;padding:12px 0 17px}
    .branch-content{display:contents}
    .branch-heading{order:0;margin-bottom:15px}
    .branch-category{display:none}
    .branch-title{display:flex;align-items:baseline;gap:.16em;font-size:clamp(58px,18.7vw,112px);line-height:.95;letter-spacing:-.025em;white-space:nowrap}
    .branch-title>span{display:inline}
    .branch-title.compound{gap:0}
    .mixed .branch-title{font-size:clamp(76px,24vw,136px);line-height:.92}
    .branch-description{order:1;max-width:550px;font-size:13px;line-height:1.8;margin:0 0 22px}
    .branch-visual{order:2}
    .branch-photo{flex:auto;min-height:0;height:clamp(180px,48vw,285px);--photo-position:var(--mobile-position)}
    .mixed .branch-photo{height:auto;aspect-ratio:1.28}
    .muay-thai .branch-photo{height:clamp(216px,58vw,330px)}
    figcaption{padding-top:10px;min-height:25px;font-size:7px}
    .branch-actions{order:3;display:grid;grid-template-columns:1.2fr 1fr;gap:18px;margin-top:22px;width:100%}
    .branch-primary{font-size:12px;padding:15px;min-height:52px;gap:12px}
    .branch-secondary{font-size:11px;gap:10px;min-height:52px}
    .branch-membership{display:none}
    .branch-navigation{grid-template-columns:repeat(3,minmax(0,1fr));min-height:56px}
    .nav-label{display:none}.branch-navigation>a{font-size:11px;padding:0 10px;gap:8px}.branch-navigation>a:first-of-type{border-left:0}.nav-index{display:none}.branch-navigation :global(svg){width:13px;height:13px}.current-dot{width:4px;height:4px}
  }
  @media(max-width:360px){
    :global(.landing-hero.branch-hero){padding-inline:18px}.branch-masthead{font-size:7px}.branch-masthead>a{font-size:9px}.branch-title{font-size:18.3vw}.branch-description{font-size:12px;margin-bottom:18px}.branch-actions{gap:13px;margin-top:18px}.branch-primary{font-size:10px;padding:13px;gap:8px}.branch-secondary{font-size:10px;gap:8px}.branch-membership{font-size:10px}.branch-navigation>a{font-size:10px;padding-inline:9px;gap:6px}
  }
  @media(prefers-reduced-motion:no-preference){
    .branch-heading,.branch-description{animation:branch-arrive .65s cubic-bezier(.2,.8,.2,1) both}.branch-description{animation-delay:.07s}
    @keyframes branch-arrive{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  }
  @media(prefers-reduced-motion:reduce){.branch-photo :global(img){transform:none}}
</style>
