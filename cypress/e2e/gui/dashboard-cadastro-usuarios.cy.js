/// <reference types="cypress" />

// @regression @usuarios @cadastrar @ci
describe('Dashboard - Cadastro de Usuário - GUI', () => {
    let emailUnico;

    beforeEach(() => {
        cy.acessarCadastroUsuarios();
        emailUnico = `user_${Date.now()}@testecypress.com`;
    });

    // @positive @ci
    it('deve cadastrar um novo usuário com sucesso', () => {
        cy.preencherFormularioUsuario('Fabi Oak', emailUnico, 'Senha123', true);
        cy.submeterFormulario();
        cy.contains('Lista dos usuários');
        cy.url().should('include', '/admin/listarusuarios');
        cy.get('table').should('contain', emailUnico);
    });

    // *** Cenário negativo por email já em uso ***
    it('não deve permitir cadastrar usuário com email já existente', () => {
        // Cadastra o novo usuário
        cy.preencherFormularioUsuario('Fabi Oak', emailUnico, 'Senha123', true);
        cy.submeterFormulario();
        cy.contains('Lista dos usuários');
        cy.contains('Cadastrar Usuário').click();
        cy.url().should('include', '/admin/cadastrarusuarios');

        // Tenta cadastrar com o mesmo email
        cy.preencherFormularioUsuario('Usuário Repetido', emailUnico, 'Senha123', true);
        cy.submeterFormulario();

        cy.shouldShowAlert('Este email já está sendo usado');
    });
});