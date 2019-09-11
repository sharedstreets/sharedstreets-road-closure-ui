describe('My First Test', function() {
    it('Visit explore', function() {
        cy.visit('/test/explore');
    });
    it('Visit explore, clicks on link, goes to editor', function() {
        cy.visit('/test/explore');
        cy.contains("Open...").click();
        cy.contains("in map editor").click();
        cy.url().should('include', '/test/edit');
    });
});