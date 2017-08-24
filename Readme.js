/* @flow */

import * as Router from "router.flow"
import * as Float from "float.flow"
import * as Route from "route.flow"
import * as Integer from "integer.flow"

// Segment
const blog = Router.route`/blog/`
blog.parsePath({ pathname: "blog/" }) //?
blog.parsePath({ pathname: "/blog/" }) //?
blog.parsePath({ pathname: "/blog/cats" }) //?

// Multiple segments
const user = Router.route`/user/profile/`
user.parsePath({ pathname: "/user/" }) //?
user.parsePath({ pathname: "/user/profile" }) //?
user.parsePath({ pathname: "/user/profile/" }) //?
user.parsePath({ pathname: "/user/profile/kate" }) //?

const blogPost = Router.route`/blog/`(Router.String)
blogPost.parsePath({ pathname: "/blog/" }) //?
blogPost.parsePath({ pathname: "/blog/cats/" }) //?
blogPost.parsePath({ pathname: "/blog/cats" }) //?
blogPost.parsePath({ pathname: "blog/cats" }) //?

const userProfile = Router.route`/user/`(Router.String)`/profile/`
userProfile.parsePath({ pathname: "/user/" }) //?
userProfile.parsePath({ pathname: "/user/bob/" }) //?
userProfile.parsePath({ pathname: "/user/bob/profile" }) //?

const rootFloat = Router.route`/`(Router.Float)
rootFloat.parsePath({ pathname: "/42/" }) //?
rootFloat.parsePath({ pathname: "/-42.5/" }) //?
rootFloat.parsePath({ pathname: "/NaN/" }) //?
rootFloat.parsePath({ pathname: "/Infinity/" }) //?
rootFloat.parsePath({ pathname: "/Bob/" }) //?

const rootInt = Router.route`/`(Router.Integer)
rootInt.parsePath({ pathname: "/42/" }) //?
rootInt.parsePath({ pathname: "/-7" }) //?
rootInt.parsePath({ pathname: "/+8" }) //?
rootInt.parsePath({ pathname: "/42.2/" }) //?
rootInt.parsePath({ pathname: "/" }) //?
rootInt.parsePath({ pathname: "/Infinity" }) //?
rootInt.parsePath({ pathname: "/NaN/" }) //?

const calculator = Router.route`/calculator/`(Router.Float)`/+/`(Router.Float)

calculator.parsePath({ pathname: "/calculator/313/+/3" }) //?
calculator.parsePath({ pathname: "/calculator/313/+/" }) //?
calculator.parsePath({ pathname: "/calculator/13/+/4.2/" }) //?

calculator.formatPath(Float.toFloat(7), Float.toFloat(3)) //?
calculator.formatHash(Float.toFloat(71), Float.toFloat(3)) //?
calculator.format(Float.toFloat(7), Float.toFloat(3)) //?

const blogPosts = Router.route`/blog`
blogPosts.parsePath({ pathname: "/blog" }) //?

const postID = Router.route`post/`(Router.String)`/`(Router.Integer)
postID.parsePath({ pathname: "post/jack/35/" }) //?

const blogPostID = blogPosts(postID)

blogPostID.parsePath({ pathname: "/blog/post/jack/35/" }) //?
blogPostID.parsePath({ pathname: "/post/42/" }) //?
blogPostID.parsePath({ pathname: "blog/post/7" }) //?
blogPostID.parsePath({ pathname: "/blog/post/" }) //?

const name = Router.route``(Router.String)
name.parsePath({ pathname: "blog/" }) //?
