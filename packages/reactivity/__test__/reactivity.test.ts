import { describe, expect, it, vi } from 'vitest'
import { computed, effect, reactive } from '../src'

describe('响应式测试', () => {
  const obj = reactive({
    text: 'mini-vue',
    number: 1,
  })
  let foo: string
  let bar: number
  effect(() => {
    obj.number = 2
    foo = obj.text
    bar = obj.number
  })

  it('基本测试', () => {
    expect(foo).toBe('mini-vue')
    obj.text = 'vue'
    expect(foo).toBe('vue')
  })

  it('无限调用', () => {
    expect(bar).toBe(2)
  })
})

describe('代理缓存测试', () => {
  const data = {
    name: 'mini-vue',
    describe: 'a vue-like framework',
  }
  it('重复代理', () => {
    const data1 = reactive(data)
    const data2 = reactive(data)
    expect(data1).toBe(data2)
  })
  it('嵌套代理', () => {
    const data1 = reactive(data)
    const data2 = reactive(data1)
    expect(data1).toBe(data2)
  })
})

describe('分支切换', () => {
  it('分支切换', () => {
    const data = reactive({
      flag: true,
      text: 'mini-vue',
    })
    let foo: string
    const fn = vi.fn(() => {
      foo = data.flag ? data.text : 'vue'
    })
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(foo).toBe('mini-vue')
    data.text = 'mini-vue3'
    expect(fn).toHaveBeenCalledTimes(4)
    expect(foo).toBe('mini-vue3')
  })
})

describe('计算属性', () => {
  it('计算属性', () => {
    const a = reactive({
      value: 1,
    })
    const b = reactive({
      value: 2,
    })
    const c = computed(() => a.value + b.value)

    expect(c.value).toBe(3)
    a.value = 3
    expect(c.value).toBe(5)
  })
  it('收集effect', () => {
    const a = reactive({
      value: 1,
    })
    const b = reactive({
      value: 2,
    })
    const c = computed(() => a.value + b.value)

    let foo: number
    effect(() => {
      foo = c.value
    })

    expect(c.value).toBe(3)
    expect(foo).toBe(3)

    a.value = 3
    expect(c.value).toBe(5)
    expect(foo).toBe(5)
  })
})
