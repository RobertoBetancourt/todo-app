// Asserting and testing tools
const { beforeAll, afterAll, describe, test } = require('@jest/globals')
const { assert } = require('chai')
// Client
const { createGraphQLClient } = require('./client')
// Mutations
const { LOGIN, SIGN_UP, UPSERT_TODO, TOGGLE_TODO_COMPLETED } = require('./mutations')
// Prisma Client
const { PrismaClient } = require('@prisma/client')
// Utils
const { clearData } = require('./testUtils')

describe('Test application', () => {
  const prisma = new PrismaClient()

  beforeAll(async () => {
    await clearData(prisma)
  })

  afterAll(async () => {
    await clearData(prisma)
  })

  describe('Test sign up', () => {
    let client = null
    beforeAll(async () => {
      client = createGraphQLClient()
    })

    test('Test successful sign up', async () => {
      const variables = {
        data: {
          email: 'alice@mail.com',
          name: 'Alice',
          password: '12341234'
        }
      }

      const { signUp: { user } } = await client.request(SIGN_UP, variables)

      assert.strictEqual(user.name, 'Alice')
      assert.strictEqual(user.email, 'alice@mail.com')
    })

    test('Test failed sign up', async () => {
      const variables = {
        data: {
          email: 'alice@mail.com',
          name: 'Alice',
          password: '12341234'
        }
      }

      try {
        await client.request(SIGN_UP, variables)
      } catch (e) {
        const errorMessage = e.response.errors[0].message
        assert.strictEqual(errorMessage, 'El email ya se encuentra registrado.')
      }
    })
  })

  describe('Test login', () => {
    let client = null
    beforeAll(async () => {
      client = createGraphQLClient()

      const variables = {
        data: {
          email: 'john@mail.com',
          password: '12341234',
          name: 'John'
        }
      }

      await client.request(SIGN_UP, variables)
    })

    test('Test successful login', async () => {
      const variables = {
        data: {
          email: 'john@mail.com',
          password: '12341234'
        }
      }

      const { login: { user } } = await client.request(LOGIN, variables)

      assert.strictEqual(user.name, 'John')
      assert.strictEqual(user.email, 'john@mail.com')
    })

    test('Test failed login', async () => {
      const variables = {
        data: {
          email: 'john@mail.com',
          password: '98769876'
        }
      }

      try {
        await client.request(LOGIN, variables)
      } catch (e) {
        const errorMessage = e.response.errors[0].message
        assert.strictEqual(errorMessage, 'La contraseña no es correcta. Intenta nuevamente.')
      }
    })
  })

  describe('Test to-do', () => {
    let token = null
    let upsertedToDo = null
    beforeAll(async () => {
      const client = createGraphQLClient()

      const variables = {
        data: {
          email: 'peter@mail.com',
          password: '24682468',
          name: 'Peter'
        }
      };

      ({ signUp: { token } } = await client.request(SIGN_UP, variables))
    })

    test('Test upsert to-do', async () => {
      const client = createGraphQLClient(token)

      const variables = {
        data: {
          title: 'Título 1',
          dueDate: new Date(2021, 12, 20),
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus venenatis et ante sed iaculis.'
        }
      };

      ({ upsertToDo: upsertedToDo } = await client.request(UPSERT_TODO, variables))

      assert.strictEqual(upsertedToDo.title, 'Título 1')
      assert.strictEqual(upsertedToDo.content, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus venenatis et ante sed iaculis.')
      assert.strictEqual(upsertedToDo.completed, false)
    })

    test('Test toggle to-do completed', async () => {
      const client = createGraphQLClient(token)

      const variables = {
        data: {
          id: upsertedToDo.id,
          completedDate: new Date(2021, 12, 14)
        }
      }

      const { toggleToDoCompleted } = await client.request(TOGGLE_TODO_COMPLETED, variables)

      assert.strictEqual(toggleToDoCompleted.id, upsertedToDo.id)
      assert.strictEqual(toggleToDoCompleted.title, 'Título 1')
      assert.strictEqual(toggleToDoCompleted.completed, true)
    })
  })
})
