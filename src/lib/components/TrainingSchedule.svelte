<script lang="ts">
  import { getContext, onMount, tick } from 'svelte';
  import { siteName, sites, type SiteId, type Lang } from '#lib/site.ts';
  import { editorial } from '#lib/editorial.ts';
  import { demoCopy, disciplines, type Session } from '#lib/demo.ts';
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
  let day = $state(0), now = $state<Date | null>(null);
  let membership: HTMLElement;
  let weeklyPlanner = $state<HTMLDivElement>(), dayHeading = $state<HTMLHeadingElement>();
  const nextLabel = $derived(catalog.status === 'sample' ? ux.next : lang === 'tr' ? 'SIRADAKİ DERS' : 'NEXT CLASS');
  const gymNow = $derived(now ? zonedClock(now,content.data.timezone) : null);
  let dayChosen = $state(false);
  $effect(() => { if (!dayChosen && gymNow) day = mondayIndex(gymNow); });
  const today = $derived(gymNow ? mondayIndex(gymNow) : -1);
  const scheduleByDay = $derived(d.days.map((name, index) => ({
    name,
    classes: sessions.filter(session => session.day === index && (site === 'academy' || session.discipline === site))
      .sort((a, b) => a.time.localeCompare(b.time))
  })));
  const selectedDay = $derived(scheduleByDay[day]);
  const sample = $derived(catalog.status === 'sample');
  const next = $derived(gymNow ? nextSession(sessions, gymNow, site) : null);
  const plans = $derived(catalog.groupLessons[experience.selection.discipline]);
  const monthlyPlan = $derived(plans.find(plan => plan.months === 1));
  const periodName = (months: number) => months === 1 ? c.monthly : months === 12 ? c.year : `${months} ${c.months}`;
  const money = (amount: number) => formatMoney(amount, lang, catalog.currency);
  const percent = (amount: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'percent', maximumFractionDigits: 0 }).format(amount);
  const endTime = (time: string, minutes: number) => { const [hours, mins] = time.split(':').map(Number); const end = hours * 60 + mins + minutes; return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`; };
  async function showNextSession() {
    if (!next) return;
    const scroll = { block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' } as const;
    if (site === 'academy') {
      const heading = document.getElementById(`schedule-day-${next.session.day}`);
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView(scroll);
      return;
    }
    dayChosen = true; day = next.session.day;
    await tick();
    dayHeading?.focus({ preventScroll: true });
    weeklyPlanner?.scrollIntoView(scroll);
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

{#snippet sessionRow(session: Session)}
  <li class="class-row" style:--class-accent={sites[session.discipline].accent} style:--class-ink={site === 'academy' ? sites[session.discipline].dark : sites[session.discipline].accent}>
    <div class="class-time">
      <time datetime={session.time}>{session.time}</time>
      <span>– {endTime(session.time, session.duration)}</span>
    </div>
    <div class="class-info">
      <h4>{session.title[lang]}</h4>
      <div class="class-meta">
        {#if site === 'academy'}<span class="class-discipline">{siteName(session.discipline, lang)}</span>{/if}
        <span>{d.levels[session.level]}</span>
        <span>{session.duration} {d.minutes}</span>
      </div>
    </div>
  </li>
{/snippet}

<section id="schedule" class="section schedule-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{label}</span><a class="quiet-link" href="#membership">{ux.memberships}<Icon name="diagonal" size={18}/></a></div>
  <div class="schedule-heading">
    <h2 class="display">{e.scheduleTitle.replace('\n', ' ')}</h2>
    <p>{site === 'academy' ? e.academyScheduleBody : e.scheduleBody}</p>
  </div>
  <ContentStatus {lang}/>
  {#if available}
    {#if sample}
      <div class="sample-notice"><strong>{d.badge}</strong><p>{d.note}</p></div>
    {/if}
    {#if next}
      <button class="next-session" type="button" aria-controls="weekly-planner" onclick={showNextSession}>
        <span class="next-session-info">
          <span class="next-session-label">{nextLabel}</span>
          <span class="next-session-details">
            <time datetime={next.session.time}>{next.session.time}</time>
            <span>{next.dayOffset === 0 ? ux.today : d.days[next.session.day]} · {siteName(next.session.discipline, lang)}</span>
          </span>
        </span>
        <span class="next-session-action">{ux.showDay}<Icon name="arrow-down" size={16}/></span>
      </button>
    {/if}
    {#if site === 'academy'}
      <div id="weekly-planner" class="academy-week">
        {#each scheduleByDay as { name, classes }, index (name)}
          <section class="schedule-day" aria-labelledby={`schedule-day-${index}`}>
            <h3 id={`schedule-day-${index}`} tabindex="-1">{name}{#if today === index}<small>{ux.today}</small>{/if}</h3>
            {#if classes.length}
              <ul class="class-list" role="list">
                {#each classes as session}{@render sessionRow(session)}{/each}
              </ul>
            {:else}
              <p class="schedule-empty">{lang === 'tr' ? 'Planlı ders yok.' : 'No scheduled classes.'}</p>
            {/if}
          </section>
        {/each}
      </div>
    {:else}
      <div id="weekly-planner" class="branch-week" bind:this={weeklyPlanner}>
        <div class="schedule-days" role="group" aria-label={d.daySelect}>
          {#each d.shortDays as name, index}
            <button type="button" class:today={today === index} aria-pressed={day === index} aria-label={`${d.days[index]}${index === today ? ` / ${ux.today}` : ''}`} onclick={() => { dayChosen = true; day = index; }}>
              <span>{name}</span>
            </button>
          {/each}
        </div>
        <section class="schedule-day" aria-labelledby="selected-schedule-day" aria-live="polite" aria-atomic="true">
          <h3 id="selected-schedule-day" tabindex="-1" bind:this={dayHeading}>{selectedDay.name}{#if day === today}<small>{ux.today}</small>{/if}</h3>
          {#if selectedDay.classes.length}
            <ul class="class-list" role="list">
              {#each selectedDay.classes as session}{@render sessionRow(session)}{/each}
            </ul>
          {:else}
            <p class="schedule-empty">{ux.noClass} {ux.noClassBody}</p>
          {/if}
        </section>
      </div>
    {/if}
    <p class="schedule-footnote">{sample ? ux.timetableNote : lang === 'tr' ? `Saat dilimi: ${content.data.timezone}. Güncel ders bilgilerini katılımdan önce teyit edin.` : `Class times: ${content.data.timezone}. Confirm details before attending.`}</p>
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
  .schedule-section {
    padding-block: clamp(40px, 5vw, 70px);
  }

  .schedule-section .section-top {
    align-items: center;
    padding-block: 4px;
  }

  .schedule-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 10px 32px;
    margin: 12px 0 22px;
  }

  .schedule-heading h2 {
    font-size: clamp(32px, 4.2vw, 64px);
    white-space: normal;
  }

  .schedule-heading p {
    max-width: 360px;
    color: var(--muted);
    font-size: 13px;
  }

  .sample-notice {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 3px 14px;
    margin-bottom: 12px;
    padding: 8px 12px;
    border-left: 2px solid var(--signal);
    background: var(--bg);
    color: var(--muted);
    font-size: 12px;
  }

  .sample-notice strong {
    color: var(--fg);
    font-size: 10px;
    letter-spacing: .05em;
  }

  .next-session {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px 20px;
    width: 100%;
    min-height: 48px;
    padding: 9px 14px;
    margin-bottom: 12px;
    border: 1px solid var(--line);
    background: var(--bg);
    color: var(--fg);
    text-align: left;
  }

  .next-session-info, .next-session-details, .next-session-action {
    display: flex;
    align-items: center;
  }

  .next-session-info {
    flex-wrap: wrap;
    gap: 2px 14px;
  }

  .next-session-label {
    color: var(--muted);
    font-size: 10px;
    letter-spacing: .06em;
  }

  .next-session-details {
    gap: 8px;
    font-size: 13px;
  }

  .next-session-details time {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .next-session-action {
    flex-shrink: 0;
    gap: 6px;
    color: var(--signal);
    font-size: 12px;
  }

  .next-session:hover {
    border-color: var(--signal);
  }

  .academy-week {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    align-items: start;
  }

  .schedule-day, .schedule-days {
    background: var(--bg);
    border: 1px solid var(--line);
    min-width: 0;
  }

  .schedule-day h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 36px;
    padding: 6px 14px;
    border-bottom: 1px solid var(--line);
    background: var(--surface);
    font-size: 14px;
    font-weight: 700;
  }

  .schedule-day h3:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: -2px;
  }

  .schedule-day h3 small {
    padding: 1px 6px;
    background: var(--signal);
    color: var(--button-fg);
    font-size: 10px;
  }

  .class-list {
    margin: 0;
    padding: 0 14px;
    list-style: none;
  }

  .class-row {
    display: grid;
    grid-template-columns: 54px minmax(0, 1fr);
    align-items: baseline;
    gap: 12px;
    padding-block: 8px;
  }

  .class-row + .class-row {
    border-top: 1px solid var(--line);
  }

  .class-time {
    display: grid;
    font-size: 11px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }

  .class-time time {
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
  }

  .class-info h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .class-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px 9px;
    margin-top: 3px;
    color: var(--muted);
    font-size: 11px;
  }

  .class-discipline {
    color: var(--class-ink);
    background: color-mix(in srgb, var(--class-accent) 23%, var(--bg));
    padding-inline: 5px;
  }

  .schedule-days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    border-bottom: 0;
  }

  .schedule-days button {
    position: relative;
    min-height: 44px;
    padding-inline: 2px;
    background: transparent;
    color: var(--muted);
    font-size: 12px;
  }

  .schedule-days button + button {
    border-left: 1px solid var(--line);
  }

  .schedule-days button:hover {
    color: var(--fg);
  }

  .schedule-days button[aria-pressed="true"] {
    background: var(--signal);
    color: var(--button-fg);
  }

  .schedule-days button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -4px;
  }

  .schedule-days .today::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: calc(50% - 2px);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
  }

  .schedule-empty {
    padding: 10px 14px;
    color: var(--muted);
    font-size: 12px;
  }

  .schedule-footnote {
    margin-top: 10px;
    color: var(--muted);
    font-size: 12px;
  }

  @media (max-width: 780px) {
    .schedule-heading {
      flex-direction: column;
      align-items: start;
      margin-bottom: 16px;
    }

    .academy-week {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }

    .next-session-action {
      max-width: 115px;
      text-align: right;
    }

    .next-session-action :global(svg) {
      flex-shrink: 0;
    }
  }

.membership-types{display:flex;gap:8px;border-bottom:1px solid var(--line);padding-bottom:22px;margin-bottom:25px}.membership-types button{display:flex;align-items:center;justify-content:center;gap:12px;min-height:54px;padding:15px 24px;background:transparent;color:var(--fg);border:1px solid var(--line);font-size:14px;transition:background .2s,color .2s}.membership-types button.active{background:var(--signal);color:var(--button-fg);border-color:var(--signal)}.membership-section{background:var(--bg);border-top:1px solid var(--line)}.membership-heading h2{margin-top:24px}.plan-select{display:flex;align-items:center;justify-content:space-between;gap:15px;background:transparent;padding:0;text-align:left;min-height:52px;width:100%;color:inherit}.plan-select>span:first-child{font:800 38px/1 Barlow;text-transform:uppercase}.plan-check{display:grid;place-items:center;width:36px;height:36px;border:1px solid currentColor;border-radius:50%;opacity:.5}.plan-chosen .plan-check{opacity:1}.price-card.plan-chosen{outline:2px solid var(--signal);outline-offset:4px}.price-total-label{font-size:12px;opacity:.8;margin-top:8px}.plan-inclusions{border-block:1px solid var(--line);margin-top:28px}.plan-inclusions summary{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:64px;font-size:14px}.plan-inclusions ul{list-style:none;padding:0;display:grid;gap:15px;margin:8px 0 24px}.plan-inclusions li{display:flex;align-items:center;gap:12px;font-size:13px}.plan-inclusions p{color:var(--muted);font-size:13px;max-width:680px;margin-bottom:25px}
@media(max-width:700px){.membership-types button{flex:1;padding:14px 10px;gap:8px;font-size:13px}.membership-heading h2{font-size:clamp(44px,12vw,68px)}.plan-select>span:first-child{font-size:34px}.plan-select{margin-bottom:8px}.plan-inclusions summary{font-size:14px}}
</style>
