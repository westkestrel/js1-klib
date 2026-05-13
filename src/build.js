#!/usr/bin/env node
/**
 * This build script creates the distribution package; it is not itself included
 * in the distribution.
 *
 * You can pass the --omit-license flag to leave off the LICENSE text from the files as
 * they are copied to the *dist/* folder.  This is useful when doing development as it
 * means that the line numbers reported in any exceptions thrown by the demo code will
 * correctly refer to lines in the source files.
 */

import { argv } from 'process'
import { copyFileSync, existsSync, globSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename } from 'path'

const ENCODING = { encoding: 'utf8' }

/**
 * Ensure that we include collapsible.js after longpress.js
 */
function compareFilenames(a, b) {
    if (a.startsWith('collapsible')) a = 'z' + a
    if (b.startsWith('collapsible')) b = 'z' + b
    return a < b ? -1 : a > b ? 1 : 0
}

function main() {
    const omitLicense = argv.some(a => a === '--omit-license' || a === '-L')
    const version = getProjectVersion()
    const files = readdirSync('src')
        .filter(f => f != 'build.js' && f.indexOf('.') > 0)
        .sort(compareFilenames)
    const licenseLines = readFileSync('LICENSE.txt', { encoding: 'utf8' }).split('\n').map(line => `* ${line}`)
    const allJavaScript = []
    const allStyles = []
    const helpContent = {}
    licenseLines.splice(0, 0, '/**')
    licenseLines.push('*/')
    licenseLines.push('')
    licenseLines.push('')
    const licenseForConcatenatedFile = licenseLines.join('\n')
    const licenseForIndividualFile = omitLicense ? '' : licenseForConcatenatedFile
    allJavaScript.push(licenseForConcatenatedFile)
    allStyles.push(licenseForConcatenatedFile)
    if (omitLicense) console.log('omitting LICENSE text from individual files')
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
        writeIfChanged(dst, licenseForIndividualFile + versionedContent)
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
    
    updateDocs(helpContent)
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
    const potentialTail = block.replace(/[\s\S]*?\n#/, '\n#')
    const tail = potentialTail.length == block.length ? '' : potentialTail
    const name = nameMatches[0]
    const key = name.toLowerCase()
    const help = helpContent[key] || helpContent[name] || helpContent[name.toLowerCase()]
    if (!help) {
        console.warn(`no README content found for ${name}`)
        return block
    }
    console.log(`...for ${name}`)
    return `${name}\n\n${help}${tail}`.trim() + '\n\n'
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

function updateDocs(helpContent) {
    updateDocsIndex(helpContent)
    updateScriptDocs(helpContent)
    updateStylesheetDocs(helpContent)
    updateDocDemos()
}

function updateDocsIndex(helpContent) {
    var demoLinksContent = readFileSync('demos/index.html', ENCODING)
        .split('\n')
        .filter(s => s.indexOf('<a href') > 0)
        .map(s => s.replace(/.*href="([^"]+)".*?>(.*?)<.*/, '[Demo: $2](demos/$1)'))
    const alreadyDemoed = new Set()
    var indexContent = readFileSync('README.md', ENCODING)
        .replace('project folder', 'library')
        .replace(/\n*## Script[\s\S]+/, '')
        .split('\n')
    indexContent.push('')
    indexContent.push('## Script Documentation')
    for (const key of Object.keys(helpContent).sort().filter(k => k.endsWith('.js'))) {
        indexContent.push(`- [${key}](scripts/${key}.html)`)
        const keyword = key.replace(/\..*/, '')
        for (const link of demoLinksContent.filter(s => s.indexOf(keyword) > 0)) {
            indexContent.push(`  - ${link}`)
            alreadyDemoed.add(link)
        }
    }
    indexContent.push('')
    indexContent.push('## Stylesheet Documentation')
    for (const key of Object.keys(helpContent).sort().filter(k => k.endsWith('.css'))) {
        indexContent.push(`- [${key}](stylesheets/${key}.html)`)
        const keyword = key.replace(/\..*/, '')
        for (const link of demoLinksContent.filter(s => !alreadyDemoed.has(s) && s.indexOf(keyword) > 0)) {
            indexContent.push(`  - ${link}`)
        }
    }
    
    const indexPath = `docs/index.md`
    console.log(`updating ${indexPath}`)
    writeFileSync(indexPath, indexContent.join('\n'), ENCODING)
}

function updateScriptDocs(helpContent) {
    if (!existsSync('docs/scripts')) mkdirSync('docs/scripts')
    for (const key of Object.keys(helpContent).sort().filter(s => s.endsWith('.js'))) {
        const docPath = `docs/scripts/${key}.md`
        console.log(`updating ${docPath}`)
        writeFileSync(docPath, `# ${key}\n\n${helpContent[key]}\n\n[[Back](.)]`, ENCODING)
    }
}

function updateStylesheetDocs(helpContent) {
    if (!existsSync('docs/stylesheets')) mkdirSync('docs/stylesheets')
    for (const key of Object.keys(helpContent).sort().filter(s => s.endsWith('.css'))) {
        const docPath = `docs/stylesheets/${key}.md`
        console.log(`updating ${docPath}`)
        writeFileSync(docPath, `# ${key}\n\n${helpContent[key]}\n\n[[Back](.)]`, ENCODING)
    }
}

function updateDocDemos() {
    if (!existsSync('docs/demos')) mkdirSync('docs/demos')
    if (!existsSync('docs/demos/lib')) mkdirSync('docs/demos/lib')
    for (const srcPath of globSync('demos/*').sort()) {
        const content = readFileSync(srcPath, ENCODING)
            .replaceAll('../dist/', 'lib/')
            .replaceAll('href="."', 'href=".."')
            .replaceAll("href='.'", 'href=".."')
            .replaceAll("Back to demo list", 'Back to docs')
        const dstPath = `docs/demos/${basename(srcPath)}`
        const relPath = `../../../${dstPath}`
        console.log(`updating ${dstPath}`)
        writeFileSync(dstPath, content)
    }
    for (const srcPath of globSync('dist/*').sort()) {
        const dstPath = `docs/demos/lib/${basename(srcPath)}`
        const relPath = `../../../${dstPath}`
        console.log(`updating ${dstPath}`)
        copyFileSync(srcPath, dstPath)
    }
}

main()
