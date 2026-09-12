import { ScrollAnimatedHeadline } from "@drivexstudio/animations";

import CardsSectionClient from "./CardsSectionClient";
import AnimatedListSectionClient from "./AnimatedListSectionClient";
import FeaturedWorkSectionClient from "./FeaturedWorkSectionClient";
import IndexedGridSectionClient from "./IndexedGridSectionClient";
import AccordionClient from "./AccordionClient";

const SECTION_CLASS_NAME = "bg-background pt-64 lg:pt-128 pb-64 lg:pb-128";

export function CardsSection({ data }) {
  if (!data?.cards?.length) return null;
  return (
    <section
      data-theme={data.theme}
      data-page-builder-section="cardsSection"
      className={SECTION_CLASS_NAME}
    >
      <div className="grid-container">
        <div className="grid-layout">
          <div className="grid-span-12">
            <CardsSectionClient cards={data.cards} fullHeight={data.fullHeight} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnimatedListSection({ data }) {
  if (!data?.items?.length) return null;

  return (
    <section
      data-theme={data.theme ?? "light"}
      data-page-builder-section="animatedListSection"
      className={SECTION_CLASS_NAME}
    >
      <AnimatedListSectionClient
        headline={data.headline}
        label={data.label}
        text={data.text}
        items={data.items}
        variant={data.variant}
        headlineDisplay={data.headlineDisplay}
        fixedMedia={data.fixedMedia}
      />
    </section>
  );
}

export function FeaturedWorkSection({ data }) {
  if (!data?.content?.caseStudies?.length) return null;

  return (
    <section
      data-theme={data.theme ?? "dark"}
      data-page-builder-section="featuredWorkSection"
      className={SECTION_CLASS_NAME}
    >
      <FeaturedWorkSectionClient section={data} />
    </section>
  );
}

export function IndexedGridSection({ data }) {
  if (!data?.items?.length) return null;

  return (
    <section
      data-theme="light"
      data-page-builder-section="indexedGridSection"
      className="bg-background pt-64 lg:pt-128 pb-64 lg:pb-128">

      <IndexedGridSectionClient
        headline={data.headline}
        text={data.text}
        label={data.label}
        items={data.items}
        variant={data.variant} />
    </section>
  );
}

export function AccordionSection({ data }) {
  if (!data?.content?.items?.length) return null;

  const { headline, allowMultiple, items } = data.content;

  return (
    <section
      data-theme={data.theme}
      data-page-builder-section="accordionSection"
      className={data.className || "bg-background py-64 lg:py-96"}
    >
      <div className="grid-container">
        <div className="grid-layout">
          <div className="grid-span-12 lg:grid-span-4 sticky top-0 z-10 -mx-(--site-grid-margin) bg-background px-(--site-grid-margin) pt-header pb-32 lg:top-header lg:z-auto lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-32">
            <ScrollAnimatedHeadline
              headline={{
                text: headline?.text || "Common questions",
                level: headline?.level ?? "h2",
              }}
            />
          </div>

          <div className="grid-span-12 lg:grid-span-6 lg:grid-start-6 mt-48 lg:mt-0">
            <AccordionClient items={items} allowMultiple={allowMultiple} />
          </div>
        </div>
      </div>
    </section>
  );
}
