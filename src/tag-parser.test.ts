import TagParser from './tag-parser'

test('Empty string', () => {
  const parser = new TagParser()
  expect(parser.parseSentence('')).toBe('Correctly tagged paragraph')
})

test('Unrelated tags', () => {
  const parser = new TagParser()
  expect(parser.parseSentence('<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence')).toBe(
    'Correctly tagged paragraph'
  )
})

test('Tags nested the wrong way', () => {
  const parser = new TagParser()
  expect(
    parser.parseSentence('<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>')
  ).toBe('Expected </C> found </B>')
})

test('Extra closing tag', () => {
  const parser = new TagParser()
  expect(parser.parseSentence('<B>This should be in boldface, but there is an extra closing tag</B></C>')).toBe(
    'Expected # found </C>'
  )
})

test('Missing closing tag', () => {
  const parser = new TagParser()
  expect(
    parser.parseSentence('<B><C>This should be centred and in boldface, but there is a missing closing tag</C>')
  ).toBe('Expected </B> found #')
})
