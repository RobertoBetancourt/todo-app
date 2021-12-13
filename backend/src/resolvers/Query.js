const { getUserId } = require('../utils')

const Query = {
  getAllToDos: async (_parent, _args, context) => {
    const userId = getUserId(context)
    const userPosts = await context.prisma.user
      .findUnique({
        where: {
          id: userId
        }
      })
      .toDos({
        where: {
          active: true
        }
      })

    return userPosts
  }
}

module.exports = {
  Query
}
