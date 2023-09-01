import React, { useCallback } from 'react'
import { Modal, Button, Icon } from "semantic-ui-react";
import PropTypes from 'prop-types';
import WarningPopup from '../components/presentational/WarningPopup';

const CustomModal = (props) => {
    const {
        isOpen,
        onConfirm,
        onClose,
        header,
        modalSize = 'small',
        modalStyle = {},
        contentStyle = {},
        contentClassName = '',
        modalClassName = '',
        actionButtonText = 'OK',
        cancelButtonText = 'Cancelar',
        shouldShowCancelButton = false,
        shouldDisableActionButton = false,
        contentProps = {},
        children,
        warningsArray = [],
    } = props;

    const getActionButton = useCallback(() => {
        if (warningsArray.length > 0) {
            return (<WarningPopup warnings={warningsArray} buttonText={actionButtonText}/>)
        }

        return (
        <Button disabled={shouldDisableActionButton} icon labelPosition='left' color='blue' onClick={shouldShowCancelButton ? onConfirm : onClose}>
            <Icon name='check' />
            {actionButtonText}
        </Button>
        )
    }, [actionButtonText, onClose, onConfirm, shouldDisableActionButton, shouldShowCancelButton, warningsArray]);


    return (<Modal
        open={isOpen}
        style={modalStyle}
        className={modalClassName}
        size={modalSize}
        onClose={onClose}
    >
        <Modal.Header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: header ? 'space-between' : 'end',
            padding: header ? 'inherit inherit 0 inherit' : '0',
            paddingTop: '.2rem',
            paddingBottom: '.2rem',
        }}>{header}
            <Button style={{ boxShadow: 'none', paddingRight: 0, marginRight: 0 }} size='big' basic icon='cancel' onClick={onClose} />
        </Modal.Header>
        <Modal.Content className={contentClassName} style={contentStyle} {...contentProps}>
            {children && children}
        </Modal.Content>
        {onConfirm != null && <Modal.Actions>
            {shouldShowCancelButton && <Button color='red' icon labelPosition='left' onClick={onClose}>
                <Icon name='cancel' />
                {cancelButtonText}
            </Button>}
            {getActionButton()}
        </Modal.Actions>}
    </Modal>)
}

CustomModal.propTypes = {
    isOpen: PropTypes.bool,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
    header: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.elementType,
    ]),
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
    ]),
    modalSize: PropTypes.string,
    modalStyle: PropTypes.object,
    contentStyle: PropTypes.object,
    contentClassName: PropTypes.string,
    modalClassName: PropTypes.string,
    actionButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    shouldShowCancelButton: PropTypes.bool,
    shouldDisableActionButton: PropTypes.bool,
    warningsArray: PropTypes.array,
};

export default CustomModal;
