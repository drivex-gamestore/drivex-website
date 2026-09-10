"use client";
import { LenisProvider, PreloaderProvider, PageTransitionProvider } from 'drivex-loader';

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