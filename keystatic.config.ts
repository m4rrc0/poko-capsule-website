import { config, fields, collection, type LocalConfig, type GitHubConfig, singleton } from '@keystatic/core';
import { wrapper, block, inline, mark, repeating } from '@keystatic/core/content-components'
// export const markdocConfig = fields.markdoc.createMarkdocConfig({});

// Variables
// ---------
const PUBLIC_CONTENT_DIR = import.meta.env.PUBLIC_CONTENT_DIR || 'content';
const PUBLIC_WORKING_DIR = import.meta.env.PUBLIC_WORKING_DIR || PUBLIC_CONTENT_DIR;
const VERCEL_GIT_REPO_OWNER = import.meta.env.PUBLIC_VERCEL_GIT_REPO_OWNER;
const VERCEL_GIT_REPO_SLUG = import.meta.env.PUBLIC_VERCEL_GIT_REPO_SLUG;
const VERCEL_REPO = VERCEL_GIT_REPO_OWNER && VERCEL_GIT_REPO_SLUG && `${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}`;
const REPO = import.meta.env.PUBLIC_REPO || VERCEL_REPO || '';
const PUBLIC_KEYSTATIC_STORAGE_LOCAL = (
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === true ||
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL === 'true' ||
  (import.meta.env.PUBLIC_KEYSTATIC_STORAGE_LOCAL !== 'false' && (import.meta.env.DEV || false))
);

// Retrieve User preferences
// -------------------------
// Global Settings
const globalSettings = import.meta.env.PUBLIC_GLOBAL_SETTINGS
const useArticles = globalSettings?.contentTypes?.includes('articles') || false;
let userConfig = {}
try {
  userConfig = await import(`./${PUBLIC_CONTENT_DIR}/_config/index.js`);
} catch (error) {
  console.info('INFO: No user config file found');
}
const { singletons: userSingletons, collections: userCollections, navigation: userNavigation } = userConfig;

// Storage
const localMode: LocalConfig['storage'] = {
  kind: 'local',
};

const githubMode: GitHubConfig['storage'] = {
  kind: 'github',
  repo: REPO,
  // branchPrefix: 'my-prefix/', // TODO: should we set this up?
};

const imageDirs = (dir: string) => ({
  directory: `${PUBLIC_WORKING_DIR}/_images/${dir}`,
  publicPath: `/_images/${dir}/`,
})

// SCHEMAS
const proseSchema = {
  prose: fields.markdoc({
    label: 'Prose',
    options: {
      image: {
        ...imageDirs('pages')
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
  label: 'Global Settings',
  path: `${PUBLIC_WORKING_DIR}/_settings/global`,
  format: { data: 'yaml' },
  entryLayout: 'form',
  schema: {
    siteName: fields.text({
      label: 'Site Name',
      validation: {
        isRequired: true,
      },
      multiline: false
    }),
    htmlHead: fields.text({
      label: 'HTML Head',
      description: 'Some HTML to be injected in the <head> of every page',
      multiline: true
    }),
    contentTypes: fields.multiselect({
      label: 'Content Types',
      options: [
        { label: 'Articles', value: 'articles' },
      ],
      // defaultValue: [],
    }),
  }
})

// const homepage = singleton({
//   label: 'Home Page',
//   path: `${PUBLIC_WORKING_DIR}/index`,
//   format: { contentField: 'prose' },
//   schema: {
//     name: fields.text({
//       label: 'Page Name',
//       description: 'The name of the page',
//       validation: {
//         isRequired: true,
//       },
//       multiline: false
//     }),
//     ...proseSchema
//   }
// })

// COLLECTIONS
const pages = collection({
  label: 'Pages',
  slugField: 'name',
  path: `${PUBLIC_WORKING_DIR}/pages/**`,
  entryLayout: 'content',
  format: { contentField: 'prose' },
  columns: ['name', 'order'],
  schema: {
    name: fields.slug({
      name: {
        label: 'Page Name',
        validation: {
          isRequired: true,
        }
      },
      slug: {
        label: 'URL',
        description: 'URL-friendly slug or path (may contain "/" and "-"). NOTE: The homepage must be called "index".',
        validation: {
          length: {
            min: 1,
          },
          pattern: {
            // REGEX:
            //   must contain only letters, numbers, dashes, and forward slashes
            //   and at least one letter or number
            //   and cannot start or finish with a slash
            regex: /^(?![\s-\/]*$)(?!\/)[a-z0-9-\/]*[a-z0-9-]$/,
            // regex: /^(?![\s-\/]*$)[a-z0-9-\/]+$/,
            message: 'URL must contain only letters, numbers, dashes, and forward slashes (not starting or ending with a slash or dash), and at least one letter or number'
          },
        },
      }
    }),
    // parentSlug: fields.relationship({ label: 'Parent Page', collection: 'pages' }),
    parentSlug: fields.ignored(),
    order: fields.number({ label: 'Page Order', description: 'For navigation or sorting links', defaultValue: 0 }),
    nav: fields.conditional(
      fields.checkbox({ label: 'Add to main navigation', defaultValue: false }),
      {
        true: fields.conditional(
          fields.checkbox({ label: 'Customize navigation', defaultValue: false }),
          {
            true: fields.object({
              // key: fields.text({ label: 'Key', description: 'The key of the navigation item [Default: Page Slug]' }),
              title: fields.text({ label: 'Nav Title', description: 'Default: Page Name' }),
              parent: fields.relationship({ label: 'Nav Parent', collection: 'pages', description: 'Default: Parent Page' }),
              order: fields.number({ label: 'Nav Order', description: 'Default: Page Order', defaultValue: 0 }),
            }),
            false: fields.empty(),
          }
        ),
        false: fields.empty(),
      }
    ),
    ...proseSchema,
    metadata: fields.object({
      title: fields.text({ label: 'Title', multiline: false, description: 'Default: Page Name' }),
      description: fields.text({ label: 'Description', multiline: true }),
      image: fields.image({
        label: 'Image',
        ...imageDirs('pages'),
      }),
    },
    {
      label: 'Metadata',
      // description: 'The metadata of the page',
      // layout: [12, 6, 3, 3, 12],
    }),
    // eleventyNavigation: fields.object({
    //   key: fields.text({ label: 'Key' }),
    //   title: fields.text({ label: 'Title' }),
    //   order: fields.number({ label: 'Order' }),
    // }, {
    //   label: 'Main Navigation',
    //   description: 'Add this page to your main nav',
    // }),
    
  }
});

const articles = collection({
  label: 'Articles',
  slugField: 'title',
  path: `${PUBLIC_WORKING_DIR}/articles/*`,
  entryLayout: 'content',
  format: { contentField: 'prose' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    prose: fields.markdoc({
      label: 'Prose Content',
      options: {
        image: {
          ...imageDirs('articles'),
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
      'Settings': ['settings'],
      'Pages': ['pages'],
      ...(useArticles ? { 'Articles': ['articles'] } : {}),
      ...(userNavigation || {}),
    },
  },
  singletons: {
    settings,
    ...(userSingletons || {}),
  },
  collections: {
    pages,
    articles,
    ...(userCollections || {}),
  },
});
