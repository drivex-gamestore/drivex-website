import { getImageSrc } from "@modules/sanity/utils/sanity-imageutils";
import { HeroSectionContent } from "@components/sections/HeroSectionContent";
import { HeroAsciiArt } from "@components/sections/HeroAsciiArt";
import { HeroScrollPush } from "@components/sections/HeroScrollPush";

const SECTION_CLASS_NAME =
  "relative min-h-svh overflow-hidden bg-background pt-0 pb-0";
const LEFT_COLUMN_CLASS_NAME =
  "grid-span-12 lg:grid-span-7 pointer-events-none relative z-10 flex grid-rows-[1fr_auto] flex-col items-start justify-between pb-16 lg:pb-32";
const VISUAL_COLUMN_CLASS_NAME =
  "lg:grid-span-5 absolute top-[35%] right-0 bottom-0 w-9/10 items-center justify-center overflow-hidden lg:relative lg:inset-auto lg:flex lg:w-auto";
const HERO_THEME = "dark";

export default function HeroSection({ data }) {
  if (!data) return null;

  return (
    <section
      data-theme={HERO_THEME}
      data-page-builder-section="heroSection"
      className={SECTION_CLASS_NAME}
    >
      <HeroScrollPush className="grid-container relative min-h-svh pt-52">
        <div className="grid-layout min-h-[calc(100svh-52px)]">
          <HeroSectionContent
            className={LEFT_COLUMN_CLASS_NAME}
            headline={data.headline}
            headlineLevel={data.headlineLevel}
            headlineDisplay={data.headlineDisplay}
            subtext={data.subtext}
            ctas={data.ctas}
            trustedBy={data.trustedBy}
          />

          {/* Visual column — sibling to the left column, not nested inside it */}
          <div className={VISUAL_COLUMN_CLASS_NAME}>
            {data.asciiImage && (
              <HeroAsciiArt
                imageSrc={getImageSrc(data.asciiImage)}
                mobileImageSrc={
                  data.asciiMobileFallback
                    ? getImageSrc(data.asciiMobileFallback)
                    : undefined
                }
                depthMapSrc={
                  data.asciiDepthMap ? getImageSrc(data.asciiDepthMap) : undefined
                }
                color={data.asciiColor}
                colorDark={data.asciiColorDark}
                cellSize={data.asciiCellSize}
                parallaxIntensity={data.asciiParallaxIntensity}
                revealOriginX={data.asciiRevealOriginX}
                revealOriginY={data.asciiRevealOriginY}
              />
            )}
          </div>
        </div>
      </HeroScrollPush>
    </section>
  );
}
