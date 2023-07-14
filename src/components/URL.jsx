import React from 'react'
// Import the environment variables from the `.env` file using Vite's `import.meta.env`
const API_TOKEN = import.meta.env.VITE_API_TOKEN

export default function URL() {

    const [url, setURL] = React.useState({
        longURL: "",
        alias: "",
        tiny_url: ""
    })

    const [allURLs, setAllURLs] = React.useState([])
    
    async function fetchTinyURL(event) {
        event.preventDefault();
        try {
            // information for API call
            let body = {
                url: url.longURL,
                alias: url.alias
            };
        
            const response = await fetch('https://api.tinyurl.com/create', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
                })
            
            const data = await response.json()
            console.log(data)
            const newURL = {
                ...url,
                alias: data.data.alias,
                tiny_url: data.data.tiny_url
            }

            setURL(newURL)
            setAllURLs(prevURLs => [...prevURLs, newURL])
        } catch(error) {
            console.error(error);
            // Handle any errors here
          }
    }
      

    function handleChange(event) {
        const {name, value} = event.target
        setURL(prevURL => ({
            ...prevURL,
            [name]: value
        }))
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            fetchTinyURL(event)
        }
    }
    
    /** NOTE -> will later change this into a sidebar component!!!! **/
    const urlElements = allURLs.map((prevURL, index) => (
        <div key={index}>
            <a href={prevURL.tiny_url} target="_blank" rel="noopener noreferrer">{prevURL.tiny_url}</a>
        </div>
    ))

    return (
        <div>
            <div className="form">
                <div className="form--alias">
                    <input 
                        type="text"
                        placeholder="enter an alias (optional)"
                        className="form--inputAlias"
                        name="alias"
                        value={url.alias}
                        onChange={handleChange}
                   />
                </div>

                <div className="form--searchbox">
                    <input 
                        type="text"
                        placeholder="www.reallyLongURL/NeedsShortening.com"
                        className="form--inputURL"
                        name="longURL"
                        value={url.longURL}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className='form--button'
                        onClick={fetchTinyURL}

                    >
                        Shorten  
                    </button>
                </div>
            </div>

            <div>
                {urlElements}
            </div>
        </div>
    )
}