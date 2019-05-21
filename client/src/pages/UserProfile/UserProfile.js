import React, { useEffect, useState } from 'react'
import * as api from '../../api'
import '../../styles/loader.css'
import './UserProfile.scss'
import * as util from '../../helpers/util'
import HelpRequestList from '../Home/HelpRequestList'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'


function UserProfile(props) {
    const [userProfile, setuserProfile] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        api.getUserProfile(props.match.params.uid)
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
                        <Button>Write a Compliment</Button>
                    </div>
                </div>

                <div>    
                    <hr className='profile-separator' />
                    <h2 className='profile-section-text'>Requests</h2>
                    <ul>
                        <HelpRequestList helpRequests={userProfile.helpRequests} />
                    </ul>

                    <hr className='profile-separator' />
                    <h2 className='profile-section-text'>Compliments</h2>
                    <ul>
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
        return <div className='loading'></div>
    }
}

function Compliment({ compliment }) {
    return (
        <li id="temp" className='compliment-list-item d-flex flex-row'>
            <img className='compliment-user-pic' src={compliment.complimenter.photoURL} alt={compliment.complimenter.name} />
            <div className='d-flex flex-col'>
                <span className='compliment-user-name'>{ compliment.complimenter.name }</span>
                <span className='compliment-text'>{ compliment.compliment }</span>
            </div>
        </li>
    )
}

export default UserProfile
