import { spawnSync } from 'node:child_process';
import { cp, mkdir, rm } from 'node:fs/promises';
for (const id of ['academy', 'muaythai', 'kickbox', 'mma']) {
  const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', env: { ...process.env, PUBLIC_SITE_ID: id, PUBLIC_ENABLE_PREVIEWS: 'false' } });
  if (result.status !== 0) process.exit(result.status || 1);
  await mkdir(`builds/${id}`, { recursive: true });
  await rm(`builds/${id}/output`, { recursive: true, force: true });
  await cp('.vercel/output', `builds/${id}/output`, { recursive: true });
}
