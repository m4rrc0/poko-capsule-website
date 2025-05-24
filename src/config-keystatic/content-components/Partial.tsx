import { fields } from '@keystatic/core'
import { block } from '@keystatic/core/content-components'
import React from 'react'
// import SuperscriptIcon from '@heroicons/react/24/outline/SuperscriptIcon'
import { ArrowRight as IconLucide } from "lucide-react";
import { GLOBAL_PARTIALS_PREFIX } from '../variables.js';
// import { collectionSelect } from '../common.js';

// Possible ways to reference entries
// -

// Globally defined partials
// NOTE: No need to apply the prefix here. It is applied in the Partial Tag when discriminant == 'global'
const globalPartialSelectOptions = [
    { label: 'None', value: 'none.mdoc' },
    { label: 'simple-list-item.mdoc', value: 'simple-list-item.mdoc' },
    { label: 'simple-link.mdoc', value: 'simple-link.mdoc' },
]

export const Partial = block({
    label: 'Partial',
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
        // file: fields.text({
        //   label: 'Partial File Name',
        //   validation: {
        //     isRequired: true,
        //   },
        // }),
        file: fields.conditional(
          // First, define a `select` field with all the available "conditions"
          fields.select({
            label: 'Partial File',
            options: [
              { label: 'Global Source', value: 'global' },
              { label: 'Personal library', value: 'personal' },
              { label: 'Custom file name', value: 'custom' },
            ],
            defaultValue: 'global',
          }),
          // Then, provide a schema for each condition
          {
            global: fields.select({
              options: globalPartialSelectOptions,
              defaultValue: globalPartialSelectOptions[0].value,
            }),
            personal: fields.relationship({
              collection: 'partials'
            }),
            custom: fields.text({}),
          }
        ),
        variables: fields.array(
          fields.object({
            key: fields.text({ label: 'Key' }),
            value: fields.text({ label: 'Value' }),
          }, {
            layout: [6, 6],
          }),
          {
            label: 'Variables',
            slugField: 'key',
            itemLabel: props => [props.fields.key.value, props.fields.value.value].join(' = '),
          }
        ),
    },
    ContentView(props) {
      const { discriminant: source, value } = props.value.file

      return (
          <p style={{ paddingInline: '0.5rem'}}>
              {source} partial = "{value}"
          </p>
      );
    },
    // Replaces the whole dom Node
    // NodeView(props) {
    //   return (
    //       <span style={{ paddingInline: '0.5rem'}}>
    //           {/* file = {props.value.file} */}
    //           TEST NodeView
    //       </span>
    //   );
    // },
})
