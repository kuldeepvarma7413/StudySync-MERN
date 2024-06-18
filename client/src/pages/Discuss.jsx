import React, { useState, useEffect } from 'react'
import './css/discuss.css'
import { NavLink } from 'react-router-dom'
import Question from '../components/cards/Question'

function Discuss() {
    const [totalQues, setTotalQues] = useState(0)
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/questions`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => {
            setQuestions(data)
            setTotalQues(data.length)

            console.log(data)

        })
    }, [])

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
                    {/* <input type="radio" id='active-filter' name='filter' checked='checked' />
                    <label htmlFor="active-filter">Active</label> */}
                    <input type="radio" id='unanswered-filter' name='filter' checked={true} />
                    <label htmlFor="unanswered-filter">Unanswered</label>
                    <input type="radio" id='answered-filter' name='filter' />
                    <label htmlFor="answered-filter">Answered</label>
                </div>
            </div>
        </section>
        {/* questions */}
        <section className="section-3 questions">
            {questions.map((question, index) => {
                return <Question key={index} question={question} />
            }
            )}
            { questions.length === 0 && <p>No questions found</p>}
        </section>
    </div>
  )
}

export default Discuss