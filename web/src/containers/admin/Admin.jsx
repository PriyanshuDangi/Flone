import React from "react";
import { createEmptyCollection, mintNFT, getNFTs, unauthenticate, setIPFS } from "../../utils/wallet";
import styleClasses from "./style.module.css";

const Admin = () => {

    const updateIPFS = (event) => {
        event.preventDefault();
        const token_id = event.target.token_id
        const hash = event.target.hash
        setIPFS(token_id, hash);
    }

    const mintHandler = (event) => {
        event.preventDefault();
        const hash = event.target.hash.value
        console.log(hash);
        mintNFT(hash);
    }

    return (
        <div className={["container", styleClasses.container].join(' ')}>
            <h1>Admin</h1>
            <div>
                <button onClick={() => getNFTs()}>Get NFTs</button>
            </div>
            <div>
                <form onSubmit={updateIPFS}>
                    <div>
                        <label htmlFor="token_id">Token ID</label>
                        <input type="number" name="token_id" required />
                    </div>
                    <div>
                        <label htmlFor="hash">IPFS Hash</label>
                        <input type="text" name="hash" required />
                    </div>
                    <button type="submit">Set Hash</button>
                </form>
            </div>
            <div>
                <button onClick={createEmptyCollection}>Create Empty Collection</button>
            </div>
            <div>
                <form onSubmit={mintHandler}>
                    <div>
                        <label htmlFor="hash">IPFS Hash</label>
                        <input type="text" name="hash" required />
                    </div>
                    <button type="submit">Mint NFT</button>
                </form>
            </div>
        </div>
    );
}

export default Admin;