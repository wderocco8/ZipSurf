import { Link } from "react-router-dom"

export default function Header() {
    return(
        <div className='header'>
            <h1 className='title'>
                <span className='blue-text'>Zip</span>Surf
            </h1>
            <p className='description'>Enter any valid link that is too longggggggg!!</p>

            {/* <section>
                <Link to="/">
                    Login
                </Link>
                <Link to="/shortenURL">
                    Shorten
                </Link>
            </section> */}
            
        </div>
    )
}