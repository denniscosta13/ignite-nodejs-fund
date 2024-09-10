# Testes

## Tipos de Teste

- Unitários: testam pedacinhos da aplicação, como funcões ou pequenas funcionalidades.
- Integração: testam a comunicação entre duas ou mais unidades
- e2e - Ponta a Ponta: simulam um usuário operando na nossa aplicação, são fáceis de serem escritos e testados

## Teste Front vs. Back

No front-end, o ator da aplicação é o usuário final, que irá preencher e enviar formulários, clicar em links, botões etc

No back-end, o ator é o proprio front-end, que irá fazer chamadas HTTP, websockets, etc

## Piramide de testes

Apesar de testes `e2e` serem mais fácil de utilizar, são testes mais lentos. Não que eles demorem muito, 
mas em uma escala maior, isso pode tomar muitos minutos da etapa de teste. Por isso, existe uma pirâmide que desenha como
os testes vão ser distribuídos, em forma de pirâmide:

```  
            ===e2e===
    ====integracao=====
========unitarios=======
```

Muitos testes **unitários**, seguidos de testes de **integração** e poucos testes **e2e**.

## Corpo do teste

- Enunciado - string
- Operação - o que vai fazer
- Validação - feito a operação, a resposta é a esperada?

### package.json
`npm run test / npm test`

```js 
// adicionar ao package.json
"test": "vitest" 
```

## Setup

Para testar as requisições, podemos importar o `app` de server.ts para dentro do arquivo de testes, mas assim que
o teste for iniciado, ele vai subir o app numa porta, nesse caso a **3333**.

Não é aconselhável subir o server durante o teste mesmo que com outra porta, subir o server demora um certo tempo também.

Para isso, utilizamos o `supertest`

```sh
    npm i -D supertest
```

Para facilitar, vamos separar nosso arquivo ` server.ts ` em dois.

1. app.ts: com as configurações e export do app
2. server.ts: apenas para subir o server com `app.listen`

Dessa forma, importamos o `app` de `app.ts` dentro do teste, mas sem precisar subir o servidor, que fica a cargo do `server.ts`

### Supertest

Como o supertest não foi escrito em typescript e sim em javascript, o typescript aponta um erro ao importar ele.
Podemos verificar a linguagem de escrita do modulo em npmjs.com/package/supertest.

Para corrigir isso, vamos instalar um package mantido pela comunidade:

```sh
    npm i -D @types/supertest
```

## Código do teste

Após importar os métodos necessários:

```js
import { test } from "vitest"
import supertest from "supertest"
import { app } from "../app"

```

Escrevemos a lógica do teste, utilizando o supertest. O supertest recebe um app.server, todo app por tras utiliza o
módulo HTTP do node e tem um server.

Escrevemos a requisicao que queremos e em qual rota e o que estamos enviando no body.

Por fim, com o expect, definimos qual a resposta que esperamos após termos enviado a requisação pra rota.

Como os plugins do app são `async`, pode acontecer dos testes falharem, já que o app ainda não havia registrado todos os plugins.
Para resolver isso, utilizamos do vitest o método `beforeAll` e `afterAll`.

Esses dois métodos serão executados apenas uma vez antes e depois de todos os testes. 
O nosso import fica assim:

```js
import { test, beforeAll, afterAll } from "vitest"
```

Feito isso, no `beforeAll` definimos para aguardar o app estar `ready`, para só então executar os testes, agora com as rotas
devidamente registradas.

Por fim, ao finalizar os testes, derrubamos o servidor com o `close` no `afterAll`.
