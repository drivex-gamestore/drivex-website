"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const CustomCursor = dynamic(
  () => import('@components/animations/CustomCursor').then((mod) => mod.default),
  { ssr: false }
);

export function LazyCustomCursor(props) {
  const { children } = props;

  return (
    <CustomCursor>
      {children}
    </CustomCursor>
  );
}