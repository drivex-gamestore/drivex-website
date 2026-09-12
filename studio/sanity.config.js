import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { muxInput } from 'sanity-plugin-mux-input'; 

export default defineConfig({
  name: 'default',
  title: 'drivex app',

  projectId: 'pc8d2ay0',
  dataset: 'production',

  plugins: [
   structureTool(), 
   muxInput(), 
   visionTool()
 ],

  schema: {
    types: schemaTypes,
  },
})
