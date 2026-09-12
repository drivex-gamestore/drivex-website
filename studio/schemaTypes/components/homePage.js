const SECTION_TYPES = [
  { type: "heroSection" },
  { type: "cardsSection" },
  { type: "animatedListSection" },
  { type: "featuredWorkSection" },
  { type: "indexedGridSection" },
  { type: "accordionSection" },
  { type: "contentBlockSection" },
];

export default {
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    {
      name: "pageBuilder",
      title: "Sections",
      description: "Drag to reorder. Toggle Enabled to show/hide without deleting.",
      type: "array",
      of: [
        {
          type: "object",
          name: "pageBuilderItem",
          title: "Section",
          fields: [
            {
              name: "sectionRef",
              title: "Section",
              description: "Pick which section document goes in this slot.",
              type: "reference",
              to: SECTION_TYPES,
              validation: (Rule) => Rule.required(),
            },
            {
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
            },
          ],
          preview: {
            select: {
              refType: "sectionRef._type",
              refTitle: "sectionRef.title",
              enabled: "enabled",
            },
            prepare({ refType, refTitle, enabled }) {
              return {
                title: refTitle ? `${refType} — ${refTitle}` : refType || "Untitled section",
                subtitle: enabled === false ? "Hidden" : "Visible",
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
};
