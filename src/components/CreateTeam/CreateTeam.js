import {CreateTeamIcon} from "../../assets"
import "./CreateTeam.css"

const CreateTeam = () => {
    return <div className="create-team">
        <h5 className="primaryColor">Create Team</h5>
        <div className="team-box">
            <div className="team-item">
                <div className="team-item-img"><img src={CreateTeamIcon} alt="" /></div>
                <h6 className="primaryColor">Team 1</h6>
            </div>
            <div className="team-item">
                <div className="team-item-img"><img src={CreateTeamIcon} alt="" /></div>
                <h6 className="primaryColor">Team 1</h6>
            </div>
        </div>
    </div>;
  };
  export default CreateTeam;
  