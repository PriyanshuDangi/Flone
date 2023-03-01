import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from '../../store/reducers/walletSlice';
import { Button } from 'react-bootstrap';
import tezosLogo from '../../assets/images/flow-logo.png';
import { authenticate, unauthenticate } from '../../utils/wallet';

const short = (pkh) => {
    if (pkh) return pkh.substring(0, 6) + '...' + pkh.substring(pkh.length - 4);
};

const WalletButton = (props) => {
    const user = useSelector(selectUser);
    const walletConnected = user.addr !== null;

    const clicked = () => {
        console.log(walletConnected);
        if (!walletConnected) {
            authenticate();
        } else {
            unauthenticate();
        }
    };

    return (
        <>
            {props.variant === 'dark' ? (
                <Button variant="outline-light" onClick={clicked}>
                    <img src={tezosLogo} alt="tezos logo" style={{ width: '20px', height: '20px' }} />{' '}
                    {walletConnected ? short(user.addr) : 'Connect Wallet'}
                </Button>
            ) : (
                <Button variant="outline-dark" onClick={clicked}>
                    <img src={tezosLogo} alt="tezos logo" style={{ width: '20px', height: '20px' }} />{' '}
                    {walletConnected ? short(user.addr) : 'Connect Wallet'}
                </Button>
            )}
        </>
    );
};

export default WalletButton;
