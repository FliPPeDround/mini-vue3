import { describe, expect, it } from 'vitest'
import { effect, reactive } from '../src'

describe('响应式测试', () => {
  const obj = reactive({
    text: 'mini-vue',
    age: 1,
  })
  let foo: string
  let bar: number
  effect(() => {
    obj.age = 2
    foo = obj.text
    bar = obj.age
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
