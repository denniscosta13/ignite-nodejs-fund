import 'dotenv/config'

// instalamos o knex com o sqlite3
// npm install knex sqlite3
// instalado em producao mesmo, a vantagem das queries do knex é que se trocamos o banco de dados elas se mantem a mesma
import { knex as setup_knex, Knex } from "knex";

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: process.env.DATABASE_URL!
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex = setup_knex(config)
