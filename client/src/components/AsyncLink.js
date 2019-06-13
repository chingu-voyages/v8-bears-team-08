import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { NavHandlerContext } from '../App';

function AsyncLink(props) {
    const navHandler = useContext(NavHandlerContext)

    // function timeout(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms))
    // }

    async function handleClick(e) {
        e.preventDefault()

        navHandler.asyncNavClicked(props.to, props.delayMs || undefined)
        //await timeout(5000)

        props.fetch()
            .then(response => {
                // only route if the user hasn't already clicked on another link while this one was loading
                if (navHandler.shouldRouteTo(props.to)) {
                    props.history.push(
                        {
                            pathname: props.to,
                            state: { data: response.data ? response.data : response }
                        }
                    )
                }
            })
            .catch(e => console.log(e))
            .finally(() => navHandler.setLoadingComplete(props.to))
    }

    return <a href={props.to} onClick={handleClick}>{props.children}</a>
}

export default withRouter(AsyncLink)