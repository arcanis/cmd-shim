'use strict'
const _ = require('lodash')
const MemoryFS = require('memory-fs')
const _fs = new MemoryFS()
const fs = _.mapValues(Object.getPrototypeOf(_fs), (v, k) => typeof v === 'function' ? v.bind(_fs) : v)
const path = require('path')

const { fixtures, fixtures2 } = process.platform === 'win32' ? {
  fixtures: 'I:\\cmd-shim\\fixtures',
  fixtures2: 'J:\\cmd-shim\\fixtures'
} : {
  fixtures: '/foo/cmd-shim/fixtures',
  fixtures2: '/bar/cmd-shim/fixtures'
}

exports.fixtures = fixtures
exports.fixtures2 = fixtures2
exports.fs = fs

const fixtureFiles = {
  [fixtures]: {
    'src.exe': 'exe',
    'src.env': '#!/usr/bin/env node\nconsole.log(/hi/)\n',
    'src.env.args': '#!/usr/bin/env node --expose_gc\ngc()\n',
    'src.sh': '#!/usr/bin/sh\necho hi\n',
    'src.sh.args': '#!/usr/bin/sh -x\necho hi\n'
  },
  [fixtures2]: {
    'src.sh.args': '#!/usr/bin/sh -x\necho hi\n'
  }
}

for (const [dir, files] of Object.entries(fixtureFiles)) {
  fs.mkdirpSync(dir)
  for (const [filename, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filename), contents)
  }
}
