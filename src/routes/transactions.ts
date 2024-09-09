//aqui separamos nossas rotas para outro arquivo, escrevendo uma função que chamamos de 'plugin'
//exportamos essa funcao async com as rotas dentro dela e importamos essa funcao no server.ts

//import para definir o tipo de app (parametro do plugin)
import { FastifyInstance } from "fastify"
import { z } from "zod"
//importar de database e nao de knex diretamente
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {
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