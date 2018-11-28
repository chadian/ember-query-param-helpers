import { mergeQueryParams } from 'dummy/helpers/merge-query-params';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | merge-query-params', function(hooks) {
  setupTest(hooks);

  let dogQueryParams = {
    isQueryParams: true,
    values: {
      hasFur: true,
      likesFish: false
    }
  };

  let catQueryParams = {
    isQueryParams: true,
    values: {
      hasFur: true,
      likesFish: true
    }
  };

  test('it merges query params', function(assert) {
    let result = mergeQueryParams([dogQueryParams, catQueryParams]);

    assert.equal(result.values.likesFish, true, 'catsQueryParams comes after and overrides dogQueryParams');

    assert.deepEqual(result, {
      isQueryParams: true,
      values: {
        hasFur: true,
        likesFish: true
      }
    });
  });

  test('it always contains the `isQueryParams` value of `true`', function(assert) {
    let result;

    result = mergeQueryParams([dogQueryParams, catQueryParams, { isQueryParams: false }]);
    assert.equal(result.isQueryParams, true);

    result = mergeQueryParams([dogQueryParams, catQueryParams, { isQueryParams: undefined }]);
    assert.equal(result.isQueryParams, true);

    result = mergeQueryParams([{}]);
    assert.equal(result.isQueryParams, true);
  });
});
