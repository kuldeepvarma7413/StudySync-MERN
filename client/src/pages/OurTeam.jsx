import React from 'react'
import './css/our-team.css'

function OurTeam() {
  document.title = "Our Team | StudySync";
  return (
    <>
        <div className="our-team">
            <h1>Our Team</h1>
            <div className="team-member">
                <img src="https://avatars.githubusercontent.com/u/99025650?v=4" alt="Avatar" />
                <h2>Kul Deep Varma</h2>
                <p>CEO & Developer</p>
                <p>Guided by a relentless pursuit of excellence and a passion for empowering our team, I lead with a visionary spirit, steering our company towards success and growth.</p>
                {/* git and inkdn contact */}
                <a href="https://www.linkedin.com/in/kul-deep-varma-4150bb225/">LinkedIn</a>
                <a href="https://github.com/kuldeepvarma7413">Github</a>
            </div>
        </div>
    </>
  )
}

export default OurTeam
