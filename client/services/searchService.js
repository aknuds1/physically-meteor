'use strict'
let logger = new Logger('SearchService')

class SearchService {
  static search(query) {
    logger.debug(`Searching for '${query}'`)
    Router.go('home', {}, !S.isBlank(query) ? {query: `query=${query}`,} : {})
  }
}
this.SearchService = SearchService
