import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const dataPath = 'assets/generated/pto-cheatsheet/source/instructions.json'
const flatten = category => category.groups.flatMap(group => group.opcodes)

test('PTO cheatsheet taxonomy matches the approved workbook partition', async () => {
  const data = JSON.parse(await readFile(dataPath, 'utf8'))
  assert.equal(data.schemaVersion, 1)
  assert.equal(data.source.workbook, 'PTO-ISA-保留指令列表.xlsx')
  assert.equal(data.source.range, 'Sheet1!A1:C125')
  assert.deepEqual(data.posters.map(item => item.id), ['compute', 'data-system'])

  const categories = data.posters.flatMap(poster => poster.categories)
  const opcodes = categories.flatMap(flatten)
  assert.equal(categories.length, 11)
  assert.equal(opcodes.length, 124)
  assert.equal(new Set(opcodes).size, 124)
  assert.ok(opcodes.includes('SYNCALL'))
  assert.ok(!opcodes.includes('TPOW'))
  assert.ok(!opcodes.includes('TPOWS'))

  assert.deepEqual(data.posters.map(poster => poster.categories.length), [7, 4])
  assert.deepEqual(data.posters.map(poster => poster.categories.flatMap(flatten).length), [74, 50])
  assert.deepEqual(categories.map(category => [category.name, flatten(category).length]), [
    ['逐元素双目运算', 12],
    ['逐元素单目运算', 4],
    ['逐元素超越函数', 7],
    ['逐元素与标量运算', 15],
    ['归约运算', 12],
    ['广播运算', 16],
    ['矩阵运算', 8],
    ['数据搬运与访存', 5],
    ['复杂变换计算', 29],
    ['系统与控制', 7],
    ['通信', 9],
  ])
})
