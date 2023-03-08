/// <reference types="Cypress" />

import { onHomePage } from "../../support/PageObjects/HomePage"
import { onProductPage } from "../../support/PageObjects/ProductPage";

describe('Page screen UI test suite', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });
    before(() => {
        cy.fixture('example').then((data) => {
          globalThis.data = data;
        })
    })
    beforeEach(() => {
        cy.visit('/')
        cy.setCookie('accept_cookies', 'accepted')
        cy.getCookie('accept_cookies').should('have.property', 'value', 'accepted')
    })

    it('P-001 Product actions', () => {
        onHomePage.getUpperGridProductCards().first().click()
        cy.url().should('contain', globalThis.data.productActionsFirstProductName)
        onProductPage.getProductName().should('have.text', globalThis.data.upperSliderProductNames[0])
        onProductPage.getProductOptionLabel().should('have.text', 'color')
        onProductPage.getProductVariants().should('have.length', 3).each(($color) => {
            cy.wrap($color).click()
            onProductPage.getAddToCartBtn().should('not.be.disabled')
        })
        onProductPage.addToWishListhBtn().click()
        onProductPage.getLoginDialog().should('be.visible')
        cy.LoginWithoutDialog(globalThis.data.userEmail, globalThis.data.userPassword)
        cy.reload()
        cy.wait(1000)
        onProductPage.addToWishListhBtn().click()
        onProductPage.getLoginDialog().should('not.exist')
        onProductPage.getCareCollapsedContent().should('not.be.visible')
        onProductPage.getDetailsCollapsedContent().should('not.be.visible')
        onProductPage.getCollapseHeader('Care').click()
        onProductPage.getCareCollapsedContent().should('be.visible')
        onProductPage.getCollapseHeader('Details').click()
        onProductPage.getDetailsCollapsedContent().should('be.visible')
        cy.go('back')
        onHomePage.getUpperGridProductCards().eq(1).click()
        cy.url().should('contain', globalThis.data.productActionsSecondProductName)
        onProductPage.getProductName().should('have.text', globalThis.data.upperSliderProductNames[1])
    });
})