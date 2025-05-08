let adminToken;

beforeEach(() => {
  cy.login('admin@qa.com', '1senha123').then((res) => {
    window.localStorage.setItem('token', res.body.authorization);
  });
});

describe('Cadastro, Login e Consulta de Perfil', () => {
  let user;
  let email, password, nome, userId, token;

  beforeEach(() => {
    // Preparação de dados únicos para cada teste
    email = `user${Date.now()}_${Math.floor(Math.random() * 1000)}@mail.com`;
    password = 'teste123';
    nome = 'Usuário Teste';
    user = { name: nome, email, password, admin: false };
  });

  it.only('[@smoke] Deve cadastrar, logar e consultar perfil do usuário (happy path)', () => {
    cy.cadastrarUsuario(user).then((cadastro) => {
      expect(cadastro.status).to.eq(201);
      userId = cadastro.body._id;
      cy.login(email, password).then((loginData) => {
        token = loginData.body.authorization;
        cy.request({
          method: 'GET',
          url: `${Cypress.env('api_url')}/usuarios/${userId}`,
          headers: { Authorization: token }
        }).then((perfil) => {
          expect(perfil.status).to.eq(200);
          expect(perfil.body.nome).to.eq(nome);
          expect(perfil.body.email).to.eq(email);
          cy.cleanupUsuario(userId, token);
        });
      });
    });
  });

  it('Cadastra o usuário antes de tentar o login', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('api_url')}/usuarios`,
      body: {
        nome: 'Usuário Admin',
        email: 'admin@qa.com',
        password: 'senha123',
        administrador: 'true'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([201, 400]); // 201 (Sucesso), 400 (Usuário já existe)
    });
  });

  it('Login com credenciais válidas deve retornar sucesso', () => {
    const email = 'admin@qa.com';
    const password = 'senha123';

    cy.login(email, password).then((res) => {
      expect(res.status).to.eq(200); // Login com sucesso retorna 200
      expect(res.body.authorization).to.exist; // Valida que um token é gerado
    });
  });

  it('[@regression] Cadastro de usuário com e-mail já existente', () => {
    cy.cadastrarUsuario(user).then((res1) => {
      expect(res1.status).to.eq(201);
      userId = res1.body._id;
      cy.cadastrarUsuario(user).then((res2) => {
        expect(res2.status).to.eq(400);
        expect(res2.body.message).to.eq('Este email já está sendo usado');
        cy.login(email, password).then((login) => {
          cy.cleanupUsuario(userId, login.body.authorization);
        });
      });
    });
  });

  it('[@regression] Login com senha incorreta', () => {
    cy.login('admin@qa.com', 'senhaIncorreta').then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.exist; // A mensagem de erro deve estar presente
      expect(res.body.message).to.eq('Email e/ou senha inválidos');
    });
  });
});


it('Consulta de perfil sem token', { tags: ['@regression'] }, () => {
  cy.cadastrarUsuario(user).then((res) => {
    expect(res.status).to.eq(201);
    userId = res.body._id;
    cy.request({
      method: 'GET',
      url: `${Cypress.env('api_url')}/usuarios/${userId}`,
      failOnStatusCode: false
    }).then((fail) => {
      expect(fail.status).to.eq(401);
      expect(fail.body.message).to.include('Token de acesso ausente');
      cy.login(email, password).then((login) => {
        cy.cleanupUsuario(userId, login.body.authorization);
      });
    });
  });
});


it('Consulta de perfil com token inválido', { tags: ['@regression'] }, () => {
  cy.cadastrarUsuario(user).then((res) => {
    expect(res.status).to.eq(201);
    userId = res.body._id;
    cy.request({
      method: 'GET',
      url: `${Cypress.env('api_url')}/usuarios/${userId}`,
      headers: { Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
    }).then((failRes) => {
      expect(failRes.status).to.eq(401);
      expect(failRes.body.message).to.include('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
      cy.login(email, password).then((login) => {
        cy.cleanupUsuario(userId, login.body.authorization);
      });
    });
  });
});
