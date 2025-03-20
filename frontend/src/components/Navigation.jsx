import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/all">View Products</Link>
            <Link to="/add">add product</Link>
        </nav>
    );
}

export default Navigation;
