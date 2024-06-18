import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Logo from "../images/logo.png";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import "./css/verifyemail.css";



function EmailVerification() {
    const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `https://studysync-uunh.onrender.com/auth/${param.id}/verify/${param.token}`;
				fetch(url).then(res=>res.json()).then(data=>{
                    if(data.status === 200){
                        setValidUrl(true);
                    }else{
                        setValidUrl(false);
                    }
                })
			} catch (error) {
                setValidUrl(false);
				console.log(error);
			}
		};
		verifyEmailUrl();
	}, []);

	return (
		<>
			{validUrl ? (
                <div className="verify-email">
				<div >
					{/* <img src={Logo} alt="logo" /> */}
                    {/* <MdOutlineMailOutline /> */}
					<h1>Email verified successfully</h1>
					<Link to="/login">
                        <IoArrowBack /> 
						Back to login
					</Link>
				</div>
                <div>
                    {/* design */}
                </div>
                </div>
			) : (
                <div className="verify-email">
                    <h1>404 Not Found</h1>
                </div>
			)}
		</>
	);
}

export default EmailVerification