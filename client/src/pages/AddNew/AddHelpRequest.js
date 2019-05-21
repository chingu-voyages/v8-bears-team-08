import React, { useState, useEffect, useRef, useContext } from 'react'
import Button from '../../components/Button'
import { LoggedInUserContext } from '../../App'
import DatePicker from 'react-datepicker'
import * as api from '../../api'
import './AddHelpRequest.scss'
import 'react-datepicker/dist/react-datepicker.css'

function AddHelpRequest(props) {
    const loggedInUser = useContext(LoggedInUserContext)
    const formRef = useRef()
    const datetimeRef = useRef()
    const asapRef = useRef()
    const fileInputRef = useRef()
    const selectedPhotoRef = useRef()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        neededAsap: false,
        neededDatetime: '',
        tags: '',
        photo: ''
    })

    useEffect(() => {
        toggleRequiredDateFields(!(formState.neededAsap || formState.neededDatetime))
    }, [formState.neededAsap, formState.neededDatetime])

    function handleSubmit(e) {
        e.preventDefault()
        
        if (formState.title && formState.description && (formState.neededAsap || formState.neededDatetime)) {
            setIsSubmitting(true)
            const formData = new FormData(formRef.current)
            if (formState.neededDatetime) {
                // use from state to keep the timezone
                formData.set('neededDatetime', formState.neededDatetime)
            }
            formData.set('location', loggedInUser.location)
            formData.set('userUid', loggedInUser.uid)
            formData.set('userName', loggedInUser.name)
            formData.set('userPhotoURL', loggedInUser.photoURL)
            
            api.saveHelpRequest(formData)
                .then(response => {
                    props.history.push({
                        pathname: '/help-requests/' + response.data.uid,
                        state: response.data
                    })
                })
                .catch(e => console.log(e.response))
                .finally(() => setIsSubmitting(false))
        } else {
            console.log('no', formState)
            e.preventDefault()
        }
    }

    function handleDatetime(datetime) {
        setFormState({ ...formState, neededAsap: false, neededDatetime: datetime })
    }

    function handleAsap() {
        setFormState({ ...formState, neededAsap: !formState.neededAsap, neededDatetime: '' })
    }

    function toggleRequiredDateFields(isRequired) {
        datetimeRef.current.input.required = isRequired
        asapRef.current.required = isRequired
    }

    function handlePhotoSelection(e) {
        if (e.target.files[0]) {
            setFormState({...formState, photo: e.target.files[0] })
            const reader = new FileReader()
            reader.onload = function() {
                selectedPhotoRef.current.src = reader.result
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    return (
        <div className='d-flex flex-col add-help-request'>
            <form id='form' onSubmit={handleSubmit} ref={formRef}>
                <section>
                    <h4>I need...</h4>
                    <input
                        type='text'
                        name='title'
                        value={formState.title}
                        onChange={e => setFormState({ ...formState, title: e.target.value })}
                        placeholder='up to 80 characters'
                        maxLength='80'
                        required />
                </section>

                <section>
                    <h4>Description</h4>
                    <textarea 
                        rows='10'
                        cols='50'
                        name='description'
                        value={formState.description}
                        onChange={e => setFormState({ ...formState, description: e.target.value })}
                        placeholder='Add a description (up to 500 characters)'
                        maxLength='500'
                        required 
                    />
                </section>

                <section>
                    <h4>When</h4>
                    <div>
                        <DatePicker
                            name='neededDatetime'
                            showTimeSelect
                            timeFormat="h:mm aa"
                            timeIntervals={15}
                            dateFormat="Pp"
                            timeCaption="time"
                            selected={formState.neededDatetime}
                            onChange={handleDatetime}
                            placeholderText='Click to select a date'
                            ref={datetimeRef}
                            minDate={new Date()}
                            forceShowMonthNavigation
                            required
                        />
                        <span>or</span>
                        <input
                            type='checkbox'
                            id='neededAsap'
                            name='neededAsap'
                            checked={formState.neededAsap}
                            onChange={handleAsap}
                            ref={asapRef}
                            required
                        />
                        <label htmlFor='neededAsap'>ASAP</label>
                    </div>
                </section>

                <section>
                    <h4>Tags</h4>
                    <input
                        type='text'
                        name='tags'
                        value={formState.tags}
                        onChange={e => setFormState({ ...formState, tags: e.target.value })}
                        placeholder='Enter up to 5 (comma-separated)'
                    />
                </section>

                <section>
                    <h4>Upload photo (optional)</h4>
                    <div className='d-flex flex-row'>
                        <input
                            type='file'
                            name='photo'
                            accept='image/*'
                            style={{display: "none"}}
                            onChange={handlePhotoSelection}
                            ref={fileInputRef}
                        />
                        <div className='photo' onClick={() => fileInputRef.current.click()}>
                            <img className='selected-photo' src='images/placeholder-image.png' alt='To upload' ref={selectedPhotoRef} />
                        </div>
                        <div className='d-flex flex-col flex-space-between photo-desc'>
                            <p>Upload a photo related to your request.</p>
                            <p>If no photo is selected, your profile photo will be used in the post</p>
                        </div>
                    </div>
                </section>

                <section className='d-flex'>
                    <Button type='submit' isLoading={isSubmitting}>Finish</Button>
                </section>
            </form>
        </div>
    )
}

export default AddHelpRequest