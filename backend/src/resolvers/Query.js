const { getUserId } = require('../utils')

const Query = {
  getAllToDos: async (_parent, _args, context) => {
    const userId = getUserId(context)
    const userToDos = await context.prisma.user
      .findUnique({
        where: {
          id: userId
        }
      })
      .toDos({
        where: {
          active: true
        },
        orderBy: {
          dueDate: 'asc'
        }
      })

    return userToDos
  },
  getToDo: async (_parent, args, context) => {
    const { id } = args.data

    const toDo = await context.prisma.toDo.findUnique({
      where: {
        id
      }
    })

    return toDo
  }
}

module.exports = {
  Query
}
