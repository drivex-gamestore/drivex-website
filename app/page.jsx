import { sanityClient } from '@modules/sanity/client';
import PageBuilder from '@components/PageBuilder';

const SECTION_PROJECTION = `{
  ...,
  ...content
}`;

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
    <PageBuilder sections={sections} />
  );
}
