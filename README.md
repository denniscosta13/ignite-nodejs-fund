# Planejamento

## Requisitos Funcionais

- [x] O usuário deve poder criar uma nova transação;
- [x] O usuário deve poder obter um resumo da sua conta:
  - [x] Valor total das transações;
- [x] O usuário deve poder listar todas as transações já cadastradas;
- [x] O usuário deve poder visualizar uma transação única;

## Regras de negócio

- [x] A transação pode ser do tipo crédito (receita) ou débito (despesa);
- [x] Deve ser possível identificarmos o usuário entre as requisições;
  - [x] Quando o usuário criar a primeira transacao, salvamos um session_id que vai identificar a sessao de cada usuário
- [x] O usuário só pode visualizar transações que ele criou;
