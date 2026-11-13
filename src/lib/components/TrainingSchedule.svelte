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
  const t = $derived(lang === 'tr' ? {
    all: 'Tümü', filter: 'Branşa göre filtrele', live: 'Şu an', done: 'Bitti', tomorrow: 'Yarın', rest: 'Ders yok',
    classes: (n: number) => `${n} ders`, inMinutes: (h: number, m: number) => `${h ? `${h} sa ` : ''}${m || !h ? `${m} dk ` : ''}sonra`,
    swipe: 'Günler arasında geçiş için kaydırın', week: 'Haftalık ders programı', next: 'SIRADAKİ DERS'
  } : {
    all: 'All', filter: 'Filter by discipline', live: 'Live', done: 'Finished', tomorrow: 'Tomorrow', rest: 'No classes',
    classes: (n: number) => `${n} ${n === 1 ? 'class' : 'classes'}`, inMinutes: (h: number, m: number) => `in ${h ? `${h} h` : ''}${h && m ? ' ' : ''}${m || !h ? `${m} min` : ''}`,
    swipe: 'Swipe to switch days', week: 'Weekly class timetable', next: 'NEXT CLASS'
  });
  let day = $state(0), now = $state<Date | null>(null), dayChosen = $state(false), filter = $state<SiteId>('academy'), flashed = $state('');
  let membership: HTMLElement;
  let dayStrip = $state<HTMLDivElement>();
  const nextLabel = $derived(catalog.status === 'sample' ? ux.next : t.next);
  const gymNow = $derived(now ? zonedClock(now, content.data.timezone) : null);
  $effect(() => { if (!dayChosen && gymNow) day = mondayIndex(gymNow); });
  const today = $derived(gymNow ? mondayIndex(gymNow) : -1);
  const nowMinute = $derived(gymNow ? gymNow.hour * 60 + gymNow.minute : -1);
  const scope = $derived<SiteId>(site === 'academy' ? filter : site);
  const inScope = (session: Session, id: SiteId) => id === 'academy' || session.discipline === id;
  const filters = $derived(site === 'academy' ? [
    { id: 'academy' as SiteId, count: sessions.length },
    ...disciplines.map(id => ({ id: id as SiteId, count: sessions.filter(session => session.discipline === id).length })).filter(item => item.count)
  ] : []);
  const scheduleByDay = $derived(d.days.map((name, index) => ({
    name, short: d.shortDays[index],
    classes: sessions.filter(session => session.day === index && inScope(session, scope)).sort((a, b) => a.time.localeCompare(b.time))
  })));
  const sample = $derived(catalog.status === 'sample');
  const hasClasses = $derived(scheduleByDay.some(item => item.classes.length));
  const next = $derived(gymNow ? nextSession(sessions, gymNow, scope) : null);
  const plans = $derived(catalog.groupLessons[experience.selection.discipline]);
  const monthlyPlan = $derived(plans.find(plan => plan.months === 1));
  const periodName = (months: number) => months === 1 ? c.monthly : months === 12 ? c.year : `${months} ${c.months}`;
  const money = (amount: number) => formatMoney(amount, lang, catalog.currency);
  const percent = (amount: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'percent', maximumFractionDigits: 0 }).format(amount);
  const toMinutes = (time: string) => { const [hours, mins] = time.split(':').map(Number); return hours * 60 + mins; };
  const endTime = (time: string, minutes: number) => { const end = toMinutes(time) + minutes; return `${String(Math.floor(end / 60) % 24).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`; };
  const sessionKey = (session: Session) => `class-${session.day}-${session.time.replace(':', '')}-${session.discipline}`;
  const tone = (session: Session) => {
    const { accent, dark } = sites[session.discipline];
    return site === 'academy'
      ? `--class-accent:${accent};--class-ink:${dark};--class-bar:color-mix(in srgb,${accent} 60%,${dark})`
      : `--class-accent:${accent};--class-ink:${accent};--class-bar:${accent}`;
  };
  function classStatus(session: Session) {
    if (session.day !== today) return '';
    const start = toMinutes(session.time);
    return nowMinute >= start + session.duration ? 'done' : nowMinute >= start ? 'live' : '';
  }
  const countdown = (wait: number) => wait < 1440 ? t.inMinutes(Math.floor(wait / 60), wait % 60) : '';
  const nextDay = (offset: number, index: number) => offset === 0 ? ux.today : offset === 1 ? t.tomorrow : d.days[index];
  const motion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  const singleDay = () => window.matchMedia('(max-width: 1099px)').matches;
  function choose(index: number, focus = false) {
    dayChosen = true; day = (index + 7) % 7;
    if (focus) dayStrip?.querySelectorAll<HTMLButtonElement>('button')[day]?.focus();
  }
  function stripKeys(event: KeyboardEvent) {
    const moves: Record<string, number> = { ArrowRight: day + 1, ArrowLeft: day - 1, Home: 0, End: 6 };
    if (!(event.key in moves)) return;
    event.preventDefault(); choose(moves[event.key], true);
  }
  async function showNextSession() {
    if (!next) return;
    choose(next.session.day);
    await tick();
    const card = document.getElementById(sessionKey(next.session));
    if (!card) return;
    card.focus({ preventScroll: true });
    card.scrollIntoView({ block: singleDay() ? 'center' : 'nearest', behavior: motion() });
    flashed = card.id;
    setTimeout(() => { if (flashed === card.id) flashed = ''; }, 1800);
  }
  // Horizontal swipes on the single-day agenda move between days, like a native calendar.
  let touch: { x: number; y: number } | null = null;
  const touchStart = (event: TouchEvent) => { touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; };
  function touchEnd(event: TouchEvent) {
    if (!touch || !singleDay()) return;
    const dx = event.changedTouches[0].clientX - touch.x, dy = event.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6) choose(day + (dx < 0 ? 1 : -1));
  }
  function chooseDiscipline(id: SiteId) { experience.selection.discipline = id; experience.selection = restoreSelection(new URLSearchParams(selectionQuery(experience.selection)),site,catalog); }
  function choosePlan(months: number, enquire = false) { experience.selection.months = months; experience.explicit = true; if (enquire) experience.enquiryOpen = true; }
  onMount(() => {
    now = new Date();
    const timer = setInterval(() => now = new Date(), 30000);
    const observer = new IntersectionObserver(([entry]) => experience.inMembership = entry.isIntersecting, { rootMargin: '-110px 0px -110px 0px' });
    observer.observe(membership);
    return () => { clearInterval(timer); observer.disconnect(); experience.inMembership = false; };
  });
