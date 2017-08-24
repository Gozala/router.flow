/* @flow */

import type { Route, State, URL, Query, Concat, QueryRoute } from "route.flow"
import { parsePathname } from "route.flow/lib/Route/URL"
import { Root, Empty } from "route.flow"
import { raw } from "./String"

export type { integer, float } from "route.flow"
export { String, Float, Integer } from "route.flow"

export interface RouterAPI<out> extends Route<out> {
  route: Route<out>
}

export type RouterParam<out> = Param<out> & RouterAPI<out>
export type RouterSegment<out> = Segment<out> & RouterAPI<out>
export type EitherRouter<out> = RouterParam<out> | RouterSegment<out>

export interface Param<out> {
  <next>(route: Route<next>): RouterSegment<Concat<out, next>>
}

export interface Segment<out> {
  (string[], ...string[]): RouterParam<out>
}

class Router<out> implements RouterAPI<out> {
  route: Route<out>

  read<inn>(state: State<inn>) {
    return (this.route.read(state): ?State<Concat<inn, out>>)
  }
  write<inn>(state): State<inn> {
    return this.route.write((state: State<Concat<inn, out>>))
  }

  parse(path: string[], query: Query): ?out {
    return this.route.parse(path, query)
  }
  parsePath(url: URL): ?out {
    return this.route.parsePath(url)
  }
  parseHash(url: URL): ?out {
    return this.route.parseHash(url)
  }

  format(...params: Array<mixed> & out): URL {
    return this.route.format(...params)
  }
  formatPath(...params: Array<mixed> & out): string {
    return this.route.formatPath(...params)
  }
  formatHash(...params: Array<mixed> & out): string {
    return this.route.formatHash(...params)
  }

  segment(path?: string): Route<out> {
    return this.route.segment(path)
  }
  param<a>(route: Route<[a]>) {
    return (this.route.param(route): Route<Concat<out, [a]>>)
  }
  concat<other>(route: Route<other>): Route<Concat<out, other>> {
    return this.route.concat(route)
  }
  query<a>(name: string, query: QueryRoute<[a]>) {
    return (this.route.query(name, query): Route<Concat<out, [a]>>)
  }
}

const param = <a>(base: Route<a>): RouterParam<a> => {
  const router = <b>(route: Route<b>): RouterSegment<Concat<a, b>> =>
    segment(base.concat(route))
  router.route = base

  router.read = Router.prototype.read
  router.write = Router.prototype.write

  router.parse = Router.prototype.parse
  router.parsePath = Router.prototype.parsePath
  router.parseHash = Router.prototype.parseHash

  router.format = Router.prototype.format
  router.formatPath = Router.prototype.formatPath
  router.formatHash = Router.prototype.formatHash

  router.segment = Router.prototype.segment
  router.param = Router.prototype.param
  router.concat = Router.prototype.concat
  router.query = Router.prototype.query

  return router
}

const segments = (path: string): Route<[]> => {
  const segments = parsePathname(path)
  let route = Empty
  for (let fragment of segments) {
    if (fragment !== "") {
      route = route.segment(fragment)
    }
  }
  return route
}

const segment = <a>(base: Route<a>): RouterSegment<a> => {
  const router = (fragments: string[], ...params: string[]): RouterParam<a> => {
    const path = raw({ raw: (fragments: any) }, ...params)
    return param(base.concat(segments(path)))
  }
  router.route = base

  router.read = Router.prototype.read
  router.write = Router.prototype.write

  router.parse = Router.prototype.parse
  router.parsePath = Router.prototype.parsePath
  router.parseHash = Router.prototype.parseHash

  router.format = Router.prototype.format
  router.formatPath = Router.prototype.formatPath
  router.formatHash = Router.prototype.formatHash

  router.segment = Router.prototype.segment
  router.param = Router.prototype.param
  router.concat = Router.prototype.concat
  router.query = Router.prototype.query

  return router
}

export const route = (
  fragments: string[],
  ...params: string[]
): RouterParam<[]> => {
  const path = String.raw({ raw: (fragments: any) }, ...params)
  if (path.charAt(0) === "/") {
    return param(Root.concat(segments(path)))
  } else {
    return param(segments(path))
  }
}
