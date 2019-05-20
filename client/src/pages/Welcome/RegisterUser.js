import React, { useState } from 'react'
import Button from '../../components/Button'
import * as api from '../../api'
import './Welcome.scss'


function RegisterUser(props) {
    const [firstName, setFirstName] = useState(props.user.firstName || '')
    const [lastName, setLastName] = useState(props.user.lastName || '')
    const [location, setLocation] = useState(props.user.location || '')
    const [isLoading, setIsLoading] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        
        const user = props.user
        user.firstName = firstName
        user.lastName = lastName
        user.location = location

        api.registerUser(user)
            .then(response => {
                setIsLoading(false)
                props.onUserRegistered(response.data)
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
            </section>
            
            <section>
                <Button isLoading={isLoading}>Sign Up</Button>
            </section>
        </form>
    )
}

export default RegisterUser
