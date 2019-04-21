import React, { useEffect, useState } from 'react'
import * as api from '../../api'
import '../../styles/loader.css'
import './UserProfile.scss'
import * as util from '../../helpers/util'



function UserProfile(props) {
    const [userProfile, setuserProfile] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        console.log('useEffect')
        api.getUserProfile(props.match.params.uid)
            .then(response => {
                console.log('r', response.data)
                response.data.displayName = util.getDisplayName(response.data.name)
                setuserProfile(response.data)
                setIsLoaded(true)
            })
            .catch(e => {
                console.log('e', e)
                setIsError(true)
            })
    }, [props.match.params.uid])

    if (isLoaded && userProfile) {
        return (
            <div>
                <div className='d-flex flex-row'>
                    <img className='profile__pic' src={userProfile.photoURL} />
                    <div className='profile--info d-flex flex-col flex-space-between'>
                        <div className='d-flex flex-col'>
                            <span className='profile--info__name'>{userProfile.displayName}</span>
                            <span className='profile--info__about'>"{userProfile.about}"</span>
                        </div>
                        <button>Write a compliment</button>
                    </div>
                </div>
                <div>    
                    <hr />
                    Requests<br />

                    <hr />
                    Compliments
                </div>
            </div>
        )
    } else if (isError) {
        return <div>Error</div>
    } else {
        return <div className='loading'></div>
    }
}

export default UserProfile