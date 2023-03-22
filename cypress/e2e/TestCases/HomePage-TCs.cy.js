/// <reference types="Cypress" />
import { onHomePage } from "../../support/PageObjects/HomePage"
import { onSearchPage } from "../../support/PageObjects/SearchPage";
import { onWishlistPage } from "../../support/PageObjects/WishlistPage";

describe('Home screen UI + UX test suite', () => {
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
        Check if the URL and title contain correct data
    */
    it('H-001 Correctness of URL and title', () => {
        cy.url().should('contain', 'localhost:3000')
        cy.title().should('contain', 'ACME Storefront')
    });

    /*
        Check if each of the grids contain 3 products and check image hover effect
    */
    it('H-002 Grid products count and effect', () => {
        onHomePage.getUpperGridProducts().should('have.length', 3)
        onHomePage.getCookiesBar().should('not.be.visible')
        onHomePage.getUpperGridProductCards().each(($el) => {
            cy.wrap($el).realHover().find('img').should('have.css', 'transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)')
        })
        onHomePage.getLowerGridProducts().should('have.length', 3)
        onHomePage.getLowerGridProductCards().each(($el) => {
            cy.wrap($el).realHover().find('img').should('have.css', 'transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)')
        })
    });

    /*
        Check if upper slider contains 3 products and lower slider 1 product
    */
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

    /*
        Check if shopify info part contains correct header and content
    */
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

    /*  
        Check links in footer redirect user to correct pages
    */
    it('H-005 Link redirections in footer', () => {
        cy.linkRedirection(onHomePage.getFooterHomeBtn(), 'shopify.vercel.store')
        cy.linkRedirection(onHomePage.getFooterContactBtn(), 'vercel.com/contact')
        cy.linkRedirection(onHomePage.getFtrGitHubLogo(), 'github.com/vercel/commerce')
    });

    /*
        Check if background changing function is working correctly
    */
    it('H-006 Change website background', () => {
        onHomePage.getThemeSwitcherOptionsList().should('not.exist')
        onHomePage.getCurrentBackgroundTheme().should('have.text','system')
        cy.changeSiteTheme('light')
        cy.changeSiteTheme('dark')
    });

    /*
        Check if is possible to change the language of website
    */
    it('H-007 Change website language', () => {
        onHomePage.getLanguageDropDownOptions().should('not.exist')
        cy.changeSiteLanguage('Español')
        cy.changeSiteLanguage('English')
    });

    /*
        Show all products by clicking on button All and order them
    */
    it('H-008 Show all products and order them', () => {
        onHomePage.getAllBtn().click()
        cy.url().should('contain', 'search')
        onSearchPage.getProductCard().should('be.visible').and('have.length', 4)
        onSearchPage.getNameOnProductCard().each(($prodName) => {
            var productName = $prodName.text()
            expect(globalThis.data.allProductsNames).to.contain(productName)
        })
        cy.sortProductsAndCheck('Price: Low to high')
        cy.sortProductsAndCheck('Price: High to low')
        onSearchPage.getHomePageBtn().click()
        onSearchPage.getNumOfMatchingResults().should('contain', 'Showing').and('contain', 'results')
        onSearchPage.getProductCard().should('have.length', 2)
    });

    /*
        Search for product which is in offer and also for products not in offer
    */
    it('H-009 Search for product', () => {
        onHomePage.getSearchBar().type(globalThis.data.productInOffer + `{enter}`).should('have.value', globalThis.data.productInOffer)
        cy.url().should('contain', globalThis.data.productInOffer)
        onSearchPage.getNumOfMatchingResults().should('contain', 'Showing').and('contain', globalThis.data.productInOffer)
        onHomePage.getWebsiteLogo().click()
        cy.url().should('not.contain', globalThis.data.productInOffer)
        onHomePage.getSearchBar().clear().should('be.empty')
        onHomePage.getSearchBar().type(globalThis.data.productNotInOffer + `{enter}`).should('have.value', globalThis.data.productNotInOffer)
        cy.url().should('contain', globalThis.data.productNotInOffer)
        onSearchPage.getNumOfMatchingResults().should('contain', 'There are no products that match').and('contain', globalThis.data.productNotInOffer)
    });

    /*
        Add product to wishlist before logging in and also after logging in
    */
    it('H-010 Add product to wishlist', () => {
        onHomePage.addToWishListhBtn().first().click()
        onHomePage.getLoginDialog().should('be.visible')
        cy.LoginWithoutDialog(globalThis.data.userEmail, globalThis.data.userPassword)
        cy.get('[data-test="close-icon"]').click()
        cy.reload()
        cy.wait(1000)
        onHomePage.addToWishListhBtn().first().click()
        onHomePage.getLoginDialog().should('not.exist')
        onHomePage.getWishListBtn().click()
        cy.url().should('contain', 'wishlist')
        onWishlistPage.getWishlistHeadline().should('be.visible').and('have.text', 'My Wishlist')
        onWishlistPage.getWishlistCenterText().should('have.text', 'Your wishlist is empty')
        onWishlistPage.getWishlistSubline().should('include.text', 'Make a wish')
    });
})