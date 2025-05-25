import { fields } from '@keystatic/core'
import { wrapper } from '@keystatic/core/content-components'
import React from 'react'
// import SuperscriptIcon from '@heroicons/react/24/outline/SuperscriptIcon'
import { ArrowRight as IconLucide } from "lucide-react";
import { collectionSelect } from '../common.js';

// Possible ways to reference entries
// -

export const ReferencesManual = wrapper({
    label: 'References (Manual)',
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
      collection: collectionSelect,
      wrapper: fields.object({
        tag: fields.text({
          label: 'Tag',
        }),
        attrs: fields.array(
          fields.object({
            key: fields.text({ label: 'Key' }),
            value: fields.text({ label: 'Value' }),
          }, {
            layout: [6, 6],
          }),
          {
            label: 'Attributes',
            slugField: 'key',
            itemLabel: props => [props.fields.key.value, props.fields.value.value].join(' = '),
          }
        ),
      }),
      // collection="articles"
      // wrapper={tag: "div", attrs: { class: "list"}}
      // child={tag: "div", attrs: { class: "list-item"}}
    }
  })
