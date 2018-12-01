import { helper } from '@ember/component/helper';

export function createQueryParams(params=[], hash={}) {
  let hashHasKeys = Object.keys(hash).length > 0;

  if (params.length === 1 &&  hashHasKeys) {
    throw new TypeError("Can't pass both positional params and named params into `create-query-params` helper");
  }

  if (params.length > 1 && !hashHasKeys) {
    throw new TypeError("Can't pass multiple params into `create-query-params` helper, consider using multiple `create-query-params` with `merge-query-params`");
  }

  if (params.length === 1) {
    hash = params[0];
  }

  hash = Object.assign({}, hash);

  return {
    isQueryParams: true,
    values: hash
  };
}

export default helper(createQueryParams);
