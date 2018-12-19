import { Card } from '@blueprintjs/core';
import * as React from 'react';
import { RoadClosureStateItem } from 'src/models/RoadClosureStateItem';

export interface IRoadClosureListItemProps {
    selectRoadClosure: (index: number) => void,
    item: RoadClosureStateItem,
    key: number,
  };


class RoadClosureListItem extends React.Component<IRoadClosureListItemProps, any> {
    public constructor(props: IRoadClosureListItemProps) {
        super(props);
        this.handleClickCard = this.handleClickCard.bind(this);
    }

    public handleClickCard() {
        this.props.selectRoadClosure(this.props.key);
    }

    public render() {
        return (
            <Card
                className={"SHST-Road-Closure-List-Item"}
                interactive={true}
                onClick={this.handleClickCard}
            >
                <div>{this.props.item.selectedPoints.length} selections made</div>
                <div>{this.props.item.matchedStreets.length} matched streets found</div>
            </Card>
        );
    }
}

export default RoadClosureListItem;
