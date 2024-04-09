import React from "react";


export default function Grafana() {
  return (
    <div className="custom-container">
      
        <div>

          

            <>

              <div

                style={{

                  position: "fixed",

                  top: -5,

                  left: 0,

                  width: "100%",

                  height: "100%",

                  backgroundColor: "rgba(0, 0, 0, 0.8)",

                  display: "flex",

                  justifyContent: "center",

                  alignItems: "center",

                }}

              >

                <iframe


                  src={process.env.REACT_APP_GRAFANA_DASHBOARD_ENDPOINT} 

                  title="Embedded Content"

                  frameBorder="0"

                  style={{

                    width: "100%",

                    height: "109%",

                    marginTop: "210px",

                  }}

                />

              </div>



            </>

          

          

        </div>
      </div>
    
  );

}