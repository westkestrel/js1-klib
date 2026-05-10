#!/usr/bin/env node
/**
 * This build script creates the distribution package; it is not itself included
 * in the distribution.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'

const ENCODING = { encoding: 'utf8' }

function main() {
    const version = getProjectVersion()
    const files = readdirSync('src').filter(f => f != 'build.js' && f.indexOf('.') > 0)
    const licenseLines = readFileSync('LICENSE.txt', { encoding: 'utf8' }).split('\n').map(line => `* ${line}`)
    const allJavaScript = []
    const allStyles = []
    const helpContent = {}
    licenseLines.splice(0, 0, '/**')
    licenseLines.push('*/')
    licenseLines.push('')
    licenseLines.push('')
    const license = licenseLines.join('\n')
    allJavaScript.push(license)
    allStyles.push(license)
    if (!existsSync('dist')) {
        console.log(`mkdir dist`)
        mkdirSync('dist')
    }
    for (var file of files) {
        const src = `src/${file}`
        const dst = `dist/${file}`
        const content = readFileSync(src, ENCODING)
        const versionedContent = injectVersion(content, version)
        helpContent[file.toLowerCase()] = extractHelpContent(content)
        if (file.endsWith('.js')) allJavaScript.push(versionedContent)
        if (file.endsWith('.css')) allStyles.push(versionedContent)
        writeIfChanged(dst, license + versionedContent)
    }
    
    const javaScriptDst = `dist/klib.js`
    console.log('updating', javaScriptDst)
    writeFileSync(javaScriptDst, allJavaScript.join('\n\n'), ENCODING)

    const styleDst = `dist/klib.css`
    console.log('updating', styleDst)
    writeFileSync(styleDst, allStyles.join('\n\n'), ENCODING)

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
    const nameMatches = block.match(/^[\w.-]+/)
    if (!nameMatches) return block
    const name = nameMatches[0]
    const key = name.toLowerCase()
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
        console.log(`no changes for ${path}`)
        return
    }
    console.log(`updating ${path}`)
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
