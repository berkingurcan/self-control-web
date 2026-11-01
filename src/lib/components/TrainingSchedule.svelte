<script lang="ts">
  import { untrack } from 'svelte';
  import { sites, type SiteId, type Lang } from '#lib/site.ts';
  import { editorial } from '#lib/editorial.ts';
  import { demoCopy, disciplines, sessions } from '#lib/demo.ts';
  import { reveal } from '#lib/effects.ts';
  import Icon from './Icon.svelte';
  import PrivateLessons from './PrivateLessons.svelte';
  import { membershipCatalog as catalog, membershipCopy } from '#lib/memberships.ts';
  let { site, lang, label }: { site: SiteId; lang: Lang; label: string } = $props();
  const d = $derived(demoCopy[lang]), e = $derived(editorial[lang]);
  let selected = $state<SiteId>(untrack(() => site));
  let day = $state(0);
  const classes = $derived(sessions.filter(session => session.day === day && (selected === 'academy' || session.discipline === selected)));
  const plans = $derived(catalog.groupLessons[selected]);
  const monthlyPlan = $derived(plans.find(plan => plan.months === 1));
  const c = $derived(membershipCopy[lang]);
  let membershipType = $state<'group' | 'private'>('group');
  const periodName = (months: number) => months === 1 ? c.monthly : months === 12 ? c.year : `${months} ${c.months}`;
  const currency = $derived(new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'currency', currency: catalog.currency, currencyDisplay: 'narrowSymbol' }).formatToParts(0).find(part => part.type === 'currency')?.value || catalog.currency);
  const money = (amount: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { maximumFractionDigits: 0 }).format(amount);
  const percent = (amount: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'percent', maximumFractionDigits: 0 }).format(amount);
  const endTime = (time: string, minutes: number) => { const [hours, mins] = time.split(':').map(Number); const end = hours * 60 + mins + minutes; return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`; };
</script>

<section id="schedule" class="section schedule-section" use:reveal>
  <div class="section-top"><span class="eyebrow">{label}</span><span class="eyebrow">SELF CONTROL / YOUR ROUTINE</span></div>
  <div class="section-heading"><h2 class="display">{e.scheduleTitle}</h2><p>{e.scheduleBody}</p></div>
  <div class="demo-notice"><span class="demo-badge">{d.badge}</span><p>{d.note}</p></div>
  {#if site === 'academy'}
    <div class="routine-filters" role="group" aria-label={d.disciplineSelect}>
      {#each ['academy', ...disciplines] as id}<button class:active={selected === id} aria-pressed={selected === id} onclick={() => selected = id as SiteId}>{id === 'academy' ? d.allAccess : sites[id as SiteId].name}</button>{/each}
    </div>
  {/if}
  <div class="weekly-planner">
    <div class="planner-sidebar"><span class="eyebrow">{d.weekly}</span><h3>{d.days[day]}<span>↗</span></h3><p>{selected === 'academy' ? 'SELF CONTROL FIGHT ACADEMY' : sites[selected].name}</p><span class="class-count">{String(classes.length).padStart(2, '0')} <small>{d.sessions}</small></span></div>
    <div class="planner-main">
      <div class="day-selector" role="group" aria-label={d.daySelect}>{#each d.shortDays as name, index}<button class:active={day === index} aria-pressed={day === index} aria-label={d.days[index]} onclick={() => day = index}><span>{name}</span><i aria-hidden="true"></i></button>{/each}</div>
      <div class="session-list" aria-live="polite" aria-atomic="true">
        {#each classes as session}
          <article class="session-row" style={`--session-accent:${sites[session.discipline].accent}`}><div class="session-time"><time>{session.time}</time><span>{endTime(session.time, session.duration)}</span></div><div class="session-info"><span class="session-discipline" lang="en">{sites[session.discipline].name}</span><h4>{session.title[lang]}</h4><div class="session-meta"><span>{d.levels[session.level]}</span><span>{session.duration} {d.minutes}</span></div></div><span class="session-arrow" aria-hidden="true">↗</span></article>
        {:else}
          <div class="rest-day"><Icon name="calendar" size={28}/><h4>{d.restTitle}</h4><p>{d.restBody}</p><button class="underlined-link" onclick={() => day = 0}>{d.nextDay}<Icon name="diagonal" size={17}/></button></div>
        {/each}
      </div>
    </div>
  </div>

  <div id="membership" class="memberships">
    <div class="membership-heading"><div><span class="eyebrow">{d.membershipLabel} / DEMO</span><h3 class="display">{d.membershipTitle}</h3></div><div><p>{d.membershipIntro}</p><span class="membership-scope"><small>{d.scope}</small><strong>{selected === 'academy' ? d.allAccessBody : sites[selected].name}</strong></span></div></div>
    <div class="membership-types" role="group" aria-label={c.type}><button class:active={membershipType === 'group'} aria-pressed={membershipType === 'group'} onclick={() => membershipType = 'group'}><Icon name="training" size={18}/>{c.group}</button><button class:active={membershipType === 'private'} aria-pressed={membershipType === 'private'} onclick={() => membershipType = 'private'}><Icon name="diagonal" size={18}/>{c.private}</button></div>
    {#if membershipType === 'private'}<PrivateLessons {lang}/>{:else}
    <div class="pricing-grid" aria-live="polite">
      {#each plans as plan, index}
        <article class="price-card" class:featured={plan.months === 6}>
          <div class="price-card-top"><span class="eyebrow">0{index + 1} / {periodName(plan.months)}</span>{#if plan.months === 6}<span class="recommended">{d.popular}</span>{:else}<Icon name="diagonal" size={18}/>{/if}</div>
          <h4>{periodName(plan.months)}</h4><p class="price-description">{plan.months === 1 ? c.oneMonth : plan.months < 12 ? c.shortTerm : c.longTerm}</p>
          <div class="plan-price"><span class="currency">{currency}</span><strong>{money(plan.price)}</strong>{#if plan.months === 1}<span>{d.monthly}</span>{/if}</div>
          <p class="price-payment">{plan.months === 1 ? `${c.perPerson} · ${d.equivalent}: ${currency}${money(plan.price)}` : `${c.perPerson} · ${d.upfront} · ${currency}${money(plan.price / plan.months)} ${d.monthly}`}</p>
          <div class="price-saving">{#if plan.months > 1 && monthlyPlan && plan.price < monthlyPlan.price * plan.months}<span>{d.save}</span><strong>{percent(1 - plan.price / (monthlyPlan.price * plan.months))} {d.saving}</strong>{:else}<span>{selected === 'academy' ? d.allAccess : d.singleAccess}</span><span>SELF CONTROL</span>{/if}</div>
          <ul>{#each (selected === 'academy' ? d.allBenefits : d.benefits) as benefit}<li><Icon name="check" size={15}/>{benefit}</li>{/each}</ul>
          <a class="button price-cta" href="#start">{d.cta}<Icon name="diagonal" size={19}/></a>
        </article>
      {/each}
    </div>
    <p class="pricing-note">{c.groupNote}</p>
    {/if}
  </div>
</section>

<style>
  .membership-types{display:flex;gap:8px;border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:25px}.membership-types button{display:flex;align-items:center;justify-content:center;gap:12px;min-height:52px;padding:15px 24px;background:transparent;color:var(--fg);border:1px solid var(--line);font-size:12px}.membership-types button.active{background:var(--signal);color:var(--button-fg);border-color:var(--signal)}
  @media(max-width:700px){.membership-types{gap:8px;padding-bottom:18px;margin-bottom:18px}.membership-types button{flex:1;font-size:11px;padding:14px 10px;gap:10px;min-height:52px}}
</style>
