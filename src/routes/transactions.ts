//aqui separamos nossas rotas para outro arquivo, escrevendo uma função que chamamos de 'plugin'
//exportamos essa funcao async com as rotas dentro dela e importamos essa funcao no server.ts

//import para definir o tipo de app (parametro do plugin)
import { FastifyInstance } from "fastify"

//importar de database e nao de knex diretamente
import { knex } from "../database"

export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/hello', async () => {
        const transactions = await knex('transactions')
            .where('amount', 1000)
            .select('*')
    
        return transactions
    })
}