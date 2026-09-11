import React from 'react';
import HeroSection from '@components/sections/HeroSection';

const SECTION_COMPONENTS = {
  heroSection: HeroSection,
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
