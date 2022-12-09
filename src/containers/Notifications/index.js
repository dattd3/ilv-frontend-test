import React from 'react';
import ListNotifications from './ListNotifications/ListNotifications';
import HOCComponent from '../../components/Common/HOCComponent'

class NotificationsComponent extends React.Component {
  render() {
    return (
      <ListNotifications />
    )
  }
}

export default HOCComponent(NotificationsComponent)
