import { Button, InputGroup } from '@blueprintjs/core';
import * as React from 'react';
// import './sharedstreets-header.css';

export interface IRoadClosureLoadFromURLProps {
    rightChildComponent?: React.ComponentClass,
    loadRoadClosure: (url: string) => void,
}
export interface IRoadClosureLoadFromURLState {
    url: string,
}
class RoadClosureLoadFromURL extends React.Component<IRoadClosureLoadFromURLProps, IRoadClosureLoadFromURLState> {
    public constructor(props: IRoadClosureLoadFromURLProps) {
        super(props);
        this.handleUpdateURL = this.handleUpdateURL.bind(this);
        this.handleClickLoadUrl = this.handleClickLoadUrl.bind(this);
        this.state = {
            url: ''
        };
    }

    public handleClickLoadUrl = (e: any) => {
        this.props.loadRoadClosure(this.state.url);
    }

    public handleUpdateURL = (e: any) => {
        this.setState({
            url: e.target.value
        });
    }

    public render() {
        return (
            <InputGroup
                onChange={this.handleUpdateURL}
                value={this.state.url}
                rightElement={
                    <Button
                        onClick={this.handleClickLoadUrl}
                        minimal={true}
                        className="SHST-Road-Closure-Load-From-URL-Button"
                        text={"Load from URL"}/>
                }
            />
        );
    }
}

export default RoadClosureLoadFromURL;
