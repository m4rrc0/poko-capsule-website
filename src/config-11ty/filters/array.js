import { filterCollection as filterCollectionUtil } from '../../utils/arrays.js';

/** Joins the given array into a string using the given separator. */
export const join = (array = [], separator = ', ') => array.join(separator);

/** Filters the given array based on the given options. */
export const filterCollection = (array, by, value) => filterCollectionUtil(array, by, value);

/** Returns the first x elements of the given array. */
export const first = (array, x = 1) => array.slice(0, x);

/** Returns the last x elements of the given array. */
export const last = (array, x = 1) => array.slice(-x);

/** Returns a random x elements of the given array, keeping the original order. */
export const randomFilter = (array, x = 1) => {
    const indexes = Array.from({
        length: x > array.length ? array.length : x
    }, () => Math.floor(Math.random() * array.length)).sort((a, b) => a - b);
    const result = indexes.map(index => array[index]);

    return result;
};
