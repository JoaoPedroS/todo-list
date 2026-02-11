# desafio-todo-list NEST

## Regras de fucionamento

O projeto possui duas entidades de dados, Todo e TodoDependencies, porém apenas uma entidade de dominio, chamada de TodoItem que ja possui dependentes vinculados a ela

### Cadastro de Todo

Para o cadastro de Todo é necessário passar os dados `title` e `date` e caso o todo seja dependente de um outro item então deve ser adicionado `dependencyIds`
sendo `title` um texto comum(string), `date` uma string de data no formato YYYY-MM-DD e `dependencyIds` um array de string que deve receber os ids(UUID) de quais tarefas aquela depende


## Para executar o projeto localmente

## Primeiro renomeie o arquivo .env.example, nele estão contidas as variaveis de ambiente necessárias para a execução do projeto

### Deve se utilizar o docker para rodas os containeres do projeto com o comando
```shell script
docker compose up -d
```

### Para rodar sem docker deve se primeiro instalar os pacotes, esse projeto usa npm para gerenciar os pacoes
```shell script
npm install
```

## Após isso criar um banco localmente com postgres e adicionar as configurações de conexão desse banco novo no seu arquivo .env

### Após isso rodar o comando
```shell script
npm run start:dev
```
## Testes

### Para executar os testes com o projeto rodando no docker deve se executar o seguinte comando
```shell script
docker exec -it todo_api npm run test
```

### Para executar os testes com o projeto rodando sem docker deve se executar o seguinte comando
```shell script
npm run test
```

## Tecnologias usadas no projeto

- NestJs.
- TypeScript
- Jest
- TypeOrm
- PostgreSql