<script lang="ts">
  import { href, type Lang, type SiteId } from '#lib/site.ts';
  import { headTrainerCopy, headTrainerGallery, headTrainerInstagram, headTrainerName, headTrainerPortrait } from '#lib/head-trainer.ts';
  import { reveal, swipe, modalFocus } from '#lib/effects.ts';
  import Photo from './Photo.svelte';
  import Icon from './Icon.svelte';
  let { site, lang, prefix }: { site: SiteId; lang: Lang; prefix: string } = $props();
  const c = $derived(headTrainerCopy[lang]);
  const home = $derived(href('home', lang, prefix));
  let photo = $state(0), galleryOpen = $state(false), lightbox: HTMLDialogElement;
  function openPhoto(index: number) { photo = index; galleryOpen = true; lightbox.showModal(); }
  const photoNumber = (n: number) => String(n).padStart(2, '0');
  const galleryCount = photoNumber(headTrainerGallery.length);
  function changePhoto(step: number) { photo = (photo + step + headTrainerGallery.length) % headTrainerGallery.length; }
</script>

<article class="trainer-profile" data-profile={site}>
  <section id="top" class="profile-hero">
    <a class="profile-back" href={`${home}#trainers`}><Icon name="arrow-left" size={16}/>{c.back}</a>
    <div class="profile-hero-grid">
      <div class="profile-hero-copy">
        <span class="eyebrow profile-kicker"><i></i>SELF CONTROL / {c.profileMarker}</span>
        <h1 aria-label={headTrainerName}>{#each c.title as line}<span>{line} </span>{/each}</h1>
        <span class="profile-byline">{c.byline}</span>
        <p class="profile-intro">{c.intro}</p>
        <a class="underlined-link profile-story" href="#biography">{c.bioLink}<Icon name="diagonal"/></a>
      </div>
      <div class="profile-poster">
        <Photo name={headTrainerPortrait} alt={c.portrait} eager position="50% 30%" sizes="(max-width: 700px) 100vw, 42vw"/>
        <div class="poster-top"><span>SC / GD</span><img src="/brand/mark.svg" width="50" height="37" alt=""/></div>
        <div class="poster-bottom"><span>SELF CONTROL FIGHT ACADEMY</span><strong>{c.role}</strong></div>
      </div>
    </div>
    <nav class="profile-index" aria-label={lang === 'tr' ? 'Profil bölümleri' : 'Profile sections'}><a href="#biography"><span>01</span>{c.bioLink}<Icon name="diagonal" size={15}/></a><a href="#journal"><span>02</span>{c.galleryLink}<Icon name="diagonal" size={15}/></a></nav>
  </section>

  <section id="biography" class="section profile-biography" use:reveal>
    <div class="section-top"><span class="eyebrow">{c.bioLabel}</span><span class="eyebrow">{lang === 'tr' ? 'DENİZLİ / HOLLANDA / TAYLAND' : 'DENİZLİ / THE NETHERLANDS / THAILAND'}</span></div>
    <div class="profile-bio-grid">
      <div>
        <h2 class="display">{c.bioTitle}</h2>
        <div class="profile-facts">
          <h3>{c.credentialsTitle}</h3>
          <ul>{#each c.credentials as credential}<li>{credential}</li>{/each}</ul>
        </div>
        <a class="profile-instagram" href={headTrainerInstagram} target="_blank" rel="noreferrer"><span><small>{c.instagram}</small>@gokhandennizli</span><Icon name="diagonal"/></a>
      </div>
      <div class="profile-bio-copy">
        <div class="profile-chapter">
          <h3>{c.trainingTitle}</h3>
          <p>{c.trainingIntro}</p>
          <div class="profile-countries">
            {#each c.countries as country}
              <div>
                <h4>{country.name}</h4>
                <ul>{#each country.gyms as gym}<li>{gym}</li>{/each}</ul>
                <p>{country.detail}</p>
              </div>
            {/each}
          </div>
          <p>{c.trainingOutcome}</p>
        </div>
        <div class="profile-chapter">
          <h3>{c.campsTitle}</h3>
          {#each c.camps as paragraph}<p>{paragraph}</p>{/each}
        </div>
        <div class="profile-chapter">
          <h3>{c.athleteTitle}</h3>
          {#each c.athletes as paragraph}<p>{paragraph}</p>{/each}
        </div>
        <div class="profile-chapter">
          <h3>{c.academyTitle}</h3>
          {#each c.academy as paragraph}<p>{paragraph}</p>{/each}
        </div>
      </div>
    </div>
  </section>


  <section id="journal" class="section profile-journal" use:reveal>
    <div class="section-top"><span class="eyebrow">{c.galleryLabel}</span><span class="eyebrow">{galleryCount} / {c.galleryMarker}</span></div>
    <div class="section-heading"><h2 class="display">{c.galleryTitle}</h2><p>{c.galleryBody}</p></div>
    <div class="profile-bento" aria-label={c.gallery}>{#each headTrainerGallery as frame, index}<button class="bento-tile tile-{index}" onclick={() => openPhoto(index)} aria-label={`${c.open}: ${c.photoLabels[index]}`}><Photo name={frame.image} alt={c.photoAlts[index]} position={frame.position} sizes={`(max-width: 700px) ${[2, 3, 7, 8].includes(index) ? '50vw' : '100vw'}, ${[42, 58, 25, 34, 58, 42, 34, 34, 34, 50, 50][index]}vw`}/><span class="bento-top">{photoNumber(index + 1)} / GD</span><span class="bento-bottom"><span>{c.photoLabels[index]}</span><span class="bento-plus"><Icon name="plus" size={18}/></span></span></button>{/each}</div>
    <p class="photo-note">{c.galleryNote}</p>
  </section>

  <section class="section profile-contact" use:reveal><span class="eyebrow">{c.ctaLabel}</span><div><h2 class="display">{c.ctaTitle}</h2><div><p>{c.ctaBody}</p><a class="button solid" href={`${home}#start`}>{c.cta}<Icon name="diagonal"/></a><a class="quiet-link" href={`${home}#trainers`}>{c.return}<Icon name="diagonal" size={16}/></a></div></div><span class="profile-contact-signature">{c.signature}</span></section>
</article>

<dialog use:modalFocus class="gallery-dialog profile-lightbox" bind:this={lightbox} use:swipe={changePhoto} aria-label={c.gallery} onclose={() => galleryOpen = false} onclick={(event) => { if (event.target === lightbox) lightbox.close(); }} onkeydown={(event) => { if (event.key === 'ArrowRight') { event.preventDefault(); changePhoto(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(-1); } }}><div class="gallery-dialog-top"><span class="eyebrow">GÖKHAN DENİZLİ / {c.galleryLink}</span><button class="dialog-close" aria-label={c.close} onclick={() => lightbox.close()}><Icon name="close"/></button></div>{#if galleryOpen}<Photo name={headTrainerGallery[photo].image} alt={c.photoAlts[photo]} eager position={headTrainerGallery[photo].position}/>{/if}<div class="gallery-dialog-bottom"><button aria-label={c.previous} onclick={() => changePhoto(-1)}><Icon name="arrow-left" size={24}/></button><span>{photoNumber(photo + 1)} / {galleryCount} — {c.photoLabels[photo]}</span><button aria-label={c.next} onclick={() => changePhoto(1)}><Icon name="arrow" size={24}/></button></div><p class="photo-note">{c.galleryNote}</p></dialog>

<style>
  .profile-hero{padding:26px max(5.5vw,24px) 0;max-width:1800px;margin:auto}.profile-back{display:inline-flex;align-items:center;gap:12px;font-size:11px;min-height:44px;color:var(--muted);margin-bottom:20px}.profile-hero-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px}.profile-hero-copy{grid-column:span 7;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;background:#f2f2ee;padding:38px 42px 36px;min-width:0}.profile-kicker{display:flex;align-items:center;gap:10px;font-size:9px}.profile-kicker>i{width:5px;height:5px;background:currentColor}.profile-hero-copy h1{font:800 clamp(72px,8.2vw,138px)/.88 Barlow,Impact,sans-serif;letter-spacing:-.025em;margin:32px 0 24px}.profile-hero-copy h1>span{display:block}.profile-byline{font-size:12px;line-height:1.7;font-weight:600}.profile-intro{font-size:13px;color:var(--muted);line-height:1.9;max-width:380px;margin-top:20px}.profile-story{min-width:225px;margin-top:16px}.profile-poster{grid-column:8/span 5;grid-row:1;position:relative;min-height:580px;background:#242520;overflow:hidden;color:white}.profile-poster:after{content:'';position:absolute;inset:50% 0 0;background:linear-gradient(transparent,#080808d9);pointer-events:none}.profile-poster> :global(img){position:absolute;width:100%;height:100%;object-fit:cover;filter:grayscale(1)}.poster-top{position:absolute;top:25px;left:25px;right:25px;display:flex;justify-content:space-between;align-items:flex-start;font-size:9px;letter-spacing:.1em}.poster-top>img{width:46px;height:auto;filter:invert(1)}.poster-bottom{position:absolute;z-index:1;left:30px;right:30px;bottom:30px}.poster-bottom>span{font-size:8px;letter-spacing:.1em}.poster-bottom>strong{display:block;font:800 clamp(34px,3.8vw,60px)/.96 Barlow,Impact,sans-serif;text-transform:uppercase;margin-top:12px}.profile-index{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:28px;border-block:1px solid var(--line)}.profile-index>a{display:flex;gap:18px;align-items:center;min-height:70px;padding:18px 22px;font-size:11px}.profile-index>a+a{border-left:1px solid var(--line)}.profile-index>a>span{font-size:8px;color:var(--muted)}.profile-index>a> :global(svg){margin-left:auto}.profile-bio-grid{display:grid;grid-template-columns:1fr 1fr;gap:9vw;margin-top:22px}.profile-bio-grid .display{font-size:clamp(48px,5.8vw,90px)}.profile-facts{margin-top:32px;max-width:390px}.profile-facts h3{font-size:14px;margin-bottom:12px}.profile-facts ul{list-style:none;padding:0;margin:0}.profile-facts li{padding:12px 0;border-top:1px solid var(--line);font-size:13px;line-height:1.6}.profile-instagram{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px;border:1px solid var(--line);max-width:390px;margin-top:18px;font-size:13px}.profile-instagram small{display:block;font-size:9px;color:var(--muted);margin-bottom:5px}.profile-chapter+.profile-chapter{margin-top:28px;padding-top:24px;border-top:1px solid var(--line)}.profile-chapter h3{font:800 clamp(23px,2.5vw,36px)/1.12 Barlow,Impact,sans-serif}.profile-chapter p{font-size:14px;line-height:1.8;color:var(--muted);margin-top:12px}.profile-countries{display:grid;gap:12px;margin:18px 0}.profile-countries>div{background:var(--surface);padding:16px 20px}.profile-countries h4{font-size:14px}.profile-countries ul{padding-inline-start:20px;margin:8px 0;font-size:13px;line-height:1.8}.profile-bento{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:repeat(5,190px);gap:16px}.bento-tile{position:relative;overflow:hidden;padding:0;background:#252622;color:#fff;min-width:0;text-align:left}.bento-tile:after{content:'';position:absolute;inset:40% 0 0;background:linear-gradient(transparent,#080808c9);pointer-events:none}.bento-tile> :global(img){width:100%;height:100%;object-fit:cover;filter:saturate(.65);transition:transform .65s cubic-bezier(.2,.7,.2,1),filter .5s}.tile-0{grid-column:1/span 5;grid-row:1/span 2}.tile-1{grid-column:6/span 7;grid-row:1}.tile-2{grid-column:6/span 3;grid-row:2}.tile-3{grid-column:9/span 4;grid-row:2}.tile-4{grid-column:1/span 7;grid-row:3}.tile-5{grid-column:8/span 5;grid-row:3}.tile-6{grid-column:1/span 4;grid-row:4/span 2}.tile-7{grid-column:5/span 4;grid-row:4/span 2}.tile-8{grid-column:9/span 4;grid-row:4/span 2}.tile-9,.tile-10{grid-column:span 6;height:clamp(300px,36vw,560px)}.bento-top{position:absolute;top:20px;left:20px;font-size:8px;letter-spacing:.1em;text-shadow:0 1px 10px #000}.bento-bottom{position:absolute;z-index:1;bottom:20px;left:20px;right:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;line-height:1.5}.bento-plus{width:34px;height:34px;display:grid;place-items:center;border:1px solid #ffffff70;flex-shrink:0;background:#08080830;backdrop-filter:blur(8px)}.profile-contact{background:var(--surface);border-top:1px solid var(--line)}.profile-contact>div{display:grid;grid-template-columns:1.2fr 1fr;gap:8vw;align-items:end;margin-top:28px}.profile-contact>div>div>p{font-size:14px;color:var(--muted);max-width:340px;margin-bottom:25px}.profile-contact .button{min-width:275px}.profile-contact .quiet-link{display:flex;margin-top:15px;font-size:11px}.profile-contact-signature{display:block;font-size:8px;letter-spacing:.1em;border-top:1px solid var(--line);padding-top:25px;margin-top:45px;color:var(--muted)}
  @media(hover:hover){.bento-tile:hover> :global(img){transform:scale(1.035);filter:saturate(1)}.bento-tile:hover .bento-plus{background:#fff;color:#101010}.profile-instagram:hover{background:var(--surface)}}
  @media(min-width:1500px){.profile-bento{grid-template-rows:repeat(5,230px)}}
  @media(max-width:1000px){.profile-hero-copy{padding:30px}.profile-hero-copy h1{font-size:9vw}.profile-poster{min-height:530px}.profile-bento{grid-template-rows:repeat(5,170px)}.profile-bio-grid{gap:6vw}.profile-index>a{padding:16px;gap:10px;font-size:10px}.profile-contact>div{gap:5vw}}
  @media(max-width:700px){.profile-hero{padding:18px 24px 0}.profile-back{font-size:10px;margin-bottom:16px}.profile-hero-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.profile-hero-copy{grid-column:1/-1;padding:28px 24px}.profile-kicker{font-size:7px}.profile-hero-copy h1{font-size:clamp(54px,18vw,125px);margin:28px 0 22px}.profile-byline{font-size:11px}.profile-intro{font-size:12px;margin-top:18px}.profile-story{font-size:11px;min-width:210px}.profile-poster{grid-column:1/-1;grid-row:auto;min-height:0;aspect-ratio:.9}.poster-top{top:20px;left:20px;right:20px}.poster-bottom{left:24px;right:24px;bottom:24px}.poster-bottom>strong{font-size:42px}.poster-bottom>span{font-size:7px}.profile-index{grid-template-columns:1fr;margin-top:24px}.profile-index>a{min-height:54px;padding:14px 0;font-size:11px}.profile-index>a+a{border-left:0;border-top:1px solid var(--line)}.profile-bio-grid{grid-template-columns:1fr;gap:32px}.profile-bio-grid .display{font-size:clamp(48px,13vw,76px)}.profile-facts{margin-top:24px;max-width:none}.profile-instagram{max-width:none}.profile-bento{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:none;grid-auto-rows:210px;gap:12px}.bento-tile{grid-column:auto;grid-row:auto}.tile-0{grid-column:1/-1;grid-row:span 2}.tile-1,.tile-4,.tile-5{grid-column:1/-1}.tile-6,.tile-9,.tile-10{grid-column:1/-1;grid-row:span 2}.tile-9,.tile-10{height:auto}.bento-top{left:15px;top:15px;font-size:7px}.bento-bottom{left:15px;right:15px;bottom:15px;font-size:10px;gap:8px}.bento-plus{width:28px;height:28px}.profile-contact>div{grid-template-columns:1fr;gap:28px}.profile-contact .button{min-width:0;width:100%}.profile-contact-signature{font-size:6px;line-height:1.8}.profile-biography .section-top>.eyebrow:last-child{font-size:6px}}
  @media(prefers-reduced-motion:reduce){.bento-tile> :global(img){transition:none}}
</style>
