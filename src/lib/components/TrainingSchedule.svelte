<script lang="ts">
  import { getContext, onMount, untrack, tick } from 'svelte';
  import { siteName, sites, type SiteId, type Lang } from '#lib/site.ts';
  import { editorial } from '#lib/editorial.ts';
  import { demoCopy, disciplines } from '#lib/demo.ts';
  import { reveal } from '#lib/effects.ts';
  import { membershipCopy } from '#lib/memberships.ts';
  import { experienceCopy } from '#lib/experience-copy.ts';
  import { experienceKey, formatMoney, restoreSelection, selectionQuery, type Experience } from '#lib/selection.ts';
  import { mondayIndex, nextSession, zonedClock } from '#lib/schedule.ts';
  import Icon from './Icon.svelte';
  import PrivateLessons from './PrivateLessons.svelte';
  import ContentStatus from './ContentStatus.svelte';
  import { contentKey, type ContentState } from '#lib/content-schema.ts';
  let { site, lang, label }: { site: SiteId; lang: Lang; label: string } = $props();
  const experience = getContext<Experience>(experienceKey);
  const content = getContext<ContentState>(contentKey);
  const catalog = $derived(content.data.catalog);
  const sessions = $derived(content.data.sessions);
  const available = $derived(content.phase === 'ready' || content.phase === 'stale');
  const d = $derived(demoCopy[lang]), e = $derived(editorial[lang]), c = $derived(membershipCopy[lang]), ux = $derived(experienceCopy[lang]);
  let scheduleDiscipline = $state<SiteId>(untrack(() => site)), day = $state(0), now = $state<Date | null>(null);
  let membership: HTMLElement;
  let weeklyPlanner = $state<HTMLDivElement>(), dayHeading = $state<HTMLHeadingElement>();
  const nextLabel = $derived(catalog.status === 'sample' ? ux.next : lang === 'tr' ? 'SIRADAKİ DERS' : 'NEXT CLASS');
  const gymNow = $derived(now ? zonedClock(now,content.data.timezone) : null);
  let dayChosen = $state(false);
  $effect(() => { if (!dayChosen && gymNow) day = mondayIndex(gymNow); });
  const today = $derived(gymNow ? mondayIndex(gymNow) : -1);
  const classes = $derived(sessions.filter(session => session.day === day && (scheduleDiscipline === 'academy' || session.discipline === scheduleDiscipline)).sort((a,b) => a.time.localeCompare(b.time)));
  const next = $derived(gymNow ? nextSession(sessions, gymNow, scheduleDiscipline) : null);
  const plans = $derived(catalog.groupLessons[experience.selection.discipline]);
  const monthlyPlan = $derived(plans.find(plan => plan.months === 1));
  const periodName = (months: number) => months === 1 ? c.monthly : months === 12 ? c.year : `${months} ${c.months}`;
  const money = (amount: number) => formatMoney(amount, lang, catalog.currency);
  const percent = (amount: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'percent', maximumFractionDigits: 0 }).format(amount);
  const endTime = (time: string, minutes: number) => { const [hours, mins] = time.split(':').map(Number); const end = hours * 60 + mins + minutes; return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`; };
  async function showNextSession() {
    if (!next) return;
    dayChosen = true; day = next.session.day;
    await tick();
    dayHeading?.focus({ preventScroll: true });
    weeklyPlanner?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function chooseDiscipline(id: SiteId) { experience.selection.discipline = id; experience.selection = restoreSelection(new URLSearchParams(selectionQuery(experience.selection)),site,catalog); }
  function choosePlan(months: number, enquire = false) { experience.selection.months = months; experience.explicit = true; if (enquire) experience.enquiryOpen = true; }
  onMount(() => {
    now = new Date();
    const timer = setInterval(() => now = new Date(), 60000);
    const observer = new IntersectionObserver(([entry]) => experience.inMembership = entry.isIntersecting, { rootMargin: '-110px 0px -110px 0px' });
    observer.observe(membership);
    return () => { clearInterval(timer); observer.disconnect(); experience.inMembership = false; };
  });
</script>

<section id="schedule" class="section schedule-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{label}</span><a class="quiet-link" href="#membership">{ux.memberships}<Icon name="diagonal" size={18}/></a></div>
  <div class="section-heading"><h2 class="display">{e.scheduleTitle}</h2><p>{e.scheduleBody}</p></div>
  <ContentStatus {lang}/>
  {#if available}
  {#if catalog.status === 'sample'}<div class="demo-notice"><span class="demo-badge">{d.badge}</span><p>{d.note}</p></div>{/if}
  {#if site === 'academy'}<div class="routine-filters" role="group" aria-label={d.disciplineSelect}>{#each ['academy', ...disciplines] as id}<button class:active={scheduleDiscipline === id} aria-pressed={scheduleDiscipline === id} onclick={() => scheduleDiscipline = id as SiteId}>{id === 'academy' ? d.allAccess : siteName(id as SiteId, lang)}</button>{/each}</div>{/if}
  {#if next}
    <button class="next-session" type="button" aria-controls="weekly-planner" aria-label={`${ux.showDay}: ${d.days[next.session.day]}, ${next.session.time}, ${siteName(next.session.discipline, lang)}`} onclick={showNextSession}>
      <span class="next-session-top"><span class="next-session-label"><i aria-hidden="true"></i>{nextLabel}</span><span class="next-session-action">{ux.showDay}<Icon name="arrow" size={17}/></span></span>
      <span class="next-session-main"><time datetime={next.session.time}>{next.session.time}</time><span class="next-session-details"><strong>{siteName(next.session.discipline, lang)}</strong><span>{`${next.dayOffset === 0 ? ux.today : d.days[next.session.day]} · ${next.session.duration} ${d.minutes}`}</span></span></span>
    </button>
  {/if}
  <div id="weekly-planner" class="weekly-planner" bind:this={weeklyPlanner}>
    <div class="planner-sidebar"><span class="eyebrow">{d.weekly}</span><h3 class="selected-day-heading" tabindex="-1" bind:this={dayHeading}>{d.days[day]}<span aria-hidden="true"><Icon name="diagonal" size="1em"/></span></h3><p>{day === today ? ux.today : scheduleDiscipline === 'academy' ? 'SELF CONTROL FIGHT ACADEMY' : siteName(scheduleDiscipline, lang)}</p><span class="class-count">{String(classes.length).padStart(2, '0')} <small>{lang === 'en' && classes.length === 1 ? 'class' : d.sessions}</small></span></div>
    <div class="planner-main"><div class="day-selector" role="group" aria-label={d.daySelect}>{#each d.shortDays as name, index}<button class:active={day === index} class:today={today === index} aria-pressed={day === index} aria-label={`${d.days[index]}${index === today ? ` / ${ux.today}` : ''}`} onclick={() => { dayChosen = true; day = index; }}><span>{name}</span><i aria-hidden="true"></i></button>{/each}</div>
      <div class="session-list" aria-live="polite" aria-atomic="true">{#each classes as session}<article class="session-row" style={`--session-accent:${sites[session.discipline].accent}`}><div class="session-time"><time>{session.time}</time><span>{endTime(session.time, session.duration)}</span></div><div class="session-info"><span class="session-discipline" lang={lang}>{siteName(session.discipline, lang)}</span><h4>{session.title[lang]}</h4><div class="session-meta"><span>{d.levels[session.level]}</span><span>{session.duration} {d.minutes}</span></div></div><span class="session-arrow" aria-hidden="true"><Icon name="diagonal" size="1em"/></span></article>{:else}<div class="rest-day"><Icon name="calendar" size={28}/><h4>{ux.noClass}</h4><p>{ux.noClassBody}</p>{#if next}<button class="underlined-link" onclick={showNextSession}>{ux.showDay}<Icon name="arrow" size={17}/></button>{/if}</div>{/each}</div>
    </div>
  </div><p class="schedule-footnote">{catalog.status === 'sample' ? ux.timetableNote : lang === 'tr' ? `Saat dilimi: ${content.data.timezone}. Güncel ders bilgilerini katılımdan önce teyit edin.` : `Class times: ${content.data.timezone}. Confirm details before attending.`}</p>
  {/if}
</section>

<section id="membership" class="section membership-section" bind:this={membership}>
  <div class="membership-heading"><div><span class="eyebrow">{d.membershipLabel}{available && catalog.status === 'sample' ? (lang === 'tr' ? ' / ÖRNEK' : ' / SAMPLE') : ''}</span><h2 class="display">{d.membershipTitle}</h2></div><div><p>{d.membershipIntro}</p><span class="membership-scope"><small>{d.scope}</small><strong>{experience.selection.discipline === 'academy' ? d.allAccessBody : siteName(experience.selection.discipline, lang)}</strong></span></div></div>
  <ContentStatus {lang}/>
  {#if available}
  {#if site === 'academy'}<div class="routine-filters" role="group" aria-label={lang === 'tr' ? 'Üyelik branşı' : 'Membership discipline'}>{#each ['academy', ...disciplines] as id}<button class:active={experience.selection.discipline === id} aria-pressed={experience.selection.discipline === id} onclick={() => chooseDiscipline(id as SiteId)}>{id === 'academy' ? d.allAccess : siteName(id as SiteId, lang)}</button>{/each}</div>{/if}
  <div class="membership-types" role="group" aria-label={c.type}><button class:active={experience.selection.type === 'group'} aria-pressed={experience.selection.type === 'group'} onclick={() => experience.selection.type = 'group'}><Icon name="training" size={18}/>{c.group}</button><button class:active={experience.selection.type === 'private'} aria-pressed={experience.selection.type === 'private'} onclick={() => experience.selection.type = 'private'}><Icon name="diagonal" size={18}/>{c.private}</button></div>
  {#if experience.selection.type === 'private'}<PrivateLessons {lang}/>{:else}
    {#if plans.length}<div class="pricing-grid">
      {#each plans as plan}<article class="price-card" class:featured={plan.months === 6} class:plan-chosen={experience.selection.months === plan.months}>
        <button class="plan-select" aria-pressed={experience.selection.months === plan.months} onclick={() => choosePlan(plan.months)}><span>{periodName(plan.months)}</span><span class="plan-check"><Icon name={experience.selection.months === plan.months ? 'check' : 'plus'} size={20}/></span></button>
        <p class="price-description">{plan.months === 1 ? c.oneMonth : plan.months < 12 ? c.shortTerm : c.longTerm}</p>
        <div class="plan-price"><strong>{money(plan.price)}</strong></div><p class="price-total-label">{ux.upfront}</p><p class="price-payment">{money(plan.price / plan.months)} <span>{ux.monthly}</span></p>
        <div class="price-saving">{#if plan.months > 1 && monthlyPlan && plan.price < monthlyPlan.price * plan.months}<span>{d.save}</span><strong>{percent(1 - plan.price / (monthlyPlan.price * plan.months))} {d.saving}</strong>{:else}<span>{experience.selection.discipline === 'academy' ? d.allAccess : d.singleAccess}</span><Icon name="training" size={17}/>{/if}</div>
        <button class="button price-cta" onclick={() => choosePlan(plan.months, true)}>{d.cta}<Icon name="diagonal" size={19}/></button>
      </article>{/each}
    </div>
    {:else}<p class="pricing-note">{lang === 'tr' ? 'Seçilen branş için grup dersi paketleri henüz yayımlanmadı.' : 'Group class packages have not been published for the selected discipline.'}</p>{/if}
    {#if plans.length}<details class="plan-inclusions"><summary>{ux.included}<Icon name="plus" size={20}/></summary><ul>{#each (experience.selection.discipline === 'academy' ? d.allBenefits : d.benefits) as benefit}<li><Icon name="check" size={18}/>{benefit}</li>{/each}</ul><p>{c.groupNote}</p></details>{/if}
    <p class="pricing-note">{catalog.status === 'sample' ? ux.preview : c.groupNote}</p>
  {/if}
  {/if}
</section>

<style>
.membership-types{display:flex;gap:8px;border-bottom:1px solid var(--line);padding-bottom:22px;margin-bottom:25px}.membership-types button{display:flex;align-items:center;justify-content:center;gap:12px;min-height:54px;padding:15px 24px;background:transparent;color:var(--fg);border:1px solid var(--line);font-size:14px;transition:background .2s,color .2s}.membership-types button.active{background:var(--signal);color:var(--button-fg);border-color:var(--signal)}.membership-section{background:var(--bg);border-top:1px solid var(--line)}.membership-heading h2{margin-top:24px}.schedule-footnote{font-size:12px;color:var(--muted);margin-top:18px}.day-selector .today i{width:5px;height:5px;opacity:1;background:var(--accent)}.plan-select{display:flex;align-items:center;justify-content:space-between;gap:15px;background:transparent;padding:0;text-align:left;min-height:52px;width:100%;color:inherit}.plan-select>span:first-child{font:800 38px/1 Barlow;text-transform:uppercase}.plan-check{display:grid;place-items:center;width:36px;height:36px;border:1px solid currentColor;border-radius:50%;opacity:.5}.plan-chosen .plan-check{opacity:1}.price-card.plan-chosen{outline:2px solid var(--signal);outline-offset:4px}.price-total-label{font-size:12px;opacity:.8;margin-top:8px}.plan-inclusions{border-block:1px solid var(--line);margin-top:28px}.plan-inclusions summary{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:64px;font-size:14px}.plan-inclusions ul{list-style:none;padding:0;display:grid;gap:15px;margin:8px 0 24px}.plan-inclusions li{display:flex;align-items:center;gap:12px;font-size:13px}.plan-inclusions p{color:var(--muted);font-size:13px;max-width:680px;margin-bottom:25px}
@media(max-width:700px){.membership-types button{flex:1;padding:14px 10px;gap:8px;font-size:13px}.membership-heading h2{font-size:clamp(44px,12vw,68px)}.plan-select>span:first-child{font-size:34px}.plan-select{margin-bottom:8px}.plan-inclusions summary{font-size:14px}.schedule-footnote{font-size:12px}}

.next-session{display:block;width:100%;padding:24px 28px;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-bottom:0;text-align:left;transition:background .2s,border-color .2s}.next-session-top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:20px}.next-session-label{display:flex;align-items:center;gap:9px;font-size:11px;line-height:1.6;letter-spacing:.09em;color:var(--muted)}.next-session-label i{width:5px;height:5px;background:var(--signal);flex-shrink:0;border-radius:50%}.next-session-action{display:flex;align-items:center;gap:10px;font-size:13px;line-height:1.6;color:var(--signal);white-space:nowrap}.next-session-action :global(svg){transition:transform .2s}.next-session-main{display:flex;align-items:center;gap:24px}.next-session-main>time{font:800 48px/1 Barlow,Impact,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.015em;padding-right:24px;border-right:1px solid var(--line)}.next-session-details{display:grid;gap:5px;min-width:0}.next-session-details>strong{font-size:17px;line-height:1.5;font-weight:500}.next-session-details>span{font-size:13px;line-height:1.6;color:var(--muted)}.next-session:active{background:var(--surface)}.selected-day-heading:focus{outline:none}.weekly-planner:has(.selected-day-heading:focus-visible){outline:2px solid var(--signal);outline-offset:4px}
@media(hover:hover){.next-session:hover{background:var(--surface);border-color:var(--signal)}.next-session:hover .next-session-action :global(svg){transform:translateX(3px)}}
@media(max-width:700px){.next-session{padding:20px}.next-session-top{gap:12px;margin-bottom:18px}.next-session-label{font-size:10px;letter-spacing:.06em;gap:7px}.next-session-action{font-size:12px;gap:7px}.next-session-main{gap:18px}.next-session-main>time{font-size:44px;padding-right:18px}.next-session-details>strong{font-size:16px}.next-session-details>span{font-size:13px}}
@media(max-width:360px){.next-session{padding:18px 16px}.next-session-top{gap:8px}.next-session-label{font-size:9px;letter-spacing:.02em;gap:6px}.next-session-action{font-size:11px;gap:6px}.next-session-main{gap:14px}.next-session-main>time{font-size:42px;padding-right:14px}}
</style>
