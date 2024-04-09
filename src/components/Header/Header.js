import { Icon } from "@iconify/react";
import { Dropdown, Modal, CloseButton, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { debounce } from "lodash";
import {
  Search,
  Notification,
  Info,
  Menu,
  ProfileImg,
  AppIcon,
  StudioIcon,
  headerLogo,
  IFlogoWhiteBorder,
  AppstoreLogo,
  AppdesignerLogo,
  DropdownIcon,
} from "../../assets/index";
import NotificationContainer from "../Notification/NotificationContainer";
import { ReactComponent as User } from "../../assets/NewIcon/User.svg";
import { ReactComponent as AssignRoleI } from "../../assets/NewIcon/AssignRoleI.svg";
import "./Header.css";
import "./HeaderNew.css";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import { atom, useRecoilState } from "recoil";
import "react-responsive-modal/styles.css";
import urlExist from "url-exist";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import imageCompression from "browser-image-compression";
import { loggedInUserState } from "../../state/atom";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { useTranslation } from "react-i18next";
import ImageLoader from "../ImageLoader/ImageLoader";
import{
  appList as appListAtom,
}from "../../state/atom"
export const searchTerm = atom({
  key: "searchTerm",
  default: "",
});
export const yourCompanyLogo = atom({
  key: "yourCompanyLogo",
  default: "",
});
const Header = ({ headerTitle }) => {
  const [t, i18n] = useTranslation("common");
  const history = useHistory();
  const [notibar, setNotibar] = useState(false);
  const [all, setall] = useState(false);
  const [notification, setNotification] = useState([]);
  const [todo, settodo] = useState([]);
  const [, setNavbarSearchTerm] = useRecoilState(searchTerm);
  const [, setCompanyLogo] = useRecoilState(yourCompanyLogo);
  const [changeProfileModal, setChangeProfileModal] = useState(false);
  const [changeCompanyModal, setChangeCompanyModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageCompany, setProfileImageCompany] = useState(null);
  const [images, setImages] = useState(null);
  const [imagesCompany, setImagesCompany] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [localImageCompany, setLocalImageCompany] = useState(null);
  const [cropper, setCropper] = useState();
  const [cropperCompany, setCropperCompany] = useState();
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const token = localStorage.getItem("token");
  const roles = JSON.parse(JSON.stringify(loggedInUser.roles));
  const initialRole = roles[0].name;
  const [appList, setappList] = useRecoilState(appListAtom);


  useEffect(async () => {
    var fileurl = `${
      process.env.REACT_APP_CDS_ENDPOINT
    }IFprofilePicture/image/${localStorage.getItem(
      "id"
    )}?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;
    const exists = await urlExist(fileurl);

    setProfileImage("");
    if (exists) setProfileImage(fileurl);
  }, [images]);

  useEffect(async () => {
    var fileurl = `${
      process.env.REACT_APP_CDS_ENDPOINT
    }appLogo/image/${localStorage.getItem(
      "username"
    )}?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;
    const exists = await urlExist(fileurl);

    setProfileImageCompany("");
    if (exists) setProfileImageCompany(fileurl);
    if (exists) setCompanyLogo(fileurl);
    if (exists) localStorage.setItem("ProfileImageCompany", fileurl);
  }, [imagesCompany]);

  // useEffect(() => {
  //   var includes = false;
  //   if (
  //     loggedInUser?.enabled_menus?.menus_enabled?.some((v) =>
  //       v.includes("ADMIN_DASHBOARD")
  //     )
  //   ) {
  //     includes = true;
  //   }
  //   if (!includes) {
  //     history.push({
  //       pathname: "/Dashboard",
  //     });
  //   }
  // }, []);

  const handleRoleEnabled = (role) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/access/${role}`,
      headers: {
        access_token: token,
        workspace: localStorage.getItem("workspace"),
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.menus[0]));
        localStorage.setItem("currentRole", JSON.stringify(role));
        localStorage.setItem(
          "enabled_menus",
          JSON.stringify(response.data.menus[0])
        );
        setLoggedInUser({
          ...loggedInUser,
          enabled_menus: response.data.menus[0],
          currentRole: role,
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeProfileModal = () => {
    setChangeProfileModal(!changeProfileModal);
  };
  const handleChangeCompanyModal = () => {
    setChangeCompanyModal(!changeCompanyModal);
  };

  const handleImageChange = (e) => {
    setLocalImage(e.target.files[0]);
    setImages(URL.createObjectURL(e.target.files[0]));
  };
  const handleImageChangeCompany = (e) => {
    setLocalImageCompany(e.target.files[0]);
    setImagesCompany(URL.createObjectURL(e.target.files[0]));
  };
  let urlToFile = (url) => {
    let arr = url.split(",");

    let mime = arr[0].match(/:(.*?);/)[1];
    let data = arr[1];
    let dataString = atob(data);

    let n = dataString.length;
    let dataArr = new Uint8Array(n);

    while (n--) {
      dataArr[n] = dataString.charCodeAt(n);
    }

    let file = new File([dataArr], "File.jpeg", { type: mime });

    return file;
  };
  let urlToFileCompany = (url) => {
    let arr = url.split(",");

    let mime = arr[0].match(/:(.*?);/)[1];
    let data = arr[1];
    let dataString = atob(data);

    let n = dataString.length;
    let dataArr = new Uint8Array(n);

    while (n--) {
      dataArr[n] = dataString.charCodeAt(n);
    }

    let file = new File([dataArr], "File.jpeg", { type: mime });

    return file;
  };
  const getCroppedData = (e) => {
    if (typeof cropper !== "undefined") {
      setLocalImage(cropper.getCroppedCanvas().toDataURL());
      var imageFile = cropper.getCroppedCanvas().toDataURL();
      var finalImage = urlToFile(imageFile);
    }

    return finalImage;
  };
  const getCroppedDataCompany = (e) => {
    if (typeof cropperCompany !== "undefined") {
      setLocalImageCompany(cropperCompany.getCroppedCanvas().toDataURL());
      var imageFileCompany = cropperCompany.getCroppedCanvas().toDataURL();
      var finalImageCompany = urlToFileCompany(imageFileCompany);
    }

    return finalImageCompany;
  };
  const imageUploader = async () => {
    var imageFile = getCroppedData();

    const options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 150,
      useWebWorker: true,
    };
    let uploadProfilePic;
    await imageCompression(imageFile, options).then((x) => {
      uploadProfilePic = x;
    });

    const appName = "IFprofilePicture";
    var bodyFormData = new FormData();
    bodyFormData.append("file", uploadProfilePic);

    const response = await axios.post(
      `${
        process.env.REACT_APP_CDS_ENDPOINT + appName
      }/upload?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          userid: localStorage.getItem("id"),
        },
      }
    );
    setImages(new Date().toISOString());
    return response;
  };
  const imageUploaderCompany = async () => {
    var imageFileCompany = getCroppedDataCompany();

    const options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 150,
      useWebWorker: true,
    };
    let uploadProfilePicCompany;
    await imageCompression(imageFileCompany, options).then((x) => {
      uploadProfilePicCompany = x;
    });

    const appName = "appLogo";
    var bodyFormData = new FormData();
    bodyFormData.append("file", uploadProfilePicCompany);

    const response = await axios.post(
      `${
        process.env.REACT_APP_CDS_ENDPOINT + appName
      }/upload?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          logoName: localStorage.getItem("username"),
        },
      }
    );
    setImagesCompany(new Date().toISOString());
    return response;
  };
  const onSave = () => {
    if (localImage) {
      // getCroppedData();
      imageUploader();
      handleChangeProfileModal();
    }
  };
  const onSaveCompany = () => {
    if (localImageCompany) {
      // getCroppedData();
      imageUploaderCompany();
      handleChangeCompanyModal();
    }
  };

  const showall = async () => {
    let notifications = [];

    try {
      var todoAPi = await axios.get(
        `${
          process.env.REACT_APP_IFAPP_API_ENDPOINT
        }app-center/app/user/worklist/?user=${localStorage.getItem("username")}`
      );

      if (todoAPi.data.data.count > 0) {
        todoAPi.data.data.tasks.forEach((element) => {
          notifications.push(element);
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
    try {
      settodo(notifications);
      notifications = [];

      var notificationAPi = await axios.get(
        process.env.REACT_APP_IFAPP_API_ENDPOINT +
          "app-center/app/user/notifications?user=" +
          localStorage.getItem("username")
      );

      if (notificationAPi.data.data.count > 0) {
        notificationAPi.data.data.notifications.forEach((element) => {
          if (element.notifications) notifications.push(element);
        });
      }
      setNotification(notifications);
    } catch (error) {
      console.log("Error", error);
    }

    if (localStorage.getItem("Dashboard") == t("appStore")) {
      setall(!all);
      setNotibar(!all);
    }
  };

  const shownoti = () => setNotibar(!notibar);

  var data = {
    notifications: [
      {
        noti: "Received Mail From IntelliFLow HeadQuaters",
      },
      {
        noti: "Received A Follow Request For IntelliFlow ",
      },
      {
        noti: "Financial Year Status Updated",
      },
      {
        noti: "Taiga :Sprint Changed To 12 ",
      },
    ],
  };
  // var todo = {
  //   today: {
  //     todos: [
  //       {
  //         dos: "Submit The Work Order By Today",
  //       },
  //       {
  //         dos: "Schedule A Meeting With Xyz Company ",
  //       },
  //     ],
  //   },
  //   yesterday: {
  //     todos: [
  //       {
  //         dos: "Complete The Work Order By Tomorrow",
  //       },
  //       {
  //         dos: "Do A Schedule Check For The Week ",
  //       },
  //     ],
  //   },
  // };

  const MyProfile = () => {};

  const Logout = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const workspace = localStorage.getItem("workspace");
    const isChecked = localStorage.getItem("isChecked");
    localStorage.clear();
    if (isChecked) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      localStorage.setItem("workspace", workspace);
      localStorage.setItem("isChecked", isChecked);
    }

    setLoggedInUser({});
    window.location.reload();
    window.location.href = "/";
  };
  const openNotification = (notification) => {
    if (notification && notification.app) {
      localStorage.setItem("appName", notification.app);
      var endpoint_label = notification.userTasks[0].processId;
      var path = notification.userTasks[0].processId;
      var id = notification.processId;

      history.push("/form", {
        endpoint_label: endpoint_label,
        path: path,
        id: { id: id },
      });
    }

    //   history.pushState('/')
  };
  const [openModelSearch, setOpenModelSearch] = useState(false);
  const [searchModalStatus, SetSearchModalStatus] = useState(null);

  const onOpenModalSearch = () => {
    setOpenModelSearch(true);
  };

  const onCloseModalSearch = () => {
    setOpenModelSearch(false);
  };

  var notificationDiv = (
    <>
      <img
        alt="#"
        src={Notification}
        id="notification-div-img"
        data-tip
        data-for="Notification"
        // onClick={showall}
      />
      <ReactTooltip
        id="Notification"
        className="tooltipCustom"
        arrowColor="rgba(0, 0, 0, 0)"
        place="bottom"
        effect="solid"
      >
        {/* Notification */}
        {t("comingSoon")}
      </ReactTooltip>
    </>
  );

  if (localStorage.getItem("Dashboard") != t("appStore")) {
    notificationDiv = (
      // <Dropdown className="notification-icon-dropdown">
      //   <Dropdown.Toggle
      //     variant=""
      //     id="dropdown-basic"
      //     className="notification"
      //   >
      <>
        <img
          id="header-notification-img"
          alt="#"
          data-tip
          data-for="Notification"
          src={Notification}
        />
        <ReactTooltip
          id="Notification"
          className="tooltipCustom"
          arrowColor="rgba(0, 0, 0, 0)"
          place="bottom"
          effect="solid"
        >
          {/* Notification */}
          {t("comingSoon")}
        </ReactTooltip>
      </>
      //   </Dropdown.Toggle>
      // <Dropdown.Menu className="notification-dropdown">
      //     <NotificationContainer />
      //   </Dropdown.Menu>
      // </Dropdown>
    );
  }
  var initials = "IF";
  try {
    initials =
      localStorage.getItem("firstName").charAt(0).toUpperCase() +
      localStorage.getItem("lastName").charAt(0).toUpperCase();
  } catch (error) {
    console.log(error);
  }
  const handleSearch = debounce((event) => {
    setNavbarSearchTerm(event?.target?.value?.toLowerCase());
  }, 300);

  const handleSearching = (e) =>{
    let name = e.target.value
    var getAppName = '[{"appDisplayName":"' + '.*' + name + '.*' + '"}]';
    fetchSearchData(getAppName)
  }
  
  const fetchSearchData = (appToFind) =>{
    let encodedSearchCriteria = encodeURIComponent(appToFind);
    encodedSearchCriteria = encodedSearchCriteria.replace(/\+/g, '%20');
    const url = `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/${localStorage.getItem("workspace")}/data`;
    const queryParams = `?page=1&size=50&filter=${encodedSearchCriteria}`;
    const apiUrl = url + queryParams;
    let config = {
      method: 'get',
      url: apiUrl,
      headers:{
        workspace : localStorage.getItem("workspace"),
        Authorization : localStorage.getItem("token"),
      }
    }
    axios.request(config)
    .then((res)=>{
      var sortedAppData = [];
      res.data.data.data.apps.map((element) => {
        sortedAppData.push({
          name: element.appName,
          status: element.status,
          createTime: element.creationTime,
          logoUrl: element.logoUrl,
          displayName: element.appDisplayName,
          userId: element.userId,
          workspaceName: element.workspaceName,
          lastModified: element.lastUpdatedTime,
          deviceSupport: element.deviceSupport,
          description: element.description,
        });
      });
      setappList(sortedAppData);
    })
  }

  const location = useLocation();

  useEffect(() => {
    setNavbarSearchTerm("");
  }, [location.pathname]);

  // Icon animation 180 degrees
  const [rotation, setRotation] = useState(false);
  const handleImageClick = () => {
    setRotation(!rotation);
  };

  const imageStyle = {
    transition: "transform 0.5s",
    transform: rotation ? "rotate(180deg)" : "rotate(0)",
  };

  //Dropdown Animation js work
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <div className="header-wrap">
        <div className="header-main-nav">
          <h2 className="header-title-wrap primaryColor">
            {localStorage.getItem("Dashboard") != t("appStore") ? (
              <Link to={`/`}>
                {/* <img src={IFlogoWhiteBorder} /> */}
                <ImageLoader
                  src={`${
                    process.env.REACT_APP_CDS_ENDPOINT
                  }appLogo/image/${`${localStorage.getItem(
                    "workspace"
                  )}_companylogo`}?Authorization=${localStorage.getItem(
                    "token"
                  )}&workspace=${localStorage.getItem("workspace")}`}
                  className="WorkspaceHeaderlogo"
                  alt={IFlogoWhiteBorder}
                />
              </Link>
            ) : (
              <Link to={`/Dashboard`}>
                <ImageLoader
                  src={`${
                    process.env.REACT_APP_CDS_ENDPOINT
                  }appLogo/image/${`${localStorage.getItem(
                    "workspace"
                  )}_companylogo`}?Authorization=${localStorage.getItem(
                    "token"
                  )}&workspace=${localStorage.getItem("workspace")}`}
                  className="WorkspaceHeaderlogo"
                  alt={IFlogoWhiteBorder}
                />
                {/* <img src={IFlogoWhiteBorder} /> */}
              </Link>
            )}
            <span className="header-title-span secondaryColor">
              {headerTitle}
            </span>
          </h2>
          <ul className="header-links">
            <li>
              {/* <div className="header-search"> */}
              <div
                id="container "
                className="searchContainer"
                htmlFor="search-header"
              >
                <img
                  id="header-search-img"
                  src={Search}
                  alt="search"
                  className="searchIconContainer"
                />
                <input
                  // id="header-search-input"
                  id="search"
                  type="text"
                  onChange={(e) => handleSearching(e)}
                  data-tip
                  data-for="Search"
                  // className="header-search"

                  onFocus={() => SetSearchModalStatus(true)}
                  onBlur={() => SetSearchModalStatus(false)}
                  autoComplete={false}
                />
              </div>

              <ReactTooltip
                id="Search"
                className="tooltipCustom"
                place="bottom"
                effect="solid"
              >
                {t("search")}
              </ReactTooltip>
              {/* </div> */}
            </li>
            {/*
            //for reference
            <li>
              <label htmlFor="search-header" className="header-search">
                <div className="wrapper"> tool
                  <div className="tooltip">tooltip</div>
                </div>
              </label>
            </li> */}
            <li>
              {notificationDiv}

              <div className={notibar && all ? "noti-active" : " noti"}>
                {/* <div className={todobar?'no-active':'noti-half'}> */}
                <div className="no">
                  <h2 className="primaryColor">{t("notifications")}</h2>
                  <span className="arrow secondaryColor">
                    <img
                      id="noti-arrow-icon"
                      onClick={shownoti}
                      src="data:image/png;base64,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"
                    />
                  </span>
                  <ul>
                    {notification.map((notify, index) => (
                      <li className="not" key={index}>
                        <Link id="noti-item-link" to="#">
                          <i id="noti-item-icon" className="notification-icons">
                            <Icon icon="clarity:notification-solid" />
                          </i>
                          <span
                            id="noti-item-text"
                            className="text secondaryColor"
                          >
                            {" "}
                            Your {notify.notifications[0].process} has moved to{" "}
                            {notify.notifications[0].stage} stage
                          </span>
                        </Link>
                      </li>
                    ))}
                    {/* <li className='not'><img src="https://image.shutterstock.com/image-vector/notification-icon-vector-material-design-260nw-759841507.jpg" /><span className='text'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
                    <li className='not'><img src="https://image.shutterstock.com/image-vector/notification-icon-vector-material-design-260nw-759841507.jpg" /><span className='text'>LoremThere are many variations, but the majority have suffered alteration in some form</span></li>
                    <li className='not'><img src="https://image.shutterstock.com/image-vector/notification-icon-vector-material-design-260nw-759841507.jpg" /><span className='text'>Astravan Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
                    <li className='not'><img src="https://image.shutterstock.com/image-vector/notification-icon-vector-material-design-260nw-759841507.jpg" /><span className='text'>There are many variations of passages of Lorem Ipsum available</span></li> */}
                  </ul>
                </div>
              </div>
              {/* </div> */}
              <div className={all ? "todos-active" : "todos"}>
                <div>
                  {/* <img className={!notibar ? "no-arrow" : "arrow1"}
                    onClick={shownoti}
                    src="https://cdn2.iconfinder.com/data/icons/arrows-vol-1-1/32/left2-512.png"
                  /> */}
                </div>

                <div className="todo">
                  <h2 className="primaryColor">{t("To-Do List")}</h2>
                  <ul>
                    <h1 className="notificationDays primaryColor">Today</h1>
                    {todo.map((notification, index) => (
                      <Link
                        id="todo-link-item"
                        to={{
                          pathname: `/form`,
                          state: {
                            endpoint_label: notification.userTasks[0].processId,
                            path: notification.userTasks[0].processId,
                            id: { id: notification.processId },
                            appName: notification.app,
                          },
                        }}
                      >
                        <li className="tod" key={index}>
                          <i className="todo-line"></i>
                          <p
                            id="noti-item-action-req"
                            className="secondaryColor"
                          >
                            {notification.app} - Action required for{" "}
                            {notification.userTasks[0].referenceName}
                          </p>

                          <img
                            className="close-todo"
                            src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39219/preview.png"
                          />
                        </li>
                      </Link>
                    ))}
                    {/* <li className='tod'><img src="https://i7.uihere.com/icons/461/210/353/the-vertical-bar-time-5326c9b12110bfe5b89f6060e3e9d439.png" /><span className='text'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
                    <li className='tod'><img src="https://i7.uihere.com/icons/461/210/353/the-vertical-bar-time-5326c9b12110bfe5b89f6060e3e9d439.png" /><span className='text'>LoremThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</span></li> */}
                  </ul>

                  {/* <ul>
                    <h1 className="notificationDays">Yesterday</h1>
                    {todo.yesterday.todos.map((test, index) => (
                      <li className="tod" key={index}>
                      <i className="todo-line"></i>
                      <p className="">
                        {test.dos}
                      </p>
                        <Link to="#" className="close-todo">
                          <img
                            src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39219/preview.png"
                          />
                        </Link>
                    </li>
                    ))}
                    <li className='tod'><img src="https://i7.uihere.com/icons/461/210/353/the-vertical-bar-time-5326c9b12110bfe5b89f6060e3e9d439.png" /><span className='text'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span></li>
                    <li className='tod'><img src="https://i7.uihere.com/icons/461/210/353/the-vertical-bar-time-5326c9b12110bfe5b89f6060e3e9d439.png" /><span className='text'>LoremThere are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form</span></li>
                  </ul> */}
                </div>
              </div>
            </li>
            <li>
              <Link
                to="#"
                id="header-info-link"
                data-tip
                data-for="info"
                className="header-info"
              >
                <div>
                  <img id="header-info-img" alt="#" src={Info} />
                  <ReactTooltip
                    id="info"
                    place="bottom"
                    className="tooltipCustom"
                    arrowColor="rgba(0, 0, 0, 0)"
                    effect="solid"
                  >
                    {t("comingSoon")}
                  </ReactTooltip>
                </div>
              </Link>
            </li>
            <li>
              <Dropdown>
                <Dropdown.Toggle
                  variant=""
                  id="dropdown-basic BodyColor"
                  className="menu p-0"
                >
                  <img
                    id="header-main-menu"
                    alt="#"
                    src={Menu}
                    data-tip
                    data-for="Menu"
                  />
                  <ReactTooltip
                    id="Menu"
                    className="tooltipCustom"
                    arrowColor="rgba(0, 0, 0, 0)"
                    place="bottom"
                    effect="solid"
                  >
                    {t("menu")}
                  </ReactTooltip>
                </Dropdown.Toggle>

                <Dropdown.Menu className="header-menu-dropdown BodyColor">
                  <div>
                    <div className="header-menu-dropdown-explore">
                      <span className="explore-font-style secondaryColor">
                        {t("explore")}
                      </span>
                    </div>
                    <div className="header-menu-dropdown-item-wrap">
                      <div className="width100">
                        <Dropdown.Item>
                          <Link
                            id="header-menu-app-store"
                            to="/Dashboard"
                            className="header-menu-dropdown-item"
                          >
                            <span
                              className="secondaryColor"
                              // style={{
                              //   backgroundImage: `url(${AppstoreLogo})`,
                              //   backgroundRepeat: " no-repeat",
                              // }}
                            >
                              <img
                                id="header-menu-app-store-img"
                                src={AppstoreLogo}
                              />
                            </span>
                            <p className="menu-item-font-style secondaryColor">
                              {t("appStore")}
                            </p>
                          </Link>
                        </Dropdown.Item>
                      </div>
                      <div className="width100">
                        <Dropdown.Item>
                          <Link
                            id="header-menu-app-designer"
                            to="/"
                            className="header-menu-dropdown-item"
                          >
                            <span className="secondaryColor">
                              <img
                                id="header-menu-app-designer-img"
                                src={AppdesignerLogo}
                              />
                            </span>
                            <p className="menu-item-font-style secondaryColor">
                              {t("appDesigner")}
                            </p>
                          </Link>
                        </Dropdown.Item>
                      </div>
                      {/* <div className="width100">
                        <Dropdown.Item>
                          <Link
                            id="header-menu-admin-dash"
                            to="/Reports"
                            className="header-menu-dropdown-item"
                          >
                            <span className="secondaryColor">
                              <img
                                id="header-menu-admin-dash-img"
                                src={AppstoreLogo}
                              />
                            </span>
                            <p className=" menu-item-font-style secondaryColor">
                              {t("reportStudio")}
                            </p>
                          </Link>
                        </Dropdown.Item>
                      </div> */}
                      {/* <div className="width100">
                        <Dropdown.Item>
                          <Link
                            id="header-menu-admin-dash"
                            to="/loginCustom"
                            className="header-menu-dropdown-item"
                          >
                            <span>
                              <img
                                id="header-menu-admin-dash-img"
                                src={AppstoreLogo}
                              />
                            </span>
                            <p className=" menu-item-font-style">Login</p>
                          </Link>
                        </Dropdown.Item>
                      </div> */}

                      {[
                        "UNIVERSAL_CONNECTOR",
                        "CHATBOT_BUILDER",
                        "REPORT_BUILDER",
                        "USER_MANAGEMENT",
                        "BULK_UPLOAD",
                        "PLATFORM_CUSTOMIZE",
                        "LOGINPAGE_CUSTOMIZATION",
                        "ACCESS_CONTROLLER",
                        "SUBSCRIPTION_DETAILS",
                      ].some((e) =>
                        loggedInUser?.enabled_menus?.menus_enabled?.includes(e)
                      ) && (
                        <div className="width100">
                          <Dropdown.Item>
                            <Link
                              id="header-menu-admin-dash"
                              to="/AdminDashboard"
                              className="header-menu-dropdown-item"
                            >
                              <span className="secondaryColor">
                                <img
                                  id="header-menu-admin-dash-img"
                                  src={AppstoreLogo}
                                />
                              </span>
                              <p className=" menu-item-font-style secondaryColor">
                                {t("adminDashboard")}
                              </p>
                            </Link>
                          </Dropdown.Item>
                        </div>
                      )}
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
          <div className="profile-info">
            <h5 className="ellipsis headerFontColor primaryColor">
              {localStorage.getItem("firstName")}
            </h5>
            <div className="assignRole-Dropdown">
              <Dropdown className="dropdown-box switchRoleTest">
                <Dropdown.Toggle
                  className="switchRole"
                  active="true"
                  eventKey="second"
                >
                  <h6
                    className="switchRole-activeRole"
                    onClick={handleImageClick}
                  >
                    {t(loggedInUser.currentRole)}{" "}
                    <img
                      className="assignRole-dropdown-icon"
                      style={imageStyle}
                      onClick={handleImageClick}
                      src={DropdownIcon}
                    />
                  </h6>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-container"
                  eventKey="second"
                  onClick={toggleDropdown}
                >
                  <h5 className="dropdown-menu.open switchRole-dropdown-title primaryColor">
                    Choose other assigned roles
                  </h5>
                  {loggedInUser.roles?.map((role) => {
                    return (
                      <>
                        <Dropdown.Item
                          // style={dropdownMenuStyle}

                          onClick={() => handleRoleEnabled(role.name)}
                          key={role?.name}
                          href="#"
                          id="ifDashboard-sorting-assignRole"
                          className="secondaryColor "
                        >
                          <User
                            className="svg-stroke iconSvgStrokeColor"
                            style={{ marginRight: "5px" }}
                          />
                          {role?.name.toUpperCase()}
                        </Dropdown.Item>
                        <div className="assignRole-border"></div>
                      </>
                    );
                  })}

                  <div className="assignRole-des">
                    <div className="assignRole-i">
                      <AssignRoleI className="svg-fill iconSvgFillColor" />
                    </div>
                    <div className="assignRole-info">
                      <p className="secondaryColor">
                        The Role You Select Determines And Changes Screens Of
                        The Features That User Has Access To
                      </p>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              variant=""
              id="dropdown-basic"
              className="header-profile"
            >
              <div id="header-profile-section" className="profile-img">
                {profileImage ? (
                  <ImageLoader src={profileImage} />
                ) : (
                  <p id="header-profile-section-user">{initials}</p>
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="profile-dropdown BodyColor">
              <h5 className="primaryColor">{t("myProfile")}</h5>
              <Dropdown.Item>
                <Link
                  id="header-my-profile-report"
                  className="Myprofilecsslink secondaryColor"
                  to="/UserReports"
                >
                  <span className="secondaryColor">
                    <Icon icon="carbon:report-data" />
                  </span>{" "}
                  {t("reports")}
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link
                  id="header-my-profile-my-profile"
                  to="/Profile"
                  className="Myprofilecsslink secondaryColor"
                >
                  <span className="secondaryColor">
                    <Icon icon="ant-design:user-outlined" />
                  </span>{" "}
                  {t("myProfile")}
                </Link>
              </Dropdown.Item>
              <Dropdown.Item
                id="header-my-profile-logout"
                className="logout-link"
                href="#"
                onClick={Logout}
              >
                {t("logout")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Modal
            show={changeProfileModal}
            handleClose={handleChangeProfileModal}
            centered
            size="md"
            id="change-profile-modal"
          >
            <Modal.Header className="header-main-nav">
              <Modal.Title id="contained-modal-title-vcenter">
                Change Profile Picture
              </Modal.Title>
              <CloseButton
                id="change-proifle-close-btn"
                onClick={handleChangeProfileModal}
                variant="white"
              />
            </Modal.Header>
            <Modal.Body className="profile-modal">
              <div>
                <div class="choosColorHeader">
                  <label
                    className="secondaryColor"
                    id="profile-mod-upload-img-label"
                    htmlhtmlFor="upload-img"
                    class=" colorfileHeader"
                  >
                    <input
                      type="file"
                      class="file"
                      id="upload-img"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <Icon icon="ic:outline-photo-size-select-actual" />
                    <p className="secondaryColor">
                      Upload your profile picture
                    </p>
                  </label>

                  <div style={{ width: "100%" }}>
                    <Cropper
                      className="profile-cropper"
                      initialAspectRatio={1}
                      aspectRatio={1}
                      preview=".img-preview"
                      src={images}
                      viewMode={0}
                      guides={true}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>

            <div className="profile-modal-footer">
              <button
                id="change-prof-cancel-btn"
                className="secondaryButton secondaryButtonColor"
                style={{ border: "none" }}
                onClick={() => handleChangeProfileModal()}
              >
                Cancel
              </button>
              <button
                id="change-prof-save
                -btn"
                className="primaryButton primaryButtonColor"
                onClick={onSave}
              >
                Save
              </button>
            </div>
          </Modal>
          <CommonModelContainer
            modalTitle="Change Company Picture"
            show={changeCompanyModal}
            handleClose={handleChangeCompanyModal}
            centered
            id="my-profile-change-company-modal"
            size="md"
          >
            <Modal.Body className="profile-modal">
              <div>
                <div class="choosColorHeader">
                  <label
                    className="secondaryColor"
                    htmlhtmlFor="upload-img"
                    class=" colorfileHeader"
                  >
                    <input
                      type="file"
                      class="file"
                      id="upload-img"
                      onChange={handleImageChangeCompany}
                      accept="image/*"
                    />
                    <Icon icon="ic:outline-photo-size-select-actual" />
                    <p className="secondaryColor">
                      Upload your Company picture
                    </p>
                  </label>
                  <div style={{ width: "100%" }}>
                    <Cropper
                      className="profile-cropper"
                      initialAspectRatio={82 / 25}
                      aspectRatio={82 / 25}
                      preview=".img-preview"
                      src={imagesCompany}
                      viewMode={0}
                      guides={true}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                      onInitialized={(instance) => {
                        setCropperCompany(instance);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>

            <div className="profile-modal-footer">
              <button
                className="secondaryButton secondaryButtonColor"
                style={{ border: "none" }}
                onClick={() => handleChangeCompanyModal()}
              >
                Cancel
              </button>
              <button
                className="primaryButton primaryButtonColor"
                onClick={onSaveCompany}
              >
                Save
              </button>
            </div>
          </CommonModelContainer>
        </div>
      </div>
    </header>
  );
};
export default Header;
