import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { IRoadClosureState } from 'src/store/road-closure';
import RoadClosureListItem from '../road-closure-list-item';
import './road-closure-list.css';

export interface IRoadClosureListProps {
    createRoadClosure: () => void,
    selectRoadClosure: (index: number) => void,
    roadClosure: IRoadClosureState,
  };


class RoadClosureList extends React.Component<IRoadClosureListProps, any> {
    public constructor(props: IRoadClosureListProps) {
        super(props);
        this.handleClickCreate = this.handleClickCreate.bind(this);
    }

    public handleClickCreate() {
        this.props.createRoadClosure();
    }

    public render() {
        const classname = this.props.roadClosure.isShowingRoadClosureList
            ? "SHST-Road-Closure-List" : "SHST-Road-Closure-List-hidden";
        return (
            <div
                className={classname}>
                {this.props.roadClosure.items.map((item, index) => {
                        return <RoadClosureListItem
                            selectRoadClosure={this.props.selectRoadClosure}
                            item={item}
                            key={index} />
                    })
                }
                <Button
                    intent="success"
                    large={true}
                    text={"Create new road closure"}
                    onClick={this.handleClickCreate}
                />
            </div>
        );
    }
}

export default RoadClosureList;
