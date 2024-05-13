import React from 'react'
import Navbar from '../components/common/Navbar'
import './css/landing.css'
import standingMan from '../images/people-standing.png'
import FeatureCard from '../components/cards/landing-feature-card'
import PlayStore from '../images/googleplay.png'
import StepCard from '../components/cards/StepCard'
import Footer from '../components/common/Footer'

function Landing() {

  const fCardData = [
    {
      icon: 'coverage',
      title: 'Subject Coverage',
      description: `StudySync offers an extensive range of subjects, from Mathematics to Literature and beyond. Explore in-depth resources for all your academic needs, ensuring you're prepared for any coursework or assignment`
    },
    {
      icon: 'assignment',
      title: 'Class Assignment (CA) Papers',
      description: `StudySync offers an extensive range of subjects, from Mathematics to Literature and beyond. Explore in-depth resources for all your academic needs, ensuring you're prepared for any coursework or assignment`
    },
    {
      icon: 'library',
      title: 'Interactive Resource Library',
      description: `Dive into our resource library. brimming with interactive
      study materials. practice quizzes, and expertly curated
      notes. This feature ensures you have a variety of
      resources to enhance your understanding and retention
      of the subject matter.`
    },
    {
      icon: 'sync',
      title: 'Mobile and Web Synchronization',
      description: `Seamlessly transition between your mobile device and
      the StudySync website. Access your study materials,
      notes, and resources on-the-go or from the comfort of
      your computer. ensuring you have the flexibility to learn
      whenever and wherever you choose.`
    },
    {
      icon: 'studying',
      title: 'Offline Download and Study',
      description: `No internet connection? No problem. Download study
      materials for offline access, ensuring you can study even
      when you're off the grid. StudySync is designed to
      accommodate your learning needs, whether you're online
      or offline.`
    },
    {
      icon: 'book',
      title: 'Free to Use',
      description: `StudySync is your free ticket to a world of academic
      resources. Access a vast library of PDFs, reference
      materials, and a thriving study community without any
      cost. Empower your education today.`
    },
  ]

  const stepCardData = [
    {
      title: 'Log-In/Sign-Up',
      description: `Unlocking your StudySync account is a breeze!
      Simply enter your email and password, followed by a
      secure OTP sent to your email. Verify with the 6-digit
      code, and voilb - you're back to seamless learning on
      StudySync!`
    },
    {
      title: 'Preview',
      description: `Dive into StudySync, your academic oasis! Access
      comprehensive notes, exclusive CA papers. With list
      of courses and ppts for individual course, and more,
      elevate your learning journey today!`
    },
    {
      title: 'Download',
      description: `Download StudySync effortlessly: Visit our website
      or app store, click 'Download,' and follow on-screen
      prompts. Open the app, sign in, and explore a world of
      enriching academic resources anytime, anywhere.
      Your journey to educational excellence begins with a
      simple download!`
    },
    {
      title: 'Upload',
      description: `Uploading on StudySync is a seamless process.
      Navigate to the upload section, choose your file, and
      click 'Submit.' Our platform supports a variety of file
      formats, ensuring you can effortlessly share and
      access a diverse range of educational materials with
      ease.`
    },
  ]

  return (
    <div className='landing-page'>
        <Navbar />
        <section className='landing-content'>
            <div className='left-content'>
              {/* // content */}
              <h3>Unlock academic excellence with StudySync's powerful Resources</h3>
              <p>Unlock your academic potential with StudySync! Dive into
                a world of knowledge where we provide digital notes
                tailored for all college students. Elevate your learning
                experience today and excel with us!
              </p>
              <a className='btn learn-more-btn'>Learn More</a>
            </div>
            <div className='right-content'>
              {/* standing man image */}
              <img src={standingMan} alt="" />
            </div>
        </section>
        {/* about */}
        <section className='about' id='about'>
          <div>
            <p className='title'>About Our Website</p>
          </div>
          <div>
            <p className='description'>
              StudySync is a dedicated platform designed to empower students, educators, and enthusiasts with a rich collection of academic resources. Our mission is to make learning engaging, accessible, and effective, offering a diverse range of notes, papers, and tools. Join us on a journey towards knowledge, excellence, and educational success.
            </p>
          </div>
        </section>
        {/* working of app */}
        <section className='working'>
          <h2>How StudySync Works</h2>
          <div className='working-steps'>
            { stepCardData.map((card, index) => {
              return <StepCard key={index} idx={index} title={card.title} description={card.description} />
            })}
          </div>
        </section>
        {/* feature cards */}
        <section className='features'>
          { fCardData.map((card, index) => {
            return <FeatureCard key={index} icon={card.icon} title={card.title} description={card.description} />
          })}
        </section>
        {/* downoad */}
        <section className='download' id='download'>
          <div>
            <p className='title'>Download Our App Today!</p>
          </div>
          <div>
            <p className='description'>StudySync is your ultimate companion for academic success. Whether you're a college student or a university enthusiast, this app is designed to help you excel in your studies. With StudySync, you can access a wealth of comprehensive notes and resources on a wide range of subjects right at your fingertips.</p>
          </div>
          <a className='btn download-btn'><img src={PlayStore} alt="" /></a>
        </section>
        <section className="testimonials">

        </section>
        <Footer />
    </div>
  )
}

export default Landing