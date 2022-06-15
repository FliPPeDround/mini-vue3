import { isArray, isObject } from '@vue/shared'
import { trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

function toReactive(rawValue: unknown) {
  return isObject(rawValue)
    ? reactive(rawValue as object)
    : rawValue
}

class RefImpl {
  private _value: unknown
  public __v_isRef = true
  public dep = new Set()

  constructor(
    public rawValue: unknown,
  ) {
    this._value = toReactive(rawValue)
  }

  get value() {
    trackEffects(this.dep)
    return this._value
  }

  set value(newValue: unknown) {
    if (newValue !== this.rawValue) {
      this._value = toReactive(newValue)
      this.rawValue = newValue
      triggerEffects(this.dep)
    }
  }
}

export function ref(value: unknown) {
  return new RefImpl(value)
}

class ObjectRefImpl {
  constructor(
    public object: object,
    public key: string,
  ) {}

  get value() {
    return this.object[this.key]
  }

  set value(newValue: unknown) {
    this.object[this.key] = newValue
  }
}

export function toRef(object: object, key: string) {
  return new ObjectRefImpl(object, key)
}

export function toRefs(object: object) {
  const result: unknown = isArray(object) ? new Array(object.length) : {}

  for (const key in object)
    result[key] = toRef(object, key)

  return result
}

export function proxyRefs(object: object) {
  return new Proxy(object, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      return result.__v_isRef ? result.value : result
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      if (oldValue.__v_isRef) {
        oldValue = oldValue.value
        return true
      }
      else {
        Reflect.set(target, key, value, receiver)
      }
    },
  })
}
