import { sanityClient } from '@modules/sanity/client';
import { FooterClient } from '@components/layout/FooterClient';

const footerQuery = `*[_type == "footer"][0] {
  _id,
  navigation {
    title,
    availability,
    items[] {
      _key,
      text,
      link {
        type,
        text,
        href,
        openInNewTab,
        type == "internal" => {
          "href": internal->slug.current
        }
      }
    }
  },
  contactInformation[] {
    ...,
    markDefs[] {
      ...,
      _type == "linkField" && type == "internal" => {
        "href": internal.link->slug.current
      }
    }
  },
  copyrightNotice,
  asciiImageLeft { ..., asset-> },
  asciiDepthMapLeft { ..., asset-> },
  asciiColorLeft,
  asciiColorDarkLeft,
  asciiCellSizeLeft,
  asciiParallaxIntensityLeft,
  asciiRevealOriginXLeft,
  asciiRevealOriginYLeft,
  asciiMobileFallbackLeft { ..., asset-> },
  asciiImage { ..., asset-> },
  asciiDepthMap { ..., asset-> },
  asciiColor,
  asciiColorDark,
  asciiCellSize,
  asciiParallaxIntensity,
  asciiRevealOriginX,
  asciiRevealOriginY,
  asciiMobileFallback { ..., asset-> },
  showWatermark,
  spotsRemaining
}`;

export default async function Footer() {
  const footerData = await sanityClient.fetch(footerQuery, {}, {
    next: { revalidate: 60 }
  });

  if (!footerData) {
    return null; 
  }

  return <FooterClient {...footerData} />;
}
