import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import classnames from 'classnames';

class Login extends PureComponent {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            errors: {},
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.isAuthenticated) {
            this.props.history.push('/');
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
            });
        }
    }

    componentDidMount = () => {
        if(this.props.isAuthenticated) {
            this.props.history.push('/');
        }
    }


    render = () => {
        const {errors} = this.state;
        return(
            <div className="container" style={{ marginTop: '50px', width: '700px'}}>
                <h2 style={{marginBottom: '40px'}}>Login</h2>
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <input
                            type="username"
                            placeholder="Username"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.username,
                            })}
                            name="username"
                            onChange={ this.handleInputChange }
                            value={ this.state.username }
                        />
                        {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.password,
                            })}
                            name="password"
                            onChange={ this.handleInputChange }
                            value={ this.state.password }
                        />
                        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Login User
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

Login.propTypes = {
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    errors: state.errors,
    isAuthenticated: state.auth.isAuthenticated,
})

export  default connect(mapStateToProps, { loginUser })(Login);
