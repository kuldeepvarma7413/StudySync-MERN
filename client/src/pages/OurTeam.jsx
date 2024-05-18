import React from 'react'
import './css/our-team.css'

function OurTeam() {
  return (
    <>
        <div className="our-team">
            <h1>Our Team</h1>
            <div className="team-member">
                <img src="https://media.licdn.com/dms/image/D4D03AQFzjZuT5Xv_bA/profile-displayphoto-shrink_400_400/0/1687401538044?e=1721260800&v=beta&t=tkPliInIV_VNsDB92bC2QITERTgTVuCnexAvqUbHdPw" alt="Avatar" />
                <h2>Kul Deep Varma</h2>
                <p>CEO & Developer</p>
                <p>Guided by a relentless pursuit of excellence and a passion for empowering our team, I lead with a visionary spirit, steering our company towards success and growth.</p>
                {/* git and inkdn contact */}
                <a href="https://www.linkedin.com/in/kul-deep-varma-4150bb225/">LinkedIn</a>
                <a href="https://github.com/kuldeepvarma7413">Github</a>
            </div>
            {/* <div className="team-member">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" />
            <h2>Jane Doe</h2>
            <p>Designer</p>
            <p>Some text that describes me lorem ipsum ipsum lorem.</p>
            </div>
            <div className="team-member">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" />
            <h2>Mike Ross</h2>
            <p>Developer</p>
            <p>Some text that describes me lorem ipsum ipsum lorem.</p>
            </div> */}
        </div>
    </>
  )
}

export default OurTeam