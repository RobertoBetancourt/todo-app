const ToDo = {
  author: (parent, _args, context) => {
    return context.prisma.toDo
      .findUnique({
        where: { id: parent.id }
      })
      .author()
  }
}

module.exports = {
  ToDo
}
