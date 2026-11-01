<script lang="ts">
  import { copy, siteName, type Lang } from '#lib/site.ts';
  import { disciplineCopy, type DisciplineId } from '#lib/discipline-copy.ts';
  import { reveal } from '#lib/effects.ts';
  import Icon from './Icon.svelte';
  let { site, lang }: { site: DisciplineId; lang: Lang } = $props();
  const content = $derived(disciplineCopy[lang][site]);
  const detail = $derived(copy[lang].discipline[site]);
  const text = $derived(lang === 'tr' ? {
    label: '01 / ANTRENMAN İÇERİĞİ', areas: 'ÇALIŞMA ALANLARI',
    note: 'Başlamadan önce', body: 'Seviyenize uygun grup, gerekli ekipman ve katılım koşulları için antrenöre danışın.', cta: 'Bilgi alın'
  } : {
    label: '01 / TRAINING', areas: 'TRAINING AREAS',
    note: 'Before your first class', body: 'Ask a coach about suitable groups, equipment and participation requirements.', cta: 'Enquire about training'
  });
</script>

<section id="training" class="section branch-training" use:reveal>
  <div class="section-top"><span class="eyebrow">{text.label}</span><span class="eyebrow" lang={site === 'muaythai' ? 'en' : lang}>SELF CONTROL / {siteName(site, lang)}</span></div>
  <div class="training-layout">
    <div class="training-intro"><h2>{content.title}</h2><p>{detail.description}</p><div class="training-tags">{#each detail.tags as tag}<span>{tag}</span>{/each}</div></div>
    <div class="training-areas"><span class="areas-label">{text.areas}</span>{#each content.areas as area, index}<details open={index === 0}><summary><span class="area-index">0{index + 1}</span><h3>{area.title}</h3><span class="area-toggle"><Icon name="plus" size={19}/></span></summary><p>{area.body}</p></details>{/each}
      <div class="training-enquiry"><div><h3>{text.note}</h3><p>{text.body}</p></div><a href="#start">{text.cta}<Icon name="diagonal" size={18}/></a></div>
    </div>
  </div>
</section>

<style>
  .branch-training{padding-top:74px;padding-bottom:95px}
  .branch-training .section-top{padding-bottom:37px}
  .training-layout{display:grid;grid-template-columns:.9fr 1.1fr;gap:8vw;margin-top:12px}
  .training-intro{min-width:0}
  .training-intro h2{font:800 clamp(46px,5.3vw,82px)/1 Barlow,Impact,sans-serif;letter-spacing:-.015em;white-space:pre-line}
  .training-intro>p{font-size:13px;color:var(--muted);margin-top:29px;line-height:1.95;max-width:400px;text-wrap:pretty}
  .training-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px;max-width:360px}
  .training-tags>span{font-size:8px;letter-spacing:.05em;line-height:1.6;border:1px solid #373831;padding:7px 10px;color:#bcbdb3}
  .areas-label{display:block;font-size:8px;letter-spacing:.12em;color:#a3a59a;margin-bottom:18px}
  details{border-top:1px solid #3b3d34}
  details:last-of-type{border-bottom:1px solid #3b3d34}
  summary{display:flex;align-items:center;gap:21px;cursor:pointer;list-style:none;min-height:90px;padding-block:19px}
  summary::-webkit-details-marker{display:none}
  .area-index{font:800 29px/1 Barlow,Impact,sans-serif;color:var(--accent);min-width:29px;font-variant-numeric:tabular-nums}
  summary h3{font:800 clamp(24px,2.6vw,38px)/1.1 Barlow,Impact,sans-serif;letter-spacing:.005em}
  .area-toggle{display:grid;place-items:center;width:32px;height:32px;border:1px solid #484a40;border-radius:50%;margin-left:auto;flex-shrink:0;transition:background .2s,color .2s}
  .area-toggle :global(svg){transition:transform .25s}
  summary:hover .area-toggle,details[open] .area-toggle{background:var(--accent);color:#10110f;border-color:var(--accent)}
  details[open] .area-toggle :global(svg){transform:rotate(45deg)}
  details>p{font-size:13px;line-height:1.9;color:var(--muted);padding:0 42px 27px 50px;max-width:560px}
  .training-enquiry{display:flex;justify-content:space-between;align-items:flex-start;gap:26px;margin-top:35px}
  .training-enquiry h3{font-size:12px;color:#deded6;margin-bottom:9px}
  .training-enquiry p{font-size:11px;line-height:1.9;color:#a3a59a;max-width:310px}
  .training-enquiry>a{display:flex;align-items:center;gap:15px;min-height:44px;flex-shrink:0;font-size:11px;color:var(--accent);border-bottom:1px solid #484a40;white-space:nowrap}
  @media(min-width:701px) and (max-width:1000px){.training-layout{gap:5vw;grid-template-columns:.85fr 1.15fr}.training-intro h2{font-size:5.5vw}summary{gap:14px}summary h3{font-size:28px}details>p{padding-left:43px;padding-right:5px}.training-enquiry{flex-direction:column;gap:12px}.training-enquiry p{max-width:350px}}
  @media(max-width:700px){
    .branch-training{padding:60px 22px 65px}.branch-training .section-top{padding-bottom:27px}.branch-training .section-top>.eyebrow{font-size:9px}.branch-training .section-top>.eyebrow:last-child{font-size:8px}.training-layout{grid-template-columns:1fr;gap:37px;margin-top:8px}.training-intro h2{font-size:clamp(46px,12vw,76px)}.training-intro>p{font-size:13px;margin-top:22px;max-width:520px}.training-tags{margin-top:21px;max-width:none}.training-tags>span{font-size:8px;padding:7px 9px}.areas-label{font-size:8px;margin-bottom:14px}summary{min-height:80px;gap:16px}summary h3{font-size:28px}.area-index{font-size:27px;min-width:25px}.area-toggle{width:30px;height:30px}details>p{font-size:12px;padding:0 10px 24px 41px}.training-enquiry{gap:18px;flex-direction:column;margin-top:28px}.training-enquiry p{font-size:12px;max-width:470px}.training-enquiry h3{font-size:13px}.training-enquiry>a{font-size:12px}
  }
  @media(max-width:360px){.branch-training{padding-inline:18px}.training-intro h2{font-size:12vw}summary h3{font-size:25px}summary{gap:12px}.area-index{font-size:24px;min-width:23px}details>p{padding-left:35px}.branch-training .section-top>.eyebrow{font-size:8px}}
</style>
