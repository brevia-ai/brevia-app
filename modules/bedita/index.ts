import {
  defineNuxtModule,
  addServerHandler,
  addImportsDir,
  createResolver,
  installModule,
  addServerImportsDir,
  logger,
} from '@nuxt/kit';
import { type NitroEventHandler } from 'nitropack';
import { defu } from 'defu';

// Module options TypeScript interface definition
export interface ModuleOptions {
  features: {
    signup: boolean;
    changePassword: boolean;
    deleteAccount: boolean;
    demoVersion: boolean;
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@brevia/brevia-admin-bedita',
    configKey: 'bedita',
    compatibility: {
      nuxt: '^3.0.0',
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

  async setup(options, nuxt) {
    const runtimeConfig = nuxt.options.runtimeConfig;
    const integration = process.env.NUXT_PUBLIC_INTEGRATION || runtimeConfig.public.integration;
    if (integration !== 'bedita') {
      logger.info('Skipping bedita integration setup');
      return;
    }
    logger.start('Setting up bedita integration...');

    await installModule('@atlasconsulting/nuxt-bedita');

    runtimeConfig.public.bedita = defu(runtimeConfig.public.bedita || {}, {
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
        route: '/api/bedita/user_menu',
        handler: resolver.resolve('./runtime/server/api/bedita/user_menu.get'),
      },
      {
        route: '/api/bedita/collections',
        handler: resolver.resolve('./runtime/server/api/bedita/collections.post'),
      },
      {
        route: '/api/bedita/collections/:id',
        handler: resolver.resolve('./runtime/server/api/bedita/collections/[id].patch'),
      },
      {
        route: '/api/bedita/collections/:id',
        handler: resolver.resolve('./runtime/server/api/bedita/collections/[id].delete'),
      },
      {
        route: '/api/bedita/index/link',
        handler: resolver.resolve('./runtime/server/api/bedita/index/link.post'),
      },
      {
        route: '/api/bedita/index/question',
        handler: resolver.resolve('./runtime/server/api/bedita/index/question.post'),
      },
      {
        route: '/api/bedita/index/upload',
        handler: resolver.resolve('./runtime/server/api/bedita/index/upload.post'),
      },
      {
        route: '/api/bedita/index/:collection_id/documents_metadata',
        handler: resolver.resolve(
          './runtime/server/api/bedita/index/[collection_id]/documents_metadata.get',
        ),
      },
      {
        route: '/api/bedita/index/:collection_id/:document_id',
        handler: resolver.resolve(
          './runtime/server/api/bedita/index/[collection_id]/[document_id].get',
        ),
      },
      {
        route: '/api/bedita/index/:collection_id/:document_id',
        handler: resolver.resolve(
          './runtime/server/api/bedita/index/[collection_id]/[document_id].delete',
        ),
      },
      {
        route: '/api/bedita/versions',
        handler: resolver.resolve('./runtime/server/api/bedita/versions.get'),
      },
    ];

    endpointsEnabled.forEach((endpoint) => {
      addServerHandler(endpoint);
      const methodMatch = endpoint.handler.match(/\.(get|post|patch|delete)/);
      const method = methodMatch ? `${methodMatch[1].toUpperCase()} ` : '';
      logger.info(`API endpoint ${method}${endpoint.route} added.`);
    });

    /*
     ********************************
     * Composables and SSR utils    *
     ********************************
     */
    addImportsDir(resolver.resolve('./runtime/utils'));
    addImportsDir(resolver.resolve('./runtime/composables'));
    addServerImportsDir(resolver.resolve('./runtime/server/utils'));

    logger.success('bedita integration ready');
  },
});
