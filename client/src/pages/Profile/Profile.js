import React, { useEffect, useState } from 'react'
import HelpRequestList from '../Home/HelpRequestList'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import LeaveComplimentDialog from '../../components/LeaveComplimentDialog'
import * as api from '../../api'
import * as util from '../../helpers/util'
import './Profile.scss'

/*
 * This component renders the logged in user's profile, or any other user's profile, but from different routes.
 */
function Profile({ loggedInUser, location, match }) {
    const [shouldDisplayLeaveComplimentDialog, setShoulDisplayLeaveComplimentDialog] = useState(false)
    const [userProfile, setuserProfile] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (location.state) {
            setuserProfile({ ...location.state.data, displayName: util.getDisplayName(location.state.data.name )})
            setIsLoaded(true)
        }  else {
            // If we didn't receive a user's uid in the url, then we should render the logged in user's profile.
            const profileUid = match.params.uid || loggedInUser.uid

            api.getUserProfile(profileUid)
                .then(response => {
                    setuserProfile({ ...response.data, displayName: util.getDisplayName(response.data.name) })
                    setIsLoaded(true)
                })
                .catch(e => {
                    console.log(e)
                    setIsError(true)
                })
        }
    }, [location, loggedInUser, match.params.uid])

    function handleComplimentSaved(compliment) {
        const compliments = userProfile.compliments
        compliments.unshift(compliment)
        console.log(compliments)
        setuserProfile({ ...userProfile, compliments })
    }

    if (isLoaded) {
        return (
            <>
                <LeaveComplimentDialog
                    shouldShow={shouldDisplayLeaveComplimentDialog}
                    hide={() => setShoulDisplayLeaveComplimentDialog(false)}
                    onComplimentSaved={handleComplimentSaved}
                    complimentee={userProfile}
                />
            
                <div className='user-profile'>
                    <div className='profile'>
                        <Avatar url={userProfile.photoURL} showHalo={true} size='xxl' alt={userProfile.displayName} />

                        <div className='profile-details'>
                            <div className='profile-name-about'>
                                <span className='profile-name'>{userProfile.displayName}</span>
                                <span className='profile-num-helped'>
                                    <p>I've helped <strong>{userProfile.numTimesHelped}</strong> {userProfile.numTimesHelped === 1 ? 'neighbor' : 'neighbors'} in</p>
                                    <p className='profile-location'>&nbsp;{userProfile.location}</p>
                                </span>
                                <span className='profile-about'>"{userProfile.about}"</span>
                            </div>
                            {userProfile.uid !== loggedInUser.uid && <Button onClick={() => setShoulDisplayLeaveComplimentDialog(true)}>Write Compliment</Button>}
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
                        <h2 className='profile-section-text'>Active Requests</h2>
                        <HelpRequestList cardSize='small' helpRequests={userProfile.helpRequests} />

                        <hr className='profile-separator' />
                        <h2 className='profile-section-text'>Latest Compliments</h2>
                        <ul className='compliments'>
                            { userProfile.compliments.map(compliment => (
                                <Compliment key={compliment.uid} compliment={compliment} />
                            ))}
                        </ul>
                    </div>
                </div>
            </>
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
            <Avatar url={compliment.complimenter.photoURL} alt={util.getDisplayName(compliment.complimenter.name)} size='medium' kind='square' />
            <div className='d-flex flex-col flex-center-vertical'>
                <div className='d-flex flex-row'>
                    <div className='compliment-user-name'>{ util.getDisplayName(compliment.complimenter.name) }</div>
                    <div className='compliment-date'>{ util.getRelativeTime(compliment.created) }</div>
                </div>
                <div className='compliment-text'>{ compliment.compliment }</div>
            </div>
        </li>
    )
}

export default Profile
