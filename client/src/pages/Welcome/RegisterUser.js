import React, { useState } from 'react'
import Button from '../../components/Button'
import { Redirect } from 'react-router-dom'
import * as api from '../../api'
import './Welcome.scss'


function RegisterUser(props) {
    const user = props.location.state.user
    const referrer = props.location.state.referrer || ''
    const [firstName, setFirstName] = useState(user.firstName || '')
    const [lastName, setLastName] = useState(user.lastName || '')
    const [location, setLocation] = useState(user.location || '')
    const [about, setAbout] = useState(user.about || '')
    const [isLoading, setIsLoading] = useState(false)

    if (!props.location.state || !props.location.state.user) {
        return <Redirect to='/login' />
    }

    function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        
        user.firstName = firstName
        user.lastName = lastName
        user.location = location
        user.about = about

        api.registerUser(user)
            .then(response => {
                setIsLoading(false)
                props.onUserRegistered(response.data, referrer)
            })
            .catch(e => {
                setIsLoading(false)
            })
    }

    return (
        <form onSubmit={handleSubmit} className='register d-flex flex-col'>
            <section>
                <h1>Tell us a bit about yourself.</h1>
            </section>

            <section>
                <input
                    type='text'
                    id='firstName'
                    placeholder='Your First Name'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                />
                <input
                    type='text'
                    id='lastName'
                    placeholder='Your Last Name'
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                />
                <input
                    type='text'
                    id='zip'
                    placeholder='Your Zip Code'
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                />
                <input
                    type='text'
                    id='about'
                    placeholder='About you'
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    required
                />
            </section>
            
            <section>
                <Button isLoading={isLoading}>Sign Up</Button>
            </section>
        </form>
    )
}

export default RegisterUser
