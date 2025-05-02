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
import { globalSettings as globalSettingsSingleton } from './src/config-keystatic/content-types/globalSettings.ts';
import { languages } from './src/config-keystatic/content-types/languages.ts';
import { pages } from './src/config-keystatic/content-types/pages.ts'
import { articles } from './src/config-keystatic/content-types/articles.ts';

const useArticles = globalSettings?.collections?.includes('articles') || false;

// Storage
const localMode: LocalConfig['storage'] = {
  kind: 'local',
  pathPrefix: PUBLIC_CONTENT_PATH_PREFIX,
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
      'Settings': ['globalSettings', 'languages'],
      'Pages': ['pages'],
      ...(useArticles ? { 'Articles': ['articles'] } : {}),
      ...(userNavigation || {}),
    },
  },
  singletons: {
    globalSettings: globalSettingsSingleton,
    ...(userSingletons || {}),
  },
  collections: {
    languages,
    pages,
    articles,
    ...(userCollections || {}),
  },
});
