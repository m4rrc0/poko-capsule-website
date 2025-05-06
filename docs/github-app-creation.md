# Github app creation form

## Introduction

This guide will help you create a Github app to allow the Keystatic CMS to edit your content files on Github.

During this process, you will need to record a few values that are unique to this project. These values will need to be copied to our hosting provider. In development projects, those project-specific values are called "environment variables".

The envirnment variable we will need to collect during this step are:
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`

## Basic information

- GitHub App name: <whatever> -> (❗️This is your `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` environment variable)
- Homepage URL: "https://<deployed_URL>/keystatic"

## Identifying and authorizing users

- Callback URL: "https://<deployed_URL>/api/keystatic/github/oauth/callback"
- Expire user authorization tokens: `true`
- Request user authorization (OAuth) during installation: `true`
- Enable Device flow: `false`

## Post Installation

- Setup URL: ""
- Redirect on update: `false`

## Webhook

- Active: `false`
- Webhook URL: ""
- Secret: ""

## Permissions and events

### Repository permissions

- Contents: `read`, `write`
- Metadata: `read only` (mandatory: should be preselected)
- Pull requests: `read only`

## Generate a new client secret

After creating the app, you can generate a new client secret from the app's settings page.

1. Go to https://github.com/settings/apps/
2. Click on the app you just created
3. In the very first section, click on "Generate a new client secret"
4. ⚠️ Immediately copy the generated client secret and save it somewhere safe as it will not be visible later in your app settings
5. If you forget to save it, you can always create a new one later though

-> ❗️This is your `KEYSTATIC_GITHUB_CLIENT_SECRET` environment variable

## Retrieve the remaining environment variables

### Client ID

The `Client ID` is visible in the very first section of the Github app settings.

-> ❗️This is your `KEYSTATIC_GITHUB_CLIENT_ID` environment variable