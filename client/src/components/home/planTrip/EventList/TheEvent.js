import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import './events.css';
import Notification, { notify } from 'react-notify-toast';


const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: ${props=> (props.isDragging ? 'lightgreen' : 'white')};
  width: ${props=> (props.isDragging ? '40%' : 'auto')};
  transition: max-width 0.2 ease;
  font-size: 18px;
`;

// transform: ${props=> (props.isDragging ? 'rotate(20deg)' : 'none')};

@inject(allStores => ({
  deleteEvent: allStores.store.deleteEvent,
  addTempEvent: allStores.store.addTempEvent,
  tempEventArray: allStores.store.tempEventArray,
  eventsArray: allStores.store.eventsArray
}))

@observer
class TheEvent extends Component {

  constructor() {
    super();
    this.state = { toggledCollapse: false };
  }

  collapseToggle = () => {
    this.setState(prevState => ({
      toggledCollapse: !prevState.toggledCollapse
    }));
  };

  handleAddEvent = () => {
    let exist = false;
    let events = this.props.eventsArray;
    for (var i = 0; i < events.length && !exist; i++) {
      if (events[i].id === this.props.tempEvent.id) {
        let myColor = { background: '#e22866', text: '#FFFFFF' };
        notify.show('You Already Choose This Event', 'custom', 5000, myColor);
        // alert('You already have this activity place');
        exist = true;
        return;
      }
    }

    this.props.addTempEvent(this.props.tempEvent);
  }

  regularOrTempEvent = (toggleCollapse) => {

    if (this.props.verifier==='eventOfEvents'){
      console.log('this.props.eventItem.iternalId', this.props.eventItem.iternalId);
      return (
        <Draggable draggableId={this.props.eventItem.iternalId} index={this.props.eventIndex}>
          {(provided, snapshot) => (

            <Container
              innerRef={provided.innerRef}
              isDragging={snapshot.isDragging}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="single-event-header-section">

                <button className="btn btn-secondary btn-sm" onClick={() => this.props.deleteEvent(this.props.eventIndex, this.props.dayVerifier, this.props.dayIndex)}>x</button>

                <h6 className="event-headline">{this.props.eventName}</h6>

                <div className="place-arrow" onClick={() => this.collapseToggle(toggleCollapse)}>&raquo;</div>
              </div>

              <Collapse isOpened={this.state.toggledCollapse}>
                <ul className="content-of-event">
                  {Object.keys(this.props.eventItem).map((prop, index) => {
                    if (prop !== 'type' && prop !== 'name' && prop !== 'id' && prop !== 'position' && prop !== 'iternalId') {
                      return <li key={index}><u>{prop}</u>: {this.props.eventItem[prop]}</li>;
                    }
                    return null;
                  })}
                </ul>
              </Collapse>

            </Container>
          )}
        </Draggable>
      );

    } else if (this.props.verifier === 'eventOfTempEvent') {
      return (
        <div className="events-list-container">
          <Notification options={{ zIndex: 400, top: '250px' }} />

          <div className="single-event-header-section">
            <h6 className="event-headline">{this.props.tempEventName}</h6>
            <div className="place-arrow" onClick={() => this.collapseToggle(toggleCollapse)}>&raquo;</div>
          </div>

          <Collapse isOpened={this.state.toggledCollapse}>
            <ul className="content-of-event">
              {Object.keys(this.props.tempEvent).map((prop, index) => {
                if (prop !== 'type' && prop !== 'name' && prop !== 'id' && prop !== 'position' && prop !== 'iternalId') {
                  return <li key={index}><u>{prop}</u>: {this.props.tempEvent[prop]}</li>;
                }
                return null;
              })}
            </ul>
          </Collapse>
          {/* <button className="btn btn-primary btn-sm" onClick={()=>this.props.addTempEvent(this.props.tempEvent)}>Add</button> */}
          <button className="btn btn-outline-secondary btn-sm ml-3" onClick={this.handleAddEvent}>Add</button>
        </div>
      );

    }

  }
  render() {
    const toggleCollapse = false;

    return this.regularOrTempEvent(toggleCollapse);

  }
}

export default TheEvent;