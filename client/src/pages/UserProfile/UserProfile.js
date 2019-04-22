import React, { useEffect, useState } from 'react'
import * as api from '../../api'
import '../../styles/loader.css'
import './UserProfile.scss'
import * as util from '../../helpers/util'
import HelpRequest from '../Home/HelpRequest';


function UserProfile(props) {
    const [userProfile, setuserProfile] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        api.getUserProfile(props.match.params.uid)
            .then(response => {
                response.data.displayName = util.getDisplayName(response.data.name)
                setuserProfile(response.data)
                setIsLoaded(true)
            })
            .catch(e => {
                setIsError(true)
            })
    }, [props.match.params.uid])

    if (isLoaded) {
        return (
            <>
                <div className='profile'>
                    <img className='profile-pic' src={userProfile.photoURL} />

                    <div className='profile-details'>
                        <div className='profile-name-about'>
                            <span className='profile-name'>{userProfile.displayName}</span>
                            <span className='profile-about'>"{userProfile.about}"</span>
                        </div>
                        <button id='profile-compliment-button'>Write a Compliment</button>
                    </div>
                </div>

                <div>    
                    <hr className='profile-separator' />
                    <h2 className='profile-section-text'>Requests</h2>
                    <ul>
                        { userProfile.helpRequests.map(helpRequest => (
                            <HelpRequest key={helpRequest.uid} helpRequest={helpRequest} />
                        ))}
                    </ul>

                    <hr className='profile-separator' />
                    <h2 className='profile-section-text'>Compliments</h2>
                    <ul>
                        { userProfile.compliments.map(compliment => (
                            <Compliment key={compliment.uid} compliment={compliment} />
                        ))}
                    </ul>
                </div>
            </>
        )
    } else if (isError) {
        return <div>Error</div>
    } else {
        return <div className='loading'></div>
    }
}

function Compliment({ compliment }) {
    return (
        <li id="temp" className='compliment-list-item d-flex flex-row'>
            <img className='compliment-user-pic' src={compliment.complimenter.photoURL} />
            <div className='d-flex flex-col'>
                <span className='compliment-user-name'>{ compliment.complimenter.name }</span>
                <span className='compliment-text'>{ compliment.compliment }</span>
            </div>
        </li>
    )
}

export default UserProfile
