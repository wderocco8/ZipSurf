import React from 'react'
import Header from './components/Header'
import URL from './components/URL'
import Login from './components/Login'
// import { Route, Routes } from "react-router-dom"
import { auth } from "./firebase"
 
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    
    const user = auth.currentUser

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(user !== null) // update isAuthenticated based on if user signed in
        })

        return unsubscribe
    }, [])

    const handleSignOut = async () => {
        try {
            await auth.signOut()
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <main>
            <div className='welcome-msg'>
                {isAuthenticated && (
                    <div className='welcome-msg-content'>
                        <div>
                            <p>Hello {user.displayName}!</p>
                        </div>
                        <div>
                            <button className='google-btn' onClick={handleSignOut}>Sign out?</button>
                        </div>
                    </div>
                )}
            </div>

            <Header />
            {isAuthenticated ? <URL user={user} /> : <Login />}
            {/* <Routes>
                <Route path='/' element={<Login />} /> 
                <Route path='/shortenURL' element={<URL />} /> 
            </Routes> */}
        </main>
    )
}