import React from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import LeftPanelTabs from 'components/LeftPanelTabs';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import OutlinesPanel from 'components/OutlinesPanel';
import BookmarksPanel from 'components/BookmarksPanel';
import LayersPanel from 'components/LayersPanel';
import NotesPanel from 'components/NotesPanel';
import FileAttachmentPanel from 'components/FileAttachmentPanel';
import SignaturePanel from 'components/SignaturePanel';
import CustomElement from 'components/CustomElement';
import ResizeBar from 'components/ResizeBar';
import Icon from 'components/Icon';

import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import useMedia from 'hooks/useMedia';
import { isIE } from 'helpers/device';

import './LeftPanel.scss';
import LeftPanelPageTabs from "components/LeftPanelPageTabs";
import ToolbarPanel from '../ToolbarPanel';

const LeftPanel = () => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  const [
    currentToolbarGroup,
    isHeaderOpen,
    isToolsHeaderOpen,
    isOpen,
    isDisabled,
    activePanel,
    customPanels,
    currentWidth,
    notesInLeftPanel,
    isInDesktopOnlyMode,
    isThumbnailSelectingPages
  ] = useSelector(
    state => [
      selectors.getCurrentToolbarGroup(state),
      selectors.isElementOpen(state, 'header'),
      selectors.isElementOpen(state, 'toolsHeader'),
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementDisabled(state, 'leftPanel'),
      selectors.getActiveLeftPanel(state),
      selectors.getCustomPanels(state),
      selectors.getLeftPanelWidth(state),
      selectors.getNotesInLeftPanel(state),
      selectors.isInDesktopOnlyMode(state),
      selectors.isThumbnailSelectingPages(state),
    ],
    shallowEqual,
  );

  const minWidth = 264;
  const dispatch = useDispatch();

  const onDrop = e => {
    // this is mainly for the thumbnail panel, to prevent the broswer from loading a document that dropped in
    e.preventDefault();
  };

  const onDragOver = e => {
    // when dragging over the "LeftPanel", change the cursor to "Move" from "Copy"
    e.preventDefault();
  };

  const getDisplay = panel => (panel === activePanel ? 'flex' : 'none');

  let style = {};
  if (isInDesktopOnlyMode || !isMobile) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  }

  const isVisible = !(!isOpen || isDisabled);

  return (
    <div
      className={classNames({
        Panel: true,
        LeftPanel: true,
        'closed': !isVisible,
        'tools-header-open': isToolsHeaderOpen && currentToolbarGroup !== 'toolbarGroup-View',
        'tools-header-and-header-hidden': !isHeaderOpen && !isToolsHeaderOpen,
        'thumbnail-panel-active': activePanel === 'thumbnailsPanel',
        'outlines-panel-active': activePanel === 'outlinesPanel'
      })}
      onDrop={onDrop}
      onDragOver={onDragOver}
      data-element="leftPanel"
    >
      {(isInDesktopOnlyMode || !isTabletAndMobile) &&
        <ResizeBar
          dataElement="leftPanelResizeBar"
          minWidth={minWidth}
          onResize={width => dispatch(actions.setLeftPanelWidth(window.innerWidth-width))}
        />
      }
      <div
        className="left-panel-container"
        style={style}
      >
        {!isInDesktopOnlyMode && isMobile &&
          <div
            className="close-container"
          >
            <div
              className="close-icon-container"
              onClick={() => {
                dispatch(actions.closeElements(['leftPanel']));
              }}
            >
              <Icon
                glyph="ic_close_black_24px"
                className="close-icon"
              />
            </div>
          </div>
        }
        <div className="left-panel-header">
          {isThumbnailSelectingPages ? <LeftPanelPageTabs /> : <LeftPanelTabs />}
        </div>
        {activePanel === 'thumbnailsPanel' && <ThumbnailsPanel/>}
        {activePanel === 'toolbarPanel' && <ToolbarPanel />}
        {activePanel === 'outlinesPanel' && <OutlinesPanel />}
        {activePanel === 'bookmarksPanel' && <BookmarksPanel />}
        {activePanel === 'layersPanel' && <LayersPanel />}
        {core.isFullPDFEnabled() && activePanel === 'signaturePanel' && <SignaturePanel />}
        {activePanel === 'attachmentPanel' && <FileAttachmentPanel />}
        {notesInLeftPanel && activePanel === 'notesPanel' && <NotesPanel currentLeftPanelWidth={currentWidth} />}
        {customPanels.map(({ panel }, index) => (
          <CustomElement
            key={panel.dataElement || index}
            className={`Panel ${panel.dataElement}`}
            display={getDisplay(panel.dataElement)}
            dataElement={panel.dataElement}
            render={panel.render}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
