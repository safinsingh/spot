import { readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
import { resolve } from 'path'

const path = resolve(__dirname, '../.eslintrc.yaml')
export = safeLoad(readFileSync(path).toString())
