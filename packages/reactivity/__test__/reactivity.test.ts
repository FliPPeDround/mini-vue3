import { describe, expect, it } from 'vitest'
import { effect, reactive } from '../src'

describe('响应式测试', () => {
  it('', () => {
    const obj = reactive({
      name: 'mini-vue',
    })
    let foo: string
    effect(() => {
      foo = obj.name
    })
    expect(foo).toBe('mini-vue')
    obj.name = 'vue'
    expect(foo).toBe('vue')
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
