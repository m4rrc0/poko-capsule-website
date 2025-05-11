import { fields } from '@keystatic/core'
import { mark } from '@keystatic/core/content-components'
import React from 'react'
// import SuperscriptIcon from '@heroicons/react/24/outline/SuperscriptIcon'
import { ArrowRight as IconLucide } from "lucide-react";
import { collections, fileDirs } from '../common.js';


// Possible ways to reference entries
// - 


export const RefList = mark({
    label: 'RefList',
    icon: <IconLucide />,
    // tag?: "span" | "strong" | "em" | "u" | "del" | "code" | "a" | "sub" | "sup" | "kbd" | "abbr" | "mark" | "s" | "small" | "big",
    // tag: "span",
    // style?: Thing<{ [key: string]: string; }>,
    // style: {
    //     fontStyle: 'italic',
    //     textDecoration: 'underline',
    // },
    // className: "align-super text-xs",
    schema: {
      name: fields.text({
        label: 'Name',
        validation: {
          isRequired: true,
        },
      }),
    }
  })