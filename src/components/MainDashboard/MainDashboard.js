import Application from "../Application/Application";
import CreateTeam from "../CreateTeam/CreateTeam";
import FormTemplate from "../FormTemplate/FormTemplate";
import InviteMembers from "../InviteMembers/InviteMembers";
import "./MainDashboard.css";

const MainDashboard = () => {
  return (
    <div className="content-body">
      <div className="team-wrap">
        <CreateTeam />
        <InviteMembers />
      </div>
      <label htmlFor="SkipCheckbox" className="skipcheckbox secondaryColor">
        <input type="checkbox" id="skipCheckbox " name="checkbox" />
        <p className="secondaryColor">Skip for now</p>
      </label>
      <Application />
      <FormTemplate />
    </div>
  );
};
export default MainDashboard;
