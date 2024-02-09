describe('e2e testing of Administration / Programming Languages', () => {
    const nameProgLang = 'Rust';
    const descProgLang = 'Rust programming langauge';
    const sourceFilesProgLang = '*.rs';
    const levelProgLang = '2';
    const pattern0ProgLang = 'mod .*';
    const pattern1ProgLang = 'use .*';
    const id = '0';

    it('adding a new programming language, editing it and removing it', () => {
        cy.intercept('GET', 'http://localhost:3500/prog-langs', (req) => {
            req.reply([]);
        }).as('listProgLangs');

        cy.intercept('POST', 'http://localhost:3500/prog-langs', (req) => {
            const { body } = req;
            // verifying the request
            expect(body.id).to.eq('');
            expect(body.name).to.eq(nameProgLang);
            expect(body.desc).to.eq(descProgLang);
            expect(body.level).to.eq(levelProgLang);
            expect(JSON.parse(body.pattern).patternList[0]).to.eq(pattern0ProgLang);
            expect(JSON.parse(body.pattern).patternList[1]).to.eq(pattern1ProgLang);
            // adding 'id' value to the response
            body.id = id;
            req.reply(body);
        }).as('createNewProgLang');

        cy.intercept('PUT', `http://localhost:3500/prog-langs/${id}`, (req) => {
            const { body } = req;
            // verifying the request
            expect(body.id).to.eq(id);
            expect(body.name).to.eq(nameProgLang + '1');
            expect(body.desc).to.eq(descProgLang + '1');
            expect(body.level).to.eq(levelProgLang + '1');
            expect(JSON.parse(body.pattern).patternList[0]).to.eq(pattern0ProgLang + '1');
            expect(JSON.parse(body.pattern).patternList[1]).to.eq(pattern1ProgLang + '1');
            // adding 'id' value to the response
            req.reply(body);
        }).as('editExistingProgLang');

        cy.intercept('DELETE', `http://localhost:3500/prog-langs/${id}`, (req) => {
            const { body } = req;
            req.reply(body);
        }).as('deleteExistingProgLang');

        // ********************** CREATE **********************
        cy.visit('/');
        // selecting prog lang admin in menu
        cy.findByRole('button', {  name: /administration/i}).click();
        cy.findByRole('link', {  name: /programming languages/i}).click();
        cy.wait('@listProgLangs');
        // clicking on the Create button
        cy.findByRole('button', {  name: /Create/i}).click();
        // populate the form
        cy.findByRole('textbox', {  name: /name/i}).type(nameProgLang);
        cy.findByRole('textbox', {  name: /description/i}).type(descProgLang);
        cy.findByRole('textbox', {  name: /source files/i}).type(sourceFilesProgLang);
        cy.findByRole('spinbutton', {  name: /level/i}).type(levelProgLang);
        cy.get('input[name="patternListItem_0"]').type(pattern0ProgLang);
        cy.get('[data-testid=t-editableListItem-add]').click({force:true});
        cy.get('input[name="patternListItem_1"]').type(pattern1ProgLang);
        // clicking on Save button
        cy.findByRole('button', {  name: /save/i}).click();
        cy.wait('@createNewProgLang');

        cy.contains('th', 'Name').parent().parent().parent().get('tbody').should('not.be.empty');

        // ********************** EDIT **********************
        // clicking on the Edit button of the 1st prog lang
        cy.findByText(nameProgLang).parent().parent().findByTestId('t-modal-show').click();
        // adding '1' to the end of each textbox and remove the last pattern
        cy.findByRole('textbox', {  name: /name/i}).type('1');
        cy.findByRole('textbox', {  name: /description/i}).type('1');
        cy.findByRole('textbox', {  name: /source files/i}).type('1');
        cy.findByRole('spinbutton', {  name: /level/i}).type('1');
        cy.get('input[name="patternListItem_0"]').type('1');
        cy.get('input[name="patternListItem_1"]').type('1');
        // clicking on Save button
        cy.findByRole('button', {  name: /save/i}).click();
        cy.wait('@editExistingProgLang');

        cy.contains('th', 'Name').parent().parent().parent().get('tbody').should('not.be.empty');

        // ********************** DELETE **********************
        // clicking on the Delete button of the 1st prog lang
        cy.findByText(nameProgLang + '1').parent().parent().findByTestId('t-modalConfirmation-show').click();
        // clicking on the Confirm button on the Confirmation Modal
        cy.findByRole('button', {  name: /confirm/i}).click();
        cy.wait('@deleteExistingProgLang');

        cy.contains('th', 'Name').parent().parent().parent().get('tbody').should('be.empty');
    })
})