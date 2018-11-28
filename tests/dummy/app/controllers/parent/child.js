import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['childQp', 'defaultEmptyString'],
  childQp: null,
  defaultEmptyString: ''
});
