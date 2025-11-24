import React from "react";
import { getAssetsUrl } from "../utils/helpers";
const Invitefriend =()=>{
    return(
        <div className="pt-3 pb-3">
            
          <img className="invitefrndimg" src={getAssetsUrl("invite.png")} loading="lazy"></img>
        </div>
    )
}
export default Invitefriend;