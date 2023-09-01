import React from 'react';
import { Icon, Popup, Button, List } from "semantic-ui-react";
import PropTypes from 'prop-types';

const getContent = (warnings) => {
    if (Array.isArray(warnings)) {
        return (
            <List bulleted>
                {warnings.map((warning, index) => <List.Item key={index}>{warning}</List.Item>)}
            </List>
        );
    } else if (typeof warnings === 'string') {
        return warnings;
    }

    return '';
}

const WarningPopup = ({ warnings, buttonText, iconName = 'warning sign' }) => {
    return (
        <Popup
            content={getContent(warnings)}
            style={{
                maxHeight: '60%',
                overflow: 'auto',
            }}
            hoverable
            popper={{ id: 'popper-container', style: { zIndex: 2000 } }}
            // Wrapping the content in a span to prevent the popup not rendering
            trigger={
                <span>
                    <Button disabled icon labelPosition='left' color='orange'>
                        <Icon name={iconName} />
                        {buttonText}
                    </Button>
                </span>}
            position='top right'
        />
    );
};

WarningPopup.propTypes = {
    warnings: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]).isRequired,
    buttonText: PropTypes.string.isRequired,
    iconName: PropTypes.string,
};

export default WarningPopup;
