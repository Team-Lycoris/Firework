import React from "react";
import '../pages css/index.css';
import {Link} from 'react-router-dom';


const Home = () => {
    return (
        <div>
            <h1>Lycoris landing banner</h1>
                <img id='small-image' src='https://cdn.britannica.com/22/215522-050-8315BB78/green-grass-close-up.jpg' alt=''/>
                <p>Welcome to Lycoris!</p>
                <Link to="/login">
                    <button>Go to login</button>
                </Link>
                <Link to="/messages">
                    <button>Go to messages</button>
                </Link>

            <div>
            <span class="bold" id="text">Lycoris</span>
            <p>Maps , I'm the map, I'm the map</p>
            <form action="">
                <input type="text"/>
            </form>
            </div>
        </div>
    );
};
 
export default Home;