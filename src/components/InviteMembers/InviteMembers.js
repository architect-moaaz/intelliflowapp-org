import { InviteMembersIcon } from "../../assets";
import "./InviteMembers.css"

  const InviteMembers = () => {
    return <div className="invite-members" id="invite-members">
      <h5 className="primaryColor">Invite Members</h5>
        <div className="members-box">
            <div className="members-item">
                <div className="members-wrap">
                  <div className="team-item-img"><img src={InviteMembersIcon} alt="" /></div>
                  <div className="team-item-img"><img src={InviteMembersIcon} alt="" /></div>
                </div>
                <h6 className="primaryColor">Team Members</h6>
            </div>
        </div>
    </div>;
  };
  export default InviteMembers;