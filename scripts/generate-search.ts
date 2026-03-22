import { writeSearchIndex } from '../src/lib/search-index'
import path from 'path'

const outDir = path.join(process.cwd(), 'out')
writeSearchIndex(outDir)
console.log('Search index generated successfully!')
