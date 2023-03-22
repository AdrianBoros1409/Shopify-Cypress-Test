/// <reference types="Cypress" />

import { onHomePage } from "../../support/PageObjects/HomePage"
import { onProductPage } from "../../support/PageObjects/ProductPage";
import { onSidebar } from "../../support/PageObjects/Sidebar";

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
        Function that returns random number in a interval <min; max>
    */
    function getRandomInt(min, max){      
        return Math.floor(Math.random() * (max - min + 1)) + min;    
    } 

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

    /*
        Open product and compare info from website with info from response
    */
    it('P-003 Product page with request info', () => {
        onHomePage.getUpperGridProductCards().eq(1).click()    
        cy.getProductInfoRequest(globalThis.data.allProductsNames[1]).then((resp) => {
            expect(resp.products).to.have.length(1)
            onProductPage.getProductName().then(($name) => {
                expect($name.text()).to.be.eq(resp.products[0].title)
            })
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

    /*
        Open product, add it to cart and check cart sidebar
    */
    it('P-004 Cart sidebar actions', () => {
        const randomNumber = getRandomInt(0,2)
        onHomePage.getUpperGridProductCards().eq(randomNumber).click()
        var productPrice = ""
        onProductPage.getProductPrice().then(($price) => {
            productPrice = $price.text().split(' ')
            onProductPage.getAddToCartBtn().click()
            onProductPage.getSidebar().should('be.visible')
            onSidebar.getMyCartLink().find('h2').should('have.text', 'My Cart')
            onSidebar.getSidebarCartInfoSubtotalPrice().should('have.text', productPrice[0])
            onSidebar.getSidebarCartInfoTotalPrice().should('have.text', productPrice[0])
        })
        onSidebar.getSidebarCartInfoTaxes().should('have.text', 'Calculated at checkout')
        onSidebar.getSidebarCartInfoShipping().should('have.text', 'FREE')
        onSidebar.getDecreaseAmountBtn().should('have.attr', 'disabled')
        onSidebar.getQuantity().should('have.value', 1)
        onSidebar.getIncreaseAmountBtn().click()
        onSidebar.getQuantity().should('have.value', 2)
        onSidebar.getRemoveFromCartBtn().click()
        onProductPage.getEmptySidebar().find('h2').should('have.text', 'Your cart is empty')
        onSidebar.getSidebarCloseBtn().click()
    });

    /*
        Open product, add it to cart and proceed to checkout
    */
    it('P-005 E2E Add a product to the cart and checkout', () => {
        const randomNumber = getRandomInt(0,2)
        onHomePage.getUpperGridProductCards().eq(randomNumber).click()
        onProductPage.getAddToCartBtn().click()
        onSidebar.getCheckoutBtn().click()
        const sentArgs = { 
            email: globalThis.data.userEmail, 
            firstname: globalThis.data.firstName,
            lastname: globalThis.data.lastName,
            address: globalThis.data.address,
            postalCode: globalThis.data.postalCode,
            city: globalThis.data.city
        }
        cy.origin('https://demostoreadrian.myshopify.com', { args: sentArgs }, ({email, firstname, lastname, address, postalCode, city}) => {
            cy.get('#email').type(email).should('have.value', email)
            cy.get('#TextField0').type(firstname).should('have.value', firstname)
            cy.get('#TextField1').type(lastname).should('have.value', lastname)
            cy.get('#TextField2').type(address).should('have.value', address)
            cy.get('#TextField4').type(postalCode).should('have.value', postalCode)
            cy.get('#TextField5').type(city).should('have.value', city)
            cy.contains('button[type="submit"]', 'Continue to shipping').click()
            cy.get('section[aria-label="Review"]').find('div[role="cell"]').each(($cell, index) => {
                if (index == 1) {
                    expect($cell.text()).to.be.eq(email)
                }
                if (index == 4) {
                    expect($cell.text()).to.include(address)
                    expect($cell.text()).to.include(postalCode)
                    expect($cell.text()).to.include(city)
                }
            })
            cy.contains('button[type="submit"]', 'Continue to payment').click()
        })
    });
})