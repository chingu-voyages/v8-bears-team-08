import React from 'react'
import { Link } from 'react-router-dom'
import * as util from '../../helpers/util'
import './HelpRequest.scss'


function HelpRequest({ helpRequest }) {
    // Display only the first character of the user's last name
    const displayName = util.getDisplayName(helpRequest.user.name)
    
    let neededAt
    if (helpRequest.neededAsap) {
        neededAt = 'ASAP'
    } else {
        neededAt = util.getRelativeLocaleTime(new Date(helpRequest.neededDatetime))
    }
    
    return (
        <li className='help-request__list-item'>
            <Link 
                to={{ pathname: `/help-requests/${helpRequest.uid}`, state: helpRequest }} 
                className='help-request__list-item__link-container d-flex flex-row'
                >
                <div className='help-request-list-item__info'>
                    <div>
                        {displayName}<br />
                        needs<br />
                        <span className='help-request-list-item__title'>{helpRequest.title}</span><br />
                        {neededAt}<br />
                        {helpRequest.tags && helpRequest.tags.join(', ')}
                    </div>
                </div>
                
                <img
                    className='help-request-list-item__photo'
                    src={helpRequest.photoURL || helpRequest.user.photoURL}
                />
            </Link>
        </li>
    )
}

export default HelpRequest