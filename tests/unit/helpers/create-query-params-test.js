import { createQueryParams } from 'dummy/helpers/create-query-params';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | create-query-params', function(hooks) {
  setupTest(hooks);

  test('it creates a query params hash from an object', function(assert) {
    let result = createQueryParams([{ cat: 'meow', dog: 'bark' }]);
    assert.deepEqual(result, {
      isQueryParams: true,
      values: {
        cat: 'meow',
        dog: 'bark'
      }
    });
  });

  test('it creates a query params hash from positional params', function(assert) {
    let result = createQueryParams([], { cat: 'meow', dog: 'bark' });
    assert.deepEqual(result, {
      isQueryParams: true,
      values: {
        cat: 'meow',
        dog: 'bark'
      }
    });
  });

  test('it throws an error when both a hash is passed and positional params', function(assert) {
    assert.throws(
      () => createQueryParams([{ cat: 'meow', dog: 'bark' }], { cat: 'meow', dog: 'bark' }),
      /Can't pass both positional params and named params into `create-query-params` helper/,
      "error is thrown"
    );
  });

  test('it throws an error when multiple positional params are passed', function(assert) {
    assert.throws(
      () => createQueryParams([{ cat: 'meow' }, { dog: 'bark' }]),
      /Can't pass multiple params into `create-query-params` helper, consider using multiple `create-query-params` with `merge-query-params`/,
      "error is thrown"
    );
  });
});
