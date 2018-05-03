# router.flow
[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]



Library provides high-level API for type safe routing, addressing two primary concerns:

1. Parsing

   Type safe parseing of routes - Extracting (typed) parameters so that type checker (in this instance [Flow][]) is able to report any missuse.

2. Linking / Formatting

   Type safe formating of hyper links - Type checker is able to report if any parameter is missing or mystyed.


## The problem

Here is a simlpe example that uses a routing system of [Express][express routing] web framework for [Node.js][]:


> **Disclaimer:** There is no intention to diminish or crticize [Express][], it's an excellent library. As a matter of fact pointed out shortcomings are shortcomings of an untyped nature of JS, which is what [Express][] is tailored for.
>
> That being said, raise of type checkers for JS like [Flow][] & [TypeScript][] provides an excellent opportunities and there is no better way to illustrate them than to compare it to an established solution.


```js
const express = require("express")
const app = express()

app.get("/", (request, response) => {
  response.send(`<a href='/calculator/313/+/3'>Calculate 313 + 3</a>`)
})

app.get("/calculator/:a/+/:b", (request, response) => {
  const {a, b} = request.params
  response.send(`${parseFloat(a) + parseFloat(b)}\n`)
})
```

> **Note:** [Express][] does not actually allow `/+/` path segments, and you would have to use `/plus/` instead, but for the sake of this example lets prentend it does

#### Parsing

There are multiple issues with this approach, which can lead to mistakes that can sneak into production:

- Handling of parameters in routes is too repetitive.

   Declaring a route parameter requires choose a name, which you must later repeat to get it from `request.params`. Mistyping the name of the parameter is a mistake which is not caught by the type checker (even if it is used). It is just too easy to make changes which would update names in some places and not other causing program to misbehave.

- Request handler needs to parse route parameters.

   All parameter values are passed as strings to a handler, which then needs to parse them, handling all possible edge cases (In our example `/calculator/313/+/bob` would respond with `NaN` :)

#### Linking

Even if we manage to keep parameter nameing in sync across the code base and excell at parsing their values, there still more that could go wrong:

- Route changes affect hyper links.

  Let's say we had to switch to prefix notation for our calculator and switched from URLs like `/calculator/313/+/3` to `/calculator/plus/313/3` it's just too easy to forget to update a link in our `/` route.

## Solution


```js
import express from "express"
import * as Router from "router.flow"
import * as URL from "url"
import * as Float from "float.flow"

const index = Router.route`/`
const plus = Router.route`/calculator/`(Router.Float)`/+/`(Router.Float)

const viewIndex = () => {
  const link = calculator.formatPath(Float.toFloat(313), Float.toFloat(3))
  return `<a href='${link}'>Calculate 313 + 3</a>`
}

const viewPlus = (a: number) => (b: number) =>
  `${a + b}`

const router = Router.router
  .get(index, viewIndex)
  .get(plus, viewPlus)

const app = express()
app.use((request, response) => {
  const data = router.route(request)
  if (data) {
    response.send(data)
  }
})
```


Presented solution attempts to illustrate building blocks from this library for structuring routes that can be used for:

1. Parsing route parameters in a type safe way.

   Type checker ([Flow][]) can ensure that there is no missmatch between extracted parameters and their handlers (`viewIndex`, `viewPlus`) using them.
   
   > **Note:** According to [Flow][]'s [function subtyping][] rules `a => b` is subtype of `(a, a) => b` there for library chose to use handlers like `a => a => b` instead which ensures that supplied handler expect all the parameters. On the flip side it requires use of less conventional handlers & typing but with arrow functions it seemed like a right tradeoff. 


2. Format hyper-links in type safe way.

   Links are formated by calling `.formatPath(...)` on the route defined routes and there for type checker is able to report missmatch in type or number of parameters passed.

   > **Note:**  Our examples pass parameters like `Float.toFloat(3)` as route expects `float` parameters and that function takes `number` and returns `float`. We might consider adding `Router.Number` in the future.

