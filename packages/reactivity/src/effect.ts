// eslint-disable-next-line import/no-mutable-exports
export let activeEffect: ReactiveEffect

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect

  for (let i = 0; i < deps.length; i++)
    deps[i].delete(effect)
  effect.deps.length = 0
}

export class ReactiveEffect {
  public parent = null
  public deps = []
  public active = true

  constructor(
    public fn: Function,
    public scheduler?: Function,
  ) {}

  run() {
    if (!this.active)
      return
    try {
      this.parent = activeEffect
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      activeEffect = this

      cleanupEffect(this)
      return this.fn()
    }
    finally {
      activeEffect = this.parent
      this.parent = null
    }
  }

  stop() {
    if (this.active) {
      this.active = false
      cleanupEffect(this)
    }
  }
}

export function effect(fn: Function, options?: { scheduler?: Function }) {
  const _effect = new ReactiveEffect(fn, options?.scheduler)
  _effect.run()

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
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

  trackEffects(deps)
}

export function trackEffects(deps: any) {
  if (!activeEffect)
    return

  const shouldTrack = !deps.has(activeEffect)
  if (shouldTrack) {
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}

export function trigger(target: object, _type: 'set', key: string | symbol, _value: any, _oldValue: any) {
  const effects = targetMap.get(target)?.get(key)
  triggerEffects(effects)
}

export function triggerEffects(effects: any) {
  effects = new Set(effects)
  effects?.forEach((effect: ReactiveEffect) => {
    if (effect !== activeEffect)
      effect.scheduler ? effect.scheduler() : effect.run()
  })
}
