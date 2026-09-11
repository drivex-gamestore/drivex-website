import IndexedGridSectionClient from "@components/sections/IndexedGridSectionClient";

export default function IndexedGridSection({ data }) {
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
