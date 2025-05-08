// OBS: A Serverest é instável. O teste pode falhar se o produto for removido por outro usuário ou se o backend estiver inconsistente.

# Comandos Customizados do Projeto

## `cy.cadastrarUsuario(user)`
Cadastra novo usuário.
- Parâmetro: Objeto com `{name, email, password, admin}`
- Retorna: response Cypress

## `cy.login(email, password)`
Realiza login e retorna objeto de resposta com token.

## `cy.cleanupUsuario(userId, token)`
Remove usuário pelo ID autenticado pelo seu próprio token.

## `cy.criarProduto(produto, token)`
Cria um novo produto autenticado como admin.

## `cy.buscarProdutos()`
Retorna lista de produtos disponíveis.

## `cy.adicionarCarrinho(token, idProduto, quantidade)`
Adiciona produto ao carrinho.

## `cy.finalizarCompra(token)`
Finaliza compra como usuário autenticado.

---

**Tags de testes:**  
- `@smoke`: para execução rápida (funcionalidades principais)
- `@regression`: para cenários de regressão e robustez

Execute testes filtrados (requer [cypress-grep](https://github.com/cypress-io/cypress-grep)):  
```bash
npx cypress run --env grepTags=@smoke
