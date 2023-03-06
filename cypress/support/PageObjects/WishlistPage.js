class WishlistPage {
    getWishlistHeadline() {
        return cy.get('[data-test="wishlist-page-div"]').find('h1')
    }
    getWishlistCenterText() {
        return cy.get('[data-test="empty-wishlist"]')
    }
    getWishlistSubline() {
        return cy.get('[data-test="wishlist-paragraph"]')
    }
}
export const onWishlistPage = new WishlistPage()