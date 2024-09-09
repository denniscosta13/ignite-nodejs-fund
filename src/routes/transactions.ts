//aqui separamos nossas rotas para outro arquivo, escrevendo uma função que chamamos de 'plugin'
//exportamos essa funcao async com as rotas dentro dela e importamos essa funcao no server.ts

//import para definir o tipo de app (parametro do plugin)
import { FastifyInstance } from "fastify"
import { z } from "zod"
//importar de database e nao de knex diretamente
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', async (request, response) => {
        const transactions = await knex('transactions').select()

        //return { transactions }
        return response
            .status(200)
            .send({ transactions })
    })

    app.get('/:id', async (request, response) => {

        // validacao usando zod para verificar se o parametro da url está no formato correto
        const requestTransactionParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestTransactionParams.parse(request.params)

        const transactions = await knex('transactions')
            .where('id', id)
            // select retorna um array, first retorna o primeiro valor, qunado queremos filtrar por id
            // utilizamos o first para retornar o primeiro valor e não correr risco de retorno duplicado
            // acredito que é possível validar se o retorno é unico
            .first() 

        //return { transactions }
        return response
            .status(200)
            .send({ transactions })
    })

    app.get('/summary', async (request, response) => {
        
        //sum para somar o campo amounte e obter o saldo final da conta
        //first() para retorna apenas o primeiro e se livrar do array
        /// como nesse caso é um sum() simples, só vai ter 1 registro de retorno SEMPRE
        /// as: renomeia o nome da coluna e retorna esse nome como chave do objeto-valor
        const summary = await knex('transactions')
            .sum('amount', { as: 'amount' })
            .first()

        return response
            .status(200)
            .send({ summary })
    })

    app.post('/', async (request, response) => {
        //{ title, amount, type: credit or debit}
        
        //vamos utilizar o zod para definir e validar o campos enviados pelo request !!IMPORTANTE!!
        //essa validacao é importante para que ao salvar no banco de dados, os dados sejam integros
        const requestTransactionBody = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        // caso tenha infos invalidas, ele vai jogar um erro
        const { title, amount, type } = requestTransactionBody.parse(request.body)
    
        await knex('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : (amount * -1)
            })

        return response.status(201).send()
    })
}