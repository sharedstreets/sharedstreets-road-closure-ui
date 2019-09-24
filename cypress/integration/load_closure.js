describe('My First Test', function() {
    it('Visit explore', function() {
        cy.visit('/Test/explore');
    });
    it('Visit explore, clicks on link, goes to editor', function() {
        cy.visit('/Test/explore');
        cy.contains("Open...").click();
        cy.contains("in map editor").click();
        cy.url().should('include', '/Test/edit');
    });
});