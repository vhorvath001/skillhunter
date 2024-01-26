import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ProgLangList from './admin/prog-lang/ProgLangList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<ProgLangList />} />
                <Route path='admin'>
                    <Route path='prog-lang' element={<ProgLangList />}></Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default App