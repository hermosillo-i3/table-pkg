import React from 'react'
import { Header } from "semantic-ui-react";
import { ItemTypes } from './Constants'
import {  DropTarget } from 'react-dnd'

const spectTarget = {
  drop(props, monitor, component) {
    // Obtain the dragged item
		const item = monitor.getItem()
		
		if(props.onDrop){
      props.onDrop(item, props.row, props.isCtrlPressed)
    }

  },
  canDrop(props, monitor){
    
    if(props.canDrop){
      return props.canDrop(props, monitor)
    }
    return false
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}


class DropZone extends React.Component {

  render(){
    const {
      connectDropTarget,
      canDrop
    } = this.props

    //  Styles

    let thStyle = {
      backgroundColor: '#3C85FB',
      textAlign: 'center',
      fontWeight: 'bold',
      position: 'sticky',
      top: 0,
    }

    const tdStyle = {
      width: '100%'
    }

    const pStyle = {
      color: 'white',
      textAlign: 'center',
      margin: '5px'
    }

    //  Do not render if no row is beeing drag.
    if(!canDrop)
      return null

    return connectDropTarget(
      <th style={thStyle} className='Table-Row'>
        <td style={tdStyle}><Header as='h4' style={pStyle}>Arrastra y suelta aquí los elementos</Header></td>
      </th>
    )
    
    
  }
}

export default DropTarget(ItemTypes.ROW, spectTarget, collectTarget)(DropZone);