'use strict'
let logger = new Logger('explore')

let showSearchAxisPicker = (show, template) => {
  let axisPicker = template.find('#search-axis-picker')
  let axisToggler = template.find('#search-axis-toggler')
  TemplateVar.set('showSearchAxisPicker', show)
  if (show) {
    logger.debug('Showing search axis picker')
    axisPicker.classList.remove('hidden')
    axisToggler.style['border-bottom-left-radius'] = 0
  } else {
    logger.debug('Hiding search axis picker')
    axisPicker.classList.add('hidden')
    axisToggler.style['border-bottom-left-radius'] = 4
  }
}

function selectSearchAxis(axis, event, template) {
  TemplateVar.set('searchAxis', axis)
  showSearchAxisPicker(false, template)
  logger.debug(`Selected axis '${axis}'`)
  let axisItems = template.find('#search-axis-picker ul').children
  R.forEach((item) => {
    if (item.id === `search-axis-${axis}`) {
      item.classList.add('selected')
    } else {
      item.classList.remove('selected')
    }
  }, axisItems)
  return false
}

Template.explore.helpers({
  isEmpty: () => {
    return Practitioners.findOne() == null
  },
  hasSearchQuery: () => {
    return !S.isBlank(trimWhitespace(Session.get('explore.searchQuery')))
  },
  searchQuery: () => {
    return Session.get('explore.searchQuery')
  },
  practitioners: () => {
    return Practitioners.find({}, {sort: [['created', 'desc']]})
  },
  searchAxis: () => {
    let searchAxis = TemplateVar.get('searchAxis')
    if (searchAxis === 'all') {
      return ''
    } else if (searchAxis === 'people') {
      return ' for people'
    } else if (searchAxis === 'specialties') {
      return ' for specialties'
    }
  },
})
Template.explore.events({
  'input #explore-search-input': (event) => {
    Session.set('explore.searchQuery', trimWhitespace(event.target.value))
  },
  'keyup #explore-search-input': (event) => {
    if (event.keyCode === 13) {
      SearchService.search(Session.get('explore.searchQuery'))
    }
  },
  'click #explore-clear-search': () => {
    logger.debug('Clear search')
    Session.set('explore.searchQuery', '')
    document.getElementById('explore-search-input').focus()
  },
  'click #search-axis-toggler': (event, template) => {
    let showPicker = !TemplateVar.get('showSearchAxisPicker')
    TemplateVar.set('showSearchAxisPicker', showPicker)
    showSearchAxisPicker(showPicker, template)
    return false
  },
  'click #search-axis-all': R.partial(selectSearchAxis, 'all'),
  'click #search-axis-people': R.partial(selectSearchAxis, 'people'),
  'click #search-axis-specialties': R.partial(selectSearchAxis, 'specialties'),
})
