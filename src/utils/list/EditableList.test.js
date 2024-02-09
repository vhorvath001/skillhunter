import { render, screen } from '@testing-library/react';
import EditableList from './EditableList';
import userEvent from '@testing-library/user-event';

test('when no list is passed (no existing data) then one EditableListItem with no value is displayed', () => {
    const list = [];
    const required = true;
    render( <EditableList 
                list={list}
                required={required} /> );
    
    expect(screen.getByRole('textbox').getAttribute('name')).toBe('patternListItem_0');
    expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
    expect(screen.getByRole('textbox').getAttribute('required')).not.toBeNull();
})

test('when a list is passed then EditableListItem(s) with value is displayed', () => {
    const list = ['a', 'b'];
    const required = false;
    render( <EditableList 
                list={list}
                required={required} /> );
    
    verifyTextbox(0, 'patternListItem_0', list[0], required);
    verifyTextbox(1, 'patternListItem_1', list[1], required);
})

test('clicking on remove and add button', async () => {
    const list = ['a', 'b'];
    const required = false;
    render( <EditableList 
                list={list}
                required={required} /> );
    
    await userEvent.click(screen.getByTestId('t-editableListItem-remove'));
    await userEvent.click(screen.getByTestId('t-editableListItem-add'));

    verifyTextbox(0, 'patternListItem_0', list[0], required);
    verifyTextbox(1, 'patternListItem_2', '', required);
})

const verifyTextbox = (idx, id, value, required) => {
    expect(screen.getAllByRole('textbox')[idx].getAttribute('name')).toBe(id);
    expect(screen.getAllByRole('textbox')[idx].getAttribute('value')).toBe(value);
    if (required) {
        expect(screen.getAllByRole('textbox')[idx].getAttribute('required')).not.toBeNull();
    } else {
        expect(screen.getAllByRole('textbox')[idx].getAttribute('required')).toBeNull();
    }
}
