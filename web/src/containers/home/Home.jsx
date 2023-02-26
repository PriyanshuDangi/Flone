
import styleClasses from "./styles.module.css";

const Home = () => {
    return (
        <div>
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
