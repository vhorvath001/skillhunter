import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProgLangList from './components/admin/prog-lang/ProgLangList';
import Missing from './components/Missing';
import RepositoryList from './components/admin/repository/RepositoryList';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgLangProvider } from './context/ProgLangProvider';
import { RepositoryProvider } from './context/RepositoryProvider';
import Extraction from './components/extraction/Extraction';
import { ExtractionProvider } from './context/ExtractionProvider';
import { SkillTreeProvider } from './context/SkillTreeProvider';
import SkillTree from './components/skillTree/SkillTree';
import { DeveloperProvider } from './context/DeveloperProvider';
import DeveloperList from './components/admin/developer/DeveloperList';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>``
                <Route index element={<Dashboard />} />
                <Route path='admin'>
                    <Route path='prog-langs'>
                        <Route index element={<ProgLangProvider><ProgLangList /></ProgLangProvider>} />
                    </Route>
                    <Route path='repositories'>
                        <Route index element={<RepositoryProvider><RepositoryList /></RepositoryProvider>} />
                    </Route>
                    <Route path='skill-tree'>
                        <Route index element={<SkillTreeProvider><SkillTree /></SkillTreeProvider>} />
                    </Route>
                    <Route path='developers'>
                        <Route index element={<DeveloperProvider><DeveloperList /></DeveloperProvider>} />
                    </Route>
                </Route>
                <Route path='extraction'>
                    <Route index element={ <ExtractionProvider><Extraction /></ExtractionProvider> } />
                </Route>
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    )
}

export default App