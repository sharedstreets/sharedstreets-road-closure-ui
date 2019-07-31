import * as React from 'react'; 

class RoadClosureFormScheduleEvent extends React.Component<any, any> {
  public render() {
    const {
      end,
      start,
      value,
    } = this.props;
    
    return <div className="event" style={{
      backgroundColor: '#48AFF0',
      fontSize: '12px',
    }}>
      <span>{`${start.format('HH:mm')} - ${end.format('HH:mm')}`}</span>
      <br /><br />
      {value}
    </div>
  }
}

export default RoadClosureFormScheduleEvent;