const { Query } = require('./Query')
const { Mutation } = require('./Mutation')
const { User } = require('./User')
const { ToDo } = require('./ToDo')

const resolvers = {
  Query,
  Mutation,
  User,
  ToDo
}

module.exports = {
  resolvers
}
