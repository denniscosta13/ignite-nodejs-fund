# Deploy

Nenhuma plataforma de hospedagem lê o código em typescript, precisamos transformar tudo para javascript antes do deploy.
O tsc faz isso pra nós mas, pode se tornar lento dependendo do tamanho do código.

Para isso, vamos utilizar o `tsup`

```sh
    npm i -D tsup
```

> package.json => "build": "tsup src"
