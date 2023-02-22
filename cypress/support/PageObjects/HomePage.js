class HomePage {
    getUpperGridProducts(){
        return cy.get('[data-test="grid-layout"]').first().find('a')
    }
    getUpperGridProductCards(){
        return cy.get('[data-test="grid-layout"]').first().find('[data-test="product-card"]')
    }
}
export const onHomePage = new HomePage()