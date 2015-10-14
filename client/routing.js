'use strict'
let logger = new Logger('Routing')

Router.configure({
  layoutTemplate: 'layout',
  // loadingTemplate: 'loading',
  trackPageView: true,
})
Router.route('/', function () {
  logger.debug(`Setting search query`)
  Session.set('searchQuery', {query: this.params.query.query || '',
    axis: this.params.query.axis || 'all'})
  this.render('explore')
}, {
  name: 'home',
  // waitOn: () => { return Meteor.subscribe('filteredPractitioners', Session.get('searchQuery')) },
})
Router.route('/p/:id', function () {
  this.render('practitioner')
}, {
  name: 'practitioner',
  data: function () {
    let id = parseInt(this.params.id)
    return R.addIndex(R.find)((p, i) => {
      return i === id
    }, Practitioners)
  },
})
