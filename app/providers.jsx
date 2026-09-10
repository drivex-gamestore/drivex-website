"use client";
import { LenisProvider, PreloaderProvider, PageTransitionProvider } from '@drivexstudio/animations';

export default function AppProviders({ children }) {
  return (
    <LenisProvider>
      <PreloaderProvider>
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </PreloaderProvider>
    </LenisProvider>
  );
}