import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// https://testing-library.com/docs/example-react-router/
test('navigating to admin / prog langs', async () => {
    const adminMenu = await clickOnAdminMenu();
    await userEvent.click(adminMenu.getByText(/Programming Languages/i));

    expect(screen.getByText(/List of Programming Languages/i)).toBeInTheDocument();
});

test('navigating to admin / repositories', async () => {
    const adminMenu = await clickOnAdminMenu();
    await userEvent.click(adminMenu.getByText(/Repositories/i));

    expect(screen.getByText(/List of Repositories/i)).toBeInTheDocument();
});

async function clickOnAdminMenu() {
    render(<App />, { wrapper: BrowserRouter });

    // first simulating to click on the 'Administration'
    const tMenuAdmin = screen.getByTestId('t-menu-admin');
    await userEvent.click(within(tMenuAdmin).getByRole('button'));
    // screen.debug();
    return within(tMenuAdmin);
}