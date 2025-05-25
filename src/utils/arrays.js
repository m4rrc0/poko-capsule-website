import { sort } from 'fast-sort';
import { tryMatchNestedVariable } from './objects.js';

export const filterCollection = (collection, filtersRaw) => {
    const toInt = (value) => isNaN(parseInt(value)) ? 1 : parseInt(value);
    const toArrayOfStrings = (value) => {
        const arr = Array.isArray(value) ? value : [value]
        return arr.map(v => v.toString())
    };
    
    const filters = Array.isArray(filtersRaw) ? filtersRaw : [filtersRaw];

    const filteredCollection = filters.reduce((acc, { by, value } = {}) => {
        switch (by) {
            case 'last':
              return collection.slice(-toInt(value));
            case 'first':
              return collection.slice(0, toInt(value));
            case 'random':
              // Randomly pick 'value' items from the collection while keeping the items in the same sort order
              const itemIndexes = Array.from({
                length: toInt(value) > collection.length ? collection.length : toInt(value)
              }, () => Math.floor(Math.random() * collection.length)).sort((a, b) => a - b);
              return itemIndexes.map(index => collection[index]);
            case 'tags':
              const tagsToMatch = toArrayOfStrings(value);
              return collection.filter(item => item.data.tags.some(tag => tagsToMatch.includes(tag)));
            default:
              return collection;
          }
    }, collection);

    return filteredCollection;
}

const sortCb = (collectionItem, by) => tryMatchNestedVariable(collectionItem, by)

export const sortCollection = (collection, sortCriteriasRaw) => {
    const sortCriterias = Array.isArray(sortCriteriasRaw) ? sortCriteriasRaw : [sortCriteriasRaw];

    const sortedCollection = sort(collection)
        .by(sortCriterias.map(({ direction, by }) => ({
            [direction]: (collectionItem) => sortCb(collectionItem, by)
        })));

    return sortedCollection;
}