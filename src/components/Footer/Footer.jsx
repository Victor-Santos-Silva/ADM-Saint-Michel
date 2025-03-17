import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import './footer.css'

export default function Footer() {
    return (
        <>
            <footer>

                <div className='footerAdm'>

                   <img src="src/Img/footerLogoAdm.png" className='img-footeer' /> 

                    <p>© 2025 Direitos reservados Hospital Saint-Michel by PNTEC-LTD</p>

                    <div>
                        <span>Parcerias:</span> <strong>Libbs</strong>
                    </div>

                    <div className="footer-social">
                        <FaLinkedin />
                        <FaFacebook />
                        <FaInstagram />
                    </div>

                </div>
            </footer>

        </>
    )
}
