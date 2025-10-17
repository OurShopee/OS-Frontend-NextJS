import React from "react";
const ComponentHeader2 = ({ title,color }) => {
    return (
        <div className="component_header2">
            <div >
                <h4 style={{background:color}}>{title}</h4>
            </div>
        </div>
    )
}
export default ComponentHeader2;