import "./FormTemplate.css";
import {
  TemplatesImg01,
  TemplatesImg02,
  TemplatesImg03,
  TemplatesLaptop,
} from "../../assets";
import Filter3LineIcon from "remixicon-react/Filter3LineIcon";
import FilterLineIcon from "remixicon-react/FilterLineIcon";
import { Link } from "react-router-dom";
import Slider from "react-slick/lib/slider";
import { useTranslation } from "react-i18next";

const FormTemplate = () => {
  const [t, i18n] = useTranslation("common");
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    margin: 10,
    responsive: [
      {
        breakpoint: 1222,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 579,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 470,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="templates-main">
      <div className="templates-header-wrap">
        <div className="templates-left">
          <span className="secondaryColor">
            <img alt="#" src={TemplatesLaptop} />
          </span>
          <h5 className="primaryColor">Form Templates</h5>
        </div>
        <div className="templates-filter">
          <Link id="form-temp-sort primaryColor" to="#">
            <span className="secondaryColor">
              <Filter3LineIcon />
            </span>
            {t("sort")}
          </Link>
          <Link id="form-temp-filter primaryColor" to="#">
            <span className="secondaryColor">
              <FilterLineIcon />
            </span>
            {t("filter")}
          </Link>
        </div>
      </div>
      <Slider {...settings}>
        <div>
          <div className="templates-item-img">
            <img alt="#" src={TemplatesImg01} />
            <Link id="form-temp-e-com" to="#">
              <span className="secondaryColor">
                <img alt="#" src={TemplatesLaptop} />
              </span>
              E-commerce Apps
            </Link>
          </div>
        </div>
        <div>
          <div className="templates-item-img">
            <img alt="#" src={TemplatesImg02} />
            <Link id="form-temp-survey-form" to="#">
              <span className="secondaryColor">
                <img alt="#" src={TemplatesLaptop} />
              </span>
              Survey Forms
            </Link>
          </div>
        </div>
        <div>
          <div className="templates-item-img">
            <img alt="#" src={TemplatesImg03} />
            <Link id="form-temp-bank-loan" to="#">
              <span className="secondaryColor">
                <img alt="#" src={TemplatesLaptop} />
              </span>
              Bank Loan App
            </Link>
          </div>
        </div>
        <div>
          <div className="templates-item-img">
            <img alt="#" src={TemplatesImg01} />
            <Link id="form-temp-e-com-2" to="#">
              <span className="secondaryColor">
                <img alt="#" src={TemplatesLaptop} />
              </span>
              E-commerce Apps
            </Link>
          </div>
        </div>
        <div>
          <div className="templates-item-img">
            <img alt="#" src={TemplatesImg02} />
            <Link id="form-temp-survey-form-2"  to="#">
              <span className="secondaryColor">
                <img alt="#" src={TemplatesLaptop} />
              </span>
              Survey Forms
            </Link>
          </div>
        </div>
        <div>
          <div className="templates-item-img">
            <img alt="#" src={TemplatesImg03} />
            <Link id="form-temp-bank-loan-2"  to="#">
              <span className="secondaryColor">
                <img alt="#" src={TemplatesLaptop} />
              </span>
              Bank Loan App
            </Link>
          </div>
        </div>
      </Slider>
    </div>
  );
};
export default FormTemplate;
