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

Cypress.Commands.add('checkSortedProducts', (mode) => {
    
})