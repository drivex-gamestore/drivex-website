import { sanityClient } from '@modules/sanity/client';
import { HeaderClient } from '@components/layout/HeaderClient';

const headerQuery = `*[_type == "siteSettings"][0]{
  navItems,
  headerCta,
  flyout {
    availability,
    centerImage {
      caption,
      image,
      link
    },
    contact,
    featuredProject {
      caption,
      project {
        title,
        uri,
        image
      }
    },
    location,
    socials,
    team
  },
  spotsRemaining
}`;

export default async function Header() {
  const headerData = await client.fetch(headerQuery);
  return (
    <HeaderClient 
      navItems={headerData?.navItems || []}
      headerCta={headerData?.headerCta}
      flyout={headerData?.flyout}
      spotsRemaining={headerData?.spotsRemaining}
    />
  );
}
