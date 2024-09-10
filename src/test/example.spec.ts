import { test, beforeAll, afterAll } from "vitest"
import supertest from "supertest"

//importamos o app, que agora esta separado do server, assim ao importar, não subimos o app.listen
//importamos apenas a instancia do app
import { app } from "../app"

beforeAll( async () => {
    await app.ready()
})

afterAll(async () => {
    await app.close()
})

test('O usuário consegue criar uma nova transação', async () => {
    //fazer chamada HTTP p/ criar uma nova transação

    await supertest(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })
        .expect(201)
})