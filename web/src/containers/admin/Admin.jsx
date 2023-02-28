import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { createEmptyCollection, mintNFT, getNFTs, unauthenticate, setIPFS } from "../../utils/wallet";
import styleClasses from "./style.module.css";

const Admin = () => {

    const updateIPFS = (event) => {
        event.preventDefault();
        const token_id = event.target.token_id.value
        const hash = event.target.hash.value
        setIPFS(parseInt(token_id), hash);
    }

    const mintHandler = (event) => {
        event.preventDefault();
        const hash = event.target.hash.value
        console.log(hash);
        mintNFT(hash);
    }

    return (
        <div>
            <Navbar />
            <div className={["container", styleClasses.container].join(' ')}>
                {/* <h1>Admin</h1> */}
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
                        <p>You can only update for the land you own</p>
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
                        <p>Only Admin will be able to mint the NFT</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Admin;