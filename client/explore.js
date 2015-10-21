'use strict'
let logger = new Logger('explore')

let searchTimeoutHandle = null

let showSearchAxisPicker = (show, template) => {
  let axisPicker = template.find('#search-axis-picker')
  let axisToggler = template.find('#search-axis-toggler')
  TemplateVar.set('showSearchAxisPicker', show)
  if (show) {
    logger.debug('Showing search axis picker')
    axisPicker.classList.remove('hidden')
    axisToggler.style['border-bottom-left-radius'] = '0px'
  } else {
    logger.debug('Hiding search axis picker')
    axisPicker.classList.add('hidden')
    axisToggler.style['border-bottom-left-radius'] = '4px'
  }
}

let axis2Icon = {
  'all': 'menu3',
  'people': 'user',
  'specialties': 'pulse2',
}

function selectSearchAxis(axis, event, template) {
  let router = Router.current()
  let query = router.params.query
  showSearchAxisPicker(false, template)
  SearchService.search(query.query, axis)
  return false
}

let getSearchAxis = () => {
   return Session.get('searchQuery').axis || 'all'
}

Template.explore.helpers({
  isEmpty: () => {
    return R.isEmpty(Practitioners)
  },
  hasSearchQuery: () => {
    return !S.isBlank(trimWhitespace(Session.get('searchQuery').query))
  },
  searchQuery: () => {
    return Session.get('searchQuery').query
  },
  practitioners: () => {
    let query = Session.get('searchQuery')
    let axis = query.axis
    let searchTerms = S.words(query.query || '')
    logger.debug(`Search terms of ${query.query}:`, searchTerms)
    let reSearchTerms = new RegExp(`${S.join('|', searchTerms)}`, 'i')
    let mappedPractitioners = R.addIndex(R.map)((p, i) => {
      return R.merge(p, {id: i})
    }, Practitioners)
    return R.sortBy((p) => {return p.name},
      R.filter((p) => {
        let matches = false
        if (axis === 'all' || axis === 'people') {
          logger.debug('Matching on people')
          let names = S.words(p.name)
          matches |= R.any((name) => {return reSearchTerms.test(name)}, names)
        }
        if (axis === 'all' || axis === 'specialties') {
          logger.debug('Matching on specialties')
          matches |= R.any((specialty) => {return reSearchTerms.test(specialty)}, p.areas)
        }
        return matches
      }, mappedPractitioners))
  },
  specialtiesStr: function () {
    return S.join(', ', this.areas)
  },
  institute: () => {
    return 'NIMI'
  },
  searchAxis: () => {
    let searchAxis = Session.get('searchQuery').axis
    if (searchAxis === 'all') {
      return ''
    } else if (searchAxis === 'people') {
      return ' for people'
    } else if (searchAxis === 'specialties') {
      return ' for specialties'
    }
  },
  searchAxisItems: () => {
    let selectedAxis = Session.get('searchQuery').axis
    logger.debug(`Computing searchAxisItems, selected axis: '${selectedAxis}'`)
    return R.map((obj) => {
      let itemAxis = obj.title.toLowerCase()
      return {
        title: obj.title,
        id: `search-axis-${itemAxis}`,
        itemClass: itemAxis === selectedAxis ? `selected` : '',
        iconClass: obj.icon != null ? `icon-${obj.icon}` : '',
      }
    }, [
      {
        title: 'All',
      },
      {
        title: 'People',
        icon: 'user',
      },
      {
        title: 'Specialties',
        icon: 'pulse2',
      },
    ])
  },
  searchAxisPickerClass: () => {
    let selectedAxis = getSearchAxis()
    return `icon-${axis2Icon[selectedAxis]}`
  },
})
Template.explore.events({
  'input #explore-search-input': (event) => {
    let searchQuery = trimWhitespace(event.target.value)
    if (searchTimeoutHandle != null) {
      clearTimeout(searchTimeoutHandle)
    }
    searchTimeoutHandle = setTimeout(() => {
      let query = Session.get('searchQuery')
      SearchService.search(searchQuery, query.axis)
    }, 500)
    return false
  },
  'click #explore-clear-search': () => {
    logger.debug('Clear search')
    SearchService.clearSearch()
    document.getElementById('explore-search-input').focus()
  },
  'click #search-axis-toggler': (event, template) => {
    let showPicker = !TemplateVar.get('showSearchAxisPicker')
    showSearchAxisPicker(showPicker, template)
    return false
  },
  'click #search-axis-all': R.partial(selectSearchAxis, ['all']),
  'click #search-axis-people': R.partial(selectSearchAxis, ['people']),
  'click #search-axis-specialties': R.partial(selectSearchAxis, ['specialties']),
})
