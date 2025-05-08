/// <reference types="cypress" />

// @regression @usuarios @cadastrar @ci
describe('Cadastro de Produto com Upload de Imagem - GUI', () => {
    let nomeUnico;
    let precoOriginal, quantidadeOriginal;
    const descricao = 'Produto criado by Fabi Oak via E2E Cypress';
    const imagemCaminho = 'produto1.png';

    beforeEach(() => {
        const timestamp = Date.now();
        nomeUnico = `Produto_${timestamp}`;
        precoOriginal = 20;
        quantidadeOriginal = 10;

        cy.loginGUI(Cypress.env('CYPRESS_EMAIL'), Cypress.env('CYPRESS_SENHA'));
        cy.url().should('include', '/admin/home');
    });

    it('deve cadastrar produto com imagem', () => {
        cy.irParaCadastroProduto();
        cy.preencherProduto({
            nome: nomeUnico,
            preco: precoOriginal,
            descricao,
            quantidade: quantidadeOriginal,
            imagem: imagemCaminho
        });
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('include', '/admin/listarprodutos');
        cy.contains('Lista dos Produtos').should('be.visible');
    });

    // @ci @usuarios @negative @cadastrar 
    it('não deve permitir cadastrar produto sem nome', () => {
        cy.irParaCadastroProduto();
        cy.preencherProduto({
            nome: '', // Sem nome
            preco: precoOriginal,
            descricao,
            quantidade: quantidadeOriginal,
            imagem: imagemCaminho
        });
        cy.get('button[type="submit"]').click();
        cy.contains('Nome é obrigatório').should('be.visible');
    });
});