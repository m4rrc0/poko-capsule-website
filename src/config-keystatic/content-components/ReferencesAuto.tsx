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
      collection: collectionSelect,
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
