import { config, fields, collection, type LocalConfig, type GitHubConfig, singleton } from '@keystatic/core';
import { wrapper } from '@keystatic/core/content-components'

// export const markdocConfig = fields.markdoc.createMarkdocConfig({});

const VERCEL_GIT_REPO_OWNER = import.meta.env.PUBLIC_VERCEL_GIT_REPO_OWNER;
const VERCEL_GIT_REPO_SLUG = import.meta.env.PUBLIC_VERCEL_GIT_REPO_SLUG;
const VERCEL_REPO = VERCEL_GIT_REPO_OWNER && VERCEL_GIT_REPO_SLUG && `${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}`;
const REPO = import.meta.env.PUBLIC_REPO || VERCEL_REPO || '';
const PUBLIC_KEYSTATIC_STORAGE_LOCAL = (
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === true ||
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === 'true' ||
  (import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL !== 'false' && (import.meta.env.DEV || false))
);

const localMode: LocalConfig['storage'] = {
  kind: 'local',
};

const githubMode: GitHubConfig['storage'] = {
  kind: 'github',
  repo: REPO,
  // branchPrefix: 'my-prefix/', // TODO: should we set this up?
};

// SCHEMAS
const pageSchema = {
  // url: fields.text({
  //   label: 'URL',
  //   description: 'The page URL',
  //   validation: {
  //     isRequired: true,
  //     pattern: {
  //       regex: /^(?!.*\/\/)[a-zA-Z0-9-\/]+$/,
  //       message: 'URL must contain only letters, numbers, dashes, and forward slashes'
  //     },
  //   },
  //   multiline: false
  // }),
  image: fields.image({
    label: "Image",
    // directory: "public/images/posts",
  }),
  prose: fields.markdoc({
    label: 'Prose',
    options: {
      image: {
        // directory: './',
        // publicPath: './content/',
      },
    },
    components: { 
      callout: wrapper({
        label: 'Callout',
        schema: {
          title: fields.text({
            label: 'Title',
            validation: {
              isRequired: true,
            },
          }),
          message: fields.text({
            label: 'Message',
            // validation: {
            //   isRequired: true,
            // },
          }),
        }
      })
    }
  }),
}

// SINGLETONS
const settings = singleton({
  label: 'Settings',
  path: 'content/_settings/general',
  format: { data: 'yaml' },
  entryLayout: 'form',
  schema: {
    
  }
})

const homepage = singleton({
  label: 'Home Page',
  path: 'content/index',
  format: { contentField: 'prose' },
  schema: {
    name: fields.text({
      label: 'Page Name',
      description: 'The name of the page',
      validation: {
        isRequired: true,
      },
      multiline: false
    }),
    ...pageSchema
  }
})

// COLLECTIONS
const pages = collection({
  label: 'Pages',
  slugField: 'name',
  path: 'content/**/',
  format: { contentField: 'prose' },
  schema: {
    name: fields.slug({
      name: {
        label: 'Page Name',
        description: 'The name of the page',
        validation: {
          isRequired: true,
        }
      },
      slug: {
        label: 'URL',
        description: 'URL-friendly slug or path (may contain "/" and "-")',
        validation: {
          length: {
            min: 1,
          },
          pattern: {
            regex: /^(?![\s-\/]*$)[a-z0-9-\/]+$/,
            message: 'URL must contain only letters, numbers, dashes, and forward slashes, and at least one letter or number'
          },
        },
      }
    }),
    ...pageSchema
  }
});

const articles = collection({
  label: 'Articles',
  slugField: 'title',
  path: 'content/articles/*',
  entryLayout: 'content',
  format: { contentField: 'prose' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    prose: fields.markdoc({
      label: 'Prose Content',
      options: {
        image: {
          directory: 'content/assets/images/articles',
          publicPath: '../../assets/images/articles/',
        },
      },
    }),
  },
})

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
      'Settings': [],
      'Pages': ['homepage', 'pages'],
      'Articles': ['articles']
    },
  },
  singletons: {
    homepage
  },
  collections: {
    pages,
    articles,
  },
});