</script>

{#snippet classCard(session: Session)}
  {@const status = classStatus(session)}
  <li id={sessionKey(session)} class="class-card" class:live={status === 'live'} class:done={status === 'done'} class:flash={flashed === sessionKey(session)} style={tone(session)} tabindex="-1">
    <div class="class-time">
      <time datetime={session.time}>{session.time}</time>
      <span aria-label={lang === 'tr' ? `bitiş ${endTime(session.time, session.duration)}` : `until ${endTime(session.time, session.duration)}`}>{endTime(session.time, session.duration)}</span>
      {#if status === 'live'}<em class="class-status live-badge"><i aria-hidden="true"></i>{t.live}</em>{:else if status === 'done'}<em class="class-status">{t.done}</em>{/if}
    </div>
    <h4>{session.title[lang]}</h4>
    <div class="class-meta">
      {#if site === 'academy'}<span class="class-discipline">{siteName(session.discipline, lang)}</span>{/if}
      <span>{d.levels[session.level]}</span>
      <span class="class-duration"><Icon name="clock" size={13}/>{session.duration} {d.minutes}</span>
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
      <p class="sample-notice"><strong>{d.badge}</strong><span>{d.note}</span></p>
    {/if}

    <div class="schedule-toolbar" class:single={!filters.length}>
      {#if filters.length}
        <div class="schedule-filters" role="group" aria-label={t.filter}>
          {#each filters as item (item.id)}
            <button type="button" aria-pressed={filter === item.id} onclick={() => filter = item.id}
              style={item.id === 'academy' ? '' : `--dot:${sites[item.id].accent};--dot-ink:${sites[item.id].dark}`}>
              {#if item.id !== 'academy'}<i class="filter-dot" aria-hidden="true"></i>{/if}
              {item.id === 'academy' ? t.all : siteName(item.id, lang)}
              <small>{item.count}</small>
            </button>
          {/each}
        </div>
      {/if}

      {#if next}
        <button class="next-session" type="button" aria-controls="weekly-planner" onclick={showNextSession} style={tone(next.session)}>
          <span class="next-pulse" aria-hidden="true"></span>
          <span class="next-session-info">
            <span class="next-session-label">{nextLabel}{#if countdown(next.wait)}<b>{countdown(next.wait)}</b>{/if}</span>
            <span class="next-session-time"><time datetime={next.session.time}>{next.session.time}</time><span>– {endTime(next.session.time, next.session.duration)}</span></span>
            <span class="next-session-title">{next.session.title[lang]}</span>
            <span class="next-session-meta">{nextDay(next.dayOffset, next.session.day)} · {siteName(next.session.discipline, lang)} · {d.levels[next.session.level]}</span>
          </span>
          <span class="next-session-action"><span>{ux.showDay}</span><Icon name="arrow-down" size={18}/></span>
        </button>
      {/if}
    </div>

    {#if !hasClasses}
      <div id="weekly-planner" class="schedule-none">
        <Icon name="calendar" size={28}/>
        <div>
          <h3>{lang === 'tr' ? 'Ders saatleri yakında yayımlanacak' : 'Class times coming soon'}</h3>
          <p>{lang === 'tr' ? 'Bu branş için haftalık program henüz paylaşılmadı. Grup ve saat bilgisi için bizimle iletişime geçin.' : 'The weekly timetable for this discipline has not been published yet. Contact us for group and class times.'}</p>
        </div>
        <a class="button solid small" href="#start">{ux.contact}<Icon name="diagonal" size={16}/></a>
      </div>
    {:else}
    <div id="weekly-planner" class="planner">
      <div class="day-strip" role="group" aria-label={d.daySelect} bind:this={dayStrip}>
        {#each scheduleByDay as item, index (item.name)}
          <button type="button" class:today={today === index} aria-pressed={day === index} tabindex={day === index ? 0 : -1}
            aria-label={`${item.name}${index === today ? `, ${ux.today}` : ''}, ${item.classes.length ? t.classes(item.classes.length) : t.rest}`}
            onclick={() => choose(index)} onkeydown={stripKeys}>
            <span class="strip-name">{item.short}</span>
            <span class="strip-dots" aria-hidden="true">
              {#each { length: Math.min(item.classes.length, 4) } as _}<i></i>{:else}<i class="none"></i>{/each}
            </span>
          </button>
        {/each}
      </div>

      <div class="week" role="region" aria-label={t.week} ontouchstart={touchStart} ontouchend={touchEnd}>
        {#each scheduleByDay as item, index (item.name)}
          <section class="day" class:selected={day === index} class:is-today={today === index} aria-labelledby={`schedule-day-${index}`}>
            <header class="day-head">
              <h3 id={`schedule-day-${index}`} tabindex="-1">{item.name}</h3>
              {#if today === index}<small class="today-badge">{ux.today}</small>{/if}
              <span class="day-count">{item.classes.length ? t.classes(item.classes.length) : t.rest}</span>
            </header>
            {#if item.classes.length}
              <ul class="class-list" role="list">
                {#each item.classes as session (sessionKey(session))}{@render classCard(session)}{/each}
              </ul>
            {:else}
              <div class="day-empty"><Icon name="calendar" size={22}/><p><strong>{t.rest}</strong><span>{site === 'academy' && filter === 'academy' ? (lang === 'tr' ? 'Bu gün planlı ders bulunmuyor.' : 'Nothing scheduled for this day.') : ux.noClassBody}</span></p></div>
            {/if}
          </section>
        {/each}
      </div>
    </div>
    <p class="swipe-hint" aria-hidden="true"><Icon name="arrow-left" size={14}/>{t.swipe}<Icon name="arrow" size={14}/></p>
    {/if}

    <p class="schedule-footnote"><Icon name="globe" size={15}/><span>{sample ? ux.timetableNote : lang === 'tr' ? `Saat dilimi: ${content.data.timezone}. Güncel ders bilgilerini katılımdan önce teyit edin.` : `Class times: ${content.data.timezone}. Confirm details before attending.`}</span></p>
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
  /* ── Schedule: one system — weekly grid on wide screens, app-style day agenda below 1100px. ── */
  .schedule-section {
    --sticky-top: 88px;
    padding-block: clamp(48px, 6vw, 88px);
  }

  .schedule-section .section-top {
    align-items: center;
    padding-block: 4px;
  }

  .schedule-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 12px 40px;
    margin: 14px 0 28px;
  }

  .schedule-heading h2 {
    font-size: clamp(34px, 4.4vw, 66px);
    white-space: normal;
  }

  .schedule-heading p {
    max-width: 380px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.75;
  }

  .sample-notice {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    margin-bottom: 16px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
  }

  .sample-notice strong {
    padding: 4px 9px;
    border: 1px solid var(--line);
    background: var(--bg);
    color: var(--fg);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: .09em;
  }

  /* Toolbar: discipline filters + next-class card. */
  .schedule-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 480px);
    align-items: end;
    gap: 16px 32px;
    margin-bottom: 20px;
  }

  .schedule-toolbar.single {
    grid-template-columns: minmax(0, 1fr);
  }

  .schedule-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }

  .schedule-filters button {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    min-height: 44px;
    padding: 0 16px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--bg);
    color: var(--fg);
    font-size: 12px;
    white-space: nowrap;
    transition: background .2s, color .2s, border-color .2s;
  }

  .schedule-filters button:hover {
    border-color: var(--fg);
  }

  .schedule-filters button[aria-pressed="true"] {
    background: var(--signal);
    border-color: var(--signal);
    color: var(--button-fg);
  }

  .schedule-filters small {
    min-width: 20px;
    padding: 1px 6px;
    border-radius: 999px;
    background: color-mix(in srgb, currentColor 12%, transparent);
    font-size: 10px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .filter-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--dot-ink) 25%, transparent);
  }

  .next-session {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 16px 18px 16px 22px;
    border: 1px solid var(--line);
    background: var(--bg);
    color: var(--fg);
    text-align: left;
    overflow: hidden;
    transition: border-color .2s, transform .2s;
  }

  .next-session::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--class-bar);
  }

  .next-session:hover {
    border-color: var(--fg);
  }

  .next-session:hover .next-session-action :global(svg) {
    transform: translateY(3px);
  }

  .next-pulse {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--class-bar);
    animation: schedule-pulse 2.2s ease-out infinite;
  }

  .next-session-info {
    display: grid;
    gap: 3px;
    min-width: 0;
  }

  .next-session-label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;
    color: var(--muted);
    font-size: 9px;
    letter-spacing: .1em;
  }

  .next-session-label b {
    padding: 2px 7px;
    background: var(--surface);
    color: var(--fg);
    font-weight: 500;
    font-size: 10px;
    letter-spacing: .02em;
  }

  .next-session-time {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 4px;
    font-variant-numeric: tabular-nums;
  }

  .next-session-time time {
    font: 800 32px/1 Barlow, Impact, sans-serif;
    letter-spacing: -.01em;
  }

  .next-session-time span {
    color: var(--muted);
    font-size: 12px;
  }

  .next-session-title {
    font-size: 14px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .next-session-meta {
    color: var(--muted);
    font-size: 11px;
  }

  .next-session-action {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 8px;
    align-self: end;
    font-size: 12px;
  }

  .next-session-action :global(svg) {
    display: grid;
    width: 36px;
    height: 36px;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: 50%;
    transition: transform .25s;
  }

  /* Planner: shared markup, two layouts. */
  .planner {
    position: relative;
  }

  .day-strip {
    display: none;
  }

  .week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    border: 1px solid var(--line);
    background: var(--bg);
  }

  .day {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .day + .day {
    border-left: 1px solid var(--line);
  }

  .day-head {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 8px;
    padding: 16px 14px 14px;
    border-bottom: 1px solid var(--line);
  }

  .day-head h3 {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
  }

  .day-head h3:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 3px;
  }

  .today-badge {
    padding: 2px 7px;
    background: var(--signal);
    color: var(--button-fg);
    font-size: 9px;
    letter-spacing: .04em;
  }

  .day-count {
    flex-basis: 100%;
    color: var(--muted);
    font-size: 11px;
  }

  .is-today {
    background: color-mix(in srgb, var(--signal) 4%, var(--bg));
  }

  .is-today .day-head::before {
    content: '';
    position: absolute;
    inset: -1px 0 auto;
    height: 3px;
    background: var(--signal);
  }

  .class-list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 10px;
    list-style: none;
  }

  .class-card {
    display: grid;
    grid-template-areas: 'time' 'title' 'meta';
    gap: 6px;
    min-width: 0;
    padding: 12px 12px 12px 14px;
    border-left: 3px solid var(--class-bar);
    background: var(--surface);
    scroll-margin: 160px 0 110px;
    transition: opacity .2s, background .2s, box-shadow .2s;
  }

  .class-card:focus-visible, .class-card.flash {
    outline: 2px solid var(--signal);
    outline-offset: 2px;
  }

  .class-card.flash {
    animation: schedule-flash 1.6s ease-out;
  }

  .class-card.live {
    background: color-mix(in srgb, var(--class-accent) 16%, var(--bg));
  }

  .class-card.done {
    opacity: .5;
  }

  .class-time {
    grid-area: time;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 6px;
    color: var(--muted);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .class-time time {
    color: var(--fg);
    font-size: 15px;
    font-weight: 700;
  }

  .class-time > span::before {
    content: '– ';
  }

  .class-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    color: var(--muted);
    font-size: 9px;
    font-style: normal;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  .live-badge {
    color: var(--fg);
  }

  .live-badge i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #d6372b;
    animation: schedule-pulse 1.6s ease-out infinite;
    --pulse: #d6372b;
  }

  .class-card h4 {
    grid-area: title;
    margin: 0;
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1.45;
    overflow-wrap: anywhere;
    hyphens: auto;
  }

  .class-meta {
    grid-area: meta;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    color: var(--muted);
    font-size: 10.5px;
    line-height: 1.5;
  }

  .class-discipline {
    padding: 1px 6px;
    background: color-mix(in srgb, var(--class-accent) 30%, var(--bg));
    color: var(--class-ink);
  }

  .class-duration {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .day-empty {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 140px;
    margin: 10px;
    padding: 18px 10px;
    border: 1px dashed var(--line);
    color: var(--muted);
    text-align: center;
  }

  .day-empty :global(svg) {
    opacity: .6;
  }

  .day-empty p {
    display: grid;
    gap: 2px;
    font-size: 11px;
    line-height: 1.6;
  }

  .day-empty strong {
    color: var(--fg);
    font-size: 12px;
    font-weight: 500;
  }

  .day-empty span {
    display: none;
  }

  .schedule-none {
    display: flex;
    align-items: center;
    gap: 20px 28px;
    padding: 28px;
    border: 1px dashed var(--line);
    background: var(--bg);
  }

  .schedule-none > :global(svg) {
    color: var(--signal);
  }

  .schedule-none > div {
    flex: 1;
  }

  .schedule-none h3 {
    font-size: 17px;
  }

  .schedule-none p {
    max-width: 520px;
    margin-top: 4px;
    color: var(--muted);
    font-size: 12.5px;
    line-height: 1.7;
  }

  .swipe-hint {
    display: none;
  }

  .schedule-footnote {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 14px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.7;
  }

  .schedule-footnote :global(svg) {
    margin-top: 2px;
  }

  @keyframes schedule-pulse {
    0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--pulse, var(--class-bar)) 55%, transparent); }
    70%, 100% { box-shadow: 0 0 0 8px transparent; }
  }

  @keyframes schedule-flash {
    0%, 30% { background: color-mix(in srgb, var(--class-accent) 32%, var(--bg)); }
  }

  @keyframes schedule-day-in {
    from { opacity: 0; transform: translateY(6px); }
  }

  /* Mid-size desktops: tighten the seven columns. */
  @media (min-width: 1100px) and (max-width: 1360px) {
    .class-list { padding: 8px; }
    .class-card { padding: 10px 10px 10px 12px; }
    .class-time time { font-size: 14px; }
    .class-card h4 { font-size: 12px; }
    .day-head { padding-inline: 12px; }
  }

  /* Tablets and phones: sticky day strip + single-day agenda. */
  @media (max-width: 1099px) {
    .schedule-toolbar {
      grid-template-columns: minmax(0, 1fr);
    }

    .day-strip {
      position: sticky;
      top: var(--sticky-top);
      z-index: 6;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 4px;
      margin-bottom: 12px;
      padding: 6px;
      border: 1px solid var(--line);
      background: color-mix(in srgb, var(--bg) 94%, transparent);
      backdrop-filter: blur(16px);
    }

    .day-strip button {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-width: 0;
      min-height: 58px;
      padding: 8px 2px;
      background: transparent;
      color: var(--muted);
      transition: background .2s, color .2s;
    }

    .day-strip button:hover {
      color: var(--fg);
    }

    .day-strip button.today {
      color: var(--fg);
    }

    .day-strip button.today::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 50%;
      width: 16px;
      height: 2px;
      margin-left: -8px;
      background: var(--signal);
    }

    .day-strip button[aria-pressed="true"] {
      background: var(--signal);
      color: var(--button-fg);
    }

    .day-strip button[aria-pressed="true"].today::before {
      background: var(--button-fg);
    }

    .day-strip button:focus-visible {
      outline: 2px solid var(--signal);
      outline-offset: 2px;
    }

    .strip-name {
      font-size: 13px;
      line-height: 1;
    }

    .strip-dots {
      display: flex;
      gap: 3px;
      height: 4px;
    }

    .strip-dots i {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
      opacity: .75;
    }

    .strip-dots i.none {
      width: 10px;
      height: 1px;
      margin-top: 1.5px;
      border-radius: 0;
      opacity: .4;
    }

    .week {
      display: block;
      border: 0;
      background: transparent;
      touch-action: pan-y;
    }

    .day {
      display: none;
      border: 1px solid var(--line);
      background: var(--bg);
    }

    .day.selected {
      display: flex;
      animation: schedule-day-in .28s cubic-bezier(.2, .8, .2, 1);
    }

    .day + .day {
      border-left: 1px solid var(--line);
    }

    .is-today {
      background: var(--bg);
    }

    .is-today .day-head::before {
      display: none;
    }

    .day-head {
      flex-wrap: nowrap;
      gap: 10px;
      padding: 16px 18px;
      background: var(--bg);
    }

    .day-head h3 {
      font: 800 28px/1 Barlow, Impact, sans-serif;
      letter-spacing: -.005em;
      text-transform: uppercase;
    }

    .day-count {
      flex-basis: auto;
      margin-left: auto;
      font-size: 12px;
      white-space: nowrap;
    }

    .class-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      padding: 12px;
    }

    .class-card {
      grid-template-columns: 64px minmax(0, 1fr);
      grid-template-areas: 'time title' 'time meta';
      align-content: start;
      column-gap: 14px;
      row-gap: 6px;
      padding: 14px 14px 14px 16px;
    }

    .class-time {
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: flex-start;
      gap: 2px;
    }

    .class-time time {
      font-size: 17px;
      line-height: 1.2;
    }

    .class-status {
      margin: 6px 0 0;
    }

    .class-card h4 {
      font-size: 14px;
    }

    .class-meta {
      font-size: 11px;
    }

    .day-empty {
      min-height: 200px;
      margin: 12px;
    }

    .day-empty span {
      display: block;
      max-width: 280px;
    }

    .day-empty strong {
      font-size: 14px;
    }

    @media (hover: none) and (pointer: coarse) {
      .swipe-hint {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 10px;
        color: var(--muted);
        font-size: 10px;
        letter-spacing: .04em;
      }
    }
  }

  @media (max-width: 760px) {
    .class-list {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 700px) {
    .schedule-section {
      --sticky-top: 76px;
      padding-block: 52px 56px;
    }

    .schedule-heading {
      flex-direction: column;
      align-items: start;
      gap: 12px;
      margin: 8px 0 20px;
    }

    .schedule-heading h2 {
      font-size: clamp(34px, 10.5vw, 52px);
    }

    .schedule-heading p {
      font-size: 12.5px;
    }

    .sample-notice {
      font-size: 11px;
    }

    /* Filters scroll edge to edge like native chips. */
    .schedule-filters {
      flex-wrap: nowrap;
      margin-inline: -24px;
      padding: 2px 24px;
      overflow-x: auto;
      scroll-snap-type: x proximity;
      scroll-padding-inline: 24px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }

    .schedule-filters::-webkit-scrollbar {
      display: none;
    }

    .schedule-filters button {
      flex-shrink: 0;
      scroll-snap-align: start;
      padding: 0 14px;
    }

    .next-session {
      padding: 14px 14px 14px 18px;
    }

    .schedule-none {
      flex-direction: column;
      align-items: flex-start;
      padding: 24px 20px;
    }

    .schedule-none .button {
      width: 100%;
    }

    .next-pulse {
      top: 16px;
      right: 16px;
    }

    .next-session-time time {
      font-size: 30px;
    }

    .next-session-title {
      font-size: 13px;
    }

    .next-session-action > span {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    .day-strip {
      margin-inline: -8px;
      padding: 5px;
      gap: 2px;
    }

    .day-strip button {
      min-height: 54px;
    }

    .strip-name {
      font-size: 12px;
    }

    .day-head {
      padding: 14px 16px;
    }

    .day-head h3 {
      font-size: 26px;
    }

    .class-list {
      gap: 8px;
      padding: 10px;
    }

    .class-card {
      grid-template-columns: 58px minmax(0, 1fr);
      column-gap: 12px;
      padding: 13px 12px 13px 14px;
    }

    .schedule-footnote {
      font-size: 11px;
    }
  }

  @media (max-width: 360px) {
    .day-strip {
      margin-inline: -12px;
      gap: 0;
      padding: 4px;
    }

    .strip-name {
      font-size: 11px;
    }

    .day-head h3 {
      font-size: 23px;
    }

    .class-card {
      grid-template-columns: 52px minmax(0, 1fr);
      column-gap: 10px;
    }

    .class-time time {
      font-size: 15px;
    }

    .class-card h4 {
      font-size: 13px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .next-pulse, .live-badge i, .class-card.flash, .day.selected {
      animation: none;
    }
  }

.membership-types{display:flex;gap:8px;border-bottom:1px solid var(--line);padding-bottom:22px;margin-bottom:25px}.membership-types button{display:flex;align-items:center;justify-content:center;gap:12px;min-height:54px;padding:15px 24px;background:transparent;color:var(--fg);border:1px solid var(--line);font-size:14px;transition:background .2s,color .2s}.membership-types button.active{background:var(--signal);color:var(--button-fg);border-color:var(--signal)}.membership-section{background:var(--bg);border-top:1px solid var(--line)}.membership-heading h2{margin-top:24px}.plan-select{display:flex;align-items:center;justify-content:space-between;gap:15px;background:transparent;padding:0;text-align:left;min-height:52px;width:100%;color:inherit}.plan-select>span:first-child{font:800 38px/1 Barlow;text-transform:uppercase}.plan-check{display:grid;place-items:center;width:36px;height:36px;border:1px solid currentColor;border-radius:50%;opacity:.5}.plan-chosen .plan-check{opacity:1}.price-card.plan-chosen{outline:2px solid var(--signal);outline-offset:4px}.price-total-label{font-size:12px;opacity:.8;margin-top:8px}.plan-inclusions{border-block:1px solid var(--line);margin-top:28px}.plan-inclusions summary{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:64px;font-size:14px}.plan-inclusions ul{list-style:none;padding:0;display:grid;gap:15px;margin:8px 0 24px}.plan-inclusions li{display:flex;align-items:center;gap:12px;font-size:13px}.plan-inclusions p{color:var(--muted);font-size:13px;max-width:680px;margin-bottom:25px}
@media(max-width:700px){.membership-types button{flex:1;padding:14px 10px;gap:8px;font-size:13px}.membership-heading h2{font-size:clamp(44px,12vw,68px)}.plan-select>span:first-child{font-size:34px}.plan-select{margin-bottom:8px}.plan-inclusions summary{font-size:14px}}
</style>
