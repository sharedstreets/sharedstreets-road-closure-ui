import { Button, ButtonGroup } from '@blueprintjs/core';
import * as React from 'react';
import { IRoadClosureState } from 'src/store/road-closure';
import RoadClosureBottomActionBar from '../road-closure-bottom-action-bar';
import RoadClosureListItem from '../road-closure-list-item';
import './road-closure-list.css';

export interface IRoadClosureListProps {
    createRoadClosure: () => void,
    selectRoadClosure: (index: number) => void,
    viewRoadClosureOutput: () => void,
    roadClosure: IRoadClosureState,
  };


class RoadClosureList extends React.Component<IRoadClosureListProps, any> {
    public constructor(props: IRoadClosureListProps) {
        super(props);
        this.handleClickCreate = this.handleClickCreate.bind(this);
        this.handleClickViewOutput = this.handleClickViewOutput.bind(this);
    }

    public handleClickViewOutput() {
        this.props.viewRoadClosureOutput();
    }

    public handleClickCreate() {
        this.props.createRoadClosure();
    }

    public render() {
        return (
            <div
                className={"SHST-Road-Closure-List"}>
                {this.props.roadClosure.items.map((item, index) => {
                        return <RoadClosureListItem
                            selectRoadClosure={this.props.selectRoadClosure}
                            item={item}
                            key={index} />
                    })
                }
                <RoadClosureBottomActionBar>
                    <ButtonGroup
                        fill={true}>
                        <Button
                            large={true}
                            text={"View output"}
                            onClick={this.handleClickViewOutput}/>
                        <Button
                            intent="success"
                            large={true}
                            text={"Create new road closure"}
                            onClick={this.handleClickCreate}
                        />
                    </ButtonGroup>
                </RoadClosureBottomActionBar>
            </div>
        );
    }
}

export default RoadClosureList;
