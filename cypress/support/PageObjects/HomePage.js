class HomePage {
    getCookiesBar() {
        return cy.get('[data-test="cookies-bar"]')
    }
    getCookiesBtn(){
        return cy.get('[data-test="accept-cookies-btn"]')
    }
    getUpperGridProducts(){
        return cy.get('[data-test="grid-layout"]').first().find('a')
    }
    getUpperGridProductCards(){
        return cy.get('[data-test="grid-layout"]').first().find('[data-test="product-card"]')
    }
    getLowerGridProducts(){
        return cy.get('[data-test="grid-layout"]').last().find('a')
    }
    getLowerGridProductCards(){
        return cy.get('[data-test="grid-layout"]').last().find('[data-test="product-card"]')
    }
    getUpperSliderProducts() {
        return cy.get('.marquee').first().find('a')
    }
    getUpperSliderProductsNames() {
        return cy.get('.marquee').first().find('span')
    }
    getLowerSliderProducts() {
        return cy.get('.marquee').last().find('a')
    }
    getLowerSliderProductsNames() {
        return cy.get('.marquee').last().find('span')
    }
    getInfoElementHeader() {
        return cy.get('[data-test="shopify-info-div"]').find('h2')
    }
    getInfoElementDescription() {
        return cy.get('[data-test="shopify-info-description"]').find('p')
    }
    getReadHereLink() {
        return cy.get('[date-test="read-it-here-link"]')
    }
    getFooterHomeBtn() {
        return cy.get('[data-test="ftr-navigation-btn-home"]')
    }
    getFooterContactBtn() {
        return cy.get('[data-test="ftr-navigation-btn-contact"]')
    }
    getFtrGitHubLogo() {
        return cy.get('[data-test="ftr-github-logo"]')
    }
    getThemeSwitcherOptionsList() {
        return cy.get('[data-test="theme-switcher-options"]')
    }
    getThemeSwitcherBtn() {
        return cy.get('.relative').find('[data-test="theme-switcher-btn"]')
    }
    getCurrentBackgroundTheme() {
        return cy.get('[data-test="background-mode-span"]')
    }
    getThemeSwitcherDropDownIcon() {
        return cy.get('.relative > [data-test="theme-switcher-btn"]').find('.cursor-pointer svg')
    }
    getLanguageDropDownOptions() {
        return cy.get('[data-test="language-dropdown"]')
    }
    getLanguageSelectorBtn() {
        return cy.get('[data-test="ftr-language-sel"]')
    }
    getLanguageDropDownIcon() {
        return cy.get('[data-test="ftr-language-sel"]').find('.cursor-pointer svg')
    }
    getAllBtn() {
        return cy.get('[data-test="nav-link-search"]')
    }
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
export const onHomePage = new HomePage()