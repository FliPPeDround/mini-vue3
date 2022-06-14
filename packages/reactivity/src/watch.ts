import { isFunction, isObject } from '@vue/shared'
import { ReactiveEffect } from './effect'
import { isReactive } from './reactive'

function traversal(value: any, set = new Set()) {
  if (!isObject(value))
    return value

  if (set.has(value))
    return value

  set.add(value)
  for (const key in value)
    traversal(value[key], set)

  return value
}

export function watch(source: any, cb: Function, _options?: any) {
  let getter: Function
  let oldValue: any
  let cleanup: Function

  if (isReactive(source))
    getter = () => traversal(source)
  else if (isFunction(source))
    getter = source
  else
    throw new Error('source must be a reactive object or a function')

  function onCleanup(fn: Function) {
    cleanup = fn
  }

  const effect = new ReactiveEffect(getter, job)

  function job() {
    if (cleanup)
      cleanup()
    const newValue = effect.run()
    cb(newValue, oldValue, onCleanup)
    oldValue = newValue
  }

  oldValue = effect.run()
}
