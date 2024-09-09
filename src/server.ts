import fastify from "fastify";

//importar de database e nao de knex diretamente
import { knex } from "./database"
import { randomUUID } from "node:crypto";
import { env } from "./env";

//importamos nosso 'plugin' que contem as rotas do nosso app, nesse caso é o plugin da transactions
//caso seja necessário, a ordem pode fazer diferença
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

//utilizamos o app.register para ler o plugin que contem nossas rotas
app.register(transactionsRoutes)

app.listen({
    port: env.PORT,
}).then(() => console.log('Server running'));
