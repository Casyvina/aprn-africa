import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { structure } from './sanity/desk/structure'
import { schemaTypes } from './sanity/schemas'
import { aprnTheme } from './sanity/theme'
import StudioLogo from './sanity/components/StudioLogo'

export default defineConfig({
  name: 'aprn-africa-studio',
  title: 'APRN Africa',

  projectId: 'cwohq4ef',
  dataset: 'production',

  basePath: '/studio',

  theme: aprnTheme,

  studio: {
    components: {
      logo: StudioLogo,
    },
  },

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
