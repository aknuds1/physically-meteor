'use strict'
let logger = new Logger('SearchService')

class SearchService {
  static search(options) {
    options = options || {}
    let {query, axis} = options
    query = query || ''
    axis = axis || ''
    logger.debug(`Searching for '${query}' along axis ${axis}`)
    let queryObj = {}
    if (!S.isBlank(query)) {
      queryObj.query = query
    }
    if (!S.isBlank(axis)) {
      queryObj.axis = axis
    }
    logger.debug('queryObj:', queryObj)
    Router.go('home', {}, {query: queryObj})
  }
}
this.SearchService = SearchService
