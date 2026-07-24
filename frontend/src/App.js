import './App.css';
import ListingsPage from './components/ListingsPage';

function App() {
    return (
        <div className="app">
            <h1 className="heading"><span className="mls">MLS</span> Property Search</h1>
            <ListingsPage />
        </div>
    );
}

export default App;
