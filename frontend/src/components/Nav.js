import { useNavigate } from 'react-router-dom';
import './Nav.css';

function Nav() {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="logo">
                <h3>HomeSearch</h3>
                <p>Your next chapter starts here.</p>
            </div>
            <div className="nav-btn-container">
                <button className="homepage-btn" onClick={() => navigate("/")}>Home</button>
                <button className="favorites-page-btn" onClick={() => navigate('/favorites')}>Favorites</button>
            </div>
        </nav>
    );
}

export default Nav;