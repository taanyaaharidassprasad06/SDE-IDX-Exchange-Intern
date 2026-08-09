import { Routes, Route } from 'react-router-dom';
import './App.css';
import ListingsPage from './components/ListingsPage';
import PropertyDetailPage from './components/PropertyDetailPage';

function App() {
    return (
        <div className="app">
            <h1 className="heading"><span className="mls">MLS</span> Property Search</h1>
            <Routes>
                <Route path="/" element={<ListingsPage />} />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
            </Routes>
            
        </div>
    );
}

export default App;
