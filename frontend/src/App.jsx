import React from "react";
import { Provider, connect } from "react-redux";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    withRouter,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import "./App.scss";
import "./themify/themify-icons.css";
import Login from "./components/Login/Login";
import store from "./store";
import {
    logoutUser as logoutUserAction,
    setCurrentUser,
} from "./actions/authentication";
import "semantic-ui-css/semantic.min.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Users } from "./components/Users/Users";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Terms } from "./components/Terms/Terms";
import { ToastProvider } from "react-toast-notifications";
import { Products } from "./components/Products/Products";

const apolloClient = new ApolloClient({
    uri: "http://localhost:3001/api",
});

const App = () => {
    return (
        <ApolloProvider client={apolloClient}>
            <Provider store={store}>
                <Router>
                    <ToastProvider autoDismissTimeout={3000}>
                        <AppInnerWithRouter />
                    </ToastProvider>
                </Router>
            </Provider>
        </ApolloProvider>
    );
};

const AppInner = props => {
    React.useEffect(() => {
        if (localStorage.jwtToken) {
            setAuthToken(localStorage.jwtToken);
            const decoded = jwt_decode(localStorage.jwtToken);
            store.dispatch(setCurrentUser(decoded));

            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                store.dispatch(logoutUserAction(props.history));
                window.location.href = "/login";
            }
        }
    }, [props.history]);

    return (
        <div>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route path="/" component={ContainerConnected} />
            </Switch>
        </div>
    );
};

const AppInnerWithRouter = withRouter(AppInner);

const Container = ({ auth, location, history, logoutUser }) => {
    React.useEffect(() => {
        if (!auth.isAuthenticated && !localStorage.jwtToken) {
            history.push("/login");
        }
    }, [auth.isAuthenticated, history]);

    const renderLogout = React.useCallback(
        props => <Logout {...props} logoutUser={logoutUser} />,
        [logoutUser],
    );

    if (!auth.isAuthenticated) {
        return null;
    }

    return (
        <div>
            <Sidebar pathname={location.pathname} />
            <div className="page-container">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/orders" component={Orders} />
                    <Route path="/users" component={Users} />
                    <Route path="/terms" component={Terms} />
                    <Route path="/products" component={Products} />
                    <Route path="/logout" render={renderLogout} />
                </Switch>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
});

const ContainerConnected = connect(
    mapStateToProps,
    { logoutUser: logoutUserAction },
)(Container);

const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
);

const Orders = () => (
    <div>
        <h2>Orders</h2>
    </div>
);

const Logout = props => {
    props.logoutUser(props.history);
    return <div></div>;
};

export default App;
