/**
 * Group objects in arrays by a given property's value.
 * Additionally, sort the resulting object's keys.
 *
 * Adapted from:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#grouping_objects_by_a_property
 *
 * @param objectArray
 * @param property
 */
export const groupByObjectPropertyValue = (
  objectArray: any[],
  property: string
) => {
  // Fail early if object array is empty or property to group by doesn't exist
  if (objectArray.length === 0 || !objectArray[0][property]) {
    return {};
  }

  // Group the array items by the given property value into an object
  const grouped = objectArray.reduce(function (acc, obj) {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  // Sort the object's properties
  const keys = Object.keys(grouped);
  keys.sort();

  const sorted: any = {};
  for (let i = 0; i < keys.length; ++i) {
    sorted[keys[i]] = grouped[keys[i]];
  }
  return sorted;
};
