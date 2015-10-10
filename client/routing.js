'use strict'
let logger = new Logger('Routing')

Router.configure({
  layoutTemplate: 'layout',
  // loadingTemplate: 'loading',
  trackPageView: true,
})
Router.route('/', function () {
  Session.set('searchQuery', this.params.query.query)
  this.render('explore')
}, {
  name: 'home',
  waitOn: () => { return Meteor.subscribe('filteredPractitioners', Session.get('searchQuery')) },
})
