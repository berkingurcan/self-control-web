<script lang="ts">
  let { name, alt, eager = false, position = 'center', class: className = '', sizes = '(max-width: 700px) 100vw, 60vw' }: { name: string; alt: string; eager?: boolean; position?: string; class?: string; sizes?: string } = $props();
</script>
<img class={className} src={`/images/${name}-1280.webp`} srcset={`/images/${name}-640.webp 640w, /images/${name}-1280.webp 1280w`} {sizes} {alt} width="1280" height="960" decoding="async" loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : 'auto'} style={`object-position:${position}`}/>
