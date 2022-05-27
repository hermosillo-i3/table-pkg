import React from 'react'
import { DropTarget } from 'react-dnd'
import { ItemTypes } from './Constants'
import EmptyStateCard from "./EmptyStateCard/EmptyStateCard";

const dropConnector = {
	drop(props, monitor) {

		// Obtain the dragged item
		const item = monitor.getItem()

		if (props.onDrop) {
			props.onDrop(item, props.row, props.isCtrlPressed)
		}
	},
	canDrop(props, monitor) {
		if (props.canDrop) {
			return props.canDrop(props, monitor)
		}
		return false
	}
};

function dropCollector(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	};
}

const NoRowsCard = (
	{
		noRowsMessage,
		connectDropTarget,
		isOver,
		canDrop
	}) => {

	const title = noRowsMessage ? noRowsMessage.title : 'Empty table'
	const subtitle = noRowsMessage ? noRowsMessage.subtitle : ''
	const icon = noRowsMessage ? noRowsMessage.icon : 'tools'
	const isMultiple = noRowsMessage ? noRowsMessage.isMultiple : false

	return (
		<tr style={{ display: 'flex' }}>
			<td style={{ margin: 'auto', padding: '1.5rem 0' }}>
				{
					connectDropTarget(
						<div>
							<EmptyStateCard
								icon={icon}
								isOver={isOver}
								isMultiple={isMultiple}
								canDrop={canDrop}
								title={title}
								subtitle={subtitle}
							/>
						</div>

					)
				}
			</td>
		</tr>
	)
}



export default DropTarget(ItemTypes.ROW, dropConnector, dropCollector)(NoRowsCard);