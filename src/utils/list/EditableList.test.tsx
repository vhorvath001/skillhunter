import { render, screen } from '@testing-library/react';
import EditableList from './EditableList';
import userEvent from '@testing-library/user-event';

test('when no list is passed (no existing data) then no EditableListItem is displayed', async () => {
    const list: string[] = [];
    const required: boolean = true;
    await render( <EditableList 
                list={list}
                required={required} /> );
    
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('when a list is passed then EditableListItem(s) with value is displayed', async () => {
    const list: string[] = ['a', 'b'];
    const required: boolean = false;
    await render( <EditableList 
                list={list}
                required={required} /> );
    
    verifyTextbox(0, 'patternListItem_0', list[0], required);
    verifyTextbox(1, 'patternListItem_1', list[1], required);
})

test('clicking on remove and add button', async () => {
    const list: string[] = ['a', 'b'];
    const required: boolean = false;
    await render( <EditableList 
                list={list}
                required={required} /> );
    
    await userEvent.click(screen.getByTestId('t-editableListItem-remove'));
    await userEvent.click(screen.getByTestId('t-editableListItem-add'));

    verifyTextbox(0, 'patternListItem_0', list[0], required);
    verifyTextbox(1, 'patternListItem_2', '', required);
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
