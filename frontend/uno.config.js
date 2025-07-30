import { transformerVariantGroup, defineConfig } from 'unocss'

export default defineConfig({
  transformers: [
    transformerVariantGroup(),
  ],
})
