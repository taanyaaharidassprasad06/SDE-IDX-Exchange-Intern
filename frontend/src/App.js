import { Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import FavoritesView from './pages/FavoritesView';
import { FavoritesProvider } from './context/FavoritesContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <FavoritesProvider>
                <Nav />
                <div className="app">
                    <Routes>
                        <Route path="/" element={<ListingsPage />} />
                        <Route path="/favorites" element={<FavoritesView />} />
                        <Route path="/property/:id" element={<PropertyDetailPage />} />
                    </Routes>
                    
                </div>
            </FavoritesProvider>
        </ErrorBoundary>
    );
}

export default App;
