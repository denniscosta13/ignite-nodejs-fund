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

    it('should be able to list a specific transaction', async () => {
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

            
            const transactionId = listAllTransactionsResponse.body.transactions[0].id
            
            const getTransactionResponse = await supertest(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies!)
            .expect(200)
            
        expect(getTransactionResponse.body.transactions).toEqual(
            expect.objectContaining({
                id: transactionId,
                title: 'New transaction',
                amount: 5000,
            })
        )
    })

    it('should be able to get amount transactions summary', async () => {
        const createTransactionResponse = await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'Credit transaction',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        await supertest(app.server)
            .post('/transactions')
            .set('Cookie', cookies!)
            .send({
                title: 'Debit transaction',
                amount: 2000,
                type: 'debit'
            })

        const getTransactionsSummaryResponse = await supertest(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies!)
            .expect(200)
        
        console.log(getTransactionsSummaryResponse.body.summary);
        
        expect(getTransactionsSummaryResponse.body.summary).toEqual(
            {
                amount: 3000,
            }
        )
    })
})