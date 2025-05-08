import 'cypress-file-upload';
require('cypress-grep')();

// Login pela interface
Cypress.Commands.add('loginGUI', (email, senha) => {
  cy.visit('https://front.serverest.dev/login');
  cy.clearCookies();
  cy.clearLocalStorage();
  if (email) cy.get('#email').type(email);
  if (senha) cy.get('#password').type(senha);
  cy.get('button[data-testid="entrar"]').click();
});

// Login negativo (mantido pois é distinto)
Cypress.Commands.add('loginGUINegative', (email, senha) => {
  if (email) cy.get('#email').type(email);
  if (senha) cy.get('#password').type(senha);
  cy.get('button[data-testid="entrar"]').click();
});

// Validar alertas
Cypress.Commands.add('shouldShowAlert', mensagem => {
  cy.get('div.alert.alert-secondary.alert-dismissible')
    .should('be.visible')
    .and('contain', mensagem);
});

// Deletar produto por nome
Cypress.Commands.add('deleteProductByName', (nomeProduto) => {
  cy.request('GET', '/produtos').then(response => {
    const produto = response.body.find(p => p.nome === nomeProduto);
    if (produto) {
      cy.request('DELETE', `/produtos/${produto._id}`);
    }
  });
});

Cypress.Commands.add('acessarCadastroUsuarios', () => {
  // Garante que está logado e navega até a tela de cadastro de usuários
  const email = Cypress.env('CYPRESS_EMAIL');
  const senha = Cypress.env('CYPRESS_SENHA');
  cy.loginGUI(email, senha);
  cy.url().should('include', '/admin/home');
  cy.contains('Cadastrar Usuários').click();
  cy.url().should('include', '/admin/cadastrarusuarios');
});

Cypress.Commands.add('preencherFormularioUsuario', (nome, email, senha, administrador = false) => {
  cy.get('#nome').clear().type(nome);
  cy.get('#email').clear().type(email);
  cy.get('#password').clear().type(senha);
  if (administrador) {
    cy.get('#administrador').check();
  }
});

Cypress.Commands.add('submeterFormulario', () => {
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('irParaCadastroProduto', () => {
  cy.contains('Cadastrar Produtos').click();
  cy.url().should('include', '/admin/cadastrarprodutos');
});

Cypress.Commands.add('preencherProduto', ({ nome, preco, descricao, quantidade, imagem }) => {
  if (nome) cy.get('#nome').type(nome);
  if (preco) cy.get('#price').type(preco);
  if (descricao) cy.get('#description').type(descricao);
  if (quantidade) cy.get('#quantity').clear().type(quantidade);
  if (imagem) cy.get('input[type="file"]').attachFile(imagem);
});