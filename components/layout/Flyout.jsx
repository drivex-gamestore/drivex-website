"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import gsap from 'gsap'; 
import { useGSAP } from '@gsap/react'; 
import { motion } from 'framer-motion'; 
import { usePageTransition } from '@hooks/usePageTransition'; 
import { useBreakpoint } from '@hooks/useIsTouchDevice'; 
import useDualLayerScramble from '@components/animations/useDualLayerScramble'; 
import { SanityLink } from '@modules/sanity/components/SanityLink'; 
import { SanityImage } from '@modules/sanity/components/SanityImage';
import { AnimatedLink } from '@components/animations/AnimatedLink'; 
import { cx } from '@libs/vendor'; 
import { easings } from '@components/animations/utils/easings'; 

export default function Flyout({ navItems, flyout, onClose, isOpen, spotsRemaining }) {
  const isDesktop = useBreakpoint("lg");
  const markerSize = isDesktop ? 32 : 20;
  const markerOffset = isDesktop ? 64 : 36;
  
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const navRef = useRef(null);
  const navItemRefs = useRef([]);
  const navLinkRefs = useRef([]);
  const secondaryLinkRefs = useRef([]);
  const availabilityDotRef = useRef(null);
  const spotsDotRef = useRef(null);
  const imageRevealRef = useRef(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition, isTransitioning } = usePageTransition();
  
  const [hoverIndex, setHoverIndex] = useState(null);
  const [markerStyle, setMarkerStyle] = useState(null);
  const [markerRotation, setMarkerRotation] = useState(0);
  const lastHoverIndexRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  
  const activeIndex = useMemo(() => {
    if (!navItems) return null;
    const index = navItems.findIndex(item => !!item.link?.href && (pathname === item.link.href || pathname.startsWith(`${item.link.href}/`)));
    return index >= 0 ? index : null;
  }, [navItems, pathname]);
  
  const currentIndicatorIndex = hoverIndex ?? (isReady ? activeIndex : null);
  
  useEffect(() => {
    if (currentIndicatorIndex === null) {
      setMarkerStyle(null);
      return;
    }
    const req = requestAnimationFrame(() => {
      const targetEl = navItemRefs.current[currentIndicatorIndex];
      const navEl = navRef.current;
      if (targetEl && navEl) {
        const navRect = navEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        setMarkerStyle({ y: targetRect.top - navRect.top + (targetRect.height - markerSize) / 2 });
      }
    });
    return () => cancelAnimationFrame(req);
  }, [currentIndicatorIndex, markerSize]);
  
  const imageScramble = useDualLayerScramble({ duration: 0.5 });
  const projectScramble = useDualLayerScramble({ duration: 0.5 });
  const availabilityScramble = useDualLayerScramble({ duration: 0.5 });
  const spotsScramble = useDualLayerScramble({ duration: 0.5 });
  
  useEffect(() => {
    if (!isOpen) {
      setHoverIndex(null);
      setMarkerStyle(null);
      setMarkerRotation(0);
      setIsReady(false);
      lastHoverIndexRef.current = null;
      imageScramble.kill();
      projectScramble.kill();
      availabilityScramble.kill();
      spotsScramble.kill();
    }
  }, [isOpen, imageScramble, projectScramble, availabilityScramble, spotsScramble]);
  
  const onMouseLeave = () => {
    setHoverIndex(null);
  };
  
  const contactInfo = flyout?.contact;
  const teamInfo = flyout?.team;
  const socialInfo = flyout?.socials;
  const locationInfo = flyout?.location;
  const availabilityInfo = flyout?.availability;
  const centerImageInfo = flyout?.centerImage;
  const featuredProjectInfo = flyout?.featuredProject;
  
  const { contextSafe } = useGSAP(() => {
    if (containerRef.current) {
      if (timelineRef.current?.kill) timelineRef.current.kill();
      
      if (isOpen) {
        timelineRef.current = gsap.timeline();
        gsap.set(containerRef.current, { clipPath: "none", gridTemplateRows: "0fr" });
        timelineRef.current.to(containerRef.current, { gridTemplateRows: "1fr", duration: 1, ease: "expo.inOut" });
        
        const links = navLinkRefs.current.filter(Boolean);
        if (links.length > 0) {
          timelineRef.current.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.1, force3D: true }, "<+50%");
        }
        
        const secondaryLinks = secondaryLinkRefs.current.filter(Boolean);
        if (secondaryLinks.length > 0) {
          timelineRef.current.fromTo(secondaryLinks, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: "power2.out", stagger: 0.04, force3D: true }, "<+25%");
        }
        
        if (imageRevealRef.current) {
          timelineRef.current.fromTo(imageRevealRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.out" }, "<+25%");
        }
        
        timelineRef.current.add(() => {
          imageScramble.kill();
          projectScramble.kill();
          availabilityScramble.kill();
          spotsScramble.kill();
          imageScramble.scramble();
          projectScramble.scramble();
          availabilityScramble.scramble();
          spotsScramble.scramble();
        }, "<");
        
        if (availabilityDotRef.current) {
          timelineRef.current.to(availabilityDotRef.current, { opacity: 1, duration: 0.5, ease: "power2.out", onComplete: () => {
            availabilityDotRef.current?.classList.add("animate-pulse");
          }}, "<");
        }
        
        if (spotsDotRef.current) {
          timelineRef.current.to(spotsDotRef.current, { opacity: 1, duration: 0.5, ease: "power2.out", onComplete: () => {
            spotsDotRef.current?.classList.add("animate-pulse");
          }}, "<");
        }
        
        timelineRef.current.add(() => {
          setIsReady(true);
        }, "<+50%");
      } else {
        timelineRef.current = gsap.timeline();
        gsap.set(containerRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        timelineRef.current.to(containerRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "expo.inOut", onComplete: () => {
          if (containerRef.current) {
            gsap.set(containerRef.current, { gridTemplateRows: "0fr", clipPath: "none" });
          }
          if (availabilityDotRef.current) {
            gsap.set(availabilityDotRef.current, { opacity: 0 });
            availabilityDotRef.current.classList.remove("animate-pulse");
          }
          if (spotsDotRef.current) {
            gsap.set(spotsDotRef.current, { opacity: 0 });
            spotsDotRef.current.classList.remove("animate-pulse");
          }
          if (imageRevealRef.current) {
            gsap.set(imageRevealRef.current, { opacity: 0 });
          }
        }});
      }
    }
  }, { dependencies: [isOpen], scope: containerRef });
  
  const onImageHover = contextSafe(() => {
    imageScramble.scramble();
  });
  
  const onProjectHover = contextSafe(() => {
    projectScramble.scramble();
  });
  
  const onNavigate = useCallback((e, href) => {
    e.preventDefault();
    if (!isTransitioning) {
      onClose();
      setTimeout(() => {
        startTransition(() => {
          router.push(href, { scroll: true });
        });
      }, 150);
    }
  }, [onClose, router, startTransition, isTransitioning]);
  
  return (
    <div className="grid-container">
      <div ref={containerRef} className="grid bg-surface transition-colors duration-300" style={{ gridTemplateRows: "0fr" }}>
        <div className="overflow-hidden">
          <div className="p-24 lg:p-64">
            <div className="grid-layout gap-y-32">
              <nav ref={navRef} className="grid-span-12 lg:grid-span-4 relative flex flex-col items-start gap-4">
                {markerStyle && (
                  <motion.div 
                    className="pointer-events-none absolute left-0 bg-brand" 
                    style={{ width: markerSize, height: markerSize }} 
                    initial={{ x: -markerOffset, y: markerStyle.y, opacity: 0 }} 
                    animate={{ x: 0, y: markerStyle.y, rotate: 90 * markerRotation, opacity: 1 }} 
                    transition={{ 
                      x: { duration: 0.6, ease: easings.power3InOut }, 
                      y: { duration: 0.6, ease: easings.backInOut }, 
                      rotate: { duration: 0.6, ease: easings.backInOut }, 
                      opacity: { duration: 0.15 } 
                    }} 
                  />
                )}
                {navItems?.map((item, index) => {
                  if (!item.link) return null;
                  const isActive = index === activeIndex;
                  const isHovered = index === hoverIndex;
                  const isCurrent = index === currentIndicatorIndex;
                  return (
                    <div ref={el => { navItemRefs.current[index] = el; }} className="overflow-y-clip overflow-x-visible" key={item._key}>
                      <motion.div 
                        animate={{ x: isCurrent ? markerOffset : 0 }} 
                        transition={{ duration: 0.6, ease: easings.power3InOut }} 
                        onMouseEnter={() => {
                          if (lastHoverIndexRef.current !== null && lastHoverIndexRef.current !== index) {
                            setMarkerRotation(r => r + 1);
                          }
                          lastHoverIndexRef.current = index;
                          setHoverIndex(index);
                        }} 
                        onMouseLeave={onMouseLeave}
                      >
                        <SanityLink 
                          ref={el => { navLinkRefs.current[index] = el; }} 
                          link={item.link} 
                          onClick={e => onNavigate(e, item.link?.href ?? "/")} 
                          className={cx("block py-4 text-h2 transition-colors duration-300", isActive || isHovered ? "text-brand" : "")}
                        >
                          {item.text}
                        </SanityLink>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>
              
              <div className="grid-span-12 lg:grid-span-2 lg:grid-start-5 flex flex-col gap-24">
                {(contactInfo?.email || contactInfo?.phone) && (
                  <div className="flex flex-col gap-4">
                    <div className="overflow-hidden">
                      <p ref={el => { secondaryLinkRefs.current[0] = el; }} className="text-accent text-foreground-muted transition-colors duration-300">Contact</p>
                    </div>
                    {contactInfo.email && (
                      <div className="overflow-hidden">
                        <AnimatedLink ref={el => { secondaryLinkRefs.current[1] = el; }} href={`mailto:${contactInfo.email}`} className="block text-body-sm transition-colors duration-300 lg:text-body">
                          {contactInfo.email}
                        </AnimatedLink>
                      </div>
                    )}
                    {contactInfo.phone && (
                      <div className="overflow-hidden">
                        <AnimatedLink ref={el => { secondaryLinkRefs.current[2] = el; }} href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="block text-body-sm transition-colors duration-300 lg:text-body">
                          {contactInfo.phone}
                        </AnimatedLink>
                      </div>
                    )}
                  </div>
                )}
                
                {teamInfo && teamInfo.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {teamInfo.map((teamMember, index) => (
                      <div className="overflow-hidden" key={teamMember._key}>
                        <AnimatedLink ref={el => { secondaryLinkRefs.current[3 + index] = el; }} href={`mailto:${teamMember.email}`} className="block text-body-sm transition-colors duration-300 lg:text-body">
                          {teamMember.name}: {teamMember.email}
                        </AnimatedLink>
                      </div>
                    ))}
                  </div>
                )}
                
                {socialInfo && socialInfo.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {socialInfo.map((social, index) => (
                      <div className="overflow-hidden" key={social._key}>
                        <AnimatedLink ref={el => { secondaryLinkRefs.current[3 + (teamInfo?.length ?? 0) + index] = el; }} href={social.href ?? "#"} target="_blank" rel="noopener noreferrer" className="block text-body-sm transition-colors duration-300 lg:text-body">
                          {social.name}: {social.handle}
                        </AnimatedLink>
                      </div>
                    ))}
                  </div>
                )}
                
                {locationInfo && (
                  <div className="overflow-hidden">
                    <p ref={el => { secondaryLinkRefs.current[3 + (teamInfo?.length ?? 0) + (socialInfo?.length ?? 0)] = el; }} className="text-accent-sm text-foreground-muted transition-colors duration-300">
                      {locationInfo}
                    </p>
                  </div>
                )}
                
                <div className="mt-auto flex flex-col gap-8">
                  {availabilityInfo?.text && (
                    <p className="inline-flex items-start gap-8 text-accent-sm transition-colors duration-300">
                      {availabilityInfo.isAvailable && <span ref={availabilityDotRef} className="mt-6 inline-block size-8 shrink-0 bg-brand opacity-0" />}
                      <span ref={availabilityScramble.ref} className="opacity-0">{availabilityInfo.text}</span>
                    </p>
                  )}
                  {spotsRemaining && spotsRemaining > 0 ? (
                    <p className="inline-flex items-start gap-8 text-accent-sm transition-colors duration-300">
                      <span ref={spotsDotRef} className="mt-6 inline-block size-8 shrink-0 bg-brand opacity-0" />
                      <span ref={spotsScramble.ref} className="opacity-0">{`Only ${spotsRemaining} spot${spotsRemaining === 1 ? "" : "s"} left`}</span>
                    </p>
                  ) : null}
                </div>
              </div>
              
              <div ref={imageRevealRef} className="grid-span-5 grid-start-8 hidden gap-16 opacity-0 lg:flex">
                <div className="flex flex-1 flex-col gap-8">
                  {centerImageInfo?.image ? (
                    centerImageInfo.link ? (
                      <SanityLink link={centerImageInfo.link} onClick={e => onNavigate(e, centerImageInfo.link?.href ?? "/")} onMouseEnter={onImageHover} className="block flex-1 overflow-hidden">
                        <SanityImage image={centerImageInfo.image} className="zoom-in-image h-full w-full object-cover" alt={centerImageInfo.image.altText ?? ""} />
                      </SanityLink>
                    ) : (
                      <SanityImage image={centerImageInfo.image} className="zoom-in-image h-full w-full object-cover" alt={centerImageInfo.image.altText ?? ""} />
                    )
                  ) : (
                    <div className="h-full w-full bg-foreground/5" />
                  )}
                  {centerImageInfo?.caption && (
                    <p ref={imageScramble.ref} className="text-accent-sm transition-colors duration-300">{centerImageInfo.caption}</p>
                  )}
                </div>
                
                <div className="flex flex-1 flex-col gap-8">
                  {featuredProjectInfo?.project?.uri && featuredProjectInfo.project.image ? (
                    <Link href={featuredProjectInfo.project.uri} onClick={e => onNavigate(e, featuredProjectInfo.project?.uri ?? "/")} onMouseEnter={onProjectHover} className="block flex-1 overflow-hidden transition-opacity duration-300 hover:opacity-80">
                      <SanityImage image={featuredProjectInfo.project.image} className="zoom-in-image h-full w-full object-cover" alt={featuredProjectInfo.project.title ?? "Featured Project"} />
                    </Link>
                  ) : (
                    <div className="h-full w-full bg-foreground/5" />
                  )}
                  {featuredProjectInfo?.caption && (
                    <p ref={projectScramble.ref} className="text-accent-sm transition-colors duration-300">{featuredProjectInfo.caption}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}