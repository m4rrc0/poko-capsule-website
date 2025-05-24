const transformFileName = (discriminant, value) => {
  let file = value.endsWith('.mdoc') ? value : `${value}.mdoc`;
  file = discriminant === 'global' ? `global/${file}` : file;
  return file;
}

class PartialFile {
  validate(fileRaw, config) {
    const { discriminant, value } = fileRaw;
    const file = transformFileName(discriminant, value);
    const { partials = {} } = config;
    const partial = partials[file];

    if (!partial)
      return [
        {
          id: 'attribute-value-invalid',
          level: 'error',
          message: `Partial \`${file}\` not found. The 'file' attribute must be set in \`config.partials\``,
        },
      ];

    return [];
  }
}

export const Partial = {
  inline: false,
  selfClosing: true,
  attributes: {
    file: { type: PartialFile, render: false, required: true },
    // variables: { type: Object, render: false },
    variables: { type: Array, render: false, default: [] }
  },
  transform(node, config) {
    const { partials = {} } = config;
    const { file: { discriminant, value }, variables: varArray } = node.attributes;
    const file = transformFileName(discriminant, value);
    const partial = partials[file];

    // console.log({ file })
    // console.log({ partials })

    if (!partial) return null;

    const variables = (varArray || []).reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    const scopedConfig = {
      ...config,
      variables: {
        ...config.variables,
        ...variables,
        ['$$partial:filename']: file,
      },
    };

    const transformChildren = (part) =>
      part.resolve(scopedConfig).transformChildren(scopedConfig);

    return Array.isArray(partial)
      ? partial.flatMap(transformChildren)
      : transformChildren(partial);
  },
};
