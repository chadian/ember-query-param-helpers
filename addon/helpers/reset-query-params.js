import { getOwner } from "@ember/application";
import { observer } from "@ember/object";
import { inject as service } from '@ember/service';
import { next } from "@ember/runloop";
import Helper from "@ember/component/helper";
import getDefaultQueryParams from "../-private/get-default-query-params";
import parseRouteName from "../-private/parse-route-name";

export default Helper.extend({
  router: service(),

  recomputeWhenRouteChanges: observer(
    "router.currentRouteName",
    function() {
      next(() => this.recompute());
    }
  ),

  compute(whitelist = [], { route } = {}) {
    let descendentRoute = route || this.get("router.currentRouteName");
    let routes = this.getRouteAncestry(descendentRoute);

    let defaultsQps = routes
      .map(getDefaultQueryParams)
      .reduce((queryParams, qpHash) => {
        return Object.assign(
          {},
          queryParams,
          qpHash
        );
      }, {});

    let queryParams = Object.keys(defaultsQps);

    let defaults = queryParams
      .filter(
        routeQpKey => (whitelist.length > 0 ? whitelist.includes(routeQpKey) : true)
      )
      .reduce((accumulatedHash, qpKey) => {
        return Object.assign(
          {},
          accumulatedHash,
          { [qpKey]: defaultsQps[qpKey] }
        );
      }, {});

    return {
      isQueryParams: true,
      values: defaults
    };
  },

  getRouteAncestry(routeName) {
    let routeNameSegments = parseRouteName(routeName);

    // add the application route
    routeNameSegments.push("application");

    let lookupRoute = routeName => getOwner(this).lookup(`route:${routeName}`);

    let routes = routeNameSegments
      .map(lookupRoute)
      .filter(Boolean)

    return routes;
  },
});
