import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditableList from './EditableList'

test('when no list is passed (no existing data) then no EditableListItem is displayed', () => {
    const list: string[] = []
    const required: boolean = true

    render( <EditableList
                list={list}
                inputName='input_'
                required={required} /> )
    
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('when a list is passed then EditableListItem(s) with value is displayed', () => {
    const list: string[] = ['a', 'b']
    const required: boolean = false
    const inputName: string = 'input_'
    
    render( <EditableList 
                list={list}
                inputName={inputName}
                required={required} /> )
    
    verifyTextbox(0, inputName+'0', list[0], required)
    verifyTextbox(1, inputName+'1', list[1], required)
})

test('clicking on remove and add button', async () => {
    const list: string[] = ['a', 'b']
    const required: boolean = false
    const inputName: string = 'input_'

    render( <EditableList 
                list={list}
                inputName={inputName}
                required={required} /> )
    
    await userEvent.click(screen.getAllByTestId('t-editableListItem-remove')[1])
    await userEvent.click(screen.getByTestId('t-editableListItem-add'))

    verifyTextbox(0, inputName+'0', list[0], required)
    verifyTextbox(1, inputName+'2', '', required)
})

const verifyTextbox = (idx: number, id: string, value: string, required: boolean) => {
    expect(screen.getAllByRole('textbox')[idx].getAttribute('name')).toBe(id);
    expect(screen.getAllByRole('textbox')[idx].getAttribute('value')).toBe(value);
    if (required) {
        expect(screen.getAllByRole('textbox')[idx].getAttribute('required')).not.toBeNull();
    } else {
        expect(screen.getAllByRole('textbox')[idx].getAttribute('required')).toBeNull();
    }
}
