import { get } from "@ember/object";

export default function getDefaultQueryParams(route) {
  let routeQueryParams = get(route, "_qp.qps");

  let defaultsByProp = routeQueryParams.map(queryParam => ({ [queryParam.prop]: queryParam.defaultValue }));
  let defaultsByUrlKey = routeQueryParams.map(queryParam => ({ [queryParam.urlKey]: queryParam.defaultValue }));
  let defaults = Object.assign.apply(null, [{}].concat(defaultsByProp, defaultsByUrlKey));
  return defaults;
}
