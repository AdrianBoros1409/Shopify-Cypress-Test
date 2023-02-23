/// <reference types="Cypress" />
import { onHomePage } from "../../support/PageObjects/HomePage"

describe('Home screen UI test suite', () => {
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
    })
    it('H-001 Correctness of URL and title', () => {
        cy.url().should('contain', 'localhost:3000')
        cy.title().should('contain', 'ACME Storefront')
        onHomePage.getCookiesBar().should('not.be.visible')
        onHomePage.getCookiesBtn().should('not.be.visible')
    });

    it('H-002 Grid products count and effect', () => {
        onHomePage.getUpperGridProducts().should('have.length', 3)
        onHomePage.getUpperGridProductCards().each(($el) => {
            cy.wrap($el).realHover().find('img').should('have.css', 'transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)')
        })
        onHomePage.getLowerGridProducts().should('have.length', 3)
        onHomePage.getLowerGridProductCards().each(($el) => {
            cy.wrap($el).realHover().find('img').should('have.css', 'transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)')
        })
    });

    it('H-003 Sliders products count', () => {
        onHomePage.getUpperSliderProducts().should('have.length', 3)
        onHomePage.getUpperSliderProductsNames().each(($el) => {
            var productName = $el.text()
            expect(globalThis.data.upperSliderProductNames).to.contain(productName)
        })
        onHomePage.getLowerSliderProducts().should('have.length', 1)
        onHomePage.getLowerSliderProducts().then(($el) => {
            var productName = $el.text()
            expect(globalThis.data.lowerSliderProductName).to.equal(productName)
        })
    });

    it('H-004 Shopify information header and content', () => {
        onHomePage.getInfoElementHeader().should('have.text', 'What is Shopify?')
        onHomePage.getInfoElementDescription().should('contain.text', 'Our expertise and leadership in commerce comes from the experiences')
        onHomePage.getReadHereLink().should('be.visible').and('have.text', 'Read it here')
        onHomePage.getReadHereLink().invoke('attr', 'href').then(($link) => {
            cy.origin($link, () => {
                cy.visit('/')
                cy.url().should('contain', 'shopify.vercel.store')
            })
        })
    });

    it('H-005 Link redirections in footer', () => {
        cy.linkRedirection(onHomePage.getFooterHomeBtn(), 'shopify.vercel.store')
        cy.linkRedirection(onHomePage.getFooterContactBtn(), 'vercel.com/contact')
        cy.linkRedirection(onHomePage.getFtrGitHubLogo(), 'github.com/vercel/commerce')
    });

    it('H-006 Change website background', () => {
        onHomePage.getThemeSwitcherOptionsList().should('not.exist')
        onHomePage.getCurrentBackgroundTheme().should('have.text','system')
        cy.changeSiteTheme('light')
        cy.changeSiteTheme('dark')
    });

    it('H-007 Change website language', () => {
        onHomePage.getLanguageDropDownOptions().should('not.exist')
        cy.changeSiteLanguage('Español')
        cy.changeSiteLanguage('English')
    });
})