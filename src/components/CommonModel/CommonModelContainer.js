import CommonModel from "./CommonModel";

const CommonModelContainer = ({show, handleClose, className, modalTitle, children}) => {
    return <CommonModel show={show} handleClose={handleClose} className={className} id="commonModelContainer-CommonModel" modalTitle={modalTitle} children={children} />
}

export default CommonModelContainer;