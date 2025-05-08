describe('Cadastro de Produto pelo Admin', () => {
  let adminToken;
  let produtoId;

  beforeEach(() => {
    cy.login(Cypress.env('admin_email'), Cypress.env('admin_password'))
      .then((login) => {
        cy.wrap(login.body.authorization).as('adminToken');
      });
  });

  it('[@regression] Não deve cadastrar produto sem token de admin', () => {
    const produto = {
      nome: `SemToken${Date.now()}`,
      preco: 10,
      descricao: 'Teste',
      quantidade: 1
    };
    cy.request({
      method: 'POST',
      url: `${Cypress.env('api_url')}/produtos`,
      body: produto,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.include('Token de acesso ausente');
    });
  });

  it('[@regression] Não deve cadastrar produto com campos obrigatórios vazios', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('api_url')}/produtos`,
      headers: { Authorization: adminToken },
      body: {},
      failOnStatusCode: false
    }).then((res) => {
      expect([400, 401, 422]).to.include(res.status);
    });
  });

  describe('Cadastro de Produto pelo Admin', () => {

    beforeEach(function () {
      cy.login(Cypress.env('admin_email'), Cypress.env('admin_password'))
        .then((login) => {
          cy.wrap(login.body.authorization).as('adminToken');
        });
    });
  });
}); 
