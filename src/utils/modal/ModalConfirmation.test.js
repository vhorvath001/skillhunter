import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ModalConfirmation from './ModalConfirmation';

test('Displaying correctly a simple confirmation modal', async () => {
    const id = 647;
    const handleOperation = () => {}

    render( <ModalConfirmation 
                message='Are you sure to delete the record?'
                id={id}
                handleOperation={handleOperation} /> );
    
    // clicking to open the dialog
    await userEvent.click(screen.getByTestId('t-modalConfirmation-show'));

    expect(screen.getByText(/Are you sure to delete the record/i)).toBeInTheDocument();
})

test('Displaying the confirmation modal and set error message when clicking on Confirm', async () => {
    const id = 647;
    const handleOperation = (e, handleClose, setErrorMessage, passedId) => {
        expect(passedId).toBe(id);
        setErrorMessage('Network Error');
    }

    render( <ModalConfirmation 
                message='Are you sure to delete the record?'
                id={id}
                handleOperation={handleOperation} /> );
    
    // clicking to open the dialog
    await userEvent.click(screen.getByTestId('t-modalConfirmation-show'));
    // clicking on Confirm
    await userEvent.click(screen.getByText('Confirm'));

    expect(screen.getByText(/Are you sure to delete the record/i)).toBeInTheDocument();
    expect(within(screen.getByRole('alert')).getByText(/Network Error/i)).toBeInTheDocument();
    screen.debug();
})

test('Displaying the confirmation modal and no error message when clicking on Confirm', async () => {
    const id = 647;
    const handleOperation = (handleClose, setErrorMessage, passedId) => {
        expect(passedId).toBe(id);
        setErrorMessage('');
        handleClose();
    }

    render( <ModalConfirmation 
                message='Are you sure to delete the record?'
                id={id}
                handleOperation={handleOperation} /> );
    
    // clicking to open the dialog
    await userEvent.click(screen.getByTestId('t-modalConfirmation-show'));
    // clicking on Confirm
    await userEvent.click(screen.getByText('Confirm'));

    expect(screen.queryByText(/Are you sure to delete the record/i)).not.toBeInTheDocument();
})