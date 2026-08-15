import { Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import ListingsPage from './components/ListingsPage';
import PropertyDetailPage from './components/PropertyDetailPage';
import FavoritesView from './components/FavoritesView';
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
