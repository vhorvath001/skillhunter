import { ReactElement } from 'react';

const ProgLangListHeader = (): ReactElement => {
    return (
        <thead>
            <tr>
                <th className='col-11 text-center'>Name</th>
                <th className='col-1'></th>
            </tr>
        </thead>
    )
}

export default ProgLangListHeader;