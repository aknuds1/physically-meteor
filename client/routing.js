'use strict'
let logger = new Logger('Routing')

Router.route('/', function () {
  Session.set('searchQuery', this.params.query.query)
  this.render('explore')
}, {
  name: 'home',
  // waitOn: () => { return Meteor.subscribe('filteredProjects', Session.get('searchQuery')) },
})
