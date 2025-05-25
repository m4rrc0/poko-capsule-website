import { fields } from '@keystatic/core'
import { block } from '@keystatic/core/content-components'
import React from 'react'
// import SuperscriptIcon from '@heroicons/react/24/outline/SuperscriptIcon'
import { ArrowRight as IconLucide } from "lucide-react";
import { partialSelect } from '../common.js';

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
        file: partialSelect,
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
