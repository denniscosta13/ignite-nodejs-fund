// import fastify from "fastify";

// //importar de database e nao de knex diretamente
// import { knex } from "./database"
// import { randomUUID } from "node:crypto";
import { env } from "./env";

//importa o app configurado no app.ts
import { app } from "./app";

// //importamos nosso 'plugin' que contem as rotas do nosso app, nesse caso é o plugin da transactions
// import { transactionsRoutes } from "./routes/transactions";
// import cookie from "@fastify/cookie"; //plugin de cookie npm i @fastify/cookie

// const app = fastify();

// //utilizamos o app.register para ler o plugin que contem nossas rotas
// //prefix define qual o endpoint padrao dessas rotas, nesse caso transaction
// //dentro do plugin, passa nao ser necessario informar transaction
// //apenas do transaction em diante /, /:id etc

// //caso seja necessário, a ordem pode fazer diferença
// app.register(cookie)
// app.register(transactionsRoutes, {
//     prefix: 'transactions'
// })

app.listen({
    port: env.PORT,
}).then(() => console.log('Server running'));
