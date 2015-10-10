'use strict'
let logger = new Logger('publications')

Meteor.publish('practitioners', () => {return Practitioners.find()})
Meteor.publish('filteredPractitioners', (query) => {
  let selector = {}
  let sort = undefined
  if (!S.isBlank(query)) {
    let reTag = /\[[^\]]*\]/g
    let queryWithoutTags = ''
    let tags = []
    let offset = 0
    while (true) {
      let m = reTag.exec(query)
      if (m == null) {
        break
      }

      let tag = trimWhitespace(m[0].slice(1, -1))
      tags.push(tag)
      queryWithoutTags += ' ' + query.slice(offset, m.index)
      let offset = reTag.lastIndex
    }

    queryWithoutTags += ' ' + query.slice(offset)
    queryWithoutTags = trimWhitespace(queryWithoutTags.replace(/\s+/g, ' '))

    logger.debug('Filtering practitioners')
    if (!S.isBlank(queryWithoutTags)) {
      logger.debug(`Query: '${queryWithoutTags}'`)
      selector.$text = {'$search': queryWithoutTags,}
      sort = {
        //Project each document to include a property named 'score', which contains the document's
        //search rank
        fields: {
          score: { $meta: 'textScore', },
        },
        // Indicates that we wish the publication to be sorted by document score
        sort: {
          score: { $meta: 'textScore', },
        },
      }
    }
    if (!R.isEmpty(tags)) {
      logger.debug('Tags:', tags)
      selector.tags = {$all: tags,}
    } else {
      logger.debug('No tags')
    }
  } else {
    logger.debug('Searching without query')
  }
  return Practitioners.find(selector, sort)
})
