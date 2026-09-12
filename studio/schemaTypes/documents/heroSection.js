
import { asciiArtFields } from "../objects/asciiArtFields";

export default {
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    {
      name: "content",
      title: "Content",
      type: "object",
      fields: [
        { name: "headline", title: "Headline", type: "string" },
        { name: "headlineLevel", title: "Headline level", type: "string" },
        { name: "headlineDisplay", title: "Headline display", type: "string" },
        { name: "subtext", title: "Subtext", type: "text" },
        { name: "media", title: "Media (desktop)", type: "media" },
        { name: "mobileImage", title: "Mobile image", type: "customImage" },
        { name: "scrollText", title: "Scroll text", type: "string" },
        { name: "useWatermark", title: "Use watermark", type: "boolean" },
        {
          name: "ctas",
          title: "CTAs",
          type: "object",
          fields: [
            { name: "layout", title: "Layout", type: "string" },
            { name: "gap", title: "Gap", type: "string" },
            {
              name: "buttons",
              title: "Buttons",
              type: "array",
              of: [{ type: "ctaButton" }],
            },
          ],
        },
        {
          name: "trustedBy",
          title: "Trusted by",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            {
              name: "items",
              title: "Items",
              type: "array",
              of: [
                { type: "logoImage" },
                { type: "svgItem" },
                { type: "textItem" },
              ],
            },
          ],
        },
        ...asciiArtFields(""),
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: "Hero Section" };
    },
  },
};
