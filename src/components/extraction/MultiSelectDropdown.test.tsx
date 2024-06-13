import { render, screen } from '@testing-library/react'
import MultiSelectDropdown from './MultiSelectDropdown'
import { OptionType } from '../../context/ContextFunctions'
import userEvent from '@testing-library/user-event'

test('selecting an item', async () => {
    const options: OptionType[] = [
        { 'key': 'k0', 'value': 'v0' },
        { 'key': 'k1', 'value': 'v1' },
        { 'key': 'k2', 'value': 'v2' },
    ]
    const selectedOptions: string[] = ['k1']
    const mockedSetSelectedOptions = vi.fn()

    render(
        <MultiSelectDropdown 
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={mockedSetSelectedOptions}
        />
    )

    // clicking on the button to show the dropdown
    await userEvent.click(screen.queryByRole('button')!)
    // clicking on an item in the dropdown
    await userEvent.click(screen.queryByTestId('option_k0')!)
    
    expect(mockedSetSelectedOptions).toHaveBeenCalledTimes(1)
    expect(mockedSetSelectedOptions).toHaveBeenCalledWith(['k1', 'k0'])
})

test('unselecting an item', async () => {
    const options: OptionType[] = [
        { 'key': 'k0', 'value': 'v0' },
        { 'key': 'k1', 'value': 'v1' },
        { 'key': 'k2', 'value': 'v2' },
    ]
    const selectedOptions: string[] = []
    const mockedSetSelectedOptions = vi.fn()

    render(
        <MultiSelectDropdown 
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={mockedSetSelectedOptions}
        />
    )

    // clicking on the button to show the dropdown
    await userEvent.click(screen.queryByRole('button')!)
    // clicking on an item in the dropdown twice
    await userEvent.click(screen.queryByTestId('option_k1')!)
    await userEvent.click(screen.queryByTestId('option_k1')!)
    
    expect(mockedSetSelectedOptions).toHaveBeenCalledTimes(2)
    expect(mockedSetSelectedOptions).toHaveBeenCalledWith([])
})