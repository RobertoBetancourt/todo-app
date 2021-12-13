const { hash, compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const Mutation = {
  signUp: async (_parent, args, context) => {
    const { name, email, password } = args.data
    const hashedPassword = await hash(password, 10)

    const user = await context.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user
    }
  },
  login: async (_parent, args, context) => {
    const { email, password } = args.data

    const user = await context.prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('No se encontró el email. Intenta nuevamente')
    }

    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      throw new Error('La contraseña no es correcta. Intenta nuevamente.')
    }

    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user
    }
  },
  upsertToDo: async (_parent, args, context) => {
    const { id, title, content, dueDate } = args.data

    let toDo = null
    if (id) {
      toDo = await context.prisma.toDo.update({
        where: { id },
        data: {
          title,
          content,
          dueDate: new Date(dueDate)
        }
      })
    } else {
      const userId = getUserId(context)
      toDo = await context.prisma.toDo.create({
        data: {
          title,
          content,
          completed: false,
          dueDate: new Date(dueDate),
          author: {
            connect: { id: userId }
          }
        }
      })
    }

    return toDo
  },
  deleteToDo: async (_parent, args, context) => {
    const { id } = args.data

    const toDo = await context.prisma.toDo.update({
      where: { id },
      data: { active: false }
    })

    return toDo
  },
  toggleToDoCompleted: async (_parent, args, context) => {
    const { id, completedDate } = args.data

    const toDo = await context.prisma.toDo.findUnique({
      where: { id }
    })

    const toggledToDo = context.prisma.toDo.update({
      where: { id },
      data: {
        completed: !toDo.completed,
        completedDate: toDo.completed ? null : completedDate
      }
    })

    return toggledToDo
  }
}

module.exports = {
  Mutation
}
