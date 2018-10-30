import React from 'react'
import { Badge } from 'reactstrap';


const Status = ({status}) => {
  switch (status) {
    case 'review':
      return <Badge>Ожидание</Badge>;
    case 'approve':
      return <Badge color={"success"}>Одобрено</Badge>;
    case 'reject':
      return <Badge color={"danger"}>Отклонено</Badge>;
    default:
      return <Badge color={"warning"}>НЕИЗВЕСТНО</Badge>;
  }
}

export default Status
