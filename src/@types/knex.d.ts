// extensao .d.ts - definicao de tipos
//somento codigo que o typescript entende - nao tem javascript

//documentation: https://knexjs.org/guide/#typescript

//definimos a estrutura da tabelas que trabalhamos, assim ao escrever o codigo
//ele conseguir verificar as colunas e tipos das tabelas registradas aqui
//isso ajuda e facilia ao escrever o código
//typescript binding

import { Knex } from 'knex'

//essa interface vem em branco por padrao
declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amount: number
            created_at: string
            session_id?: string
        }
    }
}