import React from 'react'
import LightMode from '../icons/ThemeLight.svg'
import DarkMode from '../icons/ThemeDark.svg'

export default function Navbar({ toggleTheme, theme }) {

    return (
        <nav className='navbar'>
            <ul className='navbar-nav'>
                <div className='theme' onClick={toggleTheme}>
                    {theme === "light" 
                        ?
                        <img src={DarkMode} alt=''/>
                        :
                        <img src={LightMode} alt=''/>
                    }
                </div>
            </ul>
        </nav>
    )
}