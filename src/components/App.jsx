import React from 'react';
import CookieBanner from 'react-cookie-banner';
import PixelCanvasContainer from './PixelCanvas';
import CellSizeContainer from './CellSize';
import ColorPickerContainer from './ColorPicker';
import ModalContainer from './Modal';
import DimensionsContainer from './Dimensions';
import CssDisplayContainer from './CssDisplay';
import DurationContainer from './Duration';
import EraserContainer from './Eraser';
import BucketContainer from './Bucket';
import MoveContainer from './Move';
import EyedropperContainer from './Eyedropper';
import FramesHandlerContainer from './FramesHandler';
import PaletteGridContainer from './PaletteGrid';
import ResetContainer from './Reset';
import DuplicateContainer from './Duplicate'
import LockContainer from './Lock'
import SaveDrawingContainer from './SaveDrawing';
import NewProjectContainer from './NewProject';
import SimpleNotificationContainer from './SimpleNotification';
import SimpleSpinnerContainer from './SimpleSpinner';
import UndoRedoContainer from './UndoRedo';
import initialSetup from '../utils/startup';
import drawHandlersProvider from '../utils/drawHandlersProvider';
import Overlay from './Overlay'
import { withRouter } from 'react-router';
import { createDrawing } from '../graphql/mutations';
import { onUpdateByID } from '../graphql/subscriptions'
import { setDrawingId, lockDrawing } from '../store/actions/actionCreators'
import { connect } from 'react-redux';

