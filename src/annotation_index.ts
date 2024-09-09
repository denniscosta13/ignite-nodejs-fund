// typescript - podemos trabalhar com  tipagem estatica
// evita que alguns erros vao pra producao, ja que e compilada e tem tipagem forte

// INSTALA O TYPESCRIPT COMO DEPENDENCIA DE DESENVOLVIMENTO
// npm i -D typescript

// CRIAR ARQUIVO DE CONFIGURACAO DO TYPESCRIPT
// NPX SERVE PRA EXECUTAR ARQUIVOS bin OU executaveis, NESSE CASO ESTAMOS EXECUTANDO NA PASTA ./node_modules/typescript/.bin/tsc
// npx tsc --init

// DENTRO DE tsconfig.json, alteramos o target para es2020, que o node ja consegue entender novas funcionalidas do javascript
// instalar esse pacote para o node conseguir trabalhar com o typsescritp 
// -===== npm install -D @types/node

//npx tsc server.ts
//transforma o arquivo typescript em javascript, ira criar um arquivo server.js
//o node so consegue rodar o arquivo server.js, nao roda o typescript

//npm install -D tsx
//automatiza o processo de transformar o .ts em .js
//npx tsx server.ts
//recomendado utilizar apenas em desenvolvimento, nao em producao
//pra producao o melhor é converter em javascript, mais rapido

//para agilizar na hora de subir o servidor, adicionamos o script ao package.json
//"dev": "tsx watch src/server.ts"
//watch serve para atualizar o servidor quando salvamos alguma alteracao

//podemos criar uma interface que define o tipo de dado que a funcao vai aceitar como parametro
interface User {
    birthYear: number
}

//definimos que o parametros tem quser do tipo User
function calcUserAge(user: User ) {
    return new Date().getFullYear() - user.birthYear
}

//se enviamos uma string ao inves de um objeto user, javascript nao da erro
//js é runtime check, só identifica erros depois que executamos // static type chec - avisa erros durante escrita
//se trocamos para typescript as linhas abaixo ja vao dar erro
//como string nao é tipo User e objeto vazio também nao segue o modelo de User ele ja acusa erro antes de executar o codigo
calcUserAge('Denns')
calcUserAge({})

//se tentamos enviar algo diferente do numero no birthYear também da erro
calcUserAge({
    birthYear: 1995
})
