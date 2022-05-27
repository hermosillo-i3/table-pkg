import React from 'react'
import {Header} from "semantic-ui-react";
import Toolbar from "./Toolbar/Toolbar";

const TableHeader = ({
                        profileSelected,
                        onCreateProfile,
                        onChangeProfile,
                        enableProfileConfiguration,
                        profiles,
                        filter,
                        setRef,
                        shouldRenderTitle,
                        shouldRenderDefaultActions = true,
                        selected_rows = [],
                        title,
                        actions,
                        toggleSettings,
                        expandRows,
                        collapseRows,
                        allowToOpenSettings,
                        className,
                        tableHeaderOptions = {},
                        rows,
                        columns,
                        allowToDownloadCVS,
                        rows_extended,
                     }) => {

   const toolBarStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 1rem'
   };

   const headerStyle = {
      margin: '0px'
   };

   const bodyToolbarStyle = {
      display: 'flex',
      flexGrow: 1,
      flexWrap: 'wrap'
   };
   const isFilterActive = filter != null;
   const isRowSelected = selected_rows.length > 0;
   const isIndicatorActive = isFilterActive || isRowSelected;
   const shouldRenderToolbar = tableHeaderOptions.shouldRenderToolbar != null ? tableHeaderOptions.shouldRenderToolbar : true;
   if (tableHeaderOptions.shouldRenderDefaultActions != null) {
      shouldRenderDefaultActions = tableHeaderOptions.shouldRenderDefaultActions;
   }
   return (
      <div
         ref={setRef}
         style={toolBarStyle}
         className={`table-toolbar ${isIndicatorActive ? "row-selected" : ""} ${className}`}>
         {
            shouldRenderTitle && (
               <React.Fragment>
                  {(isIndicatorActive) ?
                     (
                        <Header style={headerStyle} as='h4' color='red'>
                           {isRowSelected > 0 ? `${selected_rows.length} elemento(s) seleccionados` : ""}
                           {isFilterActive ? filter.text : ""}
                        </Header>
                     )
                     : (
                        <Header style={headerStyle} as='h3'>{title}</Header>
                     )}
               </React.Fragment>

            )}
         {shouldRenderToolbar && <Toolbar
            style={bodyToolbarStyle}
            title={title}
            shouldRenderDefaultActions={shouldRenderDefaultActions}
            actions={actions}
            openSettings={toggleSettings}
            expandElements={expandRows}
            collapseElements={collapseRows}
            allowToOpenSettings={allowToOpenSettings}
            toolbarOptions={tableHeaderOptions.toolbarOptions}
            profiles={profiles}
            profileSelected={profileSelected}
            onChangeProfile={onChangeProfile}
            enableProfileConfiguration={enableProfileConfiguration}
            onCreateProfile={onCreateProfile}
            rows={rows}
            columns={columns}
            allowToDownloadCVS={allowToDownloadCVS}
            rows_extended={rows_extended}
         />}
      </div>
   )
};


export default React.memo(TableHeader);
