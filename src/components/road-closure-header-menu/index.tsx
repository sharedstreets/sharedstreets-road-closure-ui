import {
    // AnchorButton, 
    // FormGroup,
    // Label,
    Button,
    Popover,
    Tag,
    Text,
} from '@blueprintjs/core';
import {
    isEmpty
} from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import RoadClosureLogin from 'src/containers/road-closure-login';
import './road-closure-header-menu.css';

export interface IRoadClosureHeaderMenuProps {
    rightChildComponent?: React.ComponentClass,
    isEditingExistingClosure: boolean,
    isFetchingInput: boolean,
    isGeneratingUploadUrl: boolean,
    isLoggedIn: boolean,
    orgName: string,
    geojsonUploadUrl: string,
    edit?: boolean,
    explore?: boolean,
    addFile: (e: File) => void,
    clearRoadClosure: () => void,
    loadRoadClosure: (url: string) => void,
    logout: () => void,
}
export interface IRoadClosureHeaderMenuState {
    url: string,
    copyButtonText: string,
    fileName: string,
    isLoginDialogShown: boolean,
}

class RoadClosureHeaderMenu extends React.Component<IRoadClosureHeaderMenuProps, IRoadClosureHeaderMenuState> {
    public fileInputRef = React.createRef<HTMLInputElement>();
    private urlInput: any;
    
    public constructor(props: IRoadClosureHeaderMenuProps) {
        super(props);
        this.urlInput = React.createRef();
        this.handleFileAdded = this.handleFileAdded.bind(this);
        this.handleSetInputRef = this.handleSetInputRef.bind(this);
        this.handleUpdateURL = this.handleUpdateURL.bind(this);
        this.handleClickCopy = this.handleClickCopy.bind(this);
        this.handleClickClear = this.handleClickClear.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClickLoadUrl = this.handleClickLoadUrl.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.state = {
            copyButtonText: 'Copy',
            fileName: '',
            isLoginDialogShown: false,
            url: '',
        };
    }

    public componentDidUpdate(prevProps: IRoadClosureHeaderMenuProps, prevState: IRoadClosureHeaderMenuState) {
        if (prevProps.isGeneratingUploadUrl && !this.props.isGeneratingUploadUrl) {
            this.setState({
                url: this.props.geojsonUploadUrl
            });
        }
    }

    public handleLogIn = (e: any) => {
        this.setState({
            isLoginDialogShown: !this.state.isLoginDialogShown
        });
    }

    public handleLogOut = (e: any) => {
        this.props.logout();
    }
    
    public handleFileAdded = (e: any) => {
        if (this.fileInputRef.current && this.fileInputRef.current.files) {
            const file = this.fileInputRef.current.files[0];
            let selectedFileName = '';
            if (file && file.name) {
                selectedFileName = file.name;
                this.props.addFile(file);
                this.fileInputRef.current.files = null;
            }
            this.setState({
                fileName: selectedFileName
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
        return (
            <React.Fragment>
                {this.props.edit && this.props.isEditingExistingClosure &&
                    <Tag
                        large={true}
                        intent={"danger"}
                        title={"Editing"}>
                            You are editing a published closure
                    </Tag>
                }
                { this.props.explore && <Link className={"bp3-button bp3-intent-success"} to="edit">Create new closure</Link> }
                { this.props.edit && <Link className={"bp3-button bp3-intent-primary"} to="explore">View all road closures</Link> }
                { (this.props.edit && !this.props.isEditingExistingClosure) &&
                    <label className="bp3-file-input">
                        <input
                            ref={this.fileInputRef}
                            type="file"
                            accept=".json, .geojson"
                            onChange={this.handleFileAdded}/>
                        <span className="bp3-file-upload-input">
                        {
                            this.state.fileName === '' ? 
                            "Load from GeoJSON file..."
                            : this.state.fileName
                        }
                        </span>
                    </label>
                }
                <Text>{this.props.orgName}</Text>
                {
                    !this.props.isLoggedIn &&
                    <Popover
                        canEscapeKeyClose={true}
                        minimal={true}
                        position={"bottom-left"}
                        isOpen={this.state.isLoginDialogShown}>
                        <Button
                            title={"Have an account? Log in"}
                            text={"Have an account? Log in"}
                            intent={"primary"}
                            onClick={this.handleLogIn}
                        />
                        <div className={"SHST-Header-Menu-Login-Dropdown"}>
                            <RoadClosureLogin
                                redirectOnLogin={false}
                            />
                        </div>
                    </Popover>
                }
                {
                    this.props.isLoggedIn &&
                    <Button
                        title={"Log out"}
                        text={"Log out"}
                        intent={"none"}
                        onClick={this.handleLogOut}
                    />
                }
            </React.Fragment>
        );
    }
}

export default RoadClosureHeaderMenu;
