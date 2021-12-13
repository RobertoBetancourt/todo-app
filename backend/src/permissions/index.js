const { rule, and, shield } = require('graphql-shield')
const { getUserId } = require('../utils')

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context) => {
    const verifiedToken = getUserId(context)
    return Boolean(verifiedToken)
  }),
  isToDoOwner: rule()(async (_parent, args, context) => {
    const { id } = args.data
    const userId = getUserId(context)
    const author = await context.prisma.toDo
      .findUnique({
        where: { id }
      })
      .author()
    return userId === author.id
  })
}

const permissions = shield({
  Query: {
    getAllToDos: rules.isAuthenticatedUser
  },
  Mutation: {
    upsertToDo: rules.isAuthenticatedUser,
    toggleToDoCompleted: rules.isToDoOwner
  }
}, { debug: true })

module.exports = {
  permissions
}
