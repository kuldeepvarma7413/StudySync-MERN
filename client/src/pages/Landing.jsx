import React, { useEffect, useState, useRef } from "react";
import "./css/landing.css";
import standingMan from "../images/people-standing.png";
import KidsImg from "../images/kids.png";
import FeatureCard from "../components/cards/landing-feature-card";
import PlayStore from "../images/googleplay.png";
import StepCard from "../components/cards/StepCard";
import Footer from "../components/common/Footer";

function Landing() {
  document.title = "Home | StudySync";

  // scroll to download section
  const downloadSectionRef = useRef();
  // scroll to about section
  const aboutSectionRef = useRef();

  const scrollToDownload = () => {
    downloadSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // if location contains #download
    const location = window.location.href;
    if (location.includes("#download")) {
      scrollToDownload();
    }
  }, []);

  const handleLearnMore = () => {
    aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const fCardData = [
    {
      icon: "coverage",
      title: "Subject Coverage",
      description: `StudySync offers comprehensive resources across various subjects, from Mathematics to Literature, ensuring you're well-prepared for any coursework or assignment.`,
    },
    {
      icon: "assignment",
      title: "Class Assignment (CA) Papers",
      description: `Access exclusive CA papers and a range of notes for each course, helping you stay ahead in your academic journey.`,
    },
    {
      icon: "library",
      title: "Interactive Resource Library",
      description: `Explore our library filled with interactive materials, practice quizzes, and expertly curated notes to enhance your understanding and retention of subjects.`,
    },
    {
      icon: "sync",
      title: "Mobile and Web Synchronization",
      description: `Seamlessly transition between mobile and web. Access your study materials, notes, and resources on-the-go or from your computer, ensuring flexible learning.`,
    },
    {
      icon: "studying",
      title: "Offline Download and Study",
      description: `Download materials for offline access, allowing you to study without an internet connection. StudySync is designed to meet your learning needs, online or offline.`,
    },
    {
      icon: "book",
      title: "Free to Use",
      description: `Enjoy free access to a vast library of PDFs, reference materials, and a thriving study community. StudySync empowers your education at no cost.`,
    },
  ];

  const stepCardData = [
    {
      title: "Log-In/Sign-Up",
      description: `Unlocking your StudySync account is a breeze!
      Simply enter your email and password, followed by a
      secure OTP sent to your email. Verify with the 6-digit
      code, and voilb - you're back to seamless learning on
      StudySync!`,
    },
    {
      title: "Preview",
      description: `Dive into StudySync, your academic oasis! Access
      comprehensive notes, exclusive CA papers. With list
      of courses and ppts for individual course, and more,
      elevate your learning journey today!`,
    },
    {
      title: "Download",
      description: `Download StudySync effortlessly: Visit our website
      or app store, click 'Download,' and follow on-screen
      prompts. Open the app, sign in, and explore a world of
      enriching academic resources anytime, anywhere.
      Your journey to educational excellence begins with a
      simple download!`,
    },
    {
      title: "Collaboration",
      description: `Foster a collaborative learning environment with StudySync! Join study groups, participate in discussions, and share resources with classmates. Engage with peers and experts to enhance your understanding and knowledge.`,
    },
    {
      title: "Interactive Tools",
      description: `Experience interactive learning with StudySync's cutting-edge tools. Utilize our online compilers for coding practice, simulation tools for experiments, and more. Make your study sessions more productive and enjoyable.`,
    },
    {
      title: "Multi-Device Access",
      description: `Access StudySync on multiple devices, from your laptop to your smartphone. Seamlessly switch between devices and continue your learning without any interruptions.`,
    },
  ];

  return (
    <>
      <div className="landing-page">
        <section className="landing-content">
          <div className="left-content">
            {/* // content */}
            <h3>
              Unlock academic excellence with StudySync's powerful Resources
            </h3>
            <p>
              Unlock your academic potential with StudySync! Dive into a world
              of knowledge where we provide digital notes tailored for all
              college students. Elevate your learning experience today and excel
              with us!
            </p>
            <a className="btn learn-more-btn" onClick={handleLearnMore}>
              Learn More
            </a>
          </div>
          <div className="right-content">
            {/* standing man image */}
            <img loading="lazy" src={standingMan} alt="" />
          </div>
        </section>
        {/* about */}
        <section className="about" id="about" ref={aboutSectionRef}>
          <div>
            <p className="title">About Our Website</p>
          </div>
          <div>
            <p className="description">
              StudySync is a dedicated platform designed to empower students,
              educators, and enthusiasts with a rich collection of academic
              resources. Our mission is to make learning engaging, accessible,
              and effective, offering a diverse range of notes, papers, and
              tools. Join us on a journey towards knowledge, excellence, and
              educational success.
              <br />
              Collaborate with peers, access interactive tools, and switch
              seamlessly between devices with our user-friendly interface.
              Community contributions enrich our platform, making StudySync the
              future of education.
            </p>
          </div>
        </section>
        {/* working of app */}
        <section className="working">
          <h2>How StudySync Works</h2>
          <div className="working-steps">
            {stepCardData.map((card, index) => {
              return (
                <StepCard
                  key={index}
                  idx={index}
                  title={card.title}
                  description={card.description}
                />
              );
            })}
          </div>
        </section>
        {/* google ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8386642099973212"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8386642099973212"
          data-ad-slot="3931864628"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

        {/* feature cards */}
        <section className="features">
          {fCardData.map((card, index) => {
            return (
              <FeatureCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            );
          })}
        </section>

        {/* downoad */}
        <section className="download" ref={downloadSectionRef} id="download">
          <div>
            <p className="title">Download Our App Today!</p>
          </div>
          <div>
            <p className="description">
              StudySync is your ultimate companion for academic success. Whether
              you're a college student or a university enthusiast, this app is
              designed to help you excel in your studies. With StudySync, you
              can access a wealth of comprehensive notes and resources on a wide
              range of subjects right at your fingertips. Download the app today
              and unlock your potential!
            </p>
          </div>
          <a
            className="btn download-btn"
            onClick={() => alert("App in progress")}
          >
            <img src={PlayStore} alt="" />
          </a>
        </section>

        {/* google ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8386642099973212"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8386642099973212"
          data-ad-slot="3931864628"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

        <section className="testimonials">
          <img src={KidsImg} className="img1" alt="students" />
        </section>
      </div>
      <Footer scrollToDownload={scrollToDownload} />
    </>
  );
}

export default Landing;
