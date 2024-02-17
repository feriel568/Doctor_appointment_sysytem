import React from 'react';
import '../Styles/landingPage.css';
import svgDoc from '../images/hero-doctor-27ee9489.svg'
const LandingPagePatient = () =>{
    return (
        <div>
        <nav className="landnPageNav" >
            <h1 className="logo">MEDONTIME</h1>
            <ul className='homeNav'>
                <li>Home</li>
                <li>Features</li>
            </ul>
            <ul className='btnNav'>
                <li>Sign In</li>
                <li>Sign Up</li>
            </ul>

        </nav>

        <section className="landingPageView">
            <div className='content'>
            <h1 className="cn">Welcome to MEDONTIME</h1>
            <p>An Innovative Healthcare IT Solution, 
                Featuring a Web-Based Hospital Management System,
                 Designed to Streamline Operations, Enhance Patient Care, 
                 and Improve Overall Efficiency.</p>


            </div>
            <div className='landingImage'>
            <img src={svgDoc} alt="svg"></img>
                
            </div>

        </section>
        <div className='fs'>Features</div>
        <section className="features">

           

            <div className="cdrFeature">
                <h1>appointment management</h1>
                <p>Allow patients to book appointments online and manage them with ease.</p>

            </div>
            <div className="cdrFeature">
            <h1>A large choice of doctors </h1>
                <p>Allow patients to book appointments online and manage them with ease.</p>
            </div>
            <div className="cdrFeature">
            <h1>24/7 access</h1>
                <p>Allow patients to book appointments online and manage them with ease.</p>
            </div>
            <div className="cdrFeature">
            <h1>Affordable prices</h1>
                <p>Allow patients to book appointments online and manage them with ease.</p>
            </div>

        </section>

        <footer>
            Copyright @ 2024 MEDONTIME. All rights reserved
        </footer>


        </div>
        
    );
}
export default LandingPagePatient;