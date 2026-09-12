"use client";

import React from "react";
import { Preloader } from "@drivexstudio/animations"; 
import { PreloaderProvider } from "@drivexstudio/animations"; 
import { LenisProvider } from "@drivexstudio/animations"; 
import { GridOverlay } from "@components/ui/GridOverlay";
import { PageTransitionOverlay } from "@modules/transitions/PageTransitionOverlay";
import { LazyPageTransitionRectangles } from "@modules/transitions/LazyPageTransitionRectangles";
import { PageTransitionScrollLock } from "@modules/transitions/PageTransitionScrollLock";
import { LazyCustomCursor } from "@components/animations/LazyCustomCursor";
import { SyncBodyTheme } from "@constants/SyncBodyTheme";

import { PageTransitionProvider } from "@modules/providers/PageTransitionProvider";
import { PageEnterProvider } from "@modules/providers/PageEnterProvider";
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
          <Preloader />
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
