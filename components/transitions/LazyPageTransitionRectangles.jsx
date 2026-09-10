"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const PageTransitionRectangles = dynamic(
  () => import('@components/transitions/PageTransitionRectangles').then((mod) => mod.PageTransitionRectangles),
  { ssr: false }
);
export function LazyPageTransitionRectangles() {
  return <PageTransitionRectangles />;
}