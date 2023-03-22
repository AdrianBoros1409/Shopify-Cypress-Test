class Sidebar {
    getSidebarCartInfo() {
        return cy.get('[data-test="sidebar-cart-info"] ul')
    }
    getMyCartLink() {
        return cy.get('[data-test="my-cart-link"]')
    }
    getSidebarCartInfoSubtotalPrice() {
        return this.getSidebarCartInfo().find('[data-test="subtotal"]').find('span').last()
    }
    getSidebarCartInfoTotalPrice() {
        return cy.get('[data-test="total"]').find('span').last()
    }
    getSidebarCartInfoTaxes() {
        return this.getSidebarCartInfo().find('[data-test="taxes"]').find('span').last()
    }
    getSidebarCartInfoShipping() {
        return this.getSidebarCartInfo().find('[data-test="shipping"]').find('span').last()
    }
    getDecreaseAmountBtn() {
        return cy.get('[data-test="amount-decrease-btn"]')
    }
    getQuantity() {
        return cy.get('[data-test="quantity-input"]')
    }
    getIncreaseAmountBtn() {
        return cy.get('[data-test="amount-increase-btn"]')
    }
    getRemoveFromCartBtn() {
        return cy.get('[data-test="remove-from-cart-btn"]')
    }
    getSidebarCloseBtn() {
        return cy.get('[data-test="cart-close-btn"]')
    }
    getCheckoutBtn() {
        return cy.get('[data-test="checkout-btn"]')
    }
}
export const onSidebar = new Sidebar()