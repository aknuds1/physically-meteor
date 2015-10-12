'use strict'
let logger = new Logger('explore')

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
  SearchService.search({query: query.query, axis: axis})
  return false
  // logger.debug(`Setting searchQuery: '${query.query}', axis: '${query.axis}'`)
  // Session.set('searchQuery', {query: query.query, axis: axis})
  // showSearchAxisPicker(false, template)
  // logger.debug(`Selected axis '${axis}'`)
  // let axisItems = template.find('#search-axis-picker ul').children
  // R.forEach((item) => {
  //   if (item.id === `search-axis-${axis}`) {
  //     item.classList.add('selected')
  //   } else {
  //     item.classList.remove('selected')
  //   }
  // }, axisItems)
  // let iconElem = template.find('#search-axis-toggler-icon')
  // let iconClass = R.filter((cls) => {
  //   return /^icon-.+$/.test(cls)
  // }, iconElem.classList)[0]
  // iconElem.classList.remove(iconClass)
  // iconElem.classList.add(axis2Icon[axis])
  // return false
}

let getSearchAxis = () => {
   return Session.get('searchQuery').axis || 'all'
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
  fullName: function () {
    return S.join(' ', this.names)
  },
  searchAxisPickerClass: () => {
    let selectedAxis = getSearchAxis()
    return `icon-${axis2Icon[selectedAxis]}`
  },
})
Template.explore.events({
  'input #explore-search-input': (event) => {
    let searchQuery = trimWhitespace(event.target.value)
    logger.debug('Input, setting searchQuery:', searchQuery)
    Session.set('explore.searchQuery', searchQuery)
    return false
  },
  'keyup #explore-search-input': (event) => {
    if (event.keyCode === 13) {
      SearchService.search({query: Session.get('explore.searchQuery'), axis: Session.get('searchQuery').axis})
    }
  },
  'click #explore-clear-search': () => {
    logger.debug('Clear search')
    Session.set('explore.searchQuery', null)
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
