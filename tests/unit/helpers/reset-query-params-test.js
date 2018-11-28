import Route from '@ember/routing/route';
import Controller from '@ember/controller';
import Service from '@ember/service';
import resetQueryParams from 'dummy/helpers/reset-query-params';
import { module, test } from 'qunit';
import { setupTest, settled } from 'ember-qunit';

let ApplicationRoute = Route.extend({ routeName: 'application' });
let ApplicationController = Controller.extend({
  queryParams: [{ applicationQp: { as: "app" } }],
  applicationQp: "original application qp"
});
let ParentRoute = Route.extend({ routeName: 'parent'});
let ParentController = Controller.extend({
  queryParams: ["emptyString", "meow", "null"],
  a: "",
  meow: "meow",
  null: null
});
let ChildRoute = Route.extend({ routeName: "parent.child" });
let ChildController = Controller.extend({
  queryParams: ['childProp'],
  childProp: 'child-prop-default'
});

module('Unit | Helper | reset-query-params', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function register() {
    let MockRouterService = Service.extend({
      currentRouteName: 'parent'
    });

    this.owner.register('service:router', MockRouterService);
    this.owner.register('route:application', ApplicationRoute);
    this.owner.register('controller:application', ApplicationController);
    this.owner.register('route:parent', ParentRoute);
    this.owner.register('controller:parent', ParentController);
    this.owner.register('helper:reset-query-params', resetQueryParams, { instantiate: true });
    this.owner.register("route:parent.child", ChildRoute);
    this.owner.register("controller:parent.child", ChildController);
  });

  hooks.beforeEach(function bakeOriginalQueryParams() {
    // trigger initial get of `_qp` computed on each route which
    // saves the initial value from the controller
    ['application', 'parent', 'parent.child']
      .forEach(routeName => this.owner.lookup(`route:${routeName}`).get("_qp"));
  });

  test('it can generate a route hierarchy from `getRouteAncestry`', function(assert) {
    this.owner.register("route:a", Route.extend({ routeName: "a" }));

    this.owner.register("route:a.bunch", Route.extend({
      routeName: "a.bunch"
    }));

    this.owner.register("route:a.bunch.of", Route.extend({
      routeName: "a.bunch.of"
    }));

    this.owner.register("route:a.bunch.of.routes", Route.extend({
      routeName: "a.bunch.of.routes"
    }));

    this.owner.register("controller:a", Controller.extend());
    this.owner.register("controller:a.bunch", Controller.extend());
    this.owner.register("controller:a.bunch.of", Controller.extend());
    this.owner.register("controller:a.bunch.of.routes", Controller.extend());

    let helper = this.owner.lookup("helper:reset-query-params");
    let routes = helper.getRouteAncestry("a.bunch.of.routes");
    let routeNames = routes.map(route => route.get('routeName'));

    assert.deepEqual(
      routeNames,
      [
        "a",
        "a.bunch",
        "a.bunch.of",
        "a.bunch.of.routes",
        "application"
      ]
    );
  });

  test('it triggers a recompute when currentRouteName changes', async function(assert) {
    let helper = this.owner.lookup("helper:reset-query-params");

    let callCount = 0;
    let recompute = helper.recompute.bind(helper);
    helper.set('recompute', () => {
      callCount ++;
      recompute();
    });

    helper.set('router.currentRouteName', 'application');
    helper.set('router.currentRouteName', 'parent');

    await settled();
    assert.equal(callCount, 2, 'recompute was called twice');
  });

  test('it can generate reset query params', async function(assert) {
    let helper = this.owner.lookup('helper:reset-query-params');
    let result = helper.compute();

    assert.deepEqual(result, {
      "isQueryParams": true,
      "values": {
        "app": "original application qp",
        "applicationQp": 'original application qp',
        "emptyString": undefined,
        "meow": "meow",
        "null": null
      }
    });
  });

  test('it can generate reset query param for a specified route', async function(assert) {
    let helper = this.owner.lookup('helper:reset-query-params');
    let result = helper.compute([], { route: "application" });

    assert.equal(this.owner.lookup("service:router").get("currentRouteName"), 'parent', 'current route is the parent route');

    assert.deepEqual(result, {
      "isQueryParams": true,
      "values": {
        "app": 'original application qp',
        "applicationQp": 'original application qp'
      }
    }, "application query param are generated unaffected by the router's current route");
  });

  test('it can generate reset query params after controller query props are changed', async function(assert) {
    let helper = this.owner.lookup('helper:reset-query-params');
    let controller = this.owner.lookup('controller:parent');

    // set values to something other than their defaults
    controller.set('emptyString', 'not an empty string');
    controller.set('meow', null);
    controller.set('null', 25);

    let result = helper.compute();

    assert.deepEqual(result, {
      "isQueryParams": true,
      "values": {
        "app": "original application qp",
        "applicationQp": "original application qp",
        "emptyString": undefined,
        "meow": "meow",
        "null": null
      }
    });
  });

  test('it can generate reset query params for hierarchy of routes', async function(assert) {
    this.owner.register("service:router", Service.extend({ currentRouteName: 'parent.child' }));

    let helper = this.owner.lookup('helper:reset-query-params');
    let result = helper.compute();

    assert.deepEqual(result, {
      isQueryParams: true,
      values: {
        // from application route
        app: "original application qp",
        applicationQp: "original application qp",

        // from parent route
        emptyString: undefined,
        meow: "meow",
        null: null,

        // from child route
        childProp: "child-prop-default"
      }
    });
  });

  test('it only generates whitelisted reset query params when specified', function(assert) {
    let helper = this.owner.lookup('helper:reset-query-params');
    let parentControllerQueryParams = this.owner.lookup('controller:parent').get('queryParams');

    assert.equal(helper.get('router.currentRouteName'), 'parent');
    assert.equal(parentControllerQueryParams.length, 3, 'controller has three query params');

    let whitelistedQueryParams = ['emptyString'];
    let result = helper.compute(whitelistedQueryParams);

    assert.deepEqual(result, {
      "isQueryParams": true,
      "values": {
        "emptyString": undefined
      }
    }, 'it contains only whitelisted reset query params');
  });

  test('it can generate reset query params when a param url key is specified', function(assert) {
    let helper = this.owner.lookup('helper:reset-query-params');

    // set current route to application
    this.owner.lookup('service:router').set('currentRouteName', 'application');

    let applicationController = this.owner.lookup('controller:application');
    assert.deepEqual(applicationController.get('queryParams'), [{
      applicationQp: { as: 'app' }
    }], "application controller contains query param registered under a different url key");

    let result = helper.compute();

    assert.deepEqual(result, {
      isQueryParams: true,
      values: {
        app: "original application qp",
        applicationQp: "original application qp"
      }
    });
  });
});
