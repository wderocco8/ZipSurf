import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Copy from '../icons/Copy.svg'

export default function URLCollection(props) {

    const urlElements = props.allURLs.map((url, index) => (
        <div key={index}>
            <div className="delete-btn-container">
                <CopyToClipboard text={url.tiny_url}>
                    <img className='copy-icon' src={Copy} alt="" />
                </CopyToClipboard>
                <span className='delete-btn' onClick={() => props.deleteURL(url.id)}></span>
                <div className='delete-url'>
                    <a href={url.tiny_url} target="_blank" rel="noopener noreferrer">{url.tiny_url}</a>
                </div>
                
            </div>
        </div>
    ))

    return (
        <div className='all-urls'>
            {urlElements}
        </div>
    )
}
