'use strict'
this.Practitioners = new Mongo.Collection('practitioners')
if (Meteor.isServer) {
  Practitioners._ensureIndex({
    name: 'text',
  })
}
