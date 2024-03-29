import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

const Missing = (): ReactElement => {
    return (
        <main className="admin-container">
            <h2>Page Not Found!</h2>
            <p>Well, sorry, that's disappointing...</p>
            <p>
                <Link to='/'>Go to Home page</Link>
            </p>
        </main>
    )
}

export default Missing