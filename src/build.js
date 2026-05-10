#!/usr/bin/env node
/**
 * This build script creates the distribution package; it is not itself included
 * in the distribution.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'

const ENCODING = { encoding: 'utf8' }

function main() {
    const version = getProjectVersion()
    const files = readdirSync('src').filter(f => f != 'build.js')
    const licenseLines = readFileSync('LICENSE.txt', { encoding: 'utf8' }).split('\n').map(line => `* ${line}`)
    const all = []
    const helpContent = {}
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
        const content = readFileSync(src, ENCODING)
        const versionedContent = injectVersion(content, version)
        helpContent[file.replace('.js', '').toLowerCase()] = extractHelpContent(content)
        all.push(versionedContent)
        console.log('updating', dst)
        writeIfChanged(dst, license + versionedContent)
    }
    const dst = `dist/klib.js`
    console.log('updating', dst)
    writeFileSync(dst, all.join('\n\n'), ENCODING)
    var readmeBlocks = readFileSync('README.md', ENCODING).split(/^### /m)
    console.log('updating README.md')
    var readmeContent = readmeBlocks.map(b => updateReadmeBlock(b, helpContent)).join('### ')
    writeFileSync('README.md', readmeContent, ENCODING)
}

function getProjectVersion() {
    const content = readFileSync('package.json')
    const json = JSON.parse(content)
    return json.version
}

function injectVersion(content, version) {
    return content.replace(/\/\*\*/, `/** (version ${version})`)
}

function extractHelpContent(content) {
    const firstCommentBlock = content.match(/^\/\*[\s\S]*?\*\//)[0]
    const stripped = firstCommentBlock.replace(/^.*?[*]+\/?( |$)/gm, '')
    return stripped
}

function updateReadmeBlock(block, helpContent) {
    const nameMatches = block.match(/^[\w-]+/)
    if (!nameMatches) return block
    const name = nameMatches[0]
    const key = name.replace('.js', '').toLowerCase()
    const help = helpContent[key] || helpContent[name] || helpContent[name.toLowerCase()]
    if (!help) {
        console.warn(`no README content found for ${name}`)
        return block
    }
    console.log(`...for ${name}`)
    return `${name}\n\n${help}\n`
}

function writeIfChanged(path, content) {
    if (existsSync(path) && !hasMeaningfulChanges(readFileSync(path, ENCODING), content)) {
        console.log(`...no changes for ${path}`)
        return
    }
    writeFileSync(path, content, ENCODING)
}

function hasMeaningfulChanges(oldContent, newContent) {
    const oldLines = oldContent.split('\n').filter(line => line != '')
    const newLines = newContent.split('\n').filter(line => line != '')
    if (oldLines.length != newLines.length) return true
    for (var i=0; i<oldLines.length; i++) {
        if (oldLines[i] == newLines[i]) continue
        const oldWithoutVersion = oldLines[i].replace(/version \d+\.\d+\.\d+/i, '')
        const newWithoutVersion = newLines[i].replace(/version \d+\.\d+\.\d+/i, '')
        if (oldWithoutVersion != newWithoutVersion) return true
    }
    return false
}

main()
