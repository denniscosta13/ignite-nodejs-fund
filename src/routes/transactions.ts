//aqui separamos nossas rotas para outro arquivo, escrevendo uma função que chamamos de 'plugin'
//exportamos essa funcao async com as rotas dentro dela e importamos essa funcao no server.ts

//import para definir o tipo de app (parametro do plugin)
import { FastifyInstance } from "fastify"
import { z } from "zod"
//importar de database e nao de knex diretamente
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middleware/sessionIdValidation"


export async function transactionsRoutes(app: FastifyInstance) {

    //nao vai ser aplicado aqui, mantive para fins didaticos
    //adiciona um hook ou prehandle global que vai ser aplicado em todas as rotas dentro do plugin
    //como post foge da regra, o melhor e manter o prehandle individual em cada rota
    // caso colocarmos ele no server.ts antes de registrar os  plugins, ele servira pra qualquer rota
    // e nao apenas pra um plugin especifico
    app.addHook('preHandler', async(request, response) => {
        // nesse caso, da um console.log em toda rota executada
        // esse hook global pode ser interessante pra tratar errors, por exemplo
        console.log(`[${request.method}] ${request.url}`);
        
    })

    // passamos o middleware para o preHandle
    // passamos num array porque podemos utilizar mais de um middleware
    // antes de chegar no handler da rota, ele vai executar o prehandle/middleware
    // nao passamos parametros porque ele esta no contexto da requisicao e ja pega request e response
    app.get('/', { preHandler: [checkSessionIdExists] } , async (request, response) => {
        
        //recupera o cookie salvo no navegado
        //cookie definido quando chama POST /
        const { sessionId } = request.cookies

        const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select()

        //return { transactions }
        return response
            .status(200)
            .send({ transactions })
    })

    app.get('/:id',  { preHandler: [checkSessionIdExists] } , async (request, response) => {
        
        //recupera o cookie salvo no navegado
        //cookie definido quando chama POST /
        const { sessionId } = request.cookies

        // validacao usando zod para verificar se o parametro da url está no formato correto
        const requestTransactionParams = z.object({
            id: z.string().uuid(),
        })


        const { id } = requestTransactionParams.parse(request.params)

        const transactions = await knex('transactions')
            .where({
                id,
                session_id: sessionId
            })
            // select retorna um array, first retorna o primeiro valor, qunado queremos filtrar por id
            // utilizamos o first para retornar o primeiro valor e não correr risco de retorno duplicado
            // acredito que é possível validar se o retorno é unico
            .first() 

        //return { transactions }
        return response
            .status(200)
            .send({ transactions })
    })

    app.get('/summary',  { preHandler: [checkSessionIdExists] } , async (request, response) => {
        
        //recupera o cookie salvo no navegado
        //cookie definido quando chama POST /
        const { sessionId } = request.cookies

        //sum para somar o campo amounte e obter o saldo final da conta
        //first() para retorna apenas o primeiro e se livrar do array
        /// como nesse caso é um sum() simples, só vai ter 1 registro de retorno SEMPRE
        /// as: renomeia o nome da coluna e retorna esse nome como chave do objeto-valor
        const summary = await knex('transactions')
            .where('session_id', sessionId)
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
        
        //recupera o sessionId salvo por cookies
        let sessionId = request.cookies.sessionId

        //caso a linha de cima nao encontre ela sera undefined e entrara no if
        if(!sessionId) {
            //gera uuid para criar o sessionId
            sessionId = randomUUID()

            //adiciona a response o cookie, por sua vez o cookie vai acompanhar as proximas requests sempre que disponivel
            //primeiro parametro e o nome do cookie, segundo o valor do cookie que criamos com uuid
            //terceiro parametro e o objeto com o path que o cookie fica disponivel ('/')
            /// nao leva em conta que aqui estamos dentro de /transactions
            // max age e a duracao do cookie em seconds
            response.cookie('sessionId', sessionId, {
                path: '/',
                maxAge:  60 * 60 * 24 * 7 //7 days
            })
            //os cookie sao enviados automaticamente, nao precisamos passar eles em nenhum outro lugar
            //assim que criarmos uma transacao ele ficara salvo no navegador de acordo com o maxAge
            //no path que determinamos e na url da aplicacao e acompanhara as proximas requests
        }

        await knex('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : (amount * -1),
                session_id: sessionId
            })

        return response.status(201).send()
    })
}