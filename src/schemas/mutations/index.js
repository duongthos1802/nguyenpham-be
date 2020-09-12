'use strict'

import fs from 'fs'
import path from 'path'

const db = {}

const basename = path.basename(__filename)

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const { name } = path.parse(file)
    const model = require(`./${name}`).default
    Object.assign(db, {}, model)
  })

module.exports = db