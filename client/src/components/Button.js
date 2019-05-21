import React from 'react'
import posed from 'react-pose'
import './Button.scss'

const B = posed.button({
    pressable: true,
    init: { scale: 1 },
    press: { scale: 0.99 }
})
function Button(props) {
    const { isLoading, size, children, ...rest } = props

    let classes = 'btn'
    if (isLoading) {
        classes += ' btn-disabled spinning'
    }
    if (size === 'large') {
        classes += ' btn-large'
    }

    return (
        <B className={classes} {...rest}>
            {children}
        </B>
    )
}

export default Button