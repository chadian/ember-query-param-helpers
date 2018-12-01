import Route from '@ember/routing/route';
import Controller from '@ember/controller';
import { module, test } from 'qunit';
import getDefaultQueryParams from 'ember-query-param-helpers/-private/get-default-query-params';
import { setupTest } from 'ember-qunit';

module('Unit | Utility | get-default-query-params', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('controller:foo', Controller.extend({
      queryParams: ['category'],
      category: 'default query param value'
    }));

    this.owner.register('route:foo', Route.extend({ routeName: 'foo'}));
  });

  test('it returns a map of default query params', function(assert) {
    let route = this.owner.lookup('route:foo');
    let defaultQueryParams = getDefaultQueryParams(route);

    assert.deepEqual(defaultQueryParams, {
      category: 'default query param value'
    });
  });
});
