import React, { useState, useEffect, useRef } from 'react'
import Button from '../../components/Button'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './AddHelpRequest.scss'

function AddHelpRequest(props) {
    const datetimeRef = useRef()
    const asapRef = useRef()
    const [datetime, setDatetime] = useState(null)
    const [asap, setAsap] = useState(false)

    useEffect(() => {
        toggleRequired(asap || datetime)
    }, [asap, datetime])

    function handleSubmit(e) {
        e.preventDefault()
        //props.history.push('/')
    }

    function handleDatetime(datetime) {
        setDatetime(datetime)
        setAsap(false)
    }

    function handleAsap() {
        setDatetime(null)
        setAsap(!asap)
    }

    function toggleRequired(isRequired) {
        datetimeRef.current.input.required = isRequired
        asapRef.current.required = isRequired
    }

    return (
        <div className='d-flex flex-col add-help-request'>
            <form onSubmit={handleSubmit}>
                <section>
                    <h4>I need...</h4>
                    <input type='text' name='title' placeholder='up to 80 characters' maxLength='80' required />
                </section>

                <section>
                    <h4>Description</h4>
                    <textarea 
                        rows='10' 
                        cols='50' 
                        name='description' 
                        placeholder='Add a description (up to 500 characters)' 
                        maxLength='500'
                        required />
                </section>

                <section>
                    <h4>When</h4>
                    <DatePicker
                        selected={datetime}
                        onChange={handleDatetime}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        timeCaption="time"
                        ref={datetimeRef}
                        required
                    />
                    or
                    <input type='checkbox' id='asap' name='asap' checked={asap} onChange={handleAsap} required ref={asapRef} />
                    <label htmlFor='asap'>ASAP</label>
                </section>

                <section>
                    <h4>Tags</h4>
                    <input type='text' name='tags' placeholder='Enter up to 5 (comma-separated)'/>
                </section>

                <section>
                    <h4>Upload photo (optional)</h4>
                    <div className='d-flex flex-row'>
                        <div className='photo'>
                            <img src='images/placeholder-image.png' />
                        </div>
                        <div className='d-flex flex-col flex-space-between photo-desc'>
                            <p>Upload a photo related to your request.</p>
                            <p>If no photo is selected, your profile photo will be used in the post</p>
                        </div>
                    </div>
                </section>

                <Button type='submit'>Finish</Button>
            </form>
        </div>
    )
}

export default AddHelpRequest