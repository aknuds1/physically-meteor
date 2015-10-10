'use strict'
let logger = new Logger('explore')

Template.explore.helpers({
  isEmpty: () => {
    return true
  },
  hasSearchQuery: () => {
    return !S.isBlank(trimWhitespace(Session.get('explore.searchQuery')))
  },
  searchQuery: () => {
    return Session.get('explore.searchQuery')
  },
})
Template.explore.events({
  'input #explore-search-input': (event) => {
    Session.set('explore.searchQuery', trimWhitespace(event.target.value))
  },
  'keyup #explore-search-input': (event) => {
    if (event.keyCode === 13) {
      // searchService.search(Session.get('explore.searchQuery'))
    }
  },
  'click #explore-clear-search': () => {
    logger.debug('Clear search')
    Session.set('explore.searchQuery', '')
    document.getElementById('explore-search-input').focus()
  },
})
