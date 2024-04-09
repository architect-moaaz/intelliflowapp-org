import cx from "classnames";
import "./ErrorScreen.css";

const ErrorScreen = ({isDisplayError}) => {
  return (
    <>
      <div className={cx("error-messages", {"show-error": isDisplayError})}>
        <div className="error-box">
          <h4 className="primaryColor">Errors : 16</h4>
          <table>
            <thead>
              <tr>
                <th>Modeler</th>
                <th>Date</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Login.bpmn</td>
                <td>02-02-2022,05:00 AM</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                </td>
              </tr>
              <tr>
                <td>Approval.dmn</td>
                <td>01-02-2022,09:00 AM</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="error-box">
          <h4 className="primaryColor">Warnings : 8</h4>
          <table>
            <thead>
              <tr>
                <th>Modeler</th>
                <th>Date</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Login.bpmn</td>
                <td>02-02-2022,05:00 AM</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                </td>
              </tr>
              <tr>
                <td>Approval.dmn</td>
                <td>01-02-2022,09:00 AM</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default ErrorScreen;
