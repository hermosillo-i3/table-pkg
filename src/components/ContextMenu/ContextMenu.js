import React from "react";
import { Icon } from "semantic-ui-react";
import "./ContextMenu.scss";

const ContextMenu = (props) => {
   const { x, y, actions = [], onClose } = props;

   return (
      <div
         className="ContextMenu"
         style={{
            top: y,
            left: x,
            backgroundColor: "white"
         }}
      >
         {actions.map((action) => {
            return (
               <div className="ContextMenuRow" onClick={() => {
                  action.action()
                  onClose();
               }}>
                  <div className="ContextMenuRowIcon">
                     <Icon name={action.icon} />
                  </div>
                  <div className="ContextMenuRowContent">{action.name}</div>
               </div>
            );
         })}
      </div>
   );
};

ContextMenu.propTypes = {};

export default ContextMenu;
