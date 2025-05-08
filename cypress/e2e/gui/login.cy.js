describe('Login via GUI', () => {
  beforeEach(() => {
    cy.visit('https://front.serverest.dev/login');
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // @smoke @ci
  it('deve logar com sucesso e redirecionar para o dashboard', () => {
    cy.loginGUI('fabioak@yahoo.com.br', 'teste123');
    cy.url().should('include', '/admin/home');
    cy.get('p.lead').should('contain', 'Este é seu sistema para administrar seu ecommerce.');
  });

  // @regression @ci
  it('deve exibir mensagem de erro ao tentar logar com senha incorreta', () => {
    cy.loginGUINegative('fabioak@yahoo.com.br', 'SenhaIncorreta');
    cy.shouldShowAlert('Email e/ou senha inválidos');
  });

  // @regression
  it('deve impedir login se senha estiver vazia', () => {
    cy.loginGUINegative('fabioak@yahoo.com.br', null);
    cy.shouldShowAlert('Password é obrigatório');
  });

  // @regression
  it('deve impedir login se email estiver vazio', () => {
    cy.loginGUINegative(null, 'teste123');
    cy.shouldShowAlert('Email é obrigatório');
  });
});