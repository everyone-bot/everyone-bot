import { escape } from '../escapeMarkdown'

describe('escapeMarkdown tests', () => {
  it('should escape all of the required characters', () => {
    const test =
      'In all other places characters _*[]()~`>#+-=|{}.! must be escaped'

    const escaped = escape(test)

    expect(escaped).toEqual(
      'In all other places characters \\_\\*\\[\\]\\(\\)\\~\\`\\>\\#\\+\\-\\=\\|\\{\\}\\.\\! must be escaped'
    )
  })
})
