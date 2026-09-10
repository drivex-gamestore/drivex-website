"use client";

import dynamic from 'next/dynamic';

const AsciiTypewriter = dynamic(
  () => import('@modules/webgl/components/AsciiTypewriter').then((mod) => mod.AsciiTypewriter),
  { ssr: false }
);

export function AsciiTypewriterWrapper({
  imageSrc,
  color,
  colorDark,
  cellSize,
  alignX = "center",
  externalProgress,
  externalColorProgress,
  depthMapSrc,
  parallaxIntensity = 0.02,
  mouseRef,
  isHovering = false,
  isTouch = false,
  mobileFit,
  revealOriginX,
  revealOriginY,
  frameloop,
  dpr
}) {
  const enableDepthParallax = !isTouch && !!depthMapSrc;
  const enableGooeyReveal = !isTouch && !!depthMapSrc;
  const hasExternalProgress = externalProgress !== undefined;
  const resolvedColorProgress = hasExternalProgress ? externalColorProgress : undefined;

  const revealOrigin = (revealOriginX != null && revealOriginY != null) 
    ? { revealOrigin: { x: revealOriginX, y: revealOriginY } } 
    : {};

  return (
    <AsciiTypewriter
      imageSrc={imageSrc}
      color={color}
      colorDark={colorDark}
      cellSize={cellSize}
      alignX={alignX}
      alignY="center"
      fit="contain"
      mobileFit={mobileFit}
      className="size-full"
      externalProgress={externalProgress}
      externalColorProgress={resolvedColorProgress}
      disableInternalAnimation={hasExternalProgress}
      enableDepthParallax={enableDepthParallax}
      depthMapSrc={depthMapSrc}
      parallaxIntensity={parallaxIntensity}
      mouseRef={mouseRef}
      enableGooeyReveal={enableGooeyReveal}
      isHovering={isHovering}
      gooeyRadius={0.035}
      gooeySoftness={0.04}
      gooeyNoiseIntensity={0.02}
      {...revealOrigin}
      {...(frameloop !== undefined ? { frameloop } : {})}
      {...(dpr !== undefined ? { dpr } : {})}
      skipContentBounds={true}
    />
  );
}
