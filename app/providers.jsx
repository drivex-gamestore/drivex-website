"use client";
import { LenisProvider, PreloaderProvider, PageTransitionProvider } from '@drivexstudio/animations';
import { FooterVisibilityProvider } from '@modules/providers/FooterVisibilityProvider';

export default function AppProviders({ children }) {
  return (
    <LenisProvider>
      <PreloaderProvider>
        <PageTransitionProvider>
        <FooterVisibilityProvider>
          {children}
          </FooterVisibilityProvider>
        </PageTransitionProvider>
      </PreloaderProvider>
    </LenisProvider>
  );
}