<script lang="ts">
  import { disciplineOrder } from '#lib/discipline-order.ts';
  import { academyKickboxPhotos, siteName, copy, siteHref, sites, type Lang } from '#lib/site.ts';
  import { heroDepth } from '#lib/effects.ts';
  import Photo from './Photo.svelte';
  import Icon from './Icon.svelte';

  let { lang, preview }: { lang: Lang; preview: boolean } = $props();
  const disciplines = disciplineOrder;
  const positions = {
    kickbox: { desktop: '50% 29%', mobile: '50% 32%' },
    mma: { desktop: '50% 54%', mobile: '46% 54%' },
    muaythai: { desktop: '52% 52%', mobile: '56% 45%' }
  };
  let selected = $state(0);
  const active = $derived(disciplines[selected]);
  const text = $derived(lang === 'tr' ? {
    first: 'SELF', second: 'CONTROL',
    body: 'Denizli’de Kick boks, MMA ve Muay Thai. Ders saatlerini ve ücretleri inceleyin.',
    cta: 'Branşları inceleyin', schedule: 'Ders programı',
    statement: 'Üç branş.', statementEnd: 'Tek akademi.',
    path: 'BRANŞ HAKKINDA', explore: 'Branşı inceleyin',
    preview: 'Branş görselini göster',
    philosophy: 'Grup dersleri', philosophyEnd: 'Özel ders seçenekleri',
    scroll: 'Akademi hakkında', membership: 'Üyelik ve ücretler',
    masthead: 'FIGHT ACADEMY · DENİZLİ', mastheadNote: 'ANTRENMAN', visualMarker: 'SC / ANTRENMAN', seal: 'TEKNİK · DİSİPLİN · SAYGI · '
  } : {
    first: 'SELF', second: 'CONTROL',
    body: 'Kickboxing, MMA and Muay Thai in Denizli. View class times and membership prices.',
    cta: 'Explore training', schedule: 'Class timetable',
    statement: 'Three disciplines.', statementEnd: 'One academy.',
    path: 'ABOUT THE DISCIPLINE', explore: 'View discipline',
    preview: 'Show discipline photo',
    philosophy: 'Group classes', philosophyEnd: 'Private lesson options',
    scroll: 'About the academy', membership: 'Memberships and prices',
    masthead: 'FIGHT ACADEMY · DENİZLİ', mastheadNote: 'TRAINING', visualMarker: 'SC / TRAINING', seal: 'TECHNIQUE · DISCIPLINE · RESPECT · '
  });


</script>

<div class="academy-masthead">
  <div class="masthead-label"><span class="label-square" aria-hidden="true"></span> {text.masthead}</div>
  <span class="masthead-note">{text.mastheadNote} <span aria-hidden="true">/</span> {text.statement}</span>
</div>

