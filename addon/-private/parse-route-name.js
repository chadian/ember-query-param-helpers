// @returns {[string]} Array of all route segments that make up a route name.
export default function parseRouteName(routeName) {
  routeName = routeName || "";

  return routeName.split(".").reduce((routes, segment) => {
    let previousRoute = routes[routes.length - 1];
    let route = [previousRoute, segment].filter(Boolean).join('.');
    routes.push(route);
    return routes;
  }, []);
}
