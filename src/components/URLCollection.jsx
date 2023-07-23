import React from 'react'

export default function URLCollection(props) {

    const urlElements = props.allURLs.map((url, index) => (
        <div key={index}>
            <div className="delete-btn-container">
                <span className='delete-btn' onClick={() => props.deleteURL(url.id)}></span>
                <div className='delete-url'>
                    <a href={url.tiny_url} target="_blank" rel="noopener noreferrer">{url.tiny_url}</a>
                </div>
                {/* <i className="gg-trash trash-icon"></i> */}
                
            </div>
        </div>
    ))

    return (
        <div className='all-urls'>
            {urlElements}
        </div>
    )
}
