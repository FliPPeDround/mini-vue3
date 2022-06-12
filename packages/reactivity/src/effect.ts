export let activeEffect
class ReactiveEffect {
  public active = true
  constructor(public fn: Function) {}

  run() {
    if (!this.active)
      return
    this.fn()
    try {
      activeEffect = this
      this.fn()
    }
    finally {
      activeEffect = undefined
    }
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
