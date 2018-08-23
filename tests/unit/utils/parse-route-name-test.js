import parseRouteName from 'ember-query-param-helpers/-private/parse-route-name';
import { module, test } from 'qunit';

module('Unit | Utility | parse-route-name', function() {
  test('it handles a nested route', function(assert) {
    let result = parseRouteName("this.is.a.route");
    assert.deepEqual(result, [
      "this",
      "this.is",
      "this.is.a",
      "this.is.a.route"
    ]);
  });

  test('it handles a top-level route', function(assert) {
    let result = parseRouteName("route");
    assert.deepEqual(result, ['route']);
  });
});
