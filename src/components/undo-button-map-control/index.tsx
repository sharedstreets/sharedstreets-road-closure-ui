import { Button } from '@blueprintjs/core';
import * as React from 'react';

export interface IUndoButtonMapControlProps {
    onClick: () => void
};

class UndoButtonMapControl extends React.Component<IUndoButtonMapControlProps, any> {
  public render() {
    return (
        <Button
            className={"SHST-Undo-Point-Select-Button"}
            style={{
                pointerEvents: "all"
            }}
            large={true}
            icon={"undo"}
            onClick={this.props.onClick}
            text={"Undo"}
        />
    );
  }
}

export default UndoButtonMapControl;
