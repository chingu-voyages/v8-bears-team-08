import React, { useEffect, useState } from 'react'
import * as api from '../../api'
import './UserProfile.scss'
import * as util from '../../helpers/util'
import HelpRequestList from '../Home/HelpRequestList'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import Loader from '../../components/Loader'


function UserProfile(props) {
    const [userProfile, setuserProfile] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    
    // This component renders the logged in user's profile, or any other user's profile, but from different routes.
    // If we didn't receive a user's uid in the url, then we should render the logged in user's profile.
    const profileUid = props.match.params.uid || props.loggedInUser.uid

    useEffect(() => {
        setIsLoaded(false)
        api.getUserProfile(profileUid)
            .then(response => {
                setuserProfile({ ...response.data, displayName: util.getDisplayName(response.data.name) })
                setIsLoaded(true)
            })
            .catch(e => {
                console.log(e)
                setIsError(true)
            })
    }, [props.match.params.uid])

    if (isLoaded) {
        return (
            <div className='user-profile'>
                <div className='profile'>
                    <Avatar url={userProfile.photoURL} showHalo={true} size='xl' />

                    <div className='profile-details'>
                        <div className='profile-name-about'>
                            <span className='profile-name'>{userProfile.displayName}</span>
                            <span className='profile-about'>"{userProfile.about}"</span>
                        </div>
                        {userProfile.uid !== props.loggedInUser.uid && <Button>Write Compliment</Button>}
                    </div>
                </div>

                <div>
                    <hr className='profile-separator' />
                    <h2 className='profile-section-text'>Verifications</h2>
                    <ul className='verifications'>
                        { userProfile.emailVerifications.map(verification => (
                          <Verification key={verification.providerId} verification={verification} />  
                        ))}
                    </ul>
                    
                    <hr className='profile-separator' />
                    <h2 className='profile-section-text'>Requests</h2>
                    <HelpRequestList cardSize='small' helpRequests={userProfile.helpRequests} />

                    <hr className='profile-separator' />
                    <h2 className='profile-section-text'>Compliments</h2>
                    <ul className='compliments'>
                        { userProfile.compliments.map(compliment => (
                            <Compliment key={compliment.uid} compliment={compliment} />
                        ))}
                    </ul>
                </div>
            </div>
        )
    } else if (isError) {
        return <div>Error</div>
    } else {
        return <Loader />
    }
}

function Verification({ verification }) {
    if (verification.verified) {
        return (
            <li>
                <i className='material-icons'>check</i>
                <div className='provider'>{verification.providerId.split('.')[0]}</div>
            </li>
        )
    } else {
        return null
    }
}

function Compliment({ compliment }) {
    return (
        <li className='compliment-list-item d-flex flex-row'>
            <img className='compliment-user-pic' src={compliment.complimenter.photoURL} alt={compliment.complimenter.name} />
            <div className='d-flex flex-col'>
                <span className='compliment-user-name'>{ compliment.complimenter.name }</span>
                <span className='compliment-text'>{ compliment.compliment }</span>
            </div>
        </li>
    )
}

export default UserProfile
