import type { Knex } from "knex";

//up - quando sobe a migrations, o que fazer
//nesse caso criar a tabela transactions com id UUID primario e coluna title nao nula
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary()
        table.text('title').notNullable()
        table.decimal('amount', 10, 2)
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

//down - caso de algum erro no processo, desfaz o que foi feito
//dropa a tabela transactions caso ela exista
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions')
}

