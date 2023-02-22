/// <reference types="Cypress" />
import { onHomePage } from "../../support/PageObjects/HomePage"

describe('Home screen UI test suite', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.setCookie('accept_cookies', 'accepted')
        cy.intercept('GET','http://localhost:3000/_next/static/development/_devPagesManifest.json').as('devPagesManifest')
        cy.wait('@devPagesManifest')
    })
    it('H-001 Correctness of URL and title', () => {
        cy.url().should('contain', 'localhost:3000')
        cy.title().should('contain', 'ACME Storefront')
    });

    it('H-002 Upper grid products', () => {
        onHomePage.getUpperGridProducts().should('have.length', 3)
        onHomePage.getUpperGridProductCards().each(($el) => {
            cy.wrap($el).realHover().find('img').should('have.css', 'transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)')
        })
    });
})