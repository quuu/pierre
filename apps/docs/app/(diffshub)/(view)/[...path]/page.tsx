import { redirect } from 'next/navigation';

import { ReviewUI } from '../_components/ReviewUI';
import { resolveDiffshubViewerRoute } from '../_components/utils';

// Generate viewer shells on demand and keep them cached between visits. The
// diff payload still streams through `/api/diff` with `no-store`; this only
// avoids re-running the route-level React render for repeated path visits.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams(): Array<{ path: string[] }> {
  return [];
}

// Viewer route that mirrors the upstream GitHub path. Keeping query params out
// of this server component lets Next prerender/cache each path with ISR.
export default async function DiffshubViewByPathPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const route = resolveDiffshubViewerRoute(path, undefined);
  if (route.kind === 'redirect') {
    redirect(route.target);
  }

  return (
    <div className="flex h-dvh flex-col gap-2">
      <ReviewUI
        domain={route.domain}
        initialUrl={route.url}
        path={route.upstreamPath}
      />
    </div>
  );
}
