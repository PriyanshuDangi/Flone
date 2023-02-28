import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import LogoImg from '../../assets/images/2242.png';
import WalletButton from '../walletButton/WalletButton';
import { NavLink } from 'react-router-dom';
import styleClasses from './styles.module.css';

const NavBar = ({ background, color, scroll }) => {
    const [navbarActive, setNavbarActive] = useState(false);
    const [toggleNavbar, setToggleNavbar] = useState(false);
    const [walletVariant, setWalletVariant] = useState('');

    useEffect(() => {
        const checkNavbarActive = () => {
            if (window.scrollY > 0 && scroll) {
                setNavbarActive(true);
                setWalletVariant('');
            } else {
                setWalletVariant('dark');
                setNavbarActive(false);
            }
        };
        window.addEventListener('scroll', checkNavbarActive);
        checkNavbarActive();
        return () => {
            window.removeEventListener('scroll', checkNavbarActive);
        };
    }, []);

    return (
        <>
            <header
                className={`${styleClasses.navbar} ${navbarActive ? styleClasses.navbarActive : ''}`}
                style={{
                    background: background !== 'transparent' && background,
                }}
            >
                <div className={styleClasses.logoContainer}>
                    <NavLink to="/">
                        <img alt="Logo" src={LogoImg} />
                    </NavLink>
                </div>
                <div className={styleClasses.expandMenu}>
                    <MenuIcon
                        onClick={() => {
                            setToggleNavbar(!toggleNavbar);
                        }}
                    />
                </div>
                <div
                    className={`${styleClasses.navbarLinksContainer} ${toggleNavbar ? styleClasses.toggleNavbar : ''}`}
                >
                    <li>
                        <NavLink
                            className={styleClasses.navbarLink}
                            style={{ color: color !== 'inherit' && color }}
                            to="/"
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className={styleClasses.navbarLink}
                            style={{ color: color !== 'inherit' && color }}
                            to="/world"
                        >
                            World
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className={styleClasses.navbarLink}
                            style={{ color: color !== 'inherit' && color }}
                            to="/admin"
                        >
                            Admin
                        </NavLink>
                    </li>
                </div>
                <div
                    className={`${styleClasses.navbarRightContainer} ${toggleNavbar ? styleClasses.toggleNavbar : ''}`}
                >
                    <div className="d-flex gap-3">
                        <WalletButton variant={walletVariant} />
                    </div>
                </div>
            </header>
        </>
    );
};

NavBar.defaultProps = {
    scroll: false,
    background: 'rgba(35, 44, 21, 1)',
    color: '#fff',
    walletVariant: 'dark',
};

export default NavBar;