import { API, graphqlOperation } from 'aws-amplify';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      modalType: null,
      modalOpen: false,
      helpOn: false,
      showCookiesBanner: false,
      overlayType: '',
      showOverlay: false,
    };
    Object.assign(this, drawHandlersProvider(this));
    this.subscription = {}
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    initialSetup(dispatch);
    this.subscribe()
    const { activeIndex, ...framesToSet } = this.props.frames
    const { id, name, drawingVisibility } = this.props.match.params;
    try {
      dispatch(setDrawingId(id));
      const isPublic = drawingVisibility === 'public'
      const drawingData = JSON.stringify(framesToSet);
      const drawing = {
        id,
        name,
        clientId: this.props.clientId,
        itemType: isPublic ? 'Drawing' : 'PrivateDrawing',
        public: isPublic,
        data: drawingData
      };
      await API.graphql({
        query: createDrawing,
        variables: { input: drawing }
      });
      console.log('item created!');
    } catch (err) {
      console.log('drawing already created... fetching drawing', err)
      if (err.errors[0] && err.errors[0].errorType && err.errors[0].errorType === "DynamoDB:ConditionalCheckFailedException") {
        const APIData = err.errors[0].data
        const frames = JSON.parse(APIData.data)
        const isLocked = APIData.locked === true
        if (isLocked) {
          dispatch(lockDrawing())
        }
        dispatch({ type: "SET_DRAWING_FROM_API", frames: { ...frames, activeIndex: 0 } })
      }
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  subscribe() {
    const { dispatch } = this.props;
    const { id, name } = this.props.match.params;
    this.subscription = API.graphql(graphqlOperation(onUpdateByID, { id }))
    .subscribe({
      next: drawingData =>  {
        const { value: { data: { onUpdateByID, onUpdateByID: { data }}} } = drawingData
        if (onUpdateByID.clientId === this.props.clientId) return
        let { activeIndex } = this.props.frames
        const frameData = JSON.parse(data)
        if (frameData.list.length - 1 < activeIndex) {
          activeIndex = activeIndex - 1
        }
        dispatch({ type: "SET_DRAWING_FROM_API", frames: { ...JSON.parse(data), activeIndex } })
      }
    })
  }

  changeModalType(type) {
    this.setState({
      modalType: type,
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  hideCookiesBanner() {
    this.setState({
      showCookiesBanner: false
    });
  }

  toggleHelp() {
    const { helpOn } = this.state;
    this.setState({ helpOn: !helpOn });
  }

  toggleOverlay(overlayType, showOverlay) {
    this.setState({
      overlayType, showOverlay
    })
  }

  render() {
    const { helpOn, showCookiesBanner, modalType, modalOpen } = this.state;
    const { isLocked } = this.props
    return (
      <div
        className="app__main"
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
        onTouchCancel={this.onMouseUp}
      >
        <SimpleSpinnerContainer />
        <SimpleNotificationContainer
          fadeInTime={1000}
          fadeOutTime={1500}
          duration={1500}
        />
        <div
          className="app__frames-container"
          data-tooltip={
            helpOn
              ? `Create an awesome animation sequence.
              You can modify the duration of each frame, changing its own value.
              The number indicates where the frame ends in a range from 0 to 100.
              `
              : null
          }
        >
          <FramesHandlerContainer />
        </div>
        <div className="app__central-container">
          <div className="left col-1-4">
            <div className="app__left-side">
              <div className="app__mobile--container">
                <div className="app__mobile--group">
                  <div data-tooltip={helpOn ? 'New project' : null}>
                    <NewProjectContainer />
                  </div>
                  <div className="app__load-save-container">
                    <button
                      type="button"
                      className="app__load-button"
                      onClick={() => {
                        this.changeModalType('load');
                      }}
                      data-tooltip={
                        helpOn ? 'Load projects you stored before' : null
                      }
                    >
                      LOAD
                    </button>
                    <div data-tooltip={helpOn ? 'Save your project' : null}>
                      <SaveDrawingContainer />
                    </div>
                  </div>
                  {
                    !isLocked && (
                      <div data-tooltip={helpOn ? 'Undo Redo actions' : null}>
                        <UndoRedoContainer />
                      </div>
                    )
                  }
                  <div className="app__tools-wrapper grid-3">
                    <div
                      data-tooltip={
                        helpOn
                          ? 'It fills an area of the current frame based on color similarity'
                          : null
                      }
                    >
                      <BucketContainer />
                    </div>
                    <div
                      data-tooltip={
                        helpOn ? 'Sample a color from your drawing' : null
                      }
                    >
                      <EyedropperContainer />
                    </div>
                    <div
                      data-tooltip={
                        helpOn
                          ? 'Choose a new color that is not in your palette'
                          : null
                      }
                    >
                      <ColorPickerContainer />
                    </div>
                    <div data-tooltip={helpOn ? 'Remove colors' : null}>
                      <EraserContainer />
                    </div>
                    <div
                      data-tooltip={
                        helpOn ? 'Move your drawing around the canvas' : null
                      }
                    >
                      <MoveContainer />
                    </div>
                  </div>
                </div>
                <div className="app__mobile--group">
                  <PaletteGridContainer />
                </div>
              </div>
              <div className="app__mobile--container">
                <div className="app__mobile--group">
                  <button
                    type="button"
                    className="app__copycss-button"
                    onClick={() => {
                      this.changeModalType('copycss');
                    }}
                    data-tooltip={
                      helpOn ? 'Check your CSS generated code' : null
                    }
                  >
                    css
                  </button>
                </div>
                <div className="app__mobile--group">
                  <div className="app__social-container">
                    <div
                      data-tooltip={
                        helpOn
                          ? 'Download your creation in different formats'
                          : null
                      }
                    >
                      <button
                        type="button"
                        aria-label="Download"
                        className="app__download-button"
                        onClick={() => {
                          this.changeModalType('download');
                        }}
                      />
                    </div>
                    <div data-tooltip="Toggle help tooltips">
                      <button
                        type="button"
                        aria-label="Help"
                        className={`app__toggle-help-button
                          ${helpOn ? ' selected' : ''}`}
                        onClick={() => {
                          this.toggleHelp();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="center col-2-4">
            <PixelCanvasContainer
              drawHandlersFactory={this.drawHandlersFactory}
            />
          </div>
          <div className="right col-1-4">
            <div className="app__right-side">
              <div className="app__mobile--container">
                <div className="app__mobile--group">
                  <button
                    type="button"
                    className="app__preview-button"
                    onClick={() => {
                      this.changeModalType('preview');
                    }}
                    data-tooltip={
                      helpOn ? 'Show a preview of your project' : null
                    }
                  >
                    PREVIEW
                  </button>
                  {
                    !isLocked && (
                      <div
                        data-tooltip={helpOn ? 'Reset the selected frame' : null}
                      >
                        <ResetContainer />
                      </div>
                        )
                      }
                  <div
                    data-tooltip={helpOn ? 'Duplicate this drawing' : null}
                  >
                    <DuplicateContainer toggleOverlay={this.toggleOverlay.bind(this)} />
                  </div>
                  {
                    !isLocked && (
                      <div
                        data-tooltip={helpOn ? 'Lock this drawing. This will make it no longer editable' : null}
                      >
                        <LockContainer toggleOverlay={this.toggleOverlay.bind(this)} />
                      </div>
                    )
                  }
                  <div
                    data-tooltip={helpOn ? 'Number of columns and rows' : null}
                  >
                    <DimensionsContainer />
                  </div>
                </div>
                <div className="app__mobile--group">
                  <div data-tooltip={helpOn ? 'Size of one tile in px' : null}>
                    <CellSizeContainer />
                  </div>
                  <div
                    data-tooltip={
                      helpOn ? 'Animation duration in seconds' : null
                    }
                  >
                    <DurationContainer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="css-container">
          <CssDisplayContainer />
        </div>
        {showCookiesBanner ? (
          <CookieBanner
            disableStyle
            message="
              This website uses cookies. By continuing to use
              this website you are giving consent to cookies
              being used. Thank you. "
            link={{
              msg: '',
              url: 'https://www.jvalen.com/pixelartcss/cookies.html',
              target: '_blank'
            }}
            onAccept={() => this.hideCookiesBanner()}
            cookie="user-has-accepted-cookies"
            dismissOnScroll={false}
          />
        ) : null}
        <ModalContainer
          type={modalType}
          isOpen={modalOpen}
          close={() => {
            this.closeModal();
          }}
          open={() => {
            this.changeModalType(modalType);
          }}
        />
        {
          this.state.showOverlay && (
            <Overlay
              type={this.state.overlayType}
              toggleOverlay={this.toggleOverlay.bind(this)}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const currentState = state.present.toJS()
  return {
    frames: currentState.frames,
    isLocked: currentState.isLocked
  }
};

const AppContainer = connect(
  mapStateToProps
)(App);


export default withRouter(AppContainer);
