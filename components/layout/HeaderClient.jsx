"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import { useLenis, getLenis } from 'drivex-loader';

import { AnimatedButton } from '@components/animations/AnimatedButton'; 
import { useAsciiDelay } from '@hooks/useAsciiDelay'; 
import { useBreakpoint } from '@hooks/useIsTouchDevice'; 
import { useModal } from '@hooks/useModal'; 
import { usePageEnter } from '@hooks/usePageEnter'; 
import { usePageEnterContext } from '@modules/providers/PageEnterProvider'; 
import { usePageTransition } from '@hooks/usePageTransition'; 
import { usePreloader } from '@modules/providers/PreloaderProvider'; 
import { cx } from '@libs/vendor'; 
import MenuToggle from '@components/layout/MenuToggle';
import Flyout from '@components/layout/Flyout';
import { HeaderLogo } from '@components/ui/HeaderLogo';

const THEME_SELECTOR = "main [data-page-builder-section][data-theme]";
const HEADER_OFFSETS = { top: 0, scrolled: 16, menuOpen: 64 };

function useHeaderState(headerRef) {
  const [scrollState, setScrollState] = useState("top");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState("dark");
  
  const { phase } = usePageTransition();
  
  const checkTheme = useCallback((scrollPos) => {
    const sections = document.querySelectorAll(THEME_SELECTOR);
    if (sections.length === 0) return false;
    
    const activeSection = Array.from(sections).find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= scrollPos && rect.bottom > scrollPos;
    });
    
    if (activeSection) {
      const theme = activeSection.dataset.theme;
      if (theme && ["light", "dark", "brand"].includes(theme)) {
        setHeaderTheme(theme);
        return true;
      }
    }
    
    const firstSection = sections[0];
    const firstTheme = firstSection?.dataset.theme;
    if (firstTheme && ["light", "dark", "brand"].includes(firstTheme)) {
      setHeaderTheme(firstTheme);
      return true;
    }
    return false;
  }, []);
  
  useEffect(() => {
    const onScroll = () => {
      setScrollState(window.scrollY > 50 ? "scrolled" : "top");
      if (headerRef.current) checkTheme(headerRef.current.offsetTop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [checkTheme, headerRef]);
  
  useEffect(() => {
    if (headerRef.current && (phase === "exiting" || phase === "idle")) {
      checkTheme(headerRef.current.offsetTop);
    }
  }, [phase, checkTheme, headerRef]);
  
  useEffect(() => {
    if (!headerRef.current) return;
    const offsetTop = headerRef.current.offsetTop;
    
    if (document.querySelectorAll(THEME_SELECTOR).length > 0) {
      checkTheme(offsetTop);
      return;
    }
    
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(THEME_SELECTOR).length > 0) {
        checkTheme(offsetTop);
        observer.disconnect();
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [checkTheme, headerRef]);
  
  const headerState = useMemo(() => isMenuOpen ? "menuOpen" : scrollState, [isMenuOpen, scrollState]);
  
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen, closeMenu]);
  
  const lenisStoppedRef = useRef(false);
  useEffect(() => {
    if (isMenuOpen) {
      getLenis()?.stop();
      lenisStoppedRef.current = true;
    } else if (lenisStoppedRef.current) {
      getLenis()?.start();
      lenisStoppedRef.current = false;
    }
  }, [isMenuOpen]);
  
  return {
    scrollState,
    isMenuOpen,
    headerState,
    headerTheme,
    sectionTheme: headerTheme,
    toggleMenu,
    closeMenu
  };
}

export function HeaderClient({ navItems, headerCta, flyout, spotsRemaining }) {
  const headerRef = useRef(null);
  const innerRef = useRef(null);
  
  const { isMenuOpen, headerState, headerTheme, toggleMenu, closeMenu } = useHeaderState(innerRef);
  const { openModal } = useModal();
  const { prefersReducedMotion } = usePageEnterContext();
  const { isInitialLoad } = usePreloader();
  const isDesktop = useBreakpoint("lg");
  const asciiDelay = useAsciiDelay();
  
  useLayoutEffect(() => {
    if (isInitialLoad && !prefersReducedMotion && headerRef.current) {
      headerRef.current.classList.add("header-hidden", "no-transition");
      requestAnimationFrame(() => {
        headerRef.current?.classList.remove("no-transition");
      });
    }
  }, [isInitialLoad, prefersReducedMotion]);
  
  const paddingState = HEADER_OFFSETS[headerState];
  const paddingValue = isDesktop ? paddingState : (headerState === "top" ? 0 : (headerState === "scrolled" ? 16 : 24));
  
  const { phase } = usePageTransition();
  
  useEffect(() => {
    if (!prefersReducedMotion && headerRef.current) {
      if (phase === "entering") {
        headerRef.current.classList.add("header-hidden");
      } else if (phase === "holding") {
        headerRef.current.classList.add("header-hidden", "no-transition");
        requestAnimationFrame(() => {
          headerRef.current?.classList.remove("no-transition");
        });
      }
    }
  }, [prefersReducedMotion, phase]);
  
  const onEnterComplete = (delay) => {
    if (headerRef.current) {
      setTimeout(() => {
        headerRef.current?.classList.remove("header-hidden");
      }, (delay + (isInitialLoad ? asciiDelay : 0)) * 1000);
    }
  };
  
  usePageEnter(onEnterComplete, { priority: 0, skip: prefersReducedMotion });
  
  const hideHeaderRef = useRef(false);
  useEffect(() => {
    if (phase === "entering" || phase === "holding") {
      hideHeaderRef.current = false;
    }
  }, [phase]);
  
  useLenis(() => {
    if (prefersReducedMotion || !headerRef.current) return;
    
    const threshold = 0.1 * window.innerHeight;
    let shouldHide = false;
    
    const footer = document.querySelector("footer");
    if (footer) {
      const rect = footer.getBoundingClientRect();
      if (rect.height > 0 && rect.top <= threshold) {
        shouldHide = true;
      }
    }
    
    if (!shouldHide) {
      for (const el of document.querySelectorAll("[data-hide-header]")) {
        if (el.getBoundingClientRect().top <= threshold) {
          shouldHide = true;
          break;
        }
      }
    }
    
    if (shouldHide !== hideHeaderRef.current) {
      hideHeaderRef.current = shouldHide;
      headerRef.current.classList.toggle("header-hidden", shouldHide);
    }
  });
  
  const overlayClass = cx(
    "fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm",
    "transition-opacity duration-500 ease-out",
    isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
  );
  
  const headerClass = cx(
    "fixed inset-x-0 top-0 z-[9999]",
    "flex flex-col gap-8 pt-16",
    "!bg-transparent transition-colors duration-300 ease-out"
  );
  
  const innerBgClass = headerState === "top" ? "bg-transparent" : "bg-surface";
  const innerClass = cx("grid-container transition-[padding,background-color,color] duration-500 ease-out", innerBgClass);
  
  return (
    <>
      <div onClick={closeMenu} className={overlayClass} aria-hidden="true" />
      <header ref={headerRef} data-theme={headerTheme} className={headerClass}>
        <div ref={innerRef} className={innerClass} style={{ paddingLeft: paddingValue, paddingRight: paddingValue }}>
          <div className="py-16">
            <div className="grid grid-cols-2 items-center lg:grid-cols-3">
              <div className="justify-self-start">
                <HeaderLogo isMenuOpen={isMenuOpen} />
              </div>
              <div className="justify-self-end lg:justify-self-center">
                <MenuToggle isOpen={isMenuOpen} onClick={toggleMenu} />
              </div>
              {headerCta?.text ? (
                <AnimatedButton size="sm" theme="brand" className="hidden justify-self-end lg:inline-flex" onClick={() => openModal("cal-booking")}>
                  {headerCta.text}
                </AnimatedButton>
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>
        </div>
        <Flyout navItems={navItems} flyout={flyout} onClose={closeMenu} isOpen={isMenuOpen} spotsRemaining={spotsRemaining} />
      </header>
    </>
  );
}
