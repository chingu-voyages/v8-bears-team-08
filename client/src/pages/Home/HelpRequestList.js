import React, { useContext } from 'react'
import HelpRequestCard from './HelpRequestCard'
import './HelpRequestList.scss'


function HelpRequestList(props) {
    return (
        <ul className='help-request-list'>
            { props.helpRequests.map(helpRequest => (
                <HelpRequestCard cardSize={props.cardSize} key={helpRequest.uid} helpRequest={helpRequest} />
            ))}
        </ul>
    )
}

export default HelpRequestList