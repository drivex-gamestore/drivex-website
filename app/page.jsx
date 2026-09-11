import { sanityClient } from '@modules/sanity/client';
import PageBuilder from '@components/PageBuilder';

async function getHomepageData() {
  const query = `*[_type == "homePage"][0]{
    pageBuilder[]{
      _key,
      enabled,
      "section": sectionRef->{
        _type,
        _type == "heroSection" => {
          "headline": content.headline,
          "headlineLevel": content.headlineLevel,
          "headlineDisplay": content.headlineDisplay,
          "subtext": content.subtext,
          "ctas": content.ctas {
            layout,
            gap,
            buttons[]{ text, href, theme, variant }
          },
          "trustedBy": content.trustedBy.items[]{
            _type == "reference" => @-> {
              _type,
              name,
              alt,
              variant,
              svgCode
            },
            _type == "textItem" => {
              _type,
              text
            }
          },
          "asciiImage": content.asciiImage,
          "asciiMobileFallback": content.asciiMobileFallback,
          "asciiDepthMap": content.asciiDepthMap,
          "asciiColor": content.asciiColor,
          "asciiColorDark": content.asciiColorDark,
          "asciiCellSize": content.asciiCellSize,
          "asciiParallaxIntensity": content.asciiParallaxIntensity,
          "asciiRevealOriginX": content.asciiRevealOriginX,
          "asciiRevealOriginY": content.asciiRevealOriginY
        },

        // TODO: add a flattening branch per remaining section type...
        ...
      }
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
    <PageBuilder sections={sections} />
  );
}
