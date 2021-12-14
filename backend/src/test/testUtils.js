async function clearData (prisma) {
  const users = await prisma.user.findMany({})
  const toDos = await prisma.toDo.findMany({})

  const deleteUser = async (user) => {
    return await prisma.user.delete({
      where: { id: user.id }
    })
  }
  const deleteToDo = async (toDo) => {
    return await prisma.toDo.delete({
      where: { id: toDo.id }
    })
  }

  const deleteToDos = async () => {
    return Promise.all(toDos.map((toDo) => deleteToDo(toDo)))
  }

  const deleteUsers = async () => {
    return Promise.all(users.map((user) => deleteUser(user)))
  }

  await deleteToDos()
  await deleteUsers()
}

module.exports = {
  clearData
}
