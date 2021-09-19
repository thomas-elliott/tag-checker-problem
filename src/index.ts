import TagParser from './tag-parser'
import fs from 'fs'
import * as ReadLine from 'readline'
;(function main(): void {
  const args = process.argv.slice(2)

  if (args.length > 0) {
    processFile(args[0])
  } else {
    consoleInput()
  }
})()

function processFile(fileName: string): void {
  const file = fs.readFileSync(fileName, 'utf-8')
  parseParagraph(file)
}

function consoleInput(): void {
  const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question(`Enter paragraph (enter or 'exit' to quit): `, (paragraph) => {
    if (paragraph.toLowerCase() === '' || paragraph.toLowerCase() === 'exit') {
      rl.close()
      return
    } else {
      parseParagraph(paragraph)
      // Must close the current listener before calling function again to avoid stack overflow
      rl.close()
      consoleInput()
    }
  })
}

function parseParagraph(paragraph: string): void {
  const parser = new TagParser()

  console.log(parser.parseSentence(paragraph))
}
