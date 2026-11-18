# Verificação do Projeto 3

Base utilizada: https://github.com/daianefsilva/ecommerce-solid-projeto2

Testes executados em 18/11/2026 com Docker Desktop e containers Linux:

- docker compose up --build: imagem construída, banco saudável e API iniciada.
- TypeScript: npx tsc --noEmit sem erros dentro do container.
- APP_ENV=dev: POST e GET de produto físico (R$ 110) e digital (R$ 50).
- APP_ENV=test: POST e GET de produto físico (R$ 110) e digital (R$ 50).
- Pedido inexistente: HTTP 404 nos dois modos.
- ID inválido: HTTP 400 nos dois modos.
- Persistência em dev: pedidos 1 e 2 continuaram acessíveis após down e up.
- Seed repetido: produtos 1 e 2 continuaram disponíveis.
- PostgreSQL: sem porta publicada no computador anfitrião.
- A consulta passa por controller, service e interface do repositório.

Os pedidos de test são voláteis, conforme o contrato do repositório em memória.
