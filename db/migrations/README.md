# Scripts

Foi adicionado ao script o seguinte:

```js
    "knex": "node --import tsx ./node_modules/knex/bin/cli.js"
```

Assim é possível utilizar o tsx junto com knex ao executar `npm run knex`

Para criar uma migration utilizamos o seguinte comando no terminal:
`npm run knex -- migrate:make create-transactions`

> Obs.: `--` após o knex serve para passar argumentos ao knex ao inves do npm

## Executar migrations mais recente

```sh
npm run knex -- migrate:latest
```

## Migration

Caso uma migration seja executada, nao podemos alterar ela, pois ela vai estar registrada no banco de dados.
Para editar algo da tabela, etc, criamos outra migration fazendo a alteração, dessa forma o banco de dados vai ler sequencialmente as migrations até compor o schema correto e atual do banco de dados.

Se apenas nós executamos e outras pessoas do time(caso hipotetico) ainda não tenham recebido ou executado essa migration, podemos fazer o rollback e alterar ela.

```sh
npm run knex -- migrate:rollback
```

### Migration para adicionar coluna

Podemos criar uma migration para adicionar ou fazer alguma alteração na migration, caso não seja possível o rollback

`npm run knex -- migrate:make add-session-id-to-transactions`

Feito isso escrevemos a logica no **UP** e o que fazer em casos de erro ou rollback no **DOWN**