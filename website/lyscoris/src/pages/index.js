import React from "react";
import '../pages css/index.css';


const Home = () => {
    return (
        <div>
            <h1>Lycoris landing banner</h1>
                <img id='small-image' src='https://cdn.britannica.com/22/215522-050-8315BB78/green-grass-close-up.jpg' alt=''/>
                <p>Welcome to Lycoris!</p>
                <button>Go to messages</button>


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