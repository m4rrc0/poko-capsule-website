import { fields } from '@keystatic/core'
import { mark } from '@keystatic/core/content-components'
import React from 'react'
// import SuperscriptIcon from '@heroicons/react/24/outline/SuperscriptIcon'
import { Link as LinkLucide } from "lucide-react";
import { collections, fileDirs } from '../common.js';

const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="34" height="32" viewBox="0 0 34 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
</svg>

// Possible link options
// - Internal Page
//   - Page
//   - ...Collections...
// - External URL
// - File
//   - Files Library
//   - Local Upload
//   - External URL (for files hosted elsewhere)
// - Email
// - Phone

// TODO: Regex pattern validations

export const Link = mark({
    label: 'Link',
    icon: <LinkLucide />,
    // tag?: "span" | "strong" | "em" | "u" | "del" | "code" | "a" | "sub" | "sup" | "kbd" | "abbr" | "mark" | "s" | "small" | "big",
    // tag: "span",
    // style?: Thing<{ [key: string]: string; }>,
    style: {
        fontStyle: 'italic',
        textDecoration: 'underline',
    },
    // className: "align-super text-xs",
    schema: {
      type: fields.conditional(
        // CONDITIONAL SELECT
        fields.select({
          label: 'Type',
          description: 'The type of link.',
          options: [
            { label: 'Internal Page', value: 'internal' },
            { label: 'External URL', value: 'external' },
            { label: 'File', value: 'file' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
          ],
          defaultValue: 'internal',
        }),
        // SCHEMAS FOR EACH OPTION
        {
          internal: fields.conditional(
            // CONDITIONAL SELECT
            fields.select({
              label: 'Collection',
              // description: 'The type of link.',
              options: collections.map(c => ({ label: c, value: c })),
              defaultValue: 'pages',
              validation: {
                isRequired: true,
              },
            }),
            // SCHEMAS FOR EACH OPTION
            Object.fromEntries(collections.map(c => [c, fields.relationship({ label: c, collection: c, validation: { isRequired: true } })])),
          ),
          external: fields.object({
            url: fields.url({ label: 'URL', validation: { isRequired: true } }),
            target: fields.select({
              label: 'Target',
              options: [
                { label: 'New Tab', value: '_blank' },
                { label: 'Same Tab', value: '_self' },
              ],
              defaultValue: '_blank',
            }),
            hreflang: fields.text({ label: 'hreflang', description: 'Specifies the language of the linked document' }),
            rel: fields.text({
              label: 'rel',
              description: 'Specifies the relationship between the current document and the linked document',
              defaultValue: 'noopener noreferrer nofollow external',
            }),
          }),
          file: fields.object({
            file: fields.conditional(
              // CONDITIONAL SELECT
              fields.select({
                label: 'Source',
                // description: 'The type of link.',
                options: [
                  { label: 'Files Library', value: 'filesLibrary' },
                  { label: 'Local Upload', value: 'local' },
                  { label: 'External URL', value: 'external' },
                ],
                defaultValue: 'filesLibrary',
              }),
              // SCHEMAS FOR EACH OPTION
              {
                filesLibrary: fields.relationship({ label: 'File', collection: 'filesLibrary', validation: { isRequired: true } }),
                local: fields.file({ label: 'File', ...fileDirs('links'), validation: { isRequired: true } }),
                external: fields.url({ label: 'URL', validation: { isRequired: true } }),
              }
            ),
            download: fields.checkbox({ label: 'Download', defaultValue: false, description: 'Download file when clicking on the link (instead of navigating to it)' }),
            hreflang: fields.text({ label: 'hreflang', description: 'Specifies the language of the linked document' }),
            rel: fields.text({
              label: 'rel',
              description: 'Specifies the relationship between the current document and the linked document',
              defaultValue: 'noopener noreferrer nofollow external',
            }),
          }),
          email: fields.object({
            email: fields.text({ label: 'Email', multiline: false, validation: { isRequired: true } }),
            subject: fields.text({ label: 'Subject', multiline: false }),
            cc: fields.text({ label: 'CC', multiline: false }),
            bcc: fields.text({ label: 'BCC', multiline: false }),
            body: fields.text({ label: 'Body', multiline: true }),
          }),
          phone: fields.text({ label: 'Phone', validation: { isRequired: true } }),
        }
      ),
    }
  })