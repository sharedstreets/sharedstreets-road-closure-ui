import {
    Button,
    Card,
    // InputGroup,
    FormGroup,
    MenuItem,
    // Popover,
} from '@blueprintjs/core';
import {
    ItemRenderer,
    Suggest,
} from '@blueprintjs/select';
import * as React from 'react';
import { IFetchQueryStreetnameSuccessResponse } from 'src/store/road-closure';
import './road-closure-street-name-selector.css';

const StreetnameSuggest = Suggest.ofType<IFetchQueryStreetnameSuccessResponse>();

export interface IRoadClosureStreetNameSelectorProps {
    findStreetname: (streetname: string) => void,
    streetnames: IFetchQueryStreetnameSuccessResponse[]
};

export interface IRoadClosureStreetNameSelectorState {
    streetname: string,
    toStreet: string,
    fromStreet: string,
};


class RoadClosureStreetNameSelector extends React.Component<IRoadClosureStreetNameSelectorProps, IRoadClosureStreetNameSelectorState> {
    public constructor(props: IRoadClosureStreetNameSelectorProps) {
        super(props);

        this.handleChangeStreetname = this.handleChangeStreetname.bind(this);
        this.handleStreetnameSelect = this.handleStreetnameSelect.bind(this);
        this.handleChangeFromStreet = this.handleChangeFromStreet.bind(this);
        this.handleFromStreetSelect = this.handleFromStreetSelect.bind(this);
        this.handleChangeToStreet = this.handleChangeToStreet.bind(this);
        this.handleToStreetSelect = this.handleToStreetSelect.bind(this);
        this.renderStreetname = this.renderStreetname.bind(this);
        this.streetnameInputValueRenderer = this.streetnameInputValueRenderer.bind(this);
        this.state = {
            fromStreet: '',
            streetname: '',
            toStreet: '',
        };
    }

    public streetnameInputValueRenderer = (item: IFetchQueryStreetnameSuccessResponse) => item.streetname;

    public renderStreetname: ItemRenderer<IFetchQueryStreetnameSuccessResponse> = (item, { handleClick, modifiers, query }) => {
        return <MenuItem
            onClick={handleClick}
            key={item.streetname}
            label={item.streetname}
        />;
    }

    public handleChangeStreetname(query: string, e: any) {
        this.setState({
            streetname: query
        });
        this.props.findStreetname(query);
    }

    public handleStreetnameSelect(item: IFetchQueryStreetnameSuccessResponse, event: any) {
        this.setState({
            streetname: item.streetname
        });
    }

    public handleChangeFromStreet(query: string, e: any) {
        this.setState({
            fromStreet: query
        });
        this.props.findStreetname(query);
    }

    public handleFromStreetSelect(item: IFetchQueryStreetnameSuccessResponse, event: any) {
        this.setState({
            fromStreet: item.streetname
        });
    }

    public handleChangeToStreet(query: string, e: any) {
        this.setState({
            toStreet: query
        });
        this.props.findStreetname(query);
    }

    public handleToStreetSelect(item: IFetchQueryStreetnameSuccessResponse, event: any) {
        this.setState({
            toStreet: item.streetname
        });
    }

    public render() {
        return (
            <Card
                elevation={1}
                className={'SHST-Road-Closure-Street-Name-Selector'}>
                <div className={"SHST-Road-Closure-Street-Name-Selector-Content"}>
                    <div>
                        <FormGroup
                            label="Street name"
                            helperText="Type the name of the street you want to select"
                        >
                            <StreetnameSuggest
                                className={'SHST-Road-Closure-Street-Name-Selector-Streetname-Suggest'}
                                noResults={<MenuItem disabled={true} text="No streets found." />}
                                items={this.props.streetnames}
                                itemRenderer={this.renderStreetname}
                                inputValueRenderer={this.streetnameInputValueRenderer}
                                onItemSelect={this.handleStreetnameSelect}
                                onQueryChange={this.handleChangeStreetname}
                                query={this.state.streetname}
                                inputProps={{
                                    placeholder: "Enter the name of the street...",
                                }}
                            />
                        </FormGroup>
                    </div>
                    <div className={'SHST-Road-Closure-Street-Name-Selector-Bounds'}>
                        <FormGroup
                            className={"SHST-Road-Closure-Street-Name-Selector-FromStreet-FormGroup"}
                            label="From street"
                            helperText="Type the name of the first cross street"
                        >
                            <StreetnameSuggest
                                className={"SHST-Road-Closure-Street-Name-Selector-FromStreet-Suggest"}
                                noResults={<MenuItem disabled={true} text="No streets found." />}
                                items={this.props.streetnames}
                                itemRenderer={this.renderStreetname}
                                inputValueRenderer={this.streetnameInputValueRenderer}
                                onItemSelect={this.handleFromStreetSelect}
                                onQueryChange={this.handleChangeFromStreet}
                                query={this.state.fromStreet}
                                inputProps={{
                                    // large: true,
                                    placeholder: "starting from this street...",
                                    // small: false,
                                }}
                            />
                        </FormGroup>
                        <FormGroup
                            className={"SHST-Road-Closure-Street-Name-Selector-Direction-Button"}
                        >
                            <Button
                                disabled={true}
                                icon={'arrow-right'} />
                        </FormGroup>
                        <FormGroup
                            className={"SHST-Road-Closure-Street-Name-Selector-ToStreet-FormGroup"}
                            label="To street"
                            helperText="Type the name of the second cross street"
                        >
                            <StreetnameSuggest
                                className={"SHST-Road-Closure-Street-Name-Selector-ToStreet-Suggest"}
                                noResults={<MenuItem disabled={true} text="No streets found." />}
                                items={this.props.streetnames}
                                itemRenderer={this.renderStreetname}
                                inputValueRenderer={this.streetnameInputValueRenderer}
                                onItemSelect={this.handleToStreetSelect}
                                onQueryChange={this.handleChangeToStreet}
                                query={this.state.toStreet}
                                inputProps={{
                                    // large: true,
                                    placeholder: "ending at this street...",
                                    // small: false,
                                }}
                            />
                        </FormGroup>
                    </div>
                </div>
                <Button 
                        fill={true}
                        text={"Add street selection"}
                        // onClick={this.handleToggleCollapsed}
                />
            </Card>
        );
    }
}

export default RoadClosureStreetNameSelector;

