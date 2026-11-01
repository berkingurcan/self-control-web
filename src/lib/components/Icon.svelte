<script lang="ts">
  let { name = 'arrow', size = 20 }: { name?: string; size?: number } = $props();
  const paths: Record<string, string> = {
    arrow: 'M5 12h14M12 5l7 7-7 7', diagonal: 'M6 18 18 6M6 6h12v12',
    home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    training: 'M5 8v8M2 10v4M19 8v8M22 10v4M5 12h14',
    calendar: 'M8 3v4M16 3v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1ZM8 14h2M14 14h2',
    plus: 'M12 5v14M5 12h14', close: 'm6 6 12 12M18 6 6 18',
    menu: 'M4 7h16M4 12h16M4 17h16', pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    check: 'm5 12 4 4L19 6', phone: 'M7 2h10v20H7zM10 18h4',
    download: 'M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
    mail: 'M3 5h18v14H3zM3 5l9 8 9-8', chevron: 'm6 9 6 6 6-6',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z', globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c4 5 4 13 0 18-4-5-4-13 0-18Z'
  };
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={paths[name] || paths.arrow}/></svg>
