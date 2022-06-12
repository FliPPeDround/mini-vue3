import { isObject } from './../../shared/src/index'
import { ReactiveFlags, mutableHandlers } from './baseHandler'

const reactiveMap = new WeakMap()

export function reactive(target: object) {
  if (!isObject(target))
    return

  if (target[ReactiveFlags.IS_REACTIVE])
    return target

  const existingProxy = reactiveMap.get(target)
  if (existingProxy)
    return existingProxy

  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}
