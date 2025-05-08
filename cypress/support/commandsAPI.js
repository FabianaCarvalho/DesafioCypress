/**
 * @command cadastrarUsuario
 * @description Cadastra um novo usuário na API Serverest.
 * @param {Object} user - Contém as informações do usuário: {name, email, password, admin}
 */
require('cypress-grep')();

Cypress.Commands.add('cadastrarUsuario', (user) => {
  console.log('Enviando Payload:', {
    nome: user.name,
    email: user.email,
    password: user.password,
    administrador: user.admin ? 'true' : 'false'
  });

  return cy.request({
    method: 'POST',
    url: `${Cypress.env('api_url')}/usuarios`,
    body: {
      nome: user.name, // Nome do usuário
      email: user.email, // E-mail único
      password: user.password, // Senha
      administrador: user.admin ? 'true' : 'false' // Enviar como string: 'true' ou 'false'
    },
    failOnStatusCode: false // Para evitar quebra do teste com erros 4xx/5xx
  });
});

/**
 * @command login
 * @description Faz login no Serverest e retorna a response body.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário.
 */
Cypress.Commands.add('login', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('api_url')}/login`,
    body: { email, password },
    failOnStatusCode: false // ESSENCIAL
  });
});

Cypress.Commands.add('loginAdmin', () => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('api_url')}/login`,
    body: {
      email: Cypress.env('admin_email'), // Admin email definido no cypress.config.js
      password: Cypress.env('admin_password') // Admin password
    }
  });
});

/**
 * @command criarProduto
 * @description Cria um produto pelo admin autenticado.
 * @param {Object} produto - Objeto produto.
 * @param {string} token - Token de admin.
 */
Cypress.Commands.add('criarProduto', (produto, token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('api_url')}/produtos`,
    headers: {
      Authorization: token // Envia o token no header
    },
    body: produto,
    failOnStatusCode: false // Permite capturar erros e evitar falhas automáticas
  });
});

/**
 * @command cleanupUsuario
 * @description Remove o usuário cadastrado.
 * @param {string} userId - ID do usuário.
 * @param {string} token - Token JWT do usuário.
 */
Cypress.Commands.add('cleanupUsuario', (userId, token) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('api_url')}/usuarios/${userId}`,
    headers: { Authorization: token },
    failOnStatusCode: false
  });
});

/**
 * @command buscarProdutos
 * @description Recupera lista de produtos existentes.
 */
Cypress.Commands.add('buscarProdutos', () => {
  return cy.request('GET', `${Cypress.env('api_url')}/produtos`);
});

/**
 * @command adicionarCarrinho
 * @description Adiciona produto ao carrinho.
 * @param {string} token
 * @param {string} idProduto
 * @param {number} quantidade
 */
Cypress.Commands.add('adicionarCarrinho', (token, idProduto, quantidade = 1) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('api_url')}/carrinhos`,
    headers: { Authorization: token },
    body: { produtos: [{ idProduto, quantidade }] },
    failOnStatusCode: false
  });
});

/**
 * @command finalizarCompra
 * @description Finaliza a compra do carrinho.
 * @param {string} token
 */
Cypress.Commands.add('finalizarCompra', (token) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('api_url')}/carrinhos/concluir-compra`,
    headers: { Authorization: token },
    failOnStatusCode: false
  });
});