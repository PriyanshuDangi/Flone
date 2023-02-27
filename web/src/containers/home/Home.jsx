import Navbar from "../../components/navbar/Navbar";

const Home = () => {
    return (
        <div>
            <Navbar />
            <video playinline="true" autoPlay muted loop id="bgvid">
                <source src="/Black.mp4" type="video/mp4" />
            </video>

            <div>
                <h1>FLONE</h1>
            </div>
        </div>
    );
};

export default Home;
