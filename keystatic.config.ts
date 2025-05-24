// TODO: At some point, I will want to mess with Keystatic's default behavior like this...
// https://github.com/stefanprobst/astro-keystatic-tailwindcss ( from https://github.com/Thinkmill/keystatic/issues/1189#issuecomment-2320658999 )
// https://github.com/Thinkmill/keystatic/issues/831

import { config, type LocalConfig, type GitHubConfig } from '@keystatic/core';
import {
  PUBLIC_CONTENT_PATH_PREFIX,
  REPO,
  PUBLIC_KEYSTATIC_STORAGE_LOCAL,
  globalSettings,
  userSingletons,
  userCollections,
  userNavigation,
} from './src/config-keystatic/variables.js';
// Globals settings
import { globalSettings as globalSettingsSingleton } from './src/config-keystatic/content-types/globalSettings.ts';
import { languages } from './src/config-keystatic/content-types/languages.ts';
import { filesLibrary } from './src/config-keystatic/content-types/filesLibrary.ts';
import { partials } from './src/config-keystatic/content-types/partials.ts'
// Collections
import { pages } from './src/config-keystatic/content-types/pages.ts'
import { articles } from './src/config-keystatic/content-types/articles.ts';

const useArticles = globalSettings?.collections?.includes('articles') || false;

// Storage
const localMode: LocalConfig['storage'] = {
  kind: 'local',
  ...(PUBLIC_CONTENT_PATH_PREFIX ? { pathPrefix: PUBLIC_CONTENT_PATH_PREFIX } : {}),
};

const githubMode: GitHubConfig['storage'] = {
  kind: 'github',
  repo: REPO,
  // branchPrefix: 'my-prefix/', // TODO: should we set this up?
};

export default config({
  storage: PUBLIC_KEYSTATIC_STORAGE_LOCAL ? localMode : githubMode,
  locale: 'en-US',
  ui: {
    brand: {
      name: 'poko',
      // mark: ({ colorScheme }) => {
      //   let path = colorScheme === 'dark'
      //     ? '//your-brand.com/path/to/dark-logo.png'
      //     : '//your-brand.com/path/to/light-logo.png';

      //   return <img src={path} height={24} />
      // },
    },
    navigation: {
      'Settings': ['globalSettings', 'languages', 'filesLibrary', 'partials'],
      'Collections': [
        'pages',
        ...(useArticles ? ['articles'] : []),
      ],
      ...(userNavigation || {}),
    },
  },
  singletons: {
    globalSettings: globalSettingsSingleton,
    ...(userSingletons || {}),
  },
  collections: {
    languages,
    filesLibrary,
    partials,
    // Collections
    pages,
    articles,
    ...(userCollections || {}),
  },
});
