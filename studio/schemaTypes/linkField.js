import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'linkField',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' },
          { title: 'Email', value: 'email' },
        ],
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canDownload',
      title: 'Is Downloadable',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
