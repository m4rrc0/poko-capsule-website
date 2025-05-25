import { fields } from '@keystatic/core'
import { block } from '@keystatic/core/content-components'
import React from 'react'
// import SuperscriptIcon from '@heroicons/react/24/outline/SuperscriptIcon'
import { ArrowRight as IconLucide } from "lucide-react";
import { collectionSelect, partialSelect } from '../common.js';

// Possible ways to reference entries
// -

export const ReferencesAuto = block({
    label: 'References (Auto)',
    icon: <IconLucide />,
    // tag?: "span" | "strong" | "em" | "u" | "del" | "code" | "a" | "sub" | "sup" | "kbd" | "abbr" | "wrapper" | "s" | "small" | "big",
    // tag: "span",
    // style?: Thing<{ [key: string]: string; }>,
    // style: {
    //     fontStyle: 'italic',
    //     textDecoration: 'underline',
    // },
    // className: "align-super text-xs",
    schema: {
      references: fields.object({
        collection: collectionSelect,
        sort: fields.array(
          fields.object({
            direction: fields.select({
              label: 'Direction',
              options: [
                { label: '⬇️ Ascending', value: 'asc' },
                { label: '⬆️ Descending', value: 'desc' },
              ],
              defaultValue: 'asc',
            }),
            by: fields.conditional(
              fields.select({
                label: 'By',
                options: [
                  { label: 'Date', value: 'date' },
                  { label: 'Title', value: 'title' },
                  { label: 'Page URL', value: 'page.url' },
                  { label: 'Custom', value: 'custom' },
                ],
                defaultValue: 'date',
              }),
              {
                date: fields.ignored(),
                title: fields.ignored(),
                'page.url': fields.ignored(),
                custom: fields.text({
                  label: 'Custom',
                  defaultValue: 'date',
                  description: 'The field path accessor to sort by. E.g. "date", "title", "page.url',
                }),
              }
            )
          }, {
            // layout: [6, 6],
          }),
          {
            label: 'Sort',
            itemLabel: props => {
              const direction = props.fields.direction.value;
              console.log(props.fields.by)
              const by = props.fields.by.discriminant === 'custom' ? props.fields.by.value.value : props.fields.by.discriminant;
              return `${direction} ${by}`;
            },
          }
        ),
        filter: fields.array(
          fields.object({
            by: fields.conditional(
              fields.select({
                label: 'By',
                options: [
                  { label: 'First', value: 'first' },
                  { label: 'Last', value: 'last' },
                  { label: 'Random', value: 'random' },
                  { label: 'Tags', value: 'tags' },
                ],
                defaultValue: 'first',
              }),
              {
                first: fields.integer({
                  label: 'First',
                  defaultValue: 1,
                }),
                last: fields.integer({
                  label: 'Last',
                  defaultValue: 1,
                }),
                random: fields.integer({
                  label: 'Random',
                  defaultValue: 1,
                }),
                tags: fields.array(
                  fields.text({
                    label: 'Tags',
                  }),
                  {
                    label: 'Tags',
                    itemLabel: props => props.value,
                  }
                ),
              }
            ),
          }, {
            // layout: [6, 6],
          }),
          {
            label: 'Filter',
            itemLabel: props => {
              const by = props.fields.by.discriminant;
              const rawValue = props.fields.by.value;
              const value = rawValue?.elements?.map(e => e.value).join(', ') || rawValue?.value;
              return `${by} = ${value}`;
            },
          }
        ),
      },
      {
        label: 'References',
        description: 'A list of references to entries',
        layout: [12, 6, 6],
      }),
      partial: partialSelect,
    },
    ContentView(props) {
      const rawVal = JSON.stringify(props.value, null, 2)

      return (
          <code style={{ paddingInline: '0.5rem'}}>
              {rawVal}
          </code>
      );
    },
  })
