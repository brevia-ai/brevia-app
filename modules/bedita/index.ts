import {
    defineNuxtModule,
    addServerHandler,
    addImportsDir,
    createResolver,
    addServerImports,
    addRouteMiddleware,
    logger,
    addTypeTemplate,
    addImports,
  } from '@nuxt/kit';
  import { type NitroEventHandler } from 'nitropack';
  import { defu } from 'defu';
  import type { EndpointConf } from './runtime/types';

  // Module options TypeScript interface definition
  export interface ModuleOptions {
    features: {
        signup: Boolean,
        changePassword: Boolean,
        deleteAccount: Boolean,
        demoVersion: Boolean,
    },
  }

  export default defineNuxtModule<ModuleOptions>({
    meta: {
      name: '@brevia/brevia-admin-bedita',
      configKey: 'bedita',
      compatibility: {
        nuxt: '^3.0.0'
      },
    },

    // Default configuration options of the Nuxt module
    defaults: {
        features: {
            signup: true,
            changePassword: true,
            deleteAccount: true,
            demoVersion: true,
        },
    },

    setup (options, nuxt) {
      logger.start('Setting up bedita integration...');

      const runtimeConfig = nuxt.options.runtimeConfig
      runtimeConfig.bedita = defu(runtimeConfig.bedita || {}, {
        features: options.features,
      });

      const resolver = createResolver(import.meta.url);

      // Transpile runtime
      nuxt.options.build.transpile.push(
        resolver.resolve('./runtime'),
        resolver.resolve('../node_modules/tslib'), // transpile tslib used by @atlasconsulting/bedita-sdk
      );

      /*
       **************
       * Server API *
       **************
       */
      const endpointsEnabled: NitroEventHandler[] = [
        {
          route: '/api/bedita/auth',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/login.post'),
        },
        {
          route: '/api/bedita/auth/user',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/user.patch'),
        },
        {
          route: '/api/bedita/auth/logout',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/logout'),
        },
        {
          route: '/api/bedita/auth/reset',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/reset.post'),
        },
        {
          route: '/api/bedita/auth/change',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/change.patch'),
        },
        {
          route: '/api/bedita/auth/optout',
          handler: resolver.resolve('./runtime/server/api/bedita/auth/optout.post'),
        }
      ];

      /*
       ***************
       * Middlewares *
       ***************
       */
    //   addRouteMiddleware({
    //     name: 'beditaAuth',
    //     path: resolver.resolve('./runtime/middleware/auth'),
    //     global: options.auth.global,
    //   });
    //   addRouteMiddleware({
    //     name: 'beditaRolesGuard',
    //     path: resolver.resolve('./runtime/middleware/roles-guard'),
    //     global: false,
    //   });

      /*
       ********************************
       * Composables and SSR utils    *
       ********************************
       */
      addImportsDir(resolver.resolve('./runtime/utils'));
      addImportsDir(resolver.resolve('./runtime/composables'));
      // imports to use for example in route middlewares (server side)
    //   addImports([
    //     {
    //       from: resolver.resolve('./runtime/server/utils/session'),
    //       name: 'getSessionConfig',
    //     },
    //     {
    //       from: resolver.resolve('./runtime/server/utils/bedita-api-client'),
    //       name: 'beditaApiClient',
    //     },
    //   ]);

      /*
       *****************
       * Type template *
       *****************
       */
    //   addTypeTemplate({
    //     filename: 'types/nuxt-bedita.d.ts',
    //     getContents: () => [
    //       `declare module '@atlasconsulting/nuxt-bedita' {`,
    //       `  import('${resolver.resolve('./runtime/types')}')`,
    //       `  export type { UserAuth, UserDataStore, ApiResponseBodyResource, ApiResponseBodyList, SignupBeditaBody } from '${resolver.resolve('./runtime/types')}'`,
    //       `}`,
    //     ].join('\n'),
    //   });

      logger.success('bedita integration ready');
    }
  });
