export default class TagParser {
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

      // Switches between states - default, open and closing based on if it detects
      // if it's in a tag or not.
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
      // Closing the tag. Either we found a valid tag and we add to the stack, or it's
      // invalid and we discard it
      if (this.validTagName(this.currentTagName)) {
        this.stack.push(this.currentTagName)
        this.currentTagName = ''
      }
      this.state = this.stateDefault
    } else {
      this.currentTagName += char
    }
  }

  private stateClosingTag = (char: string): void => {
    if (char === '>') {
      const expectedString = this.stack.pop()

      if (this.validTagName(this.currentTagName) && expectedString !== this.currentTagName) {
        this.errors.push(
          `Expected ${this.wrapClosingTag(expectedString)} found ${this.wrapClosingTag(this.currentTagName)}`
        )
      }

      this.currentTagName = ''
      this.state = this.stateDefault
    } else {
      this.currentTagName += char
    }
  }

  private wrapClosingTag(tag: string | undefined): string {
    if (tag === undefined || !this.validTagName(tag)) return '#'
    return `</${tag}>`
  }

  private validTagName = (tag: string): boolean => {
    return tag.length === 1 && !!tag.match(/[A-Z]/)
  }
}
