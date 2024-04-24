import { render, screen } from '@testing-library/react'
import ModalForm from './ModalForm'
import { FormEvent, ReactElement } from 'react'
import userEvent from '@testing-library/user-event'

test('Displaying the modal form and clicking on the icon so the body is displayed', async () => {
    const formId: string = '11'
    const title: string = 'title11'
    const body: ReactElement = <div data-testid='body11'>aaa</div>
    const icon: ReactElement = <img data-testid='img11' />

    render( <ModalForm 
                formId={formId}
                title={title} 
                body={body} 
                icon={icon}
                handleSave={() => {}}
                dispatch={() => {}} /> )

    expect(screen.queryByTestId('img11')).toBeInTheDocument()
    expect(screen.queryByTestId('body11')).not.toBeInTheDocument()

    await userEvent.click(screen.getByTestId('t-modal-show'))

    expect(screen.queryByTestId('body11')).toBeInTheDocument()
})

test('Displaying the modal form and clicking on the icon so the body is displayed but error text is shown too', async () => {
    const formId: string = '11'
    const title: string = 'title11'
    const body: ReactElement = <div data-testid='body11'>aaa</div>
    const icon: ReactElement = <img data-testid='img11' />
    const handleSave = async (dispatch: any, e: FormEvent<HTMLFormElement>, handleClose: any, setErrorMessage: (errorMessage: string) => void) => {
        e.preventDefault();
        setErrorMessage('Exceptione!')
    }

    render( <ModalForm 
                formId={formId}
                title={title} 
                body={body} 
                icon={icon}
                handleSave={handleSave}
                dispatch={() => {}} /> )

    // click on the icon to show the modal
    await userEvent.click(screen.getByTestId('t-modal-show'))
    // click on the Save button => the dialog won't disappear, error text is shown
    await userEvent.click(screen.getByText('Save'))

    screen.debug()

    expect(screen.queryByTestId('body11')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('alert')?.textContent).toBe('Exceptione!')
    // expect(screen.queryBy
})