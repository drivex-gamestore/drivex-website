import { client } from '@modules/sanity/client';
import PageBuilder from '@components/PageBuilder';

async function getHomepageData() {
  const query = `*[_type == "page" && slug.current == "home"][0]{
    title,
    pageBuilder[]{
      _type,
      _key,

      _type == "heroSection" => {
        headline,
        headlineLevel,
        headlineDisplay,
        subtext,
        ctas[]{ label, link },
        trustedBy[]{ logo, alt },
        asciiImage,
        asciiMobileFallback,
        asciiDepthMap,
        asciiColor,
        asciiColorDark,
        asciiCellSize,
        asciiParallaxIntensity,
        asciiRevealOriginX,
        asciiRevealOriginY,
      },

      // TODO: add a "_type == '<sectionName>' => { ... }" branch here for
      // each remaining section as its schema gets written — until then this
      // falls through to the flat spread below so nothing breaks.
      ...,
    }
  }`;

  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <PageBuilder sections={data?.pageBuilder} />
  );
}
