// @flow strict

import test from "blue-tape"
import * as Router from "../"
import * as Float from "float.flow"
import * as Integer from "integer.flow"

test("test baisc", async test => {
  test.isEqual(typeof Router, "object")
  test.isEqual(typeof Router.String, "object")
  test.isEqual(typeof Router.Float, "object")
  test.isEqual(typeof Router.Integer, "object")
  test.isEqual(typeof Router.route, "function")
})

test("test absolute", async test => {
  const blog = Router.route`/blog/`
  test.deepEqual(blog.parsePath({ pathname: "blog/" }), null)
  test.deepEqual(blog.parsePath({ pathname: "/blog/" }), [])
  test.deepEqual(blog.parsePath({ pathname: "/blog/cats" }), null)
})

test("test relative", async test => {
  const blog = Router.route`blog/`
  test.deepEqual(blog.parsePath({ pathname: "blog/" }), [])
  test.deepEqual(blog.parsePath({ pathname: "/blog/" }), null)
  test.deepEqual(blog.parsePath({ pathname: "/blog/cats" }), null)
  test.deepEqual(blog.parsePath({ pathname: "blog/cats" }), null)
})

test("test multiple segments", async test => {
  const user = Router.route`/user/profile/`
  test.deepEqual(user.parsePath({ pathname: "/user/" }), null)
  test.deepEqual(user.parsePath({ pathname: "/user/profile" }), [])
  test.deepEqual(user.parsePath({ pathname: "/user/profile/" }), [])
  test.deepEqual(user.parsePath({ pathname: "/user/profile/kate" }), null)
  test.deepEqual(user.parsePath({ pathname: "user/profile" }), null)
  test.deepEqual(user.parsePath({ pathname: "user/profile/" }), null)
})

test("test multiple segments relative", async test => {
  const user = Router.route`user/profile/`
  test.deepEqual(user.parsePath({ pathname: "/user/" }), null)
  test.deepEqual(user.parsePath({ pathname: "/user/profile" }), null)
  test.deepEqual(user.parsePath({ pathname: "/user/profile/" }), null)
  test.deepEqual(user.parsePath({ pathname: "/user/profile/kate" }), null)
  test.deepEqual(user.parsePath({ pathname: "user/profile" }), [])
  test.deepEqual(user.parsePath({ pathname: "user/profile/" }), [])
  test.deepEqual(user.parsePath({ pathname: "user/profile/kate" }), null)
})

test("type parametric", async test => {
  const blogPost = Router.route`/blog/`(Router.String)
  test.deepEqual(blogPost.parsePath({ pathname: "/blog/" }), null)
  test.deepEqual(blogPost.parsePath({ pathname: "/blog/cats/" }), ["cats"])
  test.deepEqual(blogPost.parsePath({ pathname: "/blog/cats" }), ["cats"])
  test.deepEqual(blogPost.parsePath({ pathname: "blog/cats" }), null)
})

test("type parametric relative", async test => {
  const blogPost = Router.route`blog/`(Router.String)
  test.deepEqual(blogPost.parsePath({ pathname: "/blog/" }), null)
  test.deepEqual(blogPost.parsePath({ pathname: "/blog/cats" }), null)
  test.deepEqual(blogPost.parsePath({ pathname: "/blog/cats/" }), null)
  test.deepEqual(blogPost.parsePath({ pathname: "blog/" }), null)
  test.deepEqual(blogPost.parsePath({ pathname: "blog/cats/tom" }), null)
  test.deepEqual(blogPost.parsePath({ pathname: "blog/cats/" }), ["cats"])
  test.deepEqual(blogPost.parsePath({ pathname: "blog/cats" }), ["cats"])
})

test("paramteric multi-segment", async test => {
  const userProfile = Router.route`/user/`(Router.String)`/profile/`
  test.deepEqual(userProfile.parsePath({ pathname: "/user/" }), null)
  test.deepEqual(userProfile.parsePath({ pathname: "/user/bob/" }), null)
  test.deepEqual(userProfile.parsePath({ pathname: "/user/bob/profile" }), [
    "bob"
  ])
})

test("integer", async test => {
  const rootInt = Router.route`/`(Router.Integer)
  test.deepEqual(rootInt.parsePath({ pathname: "/42/" }), [42])
  test.deepEqual(rootInt.parsePath({ pathname: "/-7" }), [-7])
  test.deepEqual(rootInt.parsePath({ pathname: "/+8" }), [8])
  test.deepEqual(rootInt.parsePath({ pathname: "/42.2/" }), null)
  test.deepEqual(rootInt.parsePath({ pathname: "/" }), null)
  test.deepEqual(rootInt.parsePath({ pathname: "/Infinity" }), null)
  test.deepEqual(rootInt.parsePath({ pathname: "/NaN/" }), null)
})

test("float", async test => {
  const rootFloat = Router.route`/`(Router.Float)
  test.deepEqual(rootFloat.parsePath({ pathname: "/42/" }), [42])
  test.deepEqual(rootFloat.parsePath({ pathname: "/-42.5/" }), [-42.5])
  test.deepEqual(rootFloat.parsePath({ pathname: "/NaN/" }), null)
  test.deepEqual(rootFloat.parsePath({ pathname: "/Infinity/" }), null)
  test.deepEqual(rootFloat.parsePath({ pathname: "/Bob/" }), null)
})

test("multiparam", async test => {
  const calculator = Router.route`/calculator/`(Router.Float)`/+/`(Router.Float)

  test.deepEqual(calculator.parsePath({ pathname: "/calculator/313/+/3" }), [
    313,
    3
  ])
  test.deepEqual(calculator.parsePath({ pathname: "/calculator/313/+/" }), null)
  test.deepEqual(calculator.parsePath({ pathname: "/calculator/13/+/4.2/" }), [
    13,
    4.2
  ])

  test.deepEqual(
    calculator.formatPath(Float.toFloat(7), Float.toFloat(3)),
    "/calculator/7/+/3"
  )
  test.deepEqual(
    calculator.formatHash(Float.toFloat(71), Float.toFloat(3)),
    "#/calculator/71/+/3"
  )
  test.deepEqual(calculator.format(Float.toFloat(7), Float.toFloat(3)), {
    pathname: "/calculator/7/+/3",
    search: "",
    hash: ""
  })
})

test("parameter first", async test => {
  const name = Router.route``(Router.String)
  test.deepEqual(name.parsePath({ pathname: "blog/" }), ["blog"])
  test.deepEqual(name.parsePath({ pathname: "/blog/" }), null)
  test.deepEqual(name.parsePath({ pathname: "/blog" }), null)
})
