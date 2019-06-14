import React, { useState } from 'react'
import Button from '../components/Button'
import * as util from '../helpers/util'
import * as api from '../api'
import Dialog from './Dialog'
import './LeaveComplimentDialog.scss'


function LeaveComplimentDialog(props) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [complimentText, setComplimentText] = useState('')

    function handleCancel() {
        if (!isSubmitting) {
            props.hide()
        }
    }

    function handleSaveCompliment(e) {
        e.preventDefault()

        setIsSubmitting(true)
        api.saveCompliment(complimentText, props.complimentee.uid)
            .then(response => {
                setIsSubmitting(false)
                props.onComplimentSaved(response.data)
                props.hide()
            })
            .catch(e => {
                setIsSubmitting(false)
                console.log(e)
            })
    }

    return (
        <Dialog shouldShow={props.shouldShow} hide={handleCancel}>
            <div className='leave-compliment-dialog'>
                
                <div className='top'>
                    <p>Write a compliment for {util.getDisplayName(props.complimentee.name)}</p>
                </div>

                <form onSubmit={handleSaveCompliment}>
                    <div className='middle'>
                            <textarea
                                name='compliment-text'
                                rows='6'
                                cols='50'
                                maxLength='300'
                                value={complimentText}
                                onChange={e => setComplimentText(e.target.value)}
                                placeholder='Write a compliment up to 300 characters'
                                required
                                spellCheck></textarea>
                    </div>

                    <div className='bottom'>
                        <Button kind='text' type='button' disabled={isSubmitting} onClick={handleCancel}>Cancel</Button>
                        <Button kind='text' type='submit' isLoading={isSubmitting}>Save Compliment</Button>
                    </div>
                </form>

            </div>
        </Dialog>
    )
}

export default LeaveComplimentDialog