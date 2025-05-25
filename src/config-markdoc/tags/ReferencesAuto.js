import Markdoc from "@markdoc/markdoc";
import { sort } from 'fast-sort';
import { ensureKeyValObject, getNestedValue } from "../../utils/objects.js";
import {
  varArrayToObj,
  PartialFile,
  formatPartialFileName,
  retrievePartial,
} from './_utils.js';
import { filterCollection } from '../../utils/arrays.js';

export const ReferencesAuto = {
  inline: false,
  selfClosing: false,
  attributes: {
    collection: { type: String, required: true },
    // TODO: Understand why this does not pass validation
    partial: { type: PartialFile, render: false, required: true },
    variables: { type: Array, render: false, default: [] }
  },
  transform: (node, config) => {
    const {
      collection: collectionName,
      filter,
      partial: { discriminant, value },
      variables: varArray,
    } = node.attributes
    // Constants
    const className = `references list auto ${collectionName}`
    const childClassName = `references item auto ${collectionName}`

    // Format filters
    const filters = filter.map(f => {
      const by = f.by.discriminant;
      const value = f.by.value;
      return { by, value }
    })

    const collection = config.variables?.collections[collectionName] || []
    const filteredCollection = filterCollection(collection, filters);
    const file = formatPartialFileName(discriminant, value);
    const partial = retrievePartial(config, file);

    if (!partial) {
      // TODO: Decide if we should keep this as a fallback
      // Implementation without Partial just in case...?
      const children = filteredCollection.map(item => {
        return new Markdoc.Tag("li", {}, [new Markdoc.Tag("a", {
          href: item.page.url,
        }, item.data.title)])
      })
      return new Markdoc.Tag("div", {}, [
        new Markdoc.Tag("p", { style: 'color: red' }, `Partial "${file}" not found`),
        new Markdoc.Tag("ul", {}, children)
      ])
    }

    const variables = varArrayToObj(varArray);

    const scopedConfig = {
      ...config,
      variables: {
        ...config.variables,
        ...variables,
        collection: filteredCollection,
      },
    };

    const transformChildren = (part) =>{
      return part.resolve(scopedConfig).transformChildren(scopedConfig);
    }

    return Array.isArray(partial)
      ? partial.flatMap(transformChildren)
      : transformChildren(partial);


  }
}
