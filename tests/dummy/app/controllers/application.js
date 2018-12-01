import Controller from "@ember/controller";

export default Controller.extend({
  queryParams: [{ applicationQp: { as: "app" } }],
  applicationQp: 9001,

  init() {
    this._super(...arguments);

    this.set("sampleQueryParams", {
      applicationQp: 5,
      parentQp: "Hank",
      childQp: "Malcolm",
      defaultEmptyString: "Not an empty string :)"
    });
  }
});