This elliminates all of the problems pointed out with original example:

- No way to mistype parameter names, at least not without type checker reporting that as an error.
- No need to parse route parameters as our routes are typed parsers already.
  > **Note:** Route as presented in the example won't match `/calculator/313/+/bob` since `bob` is not a `float`).

- Route changes will not break links.

  Links are formatted from the routes themselves, so if number or order of parameters changes type checker will be at your service and tell you all the places you need to update. For example if we update our routing to prefix notation only our route definition will change & all the links will continue to work as expected:
  
  ```diff
  - const calculator = Router.route`/calculator/`(Router.Float)`/+/`(Router.Float)
  + const calculator = Router.route`/calculator/plus/`(Router.Float)`/`(Router.Float)
  ```


## Install

    npm install router.flow

## Usage

### Import


Rest of the the document & provided code examples assumes that library is installed (with yarn or npm) and imported as follows:

```js
import * as Router from "router.flow"
```

### Routes

`route` is a convenient function that provides a DSL for defining routes via [tagged template literals][] as an alternative to using low-level API exposed by [route.flow][].

#### Absolute routes

Absolute routes **must** start with leading `/` character

```js
Router.route`/`.parsePath({ pathname: "/" }) //> []
Router.route`/`.parsePath({ pathname: "/foo" }) //> null
Router.route`/`.formatPath() //> "/"

Router.route`/blog`.parsePath({ pathname: "/blog" }) //> []
Router.route`/blog`.parsePath({ pathname: "blog" }) //> null
```

#### Relative routes

If route does not start with leading `/` character it's going to only match relative paths

```js
Router.route`blog`.parsePath({ pathname: "blog" }) //> []
Router.route`blog`.parsePath({ pathname: "/blog" }) //> null

Router.route`blog`.formatPath() //> "blog"
```

#### Multiple segments

Route literal may contain multiple segments separated via `/` charater.

```js
const comment = Router.route`/user/comment`
comment.parsePath({ pathname: "/user/comment" }) //> []
comment.parsePath({ pathname: "/user/comment/" }) //> []
comment.parsePath({ pathname: "/user/comment/cat" }) //> null
comment.parsePath({ pathname: "user/comment" }) //> null

comment.formatPath() //> "/user/comment"
```

> **Note:** Trailing `/` charater is optional. But if used route will only match paths with trailing `/`, when route formatted trailing `/` will appear only if it was present in the route.

```js
const comment2 = Router.route`/user/comment/`

comment2.parsePath({ pathname: "/user/comment" }) //> null
comment2.parsePath({ pathname: "/user/comment/" }) //> []
comment2.formatPath() //> "/user/comment/"
```

[Tagged template literals]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[node URL]:https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_class_url
[Location]:https://developer.mozilla.org/en-US/docs/Web/API/Location
[opquae type alias]:https://flow.org/en/docs/types/opaque-types/
[float.flow]:https://www.npmjs.com/package/float.flow
[integer.flow]:https://www.npmjs.com/package/integer.flow
[query parameters]:#query_parameters
[function subtyping]:https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/#function-subtyping
[Express]:https://expressjs.com/
[express routing]:https://expressjs.com/en/guide/routing.html
[Node.js]:https://nodejs.org/en/
[flow]:http://flow.org/
[typescript]:http://typescriptlang.org/
[route.flow]:https://github.com/Gozala/route.flow

[travis.icon]: https://travis-ci.org/Gozala/router.flow.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/router.flow

[version.icon]: https://img.shields.io/npm/v/router.flow.svg
[downloads.icon]: https://img.shields.io/npm/dm/router.flow.svg
[package.url]: https://npmjs.org/package/router.flow


[downloads.image]: https://img.shields.io/npm/dm/router.flow.svg
[downloads.url]: https://npmjs.org/package/router.flow

[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]:https://github.com/prettier/prettier