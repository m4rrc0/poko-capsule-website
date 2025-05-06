# Static hosting configuration

Every static hosting provider is a little bit different but you should find similar configuration options everywhere.

## Build options

Everytime you update the content of your website, the platform will build all the files that constitute it.

A few options are necessary to make this work:

- Command: `bun run build`
- Publish directory: `dist`

## General settings

- Name: You can chose the name of your project which will probably influence the sub-domain of your deployed website.  
For example, if you name your project "poko", your deployed website will be available at `poko.pages.dev` or `poko.netlify.app` etc.


