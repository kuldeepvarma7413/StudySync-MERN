import React from 'react'
import './css/featurecard.css'

function FeatureCard(props) {
    return (
        <div className='feature-card'>
                <div className='icon'>
                        <img src={require(`../../images/icons/${props.icon}.png`)} alt="" />
                </div>
                <div className='content'>
                        <h3>{props.title}</h3>
                        <p>{props.description}</p>
                </div>
        </div>
    )
}

export default FeatureCard