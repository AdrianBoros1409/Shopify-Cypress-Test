class SearchPage {
    getProductCard() {
        return cy.get('[data-test="product-card"]')
    }
    getNameOnProductCard() {
        return cy.get('[data-test="product-tag-all"]').find('h3')
    }
    getMenuItem(itemName) {
        return cy.get('div[role="menu"]').contains('li', itemName)
    }
    getPriceOnProductCard() {
        return cy.get('[data-test="product-price-all"]')
    }
    getHomePageBtn() {
        return cy.get('[data-test="nav-link-home-page"]')
    }
    getNumOfMatchingResults() {
        return cy.get('[data-test="div-num-of-results"]').find('span[class*="fadeIn"]')
    }
}
export const onSearchPage = new SearchPage()