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

    /*
        Open product and check actions which can be performed on product
    */
    it('P-001 Product actions with color options', () => {
        onHomePage.getUpperGridProductCards().first().click()
        cy.url().should('contain', globalThis.data.productActionsFirstProductName)
        onProductPage.getProductName().should('have.text', globalThis.data.upperSliderProductNames[0])
        onProductPage.getProductOptionLabel().should('have.text', 'color')
        onProductPage.getProductVariants().should('have.length', 3).each(($color) => {
            cy.wrap($color).click()
            onProductPage.getAddToCartBtn().should('not.be.disabled')
            onProductPage.getAddToCartBtn().should('have.text', 'Add To Cart')
        })
        onProductPage.addToWishListhBtn().click()
        onProductPage.getLoginDialog().should('be.visible')
        cy.LoginWithoutDialog(globalThis.data.userEmail, globalThis.data.userPassword)
        cy.reload()
        cy.wait(1000)
        cy.CollapsedContentVisibilityCheck()
    });

    /*
        Open product and check actions which can be performed on product
    */
    it('P-002 Product actions with sizes options', () => {
        onHomePage.getUpperGridProductCards().eq(1).click()
        cy.url().should('contain', globalThis.data.productActionsSecondProductName)
        onProductPage.getProductName().should('have.text', globalThis.data.upperSliderProductNames[1])
        onProductPage.getProductOptionLabel().should('have.text', 'size')
        onProductPage.getProductVariants().should('have.length', 3).each(($size) => {
            cy.wrap($size).click()
            if ($size.text() == 'large') {
                onProductPage.getAddToCartBtn().should('be.disabled')
                onProductPage.getAddToCartBtn().should('have.text', 'Not Available')
                onProductPage.getAddToCartBtn().realHover().should('have.css', 'cursor', 'not-allowed')
            }
            else {
                onProductPage.getAddToCartBtn().should('not.be.disabled')
                onProductPage.getAddToCartBtn().should('have.text', 'Add To Cart')
                onProductPage.getAddToCartBtn().realHover().should('have.css', 'cursor', 'pointer')
            }   
        })
        cy.CollapsedContentVisibilityCheck()
    });

    it('P-003 Product page with request info', () => {
        onHomePage.getUpperGridProductCards().eq(1).click()
        var prodName = ""
        onProductPage.getProductName().then(($name) => {
            prodName = $name.text()
        })
        cy.getProductInfoRequest(globalThis.data.allProductsNames[1]).then((resp) => {
            expect(resp.products).to.have.length(1)
            expect(resp.products[0].title).to.contain(prodName)
            expect(resp.products[0].status).to.be.equal('active')
            expect(resp.products[0].options[0].name).to.be.equal('Size')
            expect(resp.products[0].options[0].values).to.have.length(3)
            const sizeValues = resp.products[0].options[0].values.map(($el) => {
                return $el.toLowerCase()
            })
            onProductPage.getProductVariants().each(($variant) => {
                expect(sizeValues).to.contain($variant.text())
            })
            cy.url().should('contain', resp.products[0].handle)
        })
    });
})