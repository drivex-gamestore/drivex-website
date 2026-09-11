import React from 'react';
import HeroSection from '@components/sections/HeroSection';
import CardsSection from '@components/sections/CardsSection';
import AnimatedListSection from '@components/sections/AnimatedListSection';
import FeaturedWorkSection from '@components/sections/FeaturedWorkSection';
import IndexedGridSection from '@components/sections/IndexedGridSection';

const SECTION_COMPONENTS = {
  heroSection: HeroSection,
  cardsSection: CardsSection,
  animatedListSection: AnimatedListSection,
  featuredWorkSection: FeaturedWorkSection,
  indexedGridSection : IndexedGridSection,
};

export default function PageBuilder({ sections }) {
  if (!sections || !Array.isArray(sections)) return null;

  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section._type];

        if (!Component) {
          console.warn(`Missing component for section type: ${section._type}`);
          return null;
        }
        return <Component key={section._key} data={section} />;
      })}
    </>
  );
}
