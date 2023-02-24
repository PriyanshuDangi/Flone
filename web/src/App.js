import React, { Suspense, useEffect } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from './store/reducers/walletSlice';
import { authenticate, createEmptyCollection, mintNFT, getNFTs, unauthenticate } from './utils/wallet';

import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom';


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
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route exact element={<World />} path={'/world'} />
                    <Route exact element={<Home />} path={'/'} />
                </Routes>
            </Suspense>
        </Router>

    )
    // return (
    //     <>
    //         {user.loggedIn ? (
    //             <>
    //                 <div>Welcome ${user.addr}</div>
    //                 <div>
    //                     <button onClick={() => getNFTs(user.addr)}>Get NFTs</button>
    //                 </div>
    //                 <div>
    //                     <button onClick={createEmptyCollection}>Create Empty Collection</button>
    //                 </div>
    //                 <div>
    //                     <button onClick={mintNFT}>Mint NFT</button>
    //                 </div>
    //                 <div>
    //                     <button onClick={unauthenticate}>LogOut</button>
    //                 </div>
    //             </>
    //         ) : (
    //             <button onClick={authenticate}>LogIn</button>
    //         )}
    //     </>
    // );
}

export default App;
