'use strict'
let logger = new Logger('publications')

Meteor.publish('practitioners', () => {return Practitioners.find()})
Meteor.publish('filteredPractitioners', (options) => {
  let selector = {}
  let sort = undefined
  let {query, axis} = options || {}
  axis = axis || 'all'
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
      logger.debug(`Query: '${queryWithoutTags}', axis: '${axis}'`)
      let selectors = []
      let queryArray = new RegExp(S.join('|', S.words(queryWithoutTags)), 'i')
      logger.debug('queryArray', queryArray)
      if (axis === 'all' || axis === 'people') {
        selectors.push({names: {$regex: queryArray}})
      } if (axis === 'all' || axis === 'specialties') {
        selectors.push({specialties: {$regex: queryArray}})
      }
      selector = {
        $or: selectors,
      }
    }
  } else {
    logger.debug('Searching without query')
  }
  logger.debug('Selector:', selector)

  return Practitioners.find(selector)
})
