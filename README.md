ember-query-param-helpers
==============================================================================

This add-on provides a few helpers to help tame query params in your Ember app. Query params in Ember are sticky and require knowing default values so that you properly reset them. Using the built-in `query-param` helper will not remove the existing values either. This add-on makes it easier to reset and set query params. Please see the following documentation, and the [live dummy app](https://chadian.github.io/ember-query-param-helpers/), for more examples of how these helpers can be used.

Installation
------------------------------------------------------------------------------

```
ember install ember-query-param-helpers
```

Note: Ember versions `>= 2.4` and `<2.15` *also require the [`ember-router-service-pollyfill`](https://github.com/rwjblue/ember-router-service-polyfill)*

```
ember install ember-router-service-polyfill
```

This dependency on the public router service is due to this addon using the router service to look up the current route.

Usage
------------------------------------------------------------------------------

This add-on provides the following template helpers to be used in conjunction with `{{link-to}}` or [`{{href-to}}`](https://github.com/intercom/ember-href-to). 

### `reset-query-params`

This helper allows you to reset the query params to their default values. By default it will use the current route and its hierarchy for the current query params to reset.

**Note:** The query params being selected by the helper must be compatible with the consuming `{{link-to}}` route specified.

#### Reset all query params

```
{{link-to "Link!" current-route" (reset-query-params)}}
```

####Reset whitelisted query params

```
{{link-to "Link!" "current-route" (reset-query-params "specificQueryParam")}}
```

####Reset query params for specific route

By default `reset-query-params` does not know the route it is being linked to and will default to the current route. This is useful when the query params are being used for the current route's hierarchy, ie: `sort` and `filter` query params. In the case the `link-to` is navigating to a different route and you need to reset to its default query params you can pass the `route` argument.

```
{{link-to "Link!" "some-other-route" (reset-query-params route="some-other-route")}}
```

### `create-query-params`

Similar to the regular `query-params` helper but is flexible in that it can accept an object of query param key/value pairs or named arguments (similar usage to the `query-params helper`). The behaviour of this helper is to only create or overwrite existing values of query params.

#### Query Params via Object

```
{{link-to "Link!" "route" (create-query-params qps)}}
```

Where `qps` could be a reference to an object, for example:

```
{
    sort: "DESC",
    page: 5
}
```

####Query Params via Named Arguments

Similar to the default behaviour of `query-params`:

```
{{link-to "Link!" "route" (create-query-params sort="DESC" page=5)}}
```

### `merge-query-params`

In the case you want to combine behaviours from `create-query-params` and `reset-query-params` you can use `merge-query-params` . This helper will merge the resulting query param operations in order, and will ensure that the returned object is compatible with what what `link-to` expects. This will enable use-cases where you may want to reset all, or a specific query params, and then create, or overwrite, specific query param values.

```
{{link-to "Link!" parent.child"
	(merge-query-params
		(reset-query-params)
		(create-query-params childQp="only-child-qp-is-set")
	)
}}
```


Contributing
------------------------------------------------------------------------------

💕🎉 I would love any ideas, fixes, features or other contributions you may have, please open an [issue](https://github.com/chadian/ember-query-param-helpers/issues) or [pull request](https://github.com/chadian/ember-query-param-helpers/pulls). You can also find me on the Ember Community Discord, under @chadian, if you would like to chat. 

### Installation

* `git clone` this repository
* `cd ember-query-param-helpers`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
