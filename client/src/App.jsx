import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Room } from './pages/Roompage';
import { Mainpage } from './pages/Mainpage';

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Routes>
                <Route index path='/' element={<Mainpage />} />
                <Route path='/room/:id' element={<Room />} />
            </Routes>
        </>
    );
}

export default App;
