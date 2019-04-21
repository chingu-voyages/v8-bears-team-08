import React from 'react'
import moment from 'moment'
import * as util from '../../helpers/util'
import './HelpRequest.scss'


function HelpRequest({ helpRequest }) {
    // Display only the first character of the user's last name
    const displayName = util.getDisplayName(helpRequest.user.name)
    
    let neededAt
    if (helpRequest.neededAsap) {
        neededAt = 'ASAP'
    } else {
        // get dates in local timezone
        const now = moment(new Date())
        const requestNeededDatetime = moment(new Date(helpRequest.neededDatetime))
        
        // convert to relative date/time string
        if (requestNeededDatetime.diff(now, 'hours') <= 4) {
            neededAt = requestNeededDatetime.fromNow()
        } else {
            neededAt = requestNeededDatetime.calendar()
        }
    }
    
    return (
        <li className='help-request__list-item d-flex flex-row'>
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
            ></img>
        </li>
    )
}

export default HelpRequest