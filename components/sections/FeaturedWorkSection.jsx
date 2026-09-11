import FeaturedWorkSectionClient from "@components/sections/FeaturedWorkSectionClient";

const SECTION_CLASS_NAME = "bg-background pt-64 lg:pt-128 pb-64 lg:pb-128";

export default function FeaturedWorkSection({ data }) {
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
