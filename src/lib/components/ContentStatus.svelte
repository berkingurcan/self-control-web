<script lang="ts">
  import { getContext } from 'svelte';
  import { contentKey, type ContentState } from '#lib/content-schema.ts';
  import type { Lang } from '#lib/site.ts';
  let { lang }: { lang: Lang } = $props();
  const content = getContext<ContentState>(contentKey);
  const date = $derived(content.data.checkedAt ? new Intl.DateTimeFormat(lang==='tr'?'tr-TR':'en-GB',{dateStyle:'short',timeStyle:'short',timeZone:content.data.timezone}).format(new Date(content.data.checkedAt)) : '');
</script>
{#if content.phase === 'loading'}<p class="content-status" role="status">{lang==='tr'?'Ders ve ücret bilgileri yükleniyor…':'Loading class and price information…'}</p>
{:else if content.phase === 'unavailable'}<div class="content-status" role="status"><p>{lang==='tr'?'Güncel ders ve ücret bilgileri şu anda görüntülenemiyor. Daha sonra tekrar deneyebilir veya bizimle iletişime geçebilirsiniz.':'Current schedules and prices are temporarily unavailable. Please check again later or contact us.'}</p><a href="#start">{lang==='tr'?'İletişim bilgileri':'Contact us'} ↗</a></div>
{:else if content.phase === 'stale'}<p class="content-status" role="status">{lang==='tr'?`Güncel bilgilere ulaşılamadı. ${date} tarihinde doğrulanan bilgiler gösteriliyor. Katılımdan önce ders saatini ve ücreti teyit edin.`:`Connection unavailable. Showing the last checked information (${date}). Confirm times and prices before attending.`}</p>{/if}
<style>.content-status{padding:22px;border:1px solid var(--line);background:var(--bg);color:var(--muted);font-size:14px;line-height:1.8;margin-bottom:25px;max-width:780px}.content-status p{font-size:14px}.content-status a{display:inline-flex;align-items:center;min-height:48px;color:var(--signal);font-size:14px;text-decoration:underline;text-underline-offset:5px;margin-top:10px}</style>
