import React, { useState, useEffect } from 'react'
import Avatar from '../../components/Avatar'
import { Link } from 'react-router-dom'
import * as api from '../../api'
import * as util from '../../helpers/util'
import './Discover.scss'

function Discover(props) {
    const [feed, setFeed] = useState([])

    useEffect(() => {
        if (props.location.state && props.location.state.data) {
            setFeed(props.location.state.data)
        } else {
            api.getDiscoverFeed()
                .then(response => {
                    console.log(response)
                    setFeed(response)
                })
                .catch(e => console.log(e))
        }
    }, [props.location.state])

    return (
        <div className='discover-feed'>
            <h2 className='heading-2'>What people are doing...</h2>

            <ul>
                { feed.map(feedItem => (
                    <li key={feedItem.uid}>
                        <div>
                            <p><strong>{util.getDisplayName(feedItem.helpedByUser.name)}</strong> helped <strong>{util.getDisplayName(feedItem.user.name)}</strong> with <span>{feedItem.title}</span>.</p>
                            <p className='secondary-text'>{util.getRelativeTime(feedItem.completedDatetime)}</p>
                        </div>
                        <div className='d-flex'>
                            <Avatar url={feedItem.helpedByUser.photoURL} kind='square' size='medium' alt={util.getDisplayName(feedItem.helpedByUser.name)} />
                            <Avatar url={feedItem.user.photoURL} kind='square' size='medium' alt={util.getDisplayName(feedItem.user.name)} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Discover