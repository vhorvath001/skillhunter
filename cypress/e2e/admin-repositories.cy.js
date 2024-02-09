describe('e2e testing of Administration / Repositories', () => {
    const nameRepo = 'Gitlab';
    const descRepo = 'Gitlab central repo';
    const urlRepo = 'https://gitlab.acme.co.uk';
    const tokenRepo = 'fdsSDF4g5gGg2g4';
    const id = '0';

    it('adding a new repository, editing it and removing it', () => {
        cy.intercept('GET', 'http://localhost:3500/repositories', (req) => {
            req.reply([]);
        }).as('listRepos');

        cy.intercept('POST', 'http://localhost:3500/repositories', (req) => {
            const { body } = req;
            // verifying the request
            expect(body.id).to.eq('');
            expect(body.name).to.eq(nameRepo);
            expect(body.desc).to.eq(descRepo);
            expect(body.url).to.eq(urlRepo);
            expect(body.token).to.eq(tokenRepo);
            // adding 'id' value to the response
            body.id = id;
            req.reply(body);
        }).as('createNewRepo');

        cy.intercept('PUT', `http://localhost:3500/repositories/${id}`, (req) => {
            const { body } = req;
            // verifying the request
            expect(body.id).to.eq(id);
            expect(body.name).to.eq(nameRepo + '1');
            expect(body.desc).to.eq(descRepo + '1');
            expect(body.url).to.eq(urlRepo + '1');
            expect(body.token).to.eq(tokenRepo + '1');
            // adding 'id' value to the response
            req.reply(body);
        }).as('editExistingRepo');

        cy.intercept('DELETE', `http://localhost:3500/repositories/${id}`, (req) => {
            const { body } = req;
            req.reply(body);
        }).as('deleteExistingRepo');

        // ********************** CREATE **********************
        cy.visit('/');
        // selecting repo / admin in menu
        cy.findByRole('button', {  name: /administration/i}).click();
        cy.findByRole('link', {  name: /repositories/i}).click();
        cy.wait('@listRepos');
        // clicking on the Create button
        cy.findByRole('button', {  name: /Create/i}).click();
        // populate the form
        cy.findByRole('textbox', {  name: /name/i}).type(nameRepo);
        cy.findByRole('textbox', {  name: /description/i}).type(descRepo);
        cy.findByRole('textbox', {  name: /url/i}).type(urlRepo);
        cy.findByLabelText(/token/i).type(tokenRepo);
        // clicking on Save button
        cy.findByRole('button', {  name: /save/i}).click();
        cy.wait('@createNewRepo');

        cy.contains('th', 'Name').parent().parent().parent().get('tbody').should('not.be.empty');

        // ********************** EDIT **********************
        // clicking on the Edit button of the 1st repo
        cy.findByText(nameRepo).parent().parent().findByTestId('t-modal-show').click();
        // adding '1' to the end of each textbox and remove the last pattern
        cy.findByRole('textbox', {  name: /name/i}).type('1');
        cy.findByRole('textbox', {  name: /description/i}).type('1');
        cy.findByRole('textbox', {  name: /url/i}).type('1');
        cy.findByLabelText(/token/i).type('1');
        // clicking on Save button
        cy.findByRole('button', {  name: /save/i}).click();
        cy.wait('@editExistingRepo');

        cy.contains('th', 'Name').parent().parent().parent().get('tbody').should('not.be.empty');

        // ********************** DELETE **********************
        // clicking on the Delete button of the 1st repo
        cy.findByText(nameRepo + '1').parent().parent().findByTestId('t-modalConfirmation-show').click();
        // clicking on the Confirm button on the Confirmation Modal
        cy.findByRole('button', {  name: /confirm/i}).click();
        cy.wait('@deleteExistingRepo');

        cy.contains('th', 'Name').parent().parent().parent().get('tbody').should('be.empty');
    })
})