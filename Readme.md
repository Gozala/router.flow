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

> **Note:** Example below is more verbose than one above, but that is because it is meant to illustrate low-level API provided by this library, which is more of a building block for something like [Express][]. It is also worth noting that API of this library is designed towards taking advantage of type system that does not quite fit [Express][] API and that shows


```js
import * as Router from "router.flow"
import * as URL from "url"
import express from "express"

const index = Router.route`/`
const calculator = Router.route`/calculator/`(Router.Float)`/+/`(Router.Float)

const getIndex = response =>
  response.send(`<a href='${calculator.formatPath(313, 3)}'>Calculate 313 + 3</a>`)

const getCalculator = (response, a: number, b: number) =>
  response.send(`${a + b}`)

const app = express()
app.use((request, response) => {
  const url = URL.parse(request.url)

  const indexParams = index.parsePath(url)
  if (indexParams) {
    return getIndex(request, ...indexParams)
  }

  const calculatorParams = calculator.parsePath(url)
  if (calculatorParams) {
    return getCalculator(res, ...calculatorParams)
  }
})
```


Presented solution attempts to illustrate building blocks from this library for structuring routes that can be used for:

1. Parsing route parameters in a type safe way.

   Type checker ([Flow][]) can ensure that there is no missmatch between extracted parameters and handlers (`getIndex`, `getCalculator`) using them.
   
   > **Note:** In this specific examlpe [Flow][] will not complain if handler is passed less parameters than it expects due to the way it handles [function subtyping][] rules. That being said, this library comes with solution to address that and ensure that extracted number of parameters matches of what handler expects, it's just seemed little too much for this example.

2. Format hyper-links in type safe way.

   Links are formated by calling `.format(313, 3)` on the route itself allowing type checker to report any missmatch in type or number of parameters passed.

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

[travis.icon]: https://travis-ci.org/Gozala/router.flow.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/router.flow

[version.icon]: https://img.shields.io/npm/v/router.flow.svg
[downloads.icon]: https://img.shields.io/npm/dm/router.flow.svg
[package.url]: https://npmjs.org/package/router.flow


[downloads.image]: https://img.shields.io/npm/dm/router.flow.svg
[downloads.url]: https://npmjs.org/package/router.flow

[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]:https://github.com/prettier/prettier