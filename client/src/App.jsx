import { Routes, Route, Link } from 'react-router-dom';
import { Room } from './pages/Roompage';
import { Mainpage } from './pages/Mainpage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage'; // Новый компонент для загрузки видео

function App() {
    return (
        <>
            <Routes>
                <Route index path='/' element={<Mainpage />} />
                <Route path='/room/:id' element={<Room />} />
                <Route path='/room/userUploads/:id' element={<Room />} />
                <Route path='/auth/*' element={<AuthPage />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/upload' element={<UploadPage />} />{' '}
                {/* Новый маршрут */}
            </Routes>
        </>
    );
}

export default App;
