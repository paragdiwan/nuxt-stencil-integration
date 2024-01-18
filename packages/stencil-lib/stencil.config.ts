//@ts-nocheck
import { Config } from '@stencil/core';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'stencil-lib',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'dist-hydrate-script'
    },
    vueOutputTarget({
      componentCorePackage: "stencil-lib",
      proxiesFile: "../stencil-vue-wrapper/src/components.ts",
    }),
  ],
  testing: {
    browserHeadless: "new",
  },
};
