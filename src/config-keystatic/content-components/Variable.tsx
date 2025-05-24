import React from 'react'
import { fields } from '@keystatic/core'
import { inline } from '@keystatic/core/content-components'

export const Variable = inline({
  label: 'Variable',
  schema: {
    key: fields.text({
      label: 'Variable Name',
    }),
  },
  ContentView(props) {
    return (
        <span style={{ paddingInline: '0.5rem'}}>
            ${props.value.key}
        </span>
    );
  },
//   ToolbarView(props) {
//     console.log({ props })
//     return (
//         <span style={{ paddingInline: '0.5rem'}}>
//             TEST ToolbarView
//         </span>
//     );
//   },
//   NodeView(props) {
//     return (
//         <span style={{ paddingInline: '0.5rem'}}>
//             {/* file = {props.value.file} */}
//             TEST NodeView
//         </span>
//     );
//   },
})