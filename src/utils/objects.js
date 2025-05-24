export const removeUndefinedProps = (obj) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

// Convert [{key: value}, {key: value}] to {key: value}
export const ensureKeyValObject = (objOrArr) => Array.isArray(objOrArr)
  ? Object.fromEntries(objOrArr.map(i => [i.key, i.value]))
  : (objOrArr || {})

// Get nested value from object by digging through it on every reduce step
export const getNestedValue = (obj, path, defaultValue = undefined) =>
  path.split('.').reduce((acc, key) => (acc?.[key] ?? defaultValue), obj)