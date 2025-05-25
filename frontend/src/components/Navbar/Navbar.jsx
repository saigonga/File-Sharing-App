import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../Firebase/auth';
import styles from './Navbar.module.css';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await doSignOut();
        navigate('/', { replace: true });
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.nav_container}>
                <div className={styles.logo_container}>
                    <img src="/logo.png" alt="Logo" className={styles.logo_img} />
                    <span className={styles.logo_text}>FileShare</span>
                </div>
                <button onClick={handleLogout} className={styles.logout_btn}>
                    <span>Logout</span>
                    <svg className={styles.logout_icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 16L21 12M21 12L17 8M21 12H9M9 21H7C5.93913 21 4.92172 20.5786 4.17157 19.8284C3.42143 19.0783 3 18.0609 3 17V7C3 5.93913 3.42143 4.92172 4.17157 4.17157C4.92172 3.42143 5.93913 3 7 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;