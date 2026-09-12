export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'navItems',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', title: 'Text', type: 'string' },
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                { name: 'type', title: 'Type', type: 'string' },
                { name: 'href', title: 'Href', type: 'string' },
                { name: 'text', title: 'Link Text', type: 'string' },
                { name: 'canDownload', title: 'Can Download', type: 'boolean' },
                { name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean' }
              ]
            }
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'link.href'
            }
          }
        }
      ]
    },
    {
      name: 'headerCta',
      title: 'Header CTA',
      type: 'object',
      fields: [
        { name: 'type', title: 'Type', type: 'string' },
        { name: 'href', title: 'Href', type: 'string' },
        { name: 'text', title: 'Text', type: 'string' },
        { name: 'canDownload', title: 'Can Download', type: 'boolean' },
        { name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean' }
      ]
    },
    {
      name: 'flyout',
      title: 'Flyout Menu',
      type: 'object',
      fields: [
        {
          name: 'availability',
          title: 'Availability',
          type: 'object',
          fields: [
            { name: 'isAvailable', title: 'Is Available', type: 'boolean' },
            { name: 'text', title: 'Text', type: 'text' }
          ]
        },
        {
          name: 'centerImage',
          title: 'Center Image',
          type: 'object',
          fields: [
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'image', title: 'Image', type: 'image' },
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                { name: 'type', title: 'Type', type: 'string' },
                { name: 'href', title: 'Href', type: 'string' },
                { name: 'text', title: 'Link Text', type: 'string' },
                { name: 'canDownload', title: 'Can Download', type: 'boolean' },
                { name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean' }
              ]
            }
          ]
        },
        {
          name: 'contact',
          title: 'Contact',
          type: 'object',
          fields: [
            { name: 'email', title: 'Email', type: 'string' },
            { name: 'phone', title: 'Phone', type: 'string' }
          ]
        },
        {
          name: 'featuredProject',
          title: 'Featured Project',
          type: 'object',
          fields: [
            { name: 'caption', title: 'Caption', type: 'string' },
            {
              name: 'project',
              title: 'Project',
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'uri', title: 'URI', type: 'string' },
                { name: 'image', title: 'Image', type: 'image' }
              ]
            }
          ]
        },
        { name: 'location', title: 'Location', type: 'string' },
        {
          name: 'socials',
          title: 'Socials',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Name', type: 'string' },
                { name: 'handle', title: 'Handle', type: 'string' },
                { name: 'href', title: 'Href', type: 'string' }
              ]
            }
          ]
        },
        {
          name: 'team',
          title: 'Team',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Name', type: 'string' },
                { name: 'email', title: 'Email', type: 'string' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'spotsRemaining',
      title: 'Spots Remaining',
      type: 'number',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Header, Navigation & Flyout Menu',
      }
    },
  },
}
