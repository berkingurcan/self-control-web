<script lang="ts">
  import type { Lang } from '#lib/site.ts';
  import { scrollToSlide } from '#lib/effects.ts';
  import Icon from './Icon.svelte';
  /** Mobile pager for a scroll-snap rail: counter, progress segments and previous/next buttons. */
  let { rail, count, active, labels, lang }: { rail: HTMLElement | undefined; count: number; active: number; labels: string[]; lang: Lang } = $props();
  const t = $derived(lang === 'tr' ? { previous: 'Önceki', next: 'Sonraki', of: (i: number) => `${i} / ${count}` } : { previous: 'Previous', next: 'Next', of: (i: number) => `${i} of ${count}` });
  const pad = (n: number) => String(n).padStart(2, '0');
  const go = (index: number) => scrollToSlide(rail, Math.max(0, Math.min(count - 1, index)));
</script>

<div class="carousel-nav">
  <span class="carousel-count" aria-hidden="true"><b>{pad(active + 1)}</b> / {pad(count)}</span>
  <div class="carousel-segments">
    {#each { length: count } as _, index}
      <button type="button" class:active={index === active} aria-current={index === active ? 'true' : undefined} aria-label={`${t.of(index + 1)}: ${labels[index] ?? ''}`} onclick={() => go(index)}><i></i></button>
    {/each}
  </div>
  <div class="carousel-arrows">
    <button type="button" aria-label={t.previous} disabled={active === 0} onclick={() => go(active - 1)}><Icon name="arrow-left" size={18}/></button>
    <button type="button" aria-label={t.next} disabled={active === count - 1} onclick={() => go(active + 1)}><Icon name="arrow" size={18}/></button>
  </div>
</div>

<style>
  .carousel-nav {
    display: none;
  }

  @media (max-width: 700px) {
    .carousel-nav {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 16px;
    }

    .carousel-count {
      min-width: 52px;
      color: var(--muted);
      font-size: 11px;
      letter-spacing: .06em;
      font-variant-numeric: tabular-nums;
    }

    .carousel-count b {
      color: var(--fg);
      font-weight: 500;
    }

    .carousel-segments {
      display: flex;
      flex: 1;
      min-width: 0;
    }

    /* Each segment keeps a 44px-tall hit area around a 2px visual bar. */
    .carousel-segments button {
      flex: 1;
      display: flex;
      align-items: center;
      min-width: 24px;
      height: 44px;
      padding: 0 2px;
      background: none;
    }

    .carousel-segments i {
      width: 100%;
      height: 2px;
      background: var(--line);
      transition: background .25s, height .25s;
    }

    .carousel-segments button.active i {
      height: 3px;
      background: var(--fg);
    }

    .carousel-segments button:focus-visible {
      outline: 2px solid var(--signal);
      outline-offset: -2px;
    }

    .carousel-arrows {
      display: flex;
      gap: 8px;
    }

    .carousel-arrows button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--line);
      border-radius: 50%;
      background: transparent;
      color: var(--fg);
      transition: background .2s, color .2s, border-color .2s, opacity .2s;
    }

    .carousel-arrows button:not(:disabled):active {
      background: var(--fg);
      border-color: var(--fg);
      color: var(--bg);
    }

    .carousel-arrows button:disabled {
      opacity: .35;
    }
  }
</style>
