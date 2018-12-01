import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | query params', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /query-params', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
  });
});
