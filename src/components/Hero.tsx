import type { SiteMeta } from '../types/content';

export function Hero({ site }: { site: SiteMeta }) {
  return (
    <header className="hero">
      <h1 className="hero__name">{site.name}</h1>
      <p className="hero__status">{site.status}</p>
    </header>
  );
}
