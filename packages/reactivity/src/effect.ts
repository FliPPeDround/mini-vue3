// eslint-disable-next-line import/no-mutable-exports
export let activeEffect: ReactiveEffect
class ReactiveEffect {
  public parent = null
  public deps = []
  public active = true

  constructor(
    public fn: Function,
  ) {}

  run() {
    if (!this.active)
      return
    this.fn()
    try {
      this.parent = activeEffect
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      activeEffect = this
      this.fn()
    }
    finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

const targetMap = new WeakMap()
export function track(target: object, _type: 'get', key: string | symbol) {
  if (!activeEffect)
    return

  let depsMap = targetMap.get(target)
  if (!depsMap)
    targetMap.set(target, (depsMap = new Map()))

  let deps = depsMap.get(key)
  if (!deps)
    depsMap.set(key, (deps = new Set()))

  const shouldTrack = !deps.has(activeEffect)
  if (shouldTrack) {
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}

export function trigger(target: object, _type: 'set', key: string | symbol, _value: any, _oldValue: any) {
  targetMap.get(target)
    ?.get(key)
    ?.forEach((dep: ReactiveEffect) => {
      if (dep !== activeEffect)
        dep.run()
    })
}
