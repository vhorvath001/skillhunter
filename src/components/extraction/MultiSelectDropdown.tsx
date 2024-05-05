import { ChangeEvent, useState } from 'react'
import { Form } from 'react-bootstrap'
import { OptionType } from '../../context/ContextFunctions'

type PropsType = {
    options: OptionType[]
    selectedOptions: string[],
    setSelectedOptions: (selectedOption: string[]) => void
}

const MultiSelectDropdown = ({ options, selectedOptions, setSelectedOptions }: PropsType) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const optionKey: string = event.target.value
        const isChecked: boolean = event.target.checked

        if (isChecked) {
            setSelectedOptions([...selectedOptions, optionKey]);
        } else {
            setSelectedOptions(selectedOptions.filter((key) => key !== optionKey));
        }
    };

    return (
        <div className={`dropdown ${isOpen ? 'show' : ''}`}>
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="multiSelectDropdown"
                onClick={toggleDropdown} >
                [{options.filter(o => selectedOptions.includes(o.key)).map(o => o.value).join(', ')}]&nbsp;&nbsp;
            </button>
            <div className={`dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby="multiSelectDropdown">
                {options.map((option) => (
                    <Form.Check
                        style={{ marginLeft: "10%" }}
                        key={option.key}
                        type="checkbox"
                        id={`option_${option.key}`}
                        label={option.value}
                        checked={selectedOptions.includes(option.key)}
                        onChange={handleOptionChange}
                        value={option.key} />
                ))}
            </div>
        </div>
    );
};

export default MultiSelectDropdown;