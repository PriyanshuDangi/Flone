import React, { Suspense, useEffect } from 'react';
import './App.css';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as fcl from '@onflow/fcl';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from './store/reducers/walletSlice';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import World from './containers/world/World';
import Home from './containers/home/Home';
import { setCubesNFTAsync } from './store/reducers/cubesNFTSlice';
import Admin from './containers/admin/Admin';
import WorldHome from './containers/world/home/WorldHome';

function App() {
    const dispatch = useDispatch();

    const callback = (user) => {
        console.log(user);
        dispatch(setUser(user));
    };

    // const [user, setUser] = useState({ loggedIn: null });
    useEffect(() => fcl.currentUser.subscribe(callback), []); // sets the callback for FCL to use

    useEffect(() => {
        const func = async () => {
            try {
                dispatch(setCubesNFTAsync());
            } catch (err) {
                console.log(err)
            }
        }
        func();

        console.log("woah");
    }, [])

    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route exact element={<WorldHome />} path={'/world'} />
                    <Route exact element={<Admin />} path={'/admin'} />
                    <Route exact element={<Home />} path={'/'} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
