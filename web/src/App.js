import React, { useEffect } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from './store/reducers/walletSlice';
import { authenticate, runTransaction, sayHello, unauthenticate } from './utils/wallet';

function App() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const callback = (user) => {
        console.log(user);
        dispatch(setUser(user));
    };
    // const [user, setUser] = useState({ loggedIn: null });
    useEffect(() => fcl.currentUser.subscribe(callback), []); // sets the callback for FCL to use
    return (
        <>
            {user.loggedIn ? (
                <>
                    <div>Welcome ${user.addr}</div>
                    <div>
                        <button onClick={sayHello}>Say Hello</button>
                    </div>
                    <div>
                        <button onClick={runTransaction}>Run Transaction</button>
                    </div>
                    <div>
                        <button onClick={unauthenticate}>LogOut</button>
                    </div>
                </>
            ) : (
                <button onClick={authenticate}>LogIn</button>
            )}
        </>
    );
}

export default App;
