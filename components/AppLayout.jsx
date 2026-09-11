import { Preloader } from '@drivexstudio/animations';   
import Header from '@components/layout/Header';
import { LazyCustomCursor } from '@components/animations/LazyCustomCursor';
import { GridOverlay } from '@components/ui/GridOverlay';
import { PageTransitionOverlay } from '@components/transitions/PageTransitionOverlay';
import { LazyPageTransitionRectangles } from '@components/transitions/LazyPageTransitionRectangles';
import { PageTransitionScrollLock } from '@components/transitions/PageTransitionScrollLock';
import Footer from '@components/layout/Footer';

export default function AppLayout({ children }) {
  return (
    <>
      <Preloader />
      <PageTransitionScrollLock />
      <PageTransitionOverlay />
      <LazyPageTransitionRectangles />
       <GridOverlay />
       <LazyCustomCursor>
        <Header />
       <main className="relative z-[1]">
         {children}
        </main>
      <Footer />
      </LazyCustomCursor>
    </>
  );
}
