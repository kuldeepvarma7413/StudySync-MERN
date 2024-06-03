import React, { useState } from 'react'
import './css/discuss.css'
import { NavLink } from 'react-router-dom'

function Discuss() {
    const [totalQues, setTotalQues] = useState(0)

  return (
    <div className='discuss'>
        <section className="section-1">
            <p>All Questions</p>
            <NavLink to={'ask-question'} className="btn ask-btn">Ask Question</NavLink>
        </section>
        {/* search and filter */}
        <section className="section-2">
            <p>{totalQues} questions</p>
            <div className="search-filter-div">
                <input type="search" className='search' placeholder='Search' />
                <div className='filters'>
                    <input type="radio" id='active-filter' name='filter' />
                    <label htmlFor="active-filter">Active</label>
                    <input type="radio" id='unanswered-filter' name='filter' />
                    <label htmlFor="unanswered-filter">Unanswered</label>
                    <input type="radio" id='answered-filter' name='filter' />
                    <label htmlFor="answered-filter">Answered</label>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Discuss