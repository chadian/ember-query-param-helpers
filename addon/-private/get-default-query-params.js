import { get } from "@ember/object";

export default function getDefaultQueryParams(route) {
  let routeQueryParams = get(route, "_qp.qps");
  let simplifiedQueryParamsHash = routeQueryParams.reduce((paramsHash, queryParam) => {
    return Object.assign(
      {},
      paramsHash,
      { [queryParam.prop]: queryParam.defaultValue }
    );
  }, {});

  return simplifiedQueryParamsHash;
}
