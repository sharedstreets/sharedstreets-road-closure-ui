import { Button } from '@blueprintjs/core';
import * as React from 'react';
import './sharedstreets-map-draw-control.css';

export interface ISharedStreetsMapDrawControlProps {
    isDrawing: boolean,
    isDrawControlToggled: boolean,
    onStart: (e: any) => void,
    onConfirm: (e: any) => void,
    onCancel: (e: any) => void,
    onUndo: (e: any) => void,
};

class SharedStreetsMapDrawControl extends React.Component<ISharedStreetsMapDrawControlProps, any> {
  public state = {
    isDrawControlToggled: false,
  }

  public handleStartDrawing = (e: any) => {
    this.setState({
      isDrawControlToggled: true,
    });
    this.props.onStart(e);
  }

  public handleConfirmDrawing = (e: any) => {
    this.setState({
      isDrawControlToggled: false,
    });
    this.props.onConfirm(e);
  }

  public handleCancelDrawing = (e: any) => {
    this.setState({
      isDrawControlToggled: false,
    });
    this.props.onCancel(e);
  }

  public handleUndoLastDrawing = (e: any) => {
    this.props.onUndo(e);
  }

  public render() {
    return (
        <React.Fragment>
          <Button
              title={"Click to begin selecting points to draw a line"}
              className={"SHST-Map-Draw-Control-Button"}
              style={{
                  pointerEvents: "all"
              }}
              icon={"highlight"}
              disabled={this.state.isDrawControlToggled}
              onClick={this.handleStartDrawing}
          />
          {
            this.state.isDrawControlToggled &&
            <React.Fragment>
              <Button
                title={"Click to confirm drawn selection"}
                style={{
                    pointerEvents: "all"
                }}
                intent={'success'}
                icon={"tick"}
                onClick={this.handleConfirmDrawing}
              />
              <Button
                title={"Click to cancel drawn selection"}
                style={{
                    pointerEvents: "all"
                }}
                intent={'danger'}
                icon={"cross"}
                onClick={this.handleCancelDrawing}
              />
              <Button
                title={"Click to undo last point selection"}
                style={{
                    pointerEvents: "all"
                }}
                intent={"primary"}
                icon={"undo"}
                onClick={this.handleUndoLastDrawing}
              />
            </React.Fragment>
          }
        </React.Fragment>
    );
  }
}

export default SharedStreetsMapDrawControl;
