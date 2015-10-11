'use strict'
let logger = new Logger('SearchService')

class SearchService {
  static search(query, axis) {
    query = query || ''
    axis = axis || 'all'
    logger.debug(`Searching for '${query}' along axis ${axis}`)
    Router.go('home', {}, !S.isBlank(query) ? {query: `query=${query}`} : {})
  }
}
this.SearchService = SearchService
