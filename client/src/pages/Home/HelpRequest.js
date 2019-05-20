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
                className='help-request__list-item__link-container d-flex flex-row'
                to={{ pathname: `/help-requests/${helpRequest.uid}`, state: helpRequest }} 
                >
                <div className='help-request-list-item__info'>
                    <div>
                        <h4 className='heading-4'><strong>{displayName}</strong></h4>
                        needs<br />
                        <h3 className='heading-3 primary-font-color'>{helpRequest.title}</h3>
                    </div>
                    <div className='help-request-list-item__sub-info d-flex flex-row flex-space-between'>
                        <div>
                            Near you<br />
                            {neededAt}
                        </div>
                        <div>
                            {helpRequest.tags && helpRequest.tags.join(', ')}
                        </div>
                    </div>
                </div>
                
                <img
                    className='help-request-list-item__photo'
                    src={helpRequest.photoURL || helpRequest.user.photoURL}
                    alt='Help Request'
                />
            </Link>
        </li>
    )
}

export default HelpRequest