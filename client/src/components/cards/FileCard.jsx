import React from 'react'
import './css/filecard.css'

function FileCard(props) {
  return (
    <div className="filecard">
      {/* <img src={props.image} className="filecard-image" alt={props.title} /> */}
      <img src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg' className="filecard-image" alt={props.title} />
      <div className="filecard-content">
        <h3 className="filecard-title">{props.title}</h3>
        <p className="filecard-text">Uploaded by {props.uploadedBy} on {props.date}</p>
        <p className="filecard-text">Views: {props.views} Pages: {props.pages}</p>
      </div>
    </div>
  )
}

export default FileCard