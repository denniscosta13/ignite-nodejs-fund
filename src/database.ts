// instalamos o knex com o sqlite3
// npm install knex sqlite3
// instalado em producao mesmo, a vantagem das queries do knex é que se trocamos o banco de dados elas se mantem a mesma
import { knex as setup_knex, Knex } from "knex";

//importa o env que tratamos com o ZOD
import { env } from './env'

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === 'sqlite' ? {
        filename: env.DATABASE_URL, //nao da erro quando validamos com o zod
    } : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex = setup_knex(config)
