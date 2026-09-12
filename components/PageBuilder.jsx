import React from 'react';

import HeroSection from '@sections/HeroSection';
import CardsSection from '@sections/CardsSection';
import AnimatedListSection from '@sections/AnimatedListSection';
import FeaturedWorkSection from '@sections/FeaturedWorkSection';
import IndexedGridSection from '@sections/IndexedGridSection';
import AccordionSection from '@sections/AccordionSection';
import ContentBlockSection from '@sections/ContentBlockSection';

const SECTION_COMPONENTS = {
  heroSection: HeroSection,
  cardsSection: CardsSection,
  animatedListSection: AnimatedListSection,
  featuredWorkSection: FeaturedWorkSection,
  indexedGridSection: IndexedGridSection,
  accordionSection: AccordionSection,
  contentBlockSection: ContentBlockSection,
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
