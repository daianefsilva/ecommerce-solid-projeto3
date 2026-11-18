# E-commerce - Projeto 3

Continuação do Projeto 2: https://github.com/daianefsilva/ecommerce-solid-projeto2

Enunciado: https://github.com/maikonb/p3-ecommerce-docker

API Express e TypeScript com InversifyJS, PostgreSQL e Docker Compose.
A consulta de pedido segue Controller -> Service -> IOrderRepository.

## Como rodar

Instale e abra o Docker Desktop com suporte a containers Linux e Docker Compose.
Na pasta do projeto, copie a configuração:

PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Linux/macOS:

```bash
cp .env.example .env
docker compose up --build
```

A API atende em http://localhost:3000. O serviço banco tem healthcheck,
e a API só inicia após o PostgreSQL estar pronto. O comando npm start
cria as tabelas com prisma db push, cadastra os produtos de forma idempotente
e inicia o servidor. Não é necessário instalar Node.js no computador anfitrião.

## Configuração

O .env.example contém:

```dotenv
APP_ENV=dev
DATABASE_URL=postgresql://ecommerce:ecommerce@banco:5432/ecommerce
```

O endereço banco é o nome do serviço dentro da rede do Compose.
O PostgreSQL não publica sua porta no computador anfitrião.
As credenciais são destinadas somente ao ambiente didático local.

- dev: produtos e pedidos no PostgreSQL, e-mail Ethereal (precisa de internet).
- test: produtos no PostgreSQL, pedidos em memória e e-mail no console.
  Pedidos em memória desaparecem ao reiniciar a API.

Para trocar de modo, altere APP_ENV no .env e execute:

```powershell
docker compose up -d --force-recreate api
```

## Testar no PowerShell

Crie um pedido físico de R$ 110:

```powershell
$pedido = @{
  customer = "cliente@ethereal.email"
  items = @(@{ productId = 1; quantity = 1 })
  paymentMethod = "pix"
} | ConvertTo-Json -Depth 5

$resposta = Invoke-RestMethod -Uri "http://localhost:3000/orders" -Method Post -ContentType "application/json" -Body $pedido
$resposta | Format-List
Invoke-RestMethod -Uri ("http://localhost:3000/orders/" + $resposta.orderId)
```

Para e-book, use productId = 2: uma unidade resulta em R$ 50, sem frete.
GET /orders/:id também pode ser aberto no navegador.
Um ID inexistente retorna 404. ID inválido retorna 400.

```powershell
curl.exe -i http://localhost:3000/orders/999999
```

Teste os dois produtos e a consulta nos modos dev e test.

## Persistência

No modo dev, anote o orderId de um pedido e execute:

```powershell
docker compose down
docker compose up -d
```

Consulte novamente o mesmo pedido. Ele continua no volume dados_postgres.
O seed não apaga os pedidos e conserva os produtos 1 e 2.
Não use docker compose down -v ao verificar persistência: -v remove o volume.
Essa persistência de pedidos não se aplica ao modo test, que usa memória.

## Estrutura

- compose.yaml: PostgreSQL, healthcheck, volume e API.
- Dockerfile / .dockerignore: imagem da API.
- prisma/schema.prisma: provider PostgreSQL e DATABASE_URL.
- src/container: composição das dependências e escolha do modo.
- src/controllers: entrada HTTP, sem acesso a repositórios.
- src/services: regra de pedido inexistente.
- src/repositories: findById nas versões Prisma e memória.

As migrações antigas de SQLite foram removidas. O projeto usa prisma db push.
