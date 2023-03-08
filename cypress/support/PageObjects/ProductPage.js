class ProductPage {
    getProductName() {
        return cy.get('[data-test="product-name"]')
    }
    getProductOptionLabel() {
        return cy.get('[data-test="product-option-label"]')
    }
    getProductVariants() {
        return cy.get('div[role="listbox"] button')
    }
    getAddToCartBtn() {
        return cy.get('[data-test="add-to-cart-btn"]')
    }
    addToWishListhBtn() {
        return cy.get('[data-test="add-to-wishlist-btn"]').first()
    }
    getLoginDialog() {
        return cy.get('[data-test="login-dialog"]')
    }
    getCareCollapsedContent() {
        return cy.get('[data-test="collapsed-content"]').first()
    }
    getDetailsCollapsedContent() {
        return cy.get('[data-test="collapsed-content"]').last()
    }
    getCollapseHeader(option) {
        return cy.get('[data-test="collapse-header"]').contains('span', option)
    }
}
export const onProductPage = new ProductPage()