<div class="academy-stage" use:heroDepth>
  <figure class="campaign-visual">
    <div class="campaign-frames">
      {#each disciplines as id, index}
        {@const photo = id === 'kickbox' ? academyKickboxPhotos.hero : sites[id]}
        <div class="campaign-frame" class:is-active={selected === index} class:ground-photo={id === 'mma'} aria-hidden={selected !== index} style:--desktop-position={positions[id].desktop} style:--mobile-position={positions[id].mobile}>
          <Photo name={photo.image} height={photo.imageHeight} alt={id === 'kickbox' ? academyKickboxPhotos.hero.alt[lang] : copy[lang].home[id].image} eager={index === 0} position="var(--photo-position)" sizes="(max-width: 700px) 77vw, 55vw"/>
        </div>
      {/each}
    </div>
    <div class="campaign-shade" aria-hidden="true"></div>
    <div class="visual-topline" aria-hidden="true"><span>{text.visualMarker}</span><span>0{selected + 1} — 03</span></div>
    <div class="control-seal" aria-hidden="true">
      <svg class="seal-orbit" viewBox="0 0 100 100"><defs><path id="academy-seal-orbit" d="M50,50m-40,0a40,40 0 1,1 80,0a40,40 0 1,1 -80,0"/></defs><text><textPath href="#academy-seal-orbit" textLength="251">{text.seal}</textPath></text></svg>
      <img src="/brand/mark.svg" width="40" height="30" alt=""/>
    </div>
    <figcaption class="visual-caption">
      <div class="caption-copy"><span>{text.path}</span><a href={siteHref(active, lang, preview)} aria-label={`${siteName(active, lang)} — ${text.explore}`}><span lang={active === 'muaythai' ? 'en' : lang}>{siteName(active, lang)}</span><Icon name="diagonal" size={23}/></a></div>
    </figcaption>
  </figure>

  <h1 class="campaign-title" aria-label={`${text.first} ${text.second}`}><span class="title-line"><span>{text.first}</span></span><span class="title-line"><span>{text.second}</span></span></h1>

  <div class="campaign-copy">
    <div class="copy-rule" aria-hidden="true"><span></span><span>SC / 00</span></div>
    <p>{text.body}</p>
    <div class="campaign-actions">
      <a class="campaign-primary" href="#training"><span>{text.cta}</span><span class="primary-arrow"><Icon name="diagonal" size={20}/></span></a>
      <a class="campaign-secondary" href="#schedule">{text.schedule}<Icon name="arrow" size={18}/></a>
    </div>
  </div>

  <div class="campaign-philosophy" aria-hidden="true"><span>{text.philosophy}</span><span>{text.philosophyEnd}</span></div>

  <div class="discipline-selector" role="group" aria-label={text.preview}>
    {#each disciplines as id, index}
      <button type="button" class:selected={selected === index} aria-pressed={selected === index} aria-label={`${siteName(id, lang)} — ${text.preview}`} onclick={() => selected = index}><span class="selector-index" aria-hidden="true">0{index + 1}</span><span lang={lang}>{siteName(id, lang)}</span><span class="selector-dot" aria-hidden="true"></span></button>
    {/each}
  </div>
</div>

<div class="campaign-baseline">
  <div class="baseline-statement"><span class="baseline-mark" aria-hidden="true"><Icon name="diagonal" size="1em"/></span><p>{text.statement} <span>{text.statementEnd}</span></p></div>
  <a class="baseline-membership" href="#membership">{text.membership}<Icon name="diagonal" size={16}/></a>
  <a class="baseline-scroll" href="#academy"><span>{text.scroll}</span><span class="scroll-track" aria-hidden="true"><Icon name="arrow-down" size={17}/></span></a>
</div>

<style>
  :global(.landing-hero.academy-hero){display:block;padding:0 max(5.5vw,24px);max-width:1800px;margin:auto;--hero-paper:#fff}
  .academy-masthead{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:73px;font-size:9px;letter-spacing:.1em}
  .masthead-label{display:flex;align-items:center;gap:11px}
  .label-square{width:6px;height:6px;background:currentColor}
  .masthead-note{color:#6b6b65;display:flex;gap:16px;font-size:9px;letter-spacing:.04em}
  .masthead-note>span{color:#b2b2ac}
  .academy-stage{position:relative;isolation:isolate;min-height:clamp(550px,43vw,710px);height:min(710px,calc(100svh - 220px));background:var(--hero-paper);--drift-x:0px;--drift-y:0px}
  .campaign-visual{position:absolute;inset:0 0 64px 40%;margin:0;background:#20201e;color:#fff;overflow:hidden}
  .campaign-frames,.campaign-frame,.campaign-shade{position:absolute;inset:0}
  .campaign-frame{opacity:0;visibility:hidden;transition:opacity .65s ease,visibility .65s;overflow:hidden;--photo-position:var(--desktop-position)}
  .campaign-frame.is-active{opacity:1;visibility:visible}
  .campaign-frame :global(img){width:100%;height:100%;object-fit:cover;filter:grayscale(1) brightness(var(--photo-brightness,.88)) contrast(1.05);transform:translate(var(--drift-x),var(--drift-y)) scale(1.045);transition:transform .9s cubic-bezier(.2,.7,.3,1)}
  .campaign-frame.ground-photo{--photo-brightness:1.13}
  .campaign-shade{background:linear-gradient(0deg,#080808c9,transparent 39%),linear-gradient(90deg,#08080820,transparent 55%);pointer-events:none}
  .campaign-shade:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at var(--light-x,65%) var(--light-y,40%),#ffffff18,transparent 65%);mix-blend-mode:soft-light}
  .visual-topline{position:absolute;inset:23px 25px auto;display:flex;align-items:center;justify-content:space-between;font-size:8px;letter-spacing:.12em;color:#e2e2dd}
  .control-seal{position:absolute;top:56px;right:24px;width:100px;height:100px;display:grid;place-items:center}
  .seal-orbit{position:absolute;inset:0;width:100%;height:100%;fill:#f3f3eb;font:500 7.8px Poppins,Arial,sans-serif;letter-spacing:1.2px}
  .control-seal>img{width:37px;height:auto;transform:translateY(1px)}
  .visual-caption{position:absolute;bottom:25px;left:28px;right:28px;display:flex;align-items:flex-end;justify-content:space-between;gap:20px}
  .caption-copy{display:flex;flex-direction:column;gap:8px;min-width:0}
  .caption-copy>span{font-size:8px;letter-spacing:.13em;color:#d8d8d0}
  .caption-copy>a{display:flex;gap:35px;align-items:center;min-height:44px;font:800 38px/1 Barlow,Impact,sans-serif;text-transform:uppercase}
  .caption-copy>a :global(svg){transition:transform .25s}
  .caption-copy>a:hover :global(svg){transform:translate(3px,-3px)}
  .campaign-title{position:absolute;z-index:2;top:20px;left:-.006em;color:#fff;mix-blend-mode:difference;font:800 clamp(100px,12.2vw,184px)/.92 Barlow,Impact,sans-serif;letter-spacing:-.022em;margin:0;pointer-events:none}
  .title-line{display:block;padding-bottom:.055em;margin-bottom:-.02em;white-space:nowrap}
  .title-line>span{display:block}
  .title-line:last-child{margin-left:7.5vw}
  .campaign-copy{position:absolute;left:0;bottom:75px;width:34%;max-width:380px}
  .copy-rule{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;font-size:8px;letter-spacing:.1em;color:#73736d}
  .copy-rule>span:first-child{width:45px;height:1px;background:#999993}
  .campaign-copy>p{font-size:13px;line-height:1.85;color:#64645f;max-width:330px;text-wrap:pretty}
  .campaign-actions{display:flex;flex-direction:column;align-items:flex-start;gap:13px;margin-top:25px}
  .campaign-primary{display:flex;align-items:center;justify-content:space-between;gap:28px;min-height:56px;background:#101010;color:#fff;padding:7px 7px 7px 20px;font-size:12px;overflow:hidden;transition:background .25s}
  .primary-arrow{display:grid;place-items:center;width:40px;height:40px;border:1px solid #ffffff40;transition:background .25s,color .25s}
  .campaign-primary:hover{background:#30302b}
  .campaign-primary:hover .primary-arrow{background:#fff;color:#101010}
  .campaign-secondary{display:flex;align-items:center;justify-content:space-between;gap:26px;min-height:44px;font-size:11px;border-bottom:1px solid #bbbcb4}
  .campaign-secondary :global(svg){transition:transform .25s}
  .campaign-secondary:hover :global(svg){transform:translateX(4px)}
  .campaign-philosophy{position:absolute;left:calc(40% + 28px);bottom:190px;display:flex;flex-direction:column;font-size:11px;line-height:1.7;color:#eeeee7;letter-spacing:-.02em;pointer-events:none}
  .campaign-philosophy>span:last-child{color:#b8b8b0}
  .discipline-selector{position:absolute;bottom:0;left:40%;right:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));height:64px;border-bottom:1px solid #d7d7d0}
  .discipline-selector>button{position:relative;display:flex;align-items:center;gap:12px;background:transparent;text-align:left;padding:0 17px;color:#74746d;font-size:11px;transition:color .25s,background .25s}
  .discipline-selector>button:after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;background:#111;transform:scaleX(0);transform-origin:left;transition:transform .3s}
  .discipline-selector>button+button{border-left:1px solid #e5e5df}
  .discipline-selector>button:hover{background:#f5f5f1;color:#111}
  .discipline-selector>button.selected{color:#111}
  .discipline-selector>button.selected:after{transform:scaleX(1)}
  .selector-index{font-size:9px;color:#77776e;font-variant-numeric:tabular-nums}
  .selector-dot{width:5px;height:5px;border-radius:50%;background:currentColor;margin-left:auto;opacity:0;transition:opacity .25s}
  .selected .selector-dot{opacity:1}
  .campaign-baseline{display:flex;align-items:center;justify-content:space-between;gap:25px;min-height:96px;margin-top:17px;border-bottom:1px solid var(--line)}
  .baseline-statement{display:flex;align-items:center;gap:15px}
  .baseline-mark{display:flex;font-size:35px;line-height:1}
  .baseline-statement>p{font-size:10px;line-height:1.6}
  .baseline-statement>p>span{color:#74746d}
  .baseline-membership,.baseline-scroll{display:flex;align-items:center;gap:15px;min-height:44px;font-size:10px}
  .baseline-membership{margin-left:auto;margin-right:5vw;color:#64645f}
  .baseline-scroll{gap:26px}
  .scroll-track{width:27px;height:36px;border:1px solid #d6d6ce;border-radius:20px;display:grid;place-items:center;font-size:17px;transition:transform .25s}
  .baseline-scroll:hover .scroll-track{transform:translateY(3px)}
  @media(min-width:1200px){.campaign-actions{flex-direction:row;align-items:center;gap:22px}.campaign-primary{gap:18px}}
  @media(min-width:1500px){.campaign-title{top:45px}.campaign-copy{bottom:96px}.campaign-actions{flex-direction:row;align-items:center;gap:23px}.campaign-primary{gap:18px}.campaign-secondary{gap:17px}.campaign-philosophy{bottom:185px}}
  @media(min-width:701px) and (max-width:1050px){
    .academy-stage{min-height:570px;height:570px}.campaign-visual{left:36%}.campaign-title{top:30px;font-size:12.8vw}.title-line:last-child{margin-left:4vw}.campaign-copy{width:31%;bottom:84px}.campaign-copy>p{font-size:12px}.campaign-primary{font-size:11px;gap:10px;padding-left:14px}.primary-arrow{width:34px;height:38px}.control-seal{width:82px;height:82px;right:16px}.control-seal>img{width:31px}.campaign-philosophy{left:calc(36% + 23px);bottom:200px}.discipline-selector{left:36%}.discipline-selector>button{padding:0 12px;gap:9px;font-size:10px}.visual-caption{left:23px;right:20px}.baseline-membership{margin-right:0}.baseline-statement>p{max-width:170px}
  }
  @media(max-width:700px){
    :global(.landing-hero.academy-hero){padding:0 22px}
    .academy-masthead{min-height:57px;font-size:8px;letter-spacing:.08em}.masthead-note{font-size:0;gap:0}.masthead-note>span{font-size:0}.masthead-note:before{content:'SC / 00';font-size:8px;letter-spacing:.08em}
    .academy-stage{display:flex;flex-direction:column;height:auto;min-height:0;padding-top:292px}
    .campaign-visual{inset:0 0 auto 23%;height:292px}
    .campaign-frame{--photo-position:var(--mobile-position)}
    .campaign-title{position:absolute;top:52px;left:-1px;font-size:clamp(64px,18.7vw,128px);line-height:.92;margin:0}
    .title-line{padding-bottom:.06em;margin-bottom:-.02em}.title-line:last-child{margin-left:0}
    .visual-topline{inset:14px 14px auto;font-size:6px;letter-spacing:.08em}.visual-topline>span:first-child{font-size:6px}
    .control-seal,.campaign-philosophy{display:none}
    .visual-caption{bottom:17px;left:17px;right:15px;gap:8px}.caption-copy{gap:2px}.caption-copy>span{font-size:8px;letter-spacing:.05em}.caption-copy>a{font-size:26px;gap:14px;min-height:44px}.caption-copy>a :global(svg){width:18px;height:18px}
    .discipline-selector{position:relative;left:auto;right:auto;bottom:auto;order:1;height:58px;margin-left:23%;margin-top:0}
    .discipline-selector>button{padding:0 7px;gap:5px;font-size:11px;white-space:nowrap}.selector-index{display:none}.selector-dot{display:none}
    .campaign-copy{position:relative;left:auto;bottom:auto;order:2;width:auto;max-width:none;margin-top:26px}
    .copy-rule{display:none}.campaign-copy>p{font-size:13px;max-width:440px;line-height:1.8}
    .campaign-actions{flex-direction:row;align-items:center;gap:20px;margin-top:20px}.campaign-primary{min-height:54px;flex:1;font-size:12px;gap:10px;padding-left:15px}.primary-arrow{width:34px;height:38px}.campaign-secondary{font-size:11px;gap:9px;white-space:nowrap}
    .campaign-baseline{min-height:79px;margin-top:24px;gap:12px}.baseline-statement{gap:10px}.baseline-mark{font-size:27px}.baseline-statement>p{font-size:9px}.baseline-statement>p>span{display:block}.baseline-membership{font-size:10px;margin-right:0;gap:8px}.baseline-scroll{display:none}
  }
  @media(min-width:501px) and (max-width:700px){.campaign-visual{height:360px}.academy-stage{padding-top:360px}.discipline-selector>button{font-size:12px;padding-inline:12px}.selector-index{display:inline;font-size:9px}.visual-caption{bottom:20px}.caption-copy>a{font-size:34px}.campaign-copy{margin-top:26px}}
  @media(max-width:360px){
    :global(.landing-hero.academy-hero){padding-inline:18px}.academy-masthead{font-size:7px;min-height:52px}.campaign-visual{height:266px}.academy-stage{padding-top:266px}.campaign-title{font-size:18.7vw;top:44px}.discipline-selector{height:54px}.discipline-selector>button{font-size:10px;padding-inline:5px;gap:4px}.campaign-copy{margin-top:21px}.campaign-copy>p{font-size:12px}.campaign-actions{gap:12px}.campaign-primary{font-size:11px;padding-left:12px}.campaign-secondary{font-size:10px;gap:7px}.primary-arrow{width:30px}.caption-copy>a{font-size:23px}.baseline-membership{font-size:9px;gap:5px}
  }
  @media(max-width:700px) and (max-height:740px){.campaign-visual{height:242px}.academy-stage{padding-top:242px}.campaign-title{top:36px;font-size:17.5vw}.campaign-copy{margin-top:20px}.campaign-actions{margin-top:14px}.campaign-baseline{margin-top:20px}}
  @media(prefers-reduced-motion:no-preference){
    .title-line>span{animation:type-arrive 1s cubic-bezier(.16,1,.3,1) both}.title-line:last-child>span{animation-delay:.13s}
    .campaign-visual{animation:frame-arrive 1.2s cubic-bezier(.16,1,.3,1) both}.campaign-copy{animation:copy-arrive .9s .18s both}
    .seal-orbit{animation:seal-turn 2s cubic-bezier(.16,1,.3,1) both}
    @keyframes type-arrive{from{transform:translateY(18%);clip-path:inset(100% 0 -20%)}to{transform:translateY(0);clip-path:inset(-20% 0 -20%)}}
    @keyframes frame-arrive{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0)}}
    @keyframes copy-arrive{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes seal-turn{from{transform:rotate(-40deg)}to{transform:rotate(0)}}
  }
  @media(prefers-reduced-motion:reduce){.campaign-frame,.campaign-frame :global(img),.discipline-selector>button,.discipline-selector>button:after{transition:none}.campaign-frame :global(img){transform:none}}
</style>
