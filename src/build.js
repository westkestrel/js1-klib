#!/usr/bin/env node
/**
 * This build script creates the distribution package; it is not itself included
 * in the distribution.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'

function main() {
    const files = readdirSync('src').filter(f => f != 'build.js')
    const licenseLines = readFileSync('LICENSE.txt', { encoding: 'utf8' }).split('\n').map(line => `* ${line}`)
    const all = []
    licenseLines.splice(0, 0, '/**')
    licenseLines.push('*/')
    licenseLines.push('')
    licenseLines.push('')
    const license = licenseLines.join('\n')
    all.push(license)
    if (!existsSync('dist')) {
        console.log(`mkdir dist`)
        mkdirSync('dist')
    }
    for (var file of files) {
        const src = `src/${file}`
        const dst = `dist/${file}`
        const content = readFileSync(src, { encoding: 'utf8' })
        all.push(content)
        console.log('updating', dst)
        writeFileSync(dst, license + content, { encoding: 'utf8' })
    }
    const dst = `dist/klib.js`
    console.log('updating', dst)
    writeFileSync(dst, all.join('\n\n'), { encoding: 'utf8' })
}

main()
