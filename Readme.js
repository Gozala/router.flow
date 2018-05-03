/* @flow */

import * as Router from "router.flow"
import * as Float from "float.flow"
import * as Route from "route.flow"
import * as Integer from "integer.flow"

// // Segment
// const blog = Router.route`/blog/`
// blog.parsePath({ pathname: "blog/" }) //?
// blog.parsePath({ pathname: "/blog/" }) //?
// blog.parsePath({ pathname: "/blog/cats" }) //?

// // Multiple segments
// const user = Router.route`/user/profile/`
// user.parsePath({ pathname: "/user/" }) //?
// user.parsePath({ pathname: "/user/profile" }) //?
// user.parsePath({ pathname: "/user/profile/" }) //?
// user.parsePath({ pathname: "/user/profile/kate" }) //?

// const blogPost = Router.route`/blog/`(Router.String)
// blogPost.parsePath({ pathname: "/blog/" }) //?
// blogPost.parsePath({ pathname: "/blog/cats/" }) //?
// blogPost.parsePath({ pathname: "/blog/cats" }) //?
// blogPost.parsePath({ pathname: "blog/cats" }) //?

// const userProfile = Router.route`/user/`(Router.String)`/profile/`
// userProfile.parsePath({ pathname: "/user/" }) //?
// userProfile.parsePath({ pathname: "/user/bob/" }) //?
// userProfile.parsePath({ pathname: "/user/bob/profile" }) //?

// const rootFloat = Router.route`/`(Router.Float)
// rootFloat.parsePath({ pathname: "/42/" }) //?
// rootFloat.parsePath({ pathname: "/-42.5/" }) //?
// rootFloat.parsePath({ pathname: "/NaN/" }) //?
// rootFloat.parsePath({ pathname: "/Infinity/" }) //?
// rootFloat.parsePath({ pathname: "/Bob/" }) //?

// const rootInt = Router.route`/`(Router.Integer)
// rootInt.parsePath({ pathname: "/42/" }) //?
// rootInt.parsePath({ pathname: "/-7" }) //?
// rootInt.parsePath({ pathname: "/+8" }) //?
// rootInt.parsePath({ pathname: "/42.2/" }) //?
// rootInt.parsePath({ pathname: "/" }) //?
// rootInt.parsePath({ pathname: "/Infinity" }) //?
// rootInt.parsePath({ pathname: "/NaN/" }) //?

// const calculator = Router.route`/calculator/`(Router.Float)`/+/`(Router.Float)

// calculator.parsePath({ pathname: "/calculator/313/+/3" }) //?
// calculator.parsePath({ pathname: "/calculator/313/+/" }) //?
// calculator.parsePath({ pathname: "/calculator/13/+/4.2/" }) //?

// calculator.formatPath(Float.toFloat(7), Float.toFloat(3)) //?
// calculator.formatHash(Float.toFloat(71), Float.toFloat(3)) //?
// calculator.format(Float.toFloat(7), Float.toFloat(3)) //?

// const blogPosts = Router.route`/blog`
// blogPosts.parsePath({ pathname: "/blog" }) //?

// const postID = Router.route`post/`(Router.String)`/`(Router.Integer)
// postID.parsePath({ pathname: "post/jack/35/" }) //?

// const blogPostID = blogPosts(postID)

// blogPostID.parsePath({ pathname: "/blog/post/jack/35/" }) //?
// blogPostID.parsePath({ pathname: "/post/42/" }) //?
// blogPostID.parsePath({ pathname: "blog/post/7" }) //?
// blogPostID.parsePath({ pathname: "/blog/post/" }) //?

// const name = Router.route``(Router.String)
// name.parsePath({ pathname: "blog/" }) //?

// const index = Router.route`/`
// const plus = Router.route`/calculator/`(Router.Float)`/+/`(Router.Float)

// const viewIndex = () =>
//   `<a href='${plus.formatPath(
//     Float.toFloat(313),
//     Float.toFloat(3)
//   )}'>Calculate 313 + 3</a>`

// const viewPlus = (a: number) => (b: number) => `<body>${a + b}</body>`

// const router = Router.router.get(index, viewIndex).get(plus, viewPlus)

// router.route({ method: "GET", url: { pathname: "/calculator/4/+/3" } }) //?
// router.route({ method: "GET", url: { pathname: "/" } }) //?
// router.route({ method: "GET", url: { pathname: "/calculator/4/*/3" } }) //?

// const multiply = Router.route`/calculator/`(Router.Float)`/*/`(Router.Float)
// const viewMultiply = (a: number) => (b: number) => `<body>${a * b}</body>`
// const router2 = router.get(multiply, viewMultiply)

// router2.route({ method: "GET", url: { pathname: "/calculator/4/*/3" } }) //?

// Router.route`/`.parsePath({ pathname: "/" }) //?
// Router.route`/`.parsePath({ pathname: "/foo" }) //?

// Router.route`/`.formatPath() //?

// Router.route`blog`.parsePath({ pathname: "/blog" }) //?
// Router.route`blog`.parsePath({ pathname: "blog" }) //?
// Router.route`blog`.formatPath() //?

// const comment = Router.route`/user/comment`
// comment.parsePath({ pathname: "/user/comment" }) //?
// comment.parsePath({ pathname: "/user/comment/" }) //?
// comment.parsePath({ pathname: "/user/comment/cat" }) //?
// comment.parsePath({ pathname: "user/comment" }) //?

// comment.formatPath() //?

const comment2 = Router.route`/user/comment/` //?

Router.route`/user/comment/` //?

// comment2.parsePath({ pathname: "/user/comment" }) //?
// comment2.parsePath({ pathname: "/user/comment/" }) //?
// comment2.formatPath() //?

// Route.Root
//   .segment("user")
//   .segment()
//   .param(Route.String)
//   .segment("comment")
//   .parsePath({ pathname: "/user//dog/comment" }) //?

Router.segments("/user/comment/") //?JSON.stringify($.after.text)
