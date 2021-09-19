export default class Parser {
  private stack: string[] = []
  private errors: string[] = []
  private currentTagName: string = ''
  private state: Function

  constructor() {
    this.state = this.stateDefault
  }

  public parseSentence(sentence: string): string {
    for (let i = 0; i < sentence.length; i++) {
      const currentChar = sentence[i]

      this.state(currentChar)
    }

    if (this.stack.length > 0) {
      this.errors.push(`Expected </${this.stack.pop()}> found #`)
    }

    if (this.errors.length > 0) {
      // Need to return the first unmatched tag, so the first error that occurs
      return this.errors[0]
    } else {
      return 'Correctly tagged paragraph'
    }
  }

  private stateDefault = (char: string): void => {
    if (char === '<') {
      this.state = this.stateOpenTag
      this.currentTagName = ''
    }
  }

  private stateOpenTag = (char: string): void => {
    if (this.currentTagName === '' && char === '/') {
      this.state = this.stateClosingTag
    } else if (char === '>') {
      if (this.validTagName(this.currentTagName)) {
        console.log(`Adding valid tag ${this.currentTagName} to stack`)
        this.stack.push(this.currentTagName)
        this.currentTagName = ''
      } else {
        console.log(`Discarding invalid tag ${this.currentTagName}`)
      }
      this.state = this.stateDefault
    } else {
      this.currentTagName += char
    }
  }

  private stateClosingTag = (char: string): void => {
    if (char === '>') {
      if (this.validTagName(this.currentTagName)) {
        const expectedString = this.stack.pop()
        if (expectedString !== this.currentTagName) {
          console.log(`Expected </${expectedString}> found </${this.currentTagName}>`)
          this.errors.push(
            `Expected ${this.wrapClosingTag(expectedString)} found ${this.wrapClosingTag(this.currentTagName)}`
          )
        }
        this.currentTagName = ''
      }
      this.state = this.stateDefault
    } else {
      this.currentTagName += char
    }
  }

  private wrapClosingTag(tag: string | undefined) {
    if (tag === undefined || !this.validTagName(tag)) return '#'
    return `</${tag}>`
  }

  private validTagName = (tag: string): boolean => {
    console.log(`Valid tag ${tag}: length ${tag.length === 1} and match ${!!tag.match(/[A-Z]/)}`)
    return tag.length === 1 && !!tag.match(/[A-Z]/)
  }
}
