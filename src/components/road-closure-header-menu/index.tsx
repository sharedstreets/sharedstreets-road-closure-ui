import {
    // AnchorButton, 
    // FormGroup,
    // Label,
    Tag,
    Text,
} from '@blueprintjs/core';
import {
    isEmpty
} from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './road-closure-header-menu.css';

export interface IRoadClosureHeaderMenuProps {
    rightChildComponent?: React.ComponentClass,
    isEditingExistingClosure: boolean,
    isFetchingInput: boolean,
    isGeneratingUploadUrl: boolean,
    orgName: string,
    geojsonUploadUrl: string,
    edit?: boolean,
    explore?: boolean,
    clearRoadClosure: () => void,
    loadRoadClosure: (url: string) => void,
}
export interface IRoadClosureHeaderMenuState {
    url: string,
    copyButtonText: string,
}

class RoadClosureHeaderMenu extends React.Component<IRoadClosureHeaderMenuProps, IRoadClosureHeaderMenuState> {
    private urlInput: any;
    
    public constructor(props: IRoadClosureHeaderMenuProps) {
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

    public componentDidUpdate(prevProps: IRoadClosureHeaderMenuProps, prevState: IRoadClosureHeaderMenuState) {
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
                <Text>{"Organization: " + this.props.orgName}</Text>
            </React.Fragment>
        );
    }
}

export default RoadClosureHeaderMenu;
