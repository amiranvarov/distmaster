import * as React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom'


const Menu = () => (
    <ListGroup>
        <ListGroupItem>
            <Link to={"/orders"}>Заказы</Link>
        </ListGroupItem>
        <ListGroupItem>
            <Link to={"/products"}>Товары</Link>
        </ListGroupItem>
        <ListGroupItem>
            <Link to={"/clients"}>Клиенты</Link>
        </ListGroupItem>
    </ListGroup>
);

export default Menu;
