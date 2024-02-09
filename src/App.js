import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ProgLangList from './admin/prog-lang/ProgLangList';
import Missing from './Missing';
import RepositoryList from './admin/repository/RepositoryList';
import Dashboard from './Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path='admin'>
                    <Route path='prog-langs'>
                        <Route index element={<ProgLangList />} />
                    </Route>
                    <Route path='repositories'>
                        <Route index element={<RepositoryList />} />
                    </Route>
                </Route>
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    )
}

export default App