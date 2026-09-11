import AnimatedListSectionClient from "@components/sections/AnimatedListSectionClient";

const SECTION_CLASS_NAME = "bg-background pt-64 lg:pt-128 pb-64 lg:pb-128";

export default function AnimatedListSection({ data }) {
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
