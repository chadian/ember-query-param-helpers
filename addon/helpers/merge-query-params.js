import { helper } from '@ember/component/helper';

export function mergeQueryParams(queryParamHashes) {
  let queryParamValuesArray = queryParamHashes.map(queryParamHash => queryParamHash.values).filter(Boolean);

  return {
    isQueryParams: true,
    values: Object.assign.apply(null, [{}].concat(queryParamValuesArray))
  };
}

export default helper(mergeQueryParams);
