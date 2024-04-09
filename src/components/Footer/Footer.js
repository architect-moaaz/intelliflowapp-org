import { Link } from "react-router-dom";
import { Logo, IntelliflowLogo } from "../../assets";
import "./Footer.css"

const Footer = () => {
  return <>
    <div className="footer-wrap">
      <Link to="/" id="footer-logo-link"><img className="logoimg" src={Logo} /></Link>
      <Link to="/" id="footer-intelliflowLogoImgSrc-link"><img src={IntelliflowLogo} /></Link>
    </div>
  </>;
};
export default Footer;
