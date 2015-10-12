'use strict'
let logger = new Logger('SearchService')

class SearchService {
  static search(query, axis) {
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

  static clearSearch() {
    let axis = Session.get('searchQuery').axis
    let queryObj = {}
    if (axis != null) {
      queryObj.axis = axis
    }
    Router.go('home', {}, {query: queryObj})
  }
}
this.SearchService = SearchService
