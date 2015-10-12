'use strict'
let logger = new Logger('Routing')

Router.configure({
  layoutTemplate: 'layout',
  // loadingTemplate: 'loading',
  trackPageView: true,
})
Router.route('/', function () {
  logger.debug(`Setting search query`)
  Session.set('searchQuery', {query: this.params.query.query, axis: this.params.query.axis})
  this.render('explore')
}, {
  name: 'home',
  // waitOn: () => { return Meteor.subscribe('filteredPractitioners', Session.get('searchQuery')) },
})
