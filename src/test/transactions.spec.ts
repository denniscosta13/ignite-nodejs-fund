import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest"
import supertest from "supertest"
import { app } from "../app"
import { execSync } from "child_process"

//describe cria uma categoria ou um agrupamento de testes
//podemos criar subcategorias
describe('Transactions routes', () => {
    
    beforeAll( async () => {
        await app.ready()
    })

    beforeEach(() => {
        execSync('npm run knex -- migrate:rollback --all')
        execSync('npm run knex -- migrate:latest')
    })
    
    afterAll(async () => {
        await app.close()
    })
    
    it('should be able to create a new transaction', async () => {
        await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listAllTransactionsResponse = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)
        
        expect(listAllTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })

})