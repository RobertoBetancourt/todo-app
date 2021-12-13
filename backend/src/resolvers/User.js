const User = {
  toDos: (parent, _args, context) => {
    return context.prisma.user
      .findUnique({
        where: { id: parent.id }
      })
      .toDos()
  }
}

module.exports = {
  User
}
