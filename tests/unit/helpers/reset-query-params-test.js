import Route from '@ember/routing/route';
import Controller from '@ember/controller';
import Service from '@ember/service';
import resetQueryParams from 'dummy/helpers/reset-query-params';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let ParentRoute = Route.extend({ routeName: 'parent'});
let ParentController = Controller.extend({
	queryParams: ['emptyString', 'meow', 'null'],
	a: '',
	meow: 'meow',
	null: null
});

module('Unit | Helper | reset-query-params', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    let MockRouterService = Service.extend({
      currentRouteName: 'parent'
    });

    this.owner.register('route:parent', ParentRoute);
    this.owner.register('controller:parent', ParentController);
    this.owner.register('helper:reset-query-params', resetQueryParams, { instantiate: true });
    this.owner.register('service:router', MockRouterService)
  });

  test('it can generate reset query params', async function(assert) {
    let helper = this.owner.lookup('helper:reset-query-params');
    let result = helper.compute();

    assert.deepEqual(result, {
      "isQueryParams": true,
      "values": {
        "emptyString": undefined,
        "meow": "meow",
        "null": null
      }
    });
  });

  test('it can generate reset query params after controller query props are changed', async function(assert) {
    let helper = this.owner.lookup('helper:reset-query-params');
    let route = this.owner.lookup('route:parent');
    let controller = this.owner.lookup('controller:parent');

    // 1. trigger initial get of `_qp` computed
    route.get('_qp');

    // 2. set values to something other than their defaults
    controller.set('emptyString', 'not an empty string');
    controller.set('meow', null);
    controller.set('null', 25);

    let result = helper.compute();

    assert.deepEqual(result, {
      "isQueryParams": true,
      "values": {
        "emptyString": undefined,
        "meow": "meow",
        "null": null
      }
    });
  });

  test('it can generate reset query params for parent and child routes', async function(assert) {
    this.owner.register("service:router", Service.extend({ currentRouteName: 'parent.child' }));
    this.owner.register("route:parent.child", Route.extend({ routeName: 'parent.child' }));
    this.owner.register("controller:parent.child", Controller.extend({
      queryParams: ['childProp'],
      childProp: 'child-prop-default'
    }));

    let helper = this.owner.lookup('helper:reset-query-params');
    let parentRoute = this.owner.lookup("route:parent");
    let childRoute = this.owner.lookup("route:parent.child");

    // 1. trigger initial get of `_qp` computed
    parentRoute.get("_qp");
    childRoute.get("_qp");

    let result = helper.compute();

    assert.deepEqual(result, {
      "isQueryParams": true,
      "values": {
        // from parent route
        "emptyString": undefined,
        "meow": "meow",
        "null": null,

        // from child route
        "childProp": "child-prop-default"
      }
    });
  });
});
