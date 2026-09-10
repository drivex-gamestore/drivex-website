"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ScrambleText } from '@drivexstudio/animations';
import { useMousePosition } from '@hooks/useMousePosition';
import { useIsTouchDevice } from '@hooks/useIsTouchDevice'; 
import { SanityImage } from '@modules/sanity/components/SanityImage'; 
import { SanityRichText } from '@modules/sanity/components/SanityRichText'; 
import { SanityLink } from '@modules/sanity/components/SanityLink'; 
import { getImageSrc } from '@modules/sanity/utils/sanity-imageutils'; 
import { cx } from '@libs/vendor';
import { GoodFellaWatermark } from '@components/ui/GoodFellaWatermark'; 
import { SpotsBadge } from '@components/ui/SpotsBadge';
import { NewsletterForm } from '@modules/forms/components/NewsletterForm';
import { AsciiTypewriterWrapper } from '@modules/webgl/components/AsciiTypewriterWrapper';

const BRAND_COLOR = "#FB460D";

export function FooterClient({
  navigation,
  contactInformation,
  copyrightNotice,
  asciiImageLeft,
  asciiDepthMapLeft,
  asciiColorLeft,
  asciiColorDarkLeft,
  asciiCellSizeLeft,
  asciiParallaxIntensityLeft,
  asciiRevealOriginXLeft,
  asciiRevealOriginYLeft,
  asciiMobileFallbackLeft,
  asciiImage,
  asciiDepthMap,
  asciiColor,
  asciiColorDark,
  asciiCellSize,
  asciiParallaxIntensity,
  asciiRevealOriginX,
  asciiRevealOriginY,
  asciiMobileFallback,
  showWatermark,
  spotsRemaining
}) {
  const footerRef = useRef(null);
  const themeWrapperRef = useRef(null);
  const gridContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [hasRevealed, setHasRevealed] = useState(false);
  const [isWatermarkAnimated, setIsWatermarkAnimated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isTouchDevice = useIsTouchDevice();
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains("scroll-locked")) {
      const req = requestAnimationFrame(() => setIsScrollLocked(true));
      return () => cancelAnimationFrame(req);
    }
    const observer = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("scroll-locked")) {
        observer.disconnect();
        requestAnimationFrame(() => setIsScrollLocked(true));
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const leftProgressRef = useRef({ progress: 0, colorProgress: 0 });
  const rightProgressRef = useRef({ progress: 0, colorProgress: 0 });
  const [progressState, setProgressState] = useState({ left: 0, leftColor: 0, right: 0, rightColor: 0 });

  const leftImageSrc = asciiImageLeft ? getImageSrc(asciiImageLeft, isTouchDevice ? { width: 400 } : undefined) : null;
  const leftDepthSrc = isTouchDevice ? null : (asciiDepthMapLeft ? getImageSrc(asciiDepthMapLeft) : null);
  
  const rightImageSrc = asciiImage ? getImageSrc(asciiImage, isTouchDevice ? { width: 400 } : undefined) : null;
  const rightDepthSrc = isTouchDevice ? null : (asciiDepthMap ? getImageSrc(asciiDepthMap) : null);

  const enableLeftMouse = hasRevealed && !prefersReducedMotion && !isTouchDevice;
  const { isHovering: isLeftHovering, mouseRef: leftMouseRef } = useMousePosition({
    enabled: enableLeftMouse, containerRef: leftContainerRef, refOnly: true
  });

  const enableRightMouse = hasRevealed && !prefersReducedMotion && !isTouchDevice;
  const { isHovering: isRightHovering, mouseRef: rightMouseRef } = useMousePosition({
    enabled: enableRightMouse, containerRef: rightContainerRef, refOnly: true
  });

  useEffect(() => {
    setHasRevealed(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!themeWrapperRef.current) return;
    
    if (prefersReducedMotion) {
      setIsWatermarkAnimated(true);
      leftProgressRef.current = { progress: 1, colorProgress: 1 };
      rightProgressRef.current = { progress: 1, colorProgress: 1 };
      setProgressState({ left: 1, leftColor: 1, right: 1, rightColor: 1 });
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        setIsWatermarkAnimated(true);
        const startTime = performance.now();
        
        const animate = (time) => {
          const elapsed = time - startTime;
          const progress = Math.sin(Math.max(0, Math.min(1, elapsed / 3000)) * Math.PI / 2);
          const colorProgress = Math.sin(Math.max(0, Math.min(1, (elapsed - 500) / 3000)) * Math.PI / 2);
          
          if (leftImageSrc) leftProgressRef.current = { progress, colorProgress };
          if (rightImageSrc) rightProgressRef.current = { progress, colorProgress };
          
          setProgressState({
            left: leftProgressRef.current.progress,
            leftColor: leftProgressRef.current.colorProgress,
            right: rightProgressRef.current.progress,
            rightColor: rightProgressRef.current.colorProgress
          });
          
          if (elapsed < 3500) {
            animationFrameRef.current = requestAnimationFrame(animate);
            return;
          }
          animationFrameRef.current = null;
          setProgressState({ left: 1, leftColor: 1, right: 1, rightColor: 1 });
        };
        
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }, { threshold: 0.2 });
    
    observer.observe(themeWrapperRef.current);
    
    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [leftImageSrc, rightImageSrc, prefersReducedMotion]);

  useEffect(() => {
    if (!themeWrapperRef.current || !footerRef.current || !isScrollLocked || prefersReducedMotion) return;
    
    const wrapper = themeWrapperRef.current;
    const footer = footerRef.current;
    const gridContainer = gridContainerRef.current;
    
    const updateParallax = () => {
      scrollFrameRef.current = null;
      const rect = footer.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / Math.max(rect.height, 1)));
      wrapper.style.transform = `translate3d(0, ${-20 + 20 * progress}%, 0)`;
      if (gridContainer) gridContainer.style.opacity = String(progress);
    };
    
    const requestParallax = () => {
      if (scrollFrameRef.current == null) {
        scrollFrameRef.current = requestAnimationFrame(updateParallax);
      }
    };
    
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);
    const resizeObserver = new ResizeObserver(() => { requestParallax(); });
    resizeObserver.observe(document.body);
    
    requestParallax();
    
    return () => {
      window.removeEventListener("scroll", requestParallax);
      window.removeEventListener("resize", requestParallax);
      resizeObserver.disconnect();
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
      wrapper.style.transform = "";
      if (gridContainer) gridContainer.style.opacity = "";
    };
  }, [isScrollLocked, prefersReducedMotion]);

  const dispatchColorChange = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "c", bubbles: true }));
  const dispatchGridToggle = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "g", metaKey: true, bubbles: true }));

  return (
    <div ref={footerRef}>
      <footer data-theme="dark" ref={themeWrapperRef} className="relative h-auto min-h-svh overflow-hidden bg-background pt-48 lg:h-svh">
        
        {leftImageSrc && hasRevealed && !prefersReducedMotion && (
          <div ref={leftContainerRef} className="pointer-events-none absolute top-[12.5%] bottom-0 left-0 z-20 w-1/2">
            <AsciiTypewriterWrapper
              imageSrc={leftImageSrc}
              color={asciiColorLeft ?? BRAND_COLOR}
              colorDark={asciiColorDarkLeft ?? undefined}
              cellSize={asciiCellSizeLeft ?? 20}
              alignX="left"
              mobileFit="contain"
              externalProgress={progressState.left}
              externalColorProgress={progressState.leftColor}
              depthMapSrc={isTouchDevice ? undefined : (leftDepthSrc ?? undefined)}
              parallaxIntensity={asciiParallaxIntensityLeft ?? 0.02}
              mouseRef={isTouchDevice ? undefined : leftMouseRef}
              isHovering={!isTouchDevice && isLeftHovering}
              isTouch={isTouchDevice}
              revealOriginX={asciiRevealOriginXLeft ?? undefined}
              revealOriginY={asciiRevealOriginYLeft ?? undefined}
              frameloop="demand"
              dpr={[1, 1.5]}
            />
          </div>
        )}
        
        {asciiMobileFallbackLeft && hasRevealed && prefersReducedMotion && (
          <div className="pointer-events-none absolute top-1/5 -left-1/3 flex w-3/4 items-end lg:hidden">
            <SanityImage image={asciiMobileFallbackLeft} className="h-full w-full" style={{ objectFit: "contain", objectPosition: "left bottom" }} />
          </div>
        )}
        
        {rightImageSrc && hasRevealed && !prefersReducedMotion && (
          <div ref={rightContainerRef} className="pointer-events-none absolute top-[12.5%] right-0 bottom-0 z-20 w-1/2">
            <AsciiTypewriterWrapper
              imageSrc={rightImageSrc}
              color={asciiColor ?? BRAND_COLOR}
              colorDark={asciiColorDark ?? undefined}
              cellSize={asciiCellSize ?? 20}
              alignX="right"
              mobileFit="contain"
              externalProgress={progressState.right}
              externalColorProgress={progressState.rightColor}
              depthMapSrc={isTouchDevice ? undefined : (rightDepthSrc ?? undefined)}
              parallaxIntensity={asciiParallaxIntensity ?? 0.02}
              mouseRef={isTouchDevice ? undefined : rightMouseRef}
              isHovering={!isTouchDevice && isRightHovering}
              isTouch={isTouchDevice}
              revealOriginX={asciiRevealOriginX ?? undefined}
              revealOriginY={asciiRevealOriginY ?? undefined}
              frameloop="demand"
              dpr={[1, 1.5]}
            />
          </div>
        )}
        
        {asciiMobileFallback && hasRevealed && prefersReducedMotion && (
          <div className="pointer-events-none absolute top-1/5 -right-1/3 flex w-3/4 items-end lg:hidden">
            <SanityImage image={asciiMobileFallback} className="h-full w-full" style={{ objectFit: "contain", objectPosition: "right bottom" }} />
          </div>
        )}

        <div ref={gridContainerRef} className="grid-container pointer-events-none relative z-30 flex h-full flex-col">
          <div className="grid-layout !gap-y-48 lg:gap-y-0">
            
            <div className="grid-span-12 lg:grid-span-3 lg:grid-start-1 pointer-events-auto flex flex-col gap-16">
              <NewsletterForm heading="Don't miss out on future updates." buttonText="Subscribe" buttonTheme="light" />
              
              {navigation?.availability?.isAvailable && navigation.availability.text && (
                <div className="flex flex-col items-start gap-4">
                  <p className="flex items-center gap-8 text-accent-sm text-foreground-muted">
                    <span className="inline-block size-8 shrink-0 animate-pulse bg-brand" />
                    <span>{navigation.availability.text}</span>
                  </p>
                  <SpotsBadge className="tex-foreground-muted" spots={spotsRemaining} />
                </div>
              )}
            </div>
            
            {navigation?.items && navigation.items.length > 0 && (
              <div className="grid-span-12 lg:grid-span-2 lg:grid-start-6 pointer-events-auto">
                <ul className="flex flex-col items-start gap-4 space-y-4 lg:items-center">
                  {navigation.items.map(item => (
                    <li key={item._key}>
                      {item.link && item.text && (
                        <SanityLink link={item.link} className="text-accent text-foreground-muted" aria-label={item.text}>
                          <ScrambleText triggerOnHover={true} secondColorClass="scramble-inherit">
                            {item.text}
                          </ScrambleText>
                        </SanityLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid-span-12 lg:grid-span-3 lg:grid-start-10 pointer-events-auto flex flex-col gap-16">
              {contactInformation && (
                <div className="prose prose-sm text-foreground-muted">
                  <SanityRichText value={contactInformation} />
                </div>
              )}
              
              <div className="flex flex-col gap-4 text-accent-sm text-foreground-muted opacity-40">
                <button type="button" className="flex cursor-pointer items-center gap-6" onClick={dispatchGridToggle}>
                  <kbd className="bg-surface px-4 py-2">⌘G</kbd> grid
                </button>
                <button type="button" className="flex cursor-pointer items-center gap-6" onClick={dispatchColorChange}>
                  <kbd className="bg-surface px-4 py-2">C</kbd> change color
                </button>
              </div>
            </div>
          </div>
          
          <div className="pointer-events-auto pt-[12.5%] text-center text-body text-foreground-muted">
            <span>© {new Date().getFullYear()}</span>
            {copyrightNotice && (
              <span className="prose prose-sm inline">
                {' '}
                <SanityRichText value={copyrightNotice} />
              </span>
            )}
          </div>
          
          <div className="mt-auto flex flex-col">
            {showWatermark && (
              <div className="mt-auto overflow-hidden">
                <GoodFellaWatermark 
                  className={cx("text-foreground opacity-10", isWatermarkAnimated && !prefersReducedMotion && "animate-watermark")} 
                  animate={isWatermarkAnimated && !prefersReducedMotion} 
                />
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}