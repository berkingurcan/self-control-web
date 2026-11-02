import { spawnSync } from 'node:child_process';
import { cp, mkdir, rm } from 'node:fs/promises';
for (const id of ['academy', 'muaythai', 'kickbox', 'mma']) {
  const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', env: { ...process.env, PUBLIC_SITE_ID: id, PUBLIC_ENABLE_PREVIEWS: 'false' } });
  if (result.status !== 0) process.exit(result.status || 1);
  await rm(`builds/${id}`, { recursive: true, force: true });
  await mkdir(`builds/${id}`, { recursive: true });
  // Keep the Worker's relative imports intact without exposing server modules as assets.
  for (const directory of ['cloudflare', 'cloudflare-tmp', 'output/server']) {
    await cp(`.svelte-kit/${directory}`, `builds/${id}/${directory}`, { recursive: true });
  }
}
