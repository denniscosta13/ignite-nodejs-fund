import fastify from "fastify";

//importar de database e nao de knex diretamente
import { knex } from "./database"
import { randomUUID } from "node:crypto";
import { env } from "./env";

const app = fastify();

app.get('/hello', async () => {
    const transactions = await knex('transactions')
        .where('amount', 1000)
        .select('*')

    return transactions
})

app.listen({
    port: env.PORT,
}).then(() => console.log('Server running'));
