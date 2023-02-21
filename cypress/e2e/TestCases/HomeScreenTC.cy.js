/// <reference types="Cypress" />

describe('Home screen UI test suite', () => {
    it('Visit page and verify URL', () => {
        cy.visit('/')
        cy.url().should('contain', 'localhost:3000')
    });
})