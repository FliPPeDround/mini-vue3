import { isFunction } from '@vue/shared'
import { ReactiveEffect, trackEffects, triggerEffects } from './effect'

class ComputedRefImpl {
  private effect: ReactiveEffect
  private _dirty = true
  private __v_isReadonly = true
  private __v_isRef = true
  private _value: any
  private dep = new Set()
  constructor(
    public getter: Function,
    public setter: Function,
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerEffects(this.dep)
      }
    })
  }

  get value() {
    trackEffects(this.dep)
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }

    return this._value
  }

  set value(newVal) {
    this.setter(newVal)
  }
}

export const computed = (getterOroptions: any) => {
  const onlyGetter = isFunction(getterOroptions)
  const getter: Function = onlyGetter ? getterOroptions : getterOroptions.get
  const setter: Function = onlyGetter
    ? () => console.warn('Computed property cannot be set')
    : getterOroptions.set

  return new ComputedRefImpl(getter, setter)
}
