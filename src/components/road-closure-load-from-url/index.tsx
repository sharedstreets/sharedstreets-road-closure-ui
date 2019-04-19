import { Button, InputGroup } from '@blueprintjs/core';
import {
    isEmpty
} from 'lodash';
import * as React from 'react';
import './road-closure-load-from-url.css';

export interface IRoadClosureLoadFromURLProps {
    rightChildComponent?: React.ComponentClass,
    isFetchingInput: boolean,
    isGeneratingUploadUrl: boolean,
    geojsonUploadUrl: string,
    clearRoadClosure: () => void,
    loadRoadClosure: (url: string) => void,
}
export interface IRoadClosureLoadFromURLState {
    url: string,
    copyButtonText: string,
}

class RoadClosureLoadFromURL extends React.Component<IRoadClosureLoadFromURLProps, IRoadClosureLoadFromURLState> {
    private urlInput: any;
    
    public constructor(props: IRoadClosureLoadFromURLProps) {
        super(props);
        this.urlInput = React.createRef();
        this.handleSetInputRef = this.handleSetInputRef.bind(this);
        this.handleUpdateURL = this.handleUpdateURL.bind(this);
        this.handleClickCopy = this.handleClickCopy.bind(this);
        this.handleClickClear = this.handleClickClear.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClickLoadUrl = this.handleClickLoadUrl.bind(this);
        this.state = {
            copyButtonText: 'Copy',
            url: ''
        };
    }

    public componentDidUpdate(prevProps: IRoadClosureLoadFromURLProps, prevState: IRoadClosureLoadFromURLState) {
        if (prevProps.isGeneratingUploadUrl && !this.props.isGeneratingUploadUrl) {
            this.setState({
                url: this.props.geojsonUploadUrl
            });
        }
    }
    
    public handleClickClear = (e: any) => {
        this.props.clearRoadClosure();
        this.setState({ url: '' });
    }

    public handleClickCopy = (e: any) => {
        if (!isEmpty(this.state.url)) {
            this.urlInput.select();
            document.execCommand('copy');
            this.setState({ copyButtonText: 'Copied!' }, () => {
                setTimeout ( () => {
                    this.setState( { copyButtonText: "Copy"});
                }, 2000)
            });
        }
    }

    public handleSetInputRef = (ref: HTMLInputElement | null) => {
        this.urlInput = ref;
    }

    public handleClickLoadUrl = (e: any) => {
        this.props.loadRoadClosure(this.state.url);
    }

    public handleKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            this.props.loadRoadClosure(this.state.url);
        }
    }

    public handleUpdateURL = (e: any) => {
        this.setState({
            url: e.target.value
        });
    }

    public render() {
        let inputGroupClassname = 'SHST-Road-Closure-Load-From-Url-Input';
        if (this.props.isGeneratingUploadUrl) {
            inputGroupClassname = 'SHST-Road-Closure-Load-From-Url-Input bp3-intent-success';
        }
        return (
            <InputGroup
                // disabled={this.props.}
                className={inputGroupClassname}
                onChange={this.handleUpdateURL}
                onKeyDown={this.handleKeyDown}
                value={this.state.url}
                inputRef={this.handleSetInputRef}
                placeholder={'Enter your saved road closure url here'}
                rightElement={
                    <span>
                        <Button
                            onClick={this.handleClickCopy}
                            minimal={true}
                            className="SHST-Road-Closure-Load-From-URL-Copy-Button"
                            text={this.state.copyButtonText}/>
                        <Button
                            onClick={this.handleClickClear}
                            minimal={true}
                            intent={'danger'}
                            className="SHST-Road-Closure-Load-From-URL-Clear-Button"
                            text={"Reset loaded"}/>
                        <Button
                            onClick={this.handleClickLoadUrl}
                            minimal={true}
                            intent={'primary'}
                            loading={this.props.isFetchingInput}
                            className="SHST-Road-Closure-Load-From-URL-Download-Button"
                            text={"Load from URL"}/>
                    </span>
                }
            />
        );
    }
}

export default RoadClosureLoadFromURL;
