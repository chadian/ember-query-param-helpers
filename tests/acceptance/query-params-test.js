import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

function currentQueryparams() {
  let queryParamsString = currentURL().split('?')[1];

  if (!queryParamsString) {
    return {};
  }

  return queryParamsString
    .split('&')
    .map(qp => decodeURIComponent(qp).split('='))
    .reduce((qpHash, qpArray) => Object.assign(qpHash, { [qpArray[0]]: qpArray[1] }), {});
}

let expectedResetWhitelistedQp = (currentQp) => {
  let current = Object.assign({}, currentQp);
  delete current.app
  return current;
};

let resetAll = {
  qp: {},
  linkSelector: '[data-test-reset-all] a'
};

let resetViaUrlKey = {
  expectedQp: expectedResetWhitelistedQp,
  linkSelector: '[data-test-reset-via-url-key] a'
};

let resetViaParam = {
  expectedQp: expectedResetWhitelistedQp,
  linkSelector: '[data-test-reset-via-param] a'
};

let createQpViaPositionalParams = {
  qp: {
    "app": "5",
    "childQp": "Malcolm",
    "defaultEmptyString": "Not an empty string :)",
    "parentQp": "Hank"
  },
  linkSelector: '[data-test-create-qp-via-positional-params] a'
};

let createQpViaNamedParams = {
  qp: {
    "app": "25",
    "childQp": "C-h-i-l-d",
    "parentQp": "P-a-r-e-n-t"
  },
  linkSelector: '[data-test-create-qp-via-named-params] a'
};

let createSingleQp = {
  qp:{
    "childQp": "Create Child Qp"
  },
  linkSelector: '[data-test-create-single-qp] a'
}

let mergeCreate = {
  qp: {
    "childQp": "Only the Child Qp Is Left"
  },
  linkSelector: '[data-test-merge-reset-create] a'
}

module('Acceptance | query params', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /parent/child', async function(assert) {
    await visit('/parent/child');
    assert.equal(currentURL(), '/parent/child');
  });

  test('creating query params via positional params', async function(assert) {
    await visit('/parent/child');
    await click(createQpViaPositionalParams.linkSelector);
    assert.deepEqual(currentQueryparams(), createQpViaPositionalParams.qp);
  });

  test('creating query params via named params', async function(assert) {
    await visit('/parent/child');
    await click(createQpViaNamedParams.linkSelector);
    assert.deepEqual(currentQueryparams(), createQpViaNamedParams.qp);
  });

  test('create a single qp', async function(assert) {
    await visit('/parent/child');
    await click(createSingleQp.linkSelector);
    assert.deepEqual(currentQueryparams(), createSingleQp.qp);
  });

  test('merge reset and create query param', async function(assert) {
    await visit('/parent/child');
    await click(mergeCreate.linkSelector);
    assert.deepEqual(currentQueryparams(), mergeCreate.qp);
  });

  test('reset all query params', async function(assert) {
    await visit('/parent/child');
    await click(createSingleQp.linkSelector);
    assert.deepEqual(currentQueryparams(), createSingleQp.qp);

    // reset
    await click(resetAll.linkSelector);
    assert.deepEqual(currentQueryparams(), resetAll.qp);
  });

  test('reset whitelisted query param by registered cotnroller param', async function (assert) {
    await visit('/parent/child');
    await click(createQpViaPositionalParams.linkSelector);
    assert.deepEqual(currentQueryparams(), createQpViaPositionalParams.qp);

    // reset via controller param
    let excptedQp = resetViaParam.expectedQp(currentQueryparams());
    await click(resetViaParam.linkSelector);
    assert.deepEqual(currentQueryparams(), excptedQp);
  });

  test('reset whitelisted query param by registered controller url key', async function (assert) {
    await visit('/parent/child');
    await click(createQpViaPositionalParams.linkSelector);
    assert.deepEqual(currentQueryparams(), createQpViaPositionalParams.qp);

    // reset via url key
    let excptedQp = resetViaUrlKey.expectedQp(currentQueryparams());
    await click(resetViaUrlKey.linkSelector);
    assert.deepEqual(currentQueryparams(), excptedQp);
  });

  test('single query param set on top of existing query params', async function(assert) {
    // load up query params
    await visit('/parent/child');
    await click(createQpViaNamedParams.linkSelector);
    assert.deepEqual(currentQueryparams(), createQpViaNamedParams.qp);
    assert.equal(currentQueryparams().childQp, 'C-h-i-l-d', 'Current childQp is set');

    // set single qp
    let expectedQps = Object.assign({}, currentQueryparams(), { childQp: 'Create Child Qp' });
    await click(createSingleQp.linkSelector);
    assert.equal(currentQueryparams().childQp, 'Create Child Qp', 'Current childQp is set');
    assert.deepEqual(expectedQps, currentQueryparams(), 'The exisiting qps are updated changed childQp');
  });
});
