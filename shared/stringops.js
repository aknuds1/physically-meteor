'use strict'
this.trimWhitespace = (str) => {
  return S.trim(null, str || '')
}
this.escapeHtml = (str) => {
  div = document.createElement('div')
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}
