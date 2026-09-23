import PageLoader from '@/components/layout/PageLoader';
import SmoothScroll from '@/components/shared/SmoothScroll';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageLoader />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
