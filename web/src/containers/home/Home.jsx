import ExplodingObject from '../../components/explodingObject/ExplodingObject';
import NavBar from '../../components/navbar/Navbar';

const Home = () => {
    return (
        <div>
            <NavBar background="transparent" scroll={true} />
            {/* <video playinline="true" autoPlay muted loop id="bgvid">
                <source src="/Black.mp4" type="video/mp4" />
            </video>

            <div>
                <h1>FLONE</h1>
            </div> */}
            <ExplodingObject />
        </div>
    );
};

export default Home;
