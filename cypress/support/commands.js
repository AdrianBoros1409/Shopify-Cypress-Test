// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { onHomePage } from "../support/PageObjects/HomePage"
import { onSearchPage } from "./PageObjects/SearchPage"
import { onProductPage } from "./PageObjects/ProductPage"

Cypress.Commands.add('changeSiteTheme', (themeColor) => {
    onHomePage.getThemeSwitcherBtn().click()
    onHomePage.getThemeSwitcherDropDownIcon().invoke('attr', 'class').then(($class) => {
        expect($class).to.include('rotate-90')
    })
    onHomePage.getThemeSwitcherOptionsList().should('be.visible')
    onHomePage.getThemeSwitcherOptionsList().find('li').should('have.length', 3)
    onHomePage.getThemeSwitcherOptionsList().contains('li', themeColor).click()
    if (themeColor == 'light') {
        cy.get('body').should('have.css', 'background-color').and('eq', 'rgb(255, 255, 255)')
    } else if (themeColor == 'dark') {
        cy.get('body').should('have.css', 'background-color').and('eq', 'rgb(0, 0, 0)')
    }
})

Cypress.Commands.add('linkRedirection', (selector, url) => {
    selector.invoke('attr', 'href').then(($link) => {
        cy.origin($link, { args: { url } }, ({ url }) => {
            cy.visit('/')
            cy.url().should('contain', url)
            cy.go('back')   
        })   
        cy.url().should('contain', 'localhost:3000')
    })
})

Cypress.Commands.add('changeSiteLanguage', (language) => {
    onHomePage.getLanguageSelectorBtn().click()
    onHomePage.getLanguageDropDownIcon().invoke('attr', 'class').then(($class) => {
        expect($class).to.include('active')
    })
    onHomePage.getLanguageDropDownOptions().should('be.visible')
    onHomePage.getLanguageDropDownOptions().contains('li', language).click()
    if (language == "Español") {
        cy.url().should('contain', 'es')
    }
    else {
        cy.url().should('not.contain', 'es')
    }
})

Cypress.Commands.add('sortProductsAndCheck', (option) => {
    onSearchPage.getMenuItem(option).click()
    onSearchPage.getPriceOnProductCard().then(($price) => {
        var pattern = /\d+\.?\d+/g
        var priceWithEur = $price.text().match(pattern)
        if (option == 'Price: Low to high') {
            expect(priceWithEur).to.deep.equal(priceWithEur.sort())
        } else if(option == 'Price: High to low') {
            expect(priceWithEur).to.deep.equal(priceWithEur.sort().reverse())
        } else {
            throw new Error('The condition was not met!')
        }
    })
})

Cypress.Commands.add('LoginWithoutDialog', (email, passwd) => {
    cy.fixture('example').then((data) => {
        globalThis.data = data;
    })
    const tokenQuery = `
        mutation customerAccessTokenCreate {
            customerAccessTokenCreate(input: {email: "${email}", password: "${passwd}"}) {
            customerAccessToken {
                accessToken
            }
            customerUserErrors {
                message
            }
            }
        }
    `
    cy.request({
        method: 'POST',
        url: 'https://demostoreadrian.myshopify.com/api/2023-01/graphql.json',
        headers: {
            'X-Shopify-Storefront-Access-Token': globalThis.data.storefrontAccessToken,
            'Content-Type': 'application/json'
        },
        body: {
            query: tokenQuery,
            fetchPolicy: 'no-cache'
        }
    }).then((response) => {
        const customerToken = response.body.data.customerAccessTokenCreate.customerAccessToken.accessToken
        cy.setCookie('shopify_customerToken', customerToken)
    })    
})

Cypress.Commands.add('LoginWithDialog', (email, passwd) => {
    onHomePage.getEmailInputField().type(email).should('have.value', email)
    onHomePage.getPasswordInputField().type(passwd, {log: false}).should(($el) => {
        if ($el.val() !== passwd) {
            throw new Error('Different value of typed password')
        }
    })
    onHomePage.getSubmitBtn().click()
})

Cypress.Commands.add('CollapsedContentVisibilityCheck', () => {
    onProductPage.getCareCollapsedContent().should('not.be.visible')
    onProductPage.getDetailsCollapsedContent().should('not.be.visible')
    onProductPage.getCollapseHeader('Care').click()
    onProductPage.getCareCollapsedContent().should('be.visible')
    onProductPage.getCollapseHeader('Details').click()
    onProductPage.getDetailsCollapsedContent().should('be.visible')
})

Cypress.Commands.add('getProductInfoRequest', (prodTitle) => {
    cy.fixture('example').then((data) => {
        globalThis.data = data;
    })
    cy.request({
        method: 'GET',
        url: 'https://demostoreadrian.myshopify.com/admin/api/2023-01/products.json',
        headers: {
            'X-Shopify-Access-Token': globalThis.data.shopifyAccessToken,
            'Content-Type': 'application/json'
        },
        qs: {
            'title': prodTitle
        }
    }).then((response) => {
        return response.body
    })
})