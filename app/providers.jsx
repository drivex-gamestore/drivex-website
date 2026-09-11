"use client";

import React from "react";
import { GridOverlay } from "@components/ui/GridOverlay";
import { PageTransitionOverlay } from "@components/transitions/PageTransitionOverlay";
import { LazyPageTransitionRectangles } from "@components/transitions/LazyPageTransitionRectangles";
import { PageTransitionScrollLock } from "@components/transitions/PageTransitionScrollLock";
import { LazyCustomCursor } from "@components/animations/LazyCustomCursor";
import { SyncBodyTheme } from "@constants/SyncBodyTheme";
import { PageTransitionProvider } from "@modules/providers/PageTransitionProvider";
import { PreloaderProvider } from "@modules/providers/PreloaderProvider";
import { PageEnterProvider } from "@modules/providers/PageEnterProvider";
import { LenisProvider } from "@modules/providers/LenisProvider";
import { ModalProvider } from "@modules/providers/ModalProvider";
import { PostHogProvider } from "@modules/providers/PostHogProvider";

export default function AppProviders({ children }) {
  return (
    <>
      <GridOverlay />
      <PageTransitionProvider>
        <PageTransitionOverlay />
        <LazyPageTransitionRectangles />
        <SyncBodyTheme />

        <PreloaderProvider>
          <PageEnterProvider>
            <LenisProvider>
              <PageTransitionScrollLock />
              
              <ModalProvider>
                <PostHogProvider>
                  <LazyCustomCursor>
                    {children}
                  </LazyCustomCursor>
                </PostHogProvider>
              </ModalProvider>

            </LenisProvider>
          </PageEnterProvider>
        </PreloaderProvider>
      </PageTransitionProvider>
    </>
  );
}
