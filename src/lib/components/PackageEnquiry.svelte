<script lang="ts">
  import { getContext } from 'svelte';
  import { config } from '#lib/config.ts';
  import { sites, type Lang } from '#lib/site.ts';
  import { contentKey, type ContentState } from '#lib/content-schema.ts';
  import { experienceCopy } from '#lib/experience-copy.ts';
  import { experienceKey, enquiryMessage, selectedOffer, packageLabel, formatMoney, whatsappHref, type Experience } from '#lib/selection.ts';
  import { modalFocus } from '#lib/effects.ts';
  import Icon from './Icon.svelte';
  let { lang }: { lang: Lang } = $props();
  const experience = getContext<Experience>(experienceKey);
  const content = getContext<ContentState>(contentKey);
  const catalog = $derived(content.data.catalog);
  const c = $derived(experienceCopy[lang]);
  const selection = $derived(experience.selection);
  const name = $derived(selection.discipline === 'academy' ? 'Muay Thai + Kick Box + MMA' : sites[selection.discipline].name);
  const offer = $derived(selectedOffer(selection, catalog));
  const message = $derived(enquiryMessage(selection, lang, catalog, name));
  const whatsapp = $derived(whatsappHref(config.PUBLIC_WHATSAPP, message));
  const email = $derived(config.PUBLIC_CONTACT_EMAIL ? `mailto:${config.PUBLIC_CONTACT_EMAIL}?subject=${encodeURIComponent(`Self Control / ${name}`)}&body=${encodeURIComponent(message)}` : null);
  let dialog: HTMLDialogElement, copied = $state('');
  $effect(() => { if (dialog) { if (experience.enquiryOpen && offer && content.phase !== 'unavailable' && !dialog.open) dialog.showModal(); else if (!experience.enquiryOpen && dialog.open) dialog.close(); } });
  async function copyMessage() { try { await navigator.clipboard.writeText(message); copied = c.copied; } catch { copied = c.copyFailed; } }
</script>

<dialog use:modalFocus class="package-dialog" bind:this={dialog} aria-labelledby="package-enquiry-title" onclose={() => { experience.enquiryOpen = false; copied = ''; }} onclick={event => { if (event.target === dialog) dialog.close(); }} onkeydown={event => { if (event.key === 'Escape') dialog.close(); }}>
  <div class="package-dialog-inner">
    <div class="package-dialog-top"><span class="eyebrow">SELF CONTROL / {c.enquiry}</span><button class="icon-button" aria-label={c.close} onclick={() => dialog.close()}><Icon name="close"/></button></div>
    <h2 class="display" id="package-enquiry-title">{c.enquiryTitle}</h2><p>{c.enquiryBody}</p>
    {#if offer}<div class="enquiry-receipt"><span>{name}</span><strong>{packageLabel(selection, lang, catalog)}</strong><div><span>{c.upfront}</span><b>{formatMoney(offer.price, lang, catalog.currency)}</b></div>{#if catalog.status === 'sample'}<small>{c.preview}</small>{/if}</div>{/if}
    <label class="message-label" for="package-message">{lang === 'tr' ? 'Hazırlanan mesaj' : 'Prepared message'}</label><textarea id="package-message" readonly value={message} rows="6"></textarea>
    <div class="enquiry-actions">{#if whatsapp}<a class="button solid" href={whatsapp} target="_blank" rel="noopener noreferrer">{c.whatsapp}<Icon name="diagonal"/></a>{/if}{#if email}<a class="button outline" href={email}>{c.email}<Icon name="mail"/></a>{/if}<button class="button outline" onclick={copyMessage}>{c.copy}<Icon name="copy"/></button></div>
    <p class="enquiry-status" role="status">{copied || (!whatsapp && !email ? c.pending : '')}</p>
  </div>
</dialog>

<style>
.package-dialog{background:var(--bg);color:var(--fg);border:1px solid var(--line);padding:0;width:600px;max-width:calc(100vw - 32px);max-height:calc(100dvh - 40px);overscroll-behavior:contain}.package-dialog::backdrop{background:#000b;backdrop-filter:blur(6px)}.package-dialog-inner{padding:30px}.package-dialog-top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}.icon-button{display:grid;place-items:center;background:var(--surface);width:48px;height:48px;flex-shrink:0}.package-dialog h2{font-size:clamp(36px,7vw,55px);margin:0 0 20px}.package-dialog p{font-size:13px;color:var(--muted)}.enquiry-receipt{padding:22px;background:var(--surface);border:1px solid var(--line);margin:24px 0;display:grid;gap:12px}.enquiry-receipt>span{font-size:12px;color:var(--muted)}.enquiry-receipt>strong{font-size:16px;font-weight:500}.enquiry-receipt>div{display:flex;justify-content:space-between;align-items:baseline;gap:15px;padding-top:14px;border-top:1px solid var(--line)}.enquiry-receipt>div>span{font-size:12px}.enquiry-receipt b{font:800 36px/1 Barlow}.enquiry-receipt small{color:var(--muted);font-size:12px}.message-label{display:block;font-size:12px;margin-bottom:12px}.package-dialog textarea{border:1px solid var(--line);background:var(--surface);color:var(--fg);font-size:14px;line-height:1.7;width:100%;padding:16px;resize:vertical;border-radius:0}.enquiry-actions{display:grid;gap:10px;margin-top:20px}.enquiry-actions .button{width:100%;font-size:13px;min-height:52px}.enquiry-status{margin-top:14px;min-height:24px}.package-dialog-top .eyebrow{font-size:11px}
@media(max-width:700px){.package-dialog{max-width:calc(100vw - 20px);max-height:calc(100dvh - 24px)}.package-dialog-inner{padding:22px}.package-dialog textarea{font-size:16px}.enquiry-receipt{padding:18px}.enquiry-receipt>div{flex-wrap:wrap}.enquiry-receipt b{font-size:34px}}
</style>
