import React from 'react'
import {
    Row,
    Col,
    Button, Form, FormGroup, Label, Input, FormText,
    Card,
    CardBody
} from 'reactstrap';
import { connect } from 'react-redux'
import { login } from '../../actions/auth'
import { Alert } from 'reactstrap';


class Login extends React.Component{

    state = {
        login: '',
        password: ''
    };

    onSubmit = (e) => {
        e.preventDefault();

        this.props.login({...this.state});
    };

    render() {
        const { error } = this.props;

        return (
            <div>
                <Row style={{marginTop: 56}}>
                    <Col md={{ size: 4, offset: 4 }}>
                        <Card>
                            <CardBody>
                                <Form onSubmit={this.onSubmit}>
                                    <h1 style={{textAlign: 'center'}}>Войти</h1>
                                    { error && <Alert color={"danger"}>{error}</Alert> }
                                    <FormGroup>
                                        <Input
                                            placeholder={"Логин"}
                                            value={this.state.login}
                                            onChange={e => this.setState({login: e.target.value})}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Input
                                            placeholder={"Пароль"}
                                            type="password"
                                            value={this.state.password}
                                            onChange={e => this.setState({password: e.target.value})}
                                        />
                                    </FormGroup>
                                    <Button type="submit" block>Войти</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = {login};

const enhance = connect((state) => ({
    error: state.auth.error
}), mapDispatchToProps);

export default enhance(Login);
