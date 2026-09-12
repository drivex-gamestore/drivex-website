import { sanityClient } from '@modules/sanity/client';

import HeroSection from '@sections/hero/HeroSection';
import ContentBlockSection from '@sections/ContentBlockSection';
import {
  CardsSection,
  AnimatedListSection,
  FeaturedWorkSection,
  IndexedGridSection,
  AccordionSection,
} from '@sections/ComponentSections';

const SECTION_PROJECTION = `{
  ...,
  ...content
}`;

// Maps each Sanity section `_type` to the component that renders it.
// Adding a new section type only requires one new line here.
const SECTION_COMPONENTS = {
  heroSection: HeroSection,
  cardsSection: CardsSection,
  animatedListSection: AnimatedListSection,
  featuredWorkSection: FeaturedWorkSection,
  indexedGridSection: IndexedGridSection,
  accordionSection: AccordionSection,
  contentBlockSection: ContentBlockSection,
};

async function getHomepageData() {
  const query = `*[_type == "homePage"][0]{
    pageBuilder[]{
      _key,
      enabled,
      "section": sectionRef->${SECTION_PROJECTION}
    }
  }`;

  return await sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function HomePage() {
  const data = await getHomepageData();

  const sections = (data?.pageBuilder ?? [])
    .filter((item) => item.enabled !== false && item.section)
    .map((item) => ({ ...item.section, _key: item._key }));

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
