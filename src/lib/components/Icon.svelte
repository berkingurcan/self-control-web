<script lang="ts">
  let { name = 'arrow', size = 20 }: { name?: string; size?: number | string } = $props();
  const paths: Record<string, string> = {
    plans: 'M5 3h14v18l-7-4-7 4zM9 8h6M9 12h4', copy: 'M9 9h12v12H9zM15 9V3H3v12h6',
    arrow: 'M5 12h14M12 5l7 7-7 7', diagonal: 'M6 18 18 6M6 6h12v12',
    'arrow-left': 'M19 12H5m7 7-7-7 7-7', 'arrow-down': 'M12 5v14m7-7-7 7-7-7',
    home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    training: 'M5 8v8M2 10v4M19 8v8M22 10v4M5 12h14',
    calendar: 'M8 3v4M16 3v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1ZM8 14h2M14 14h2',
    plus: 'M12 5v14M5 12h14', close: 'm6 6 12 12M18 6 6 18',
    menu: 'M4 7h16M4 12h16M4 17h16', pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    check: 'm5 12 4 4L19 6', phone: 'M7 2h10v20H7zM10 18h4',
    download: 'M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
    chat: 'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z',
    call: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z',
    mail: 'M3 5h18v14H3zM3 5l9 8 9-8', chevron: 'm6 9 6 6 6-6',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z', globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c4 5 4 13 0 18-4-5-4-13 0-18Z'
  };
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={paths[name] || paths.arrow}/></svg>
