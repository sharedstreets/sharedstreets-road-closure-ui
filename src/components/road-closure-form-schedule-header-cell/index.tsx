import * as React from 'react';

// interface IRoadClosureFormScheduleHeaderCellProps {
//   date: any,
//   dayFormat: string,
// };


class RoadClosureFormScheduleHeaderCell extends React.Component<any, any> {
  public render() {
    const {
      date,
    //   dayFormat,
    } = this.props;
    return (<span className="title">{date.format("ddd DD")}</span>);
  }
}

export default RoadClosureFormScheduleHeaderCell;