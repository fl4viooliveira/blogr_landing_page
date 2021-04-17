
<div class="container">    
    <nav>
        <h1 class="logo">Blogr</h1>        
        <ul>
            <li>Product</li>
            <li>Company</li>
            <li>Connect</li>
        </ul>
        <button class="btn-nav">Login</button>
        <button class="btn-nav">Sign Up</button>
    </nav>
    <h1>
        A modern publishing platform
    </h1>
    <p>Grow your audience and build your online brand</p>
    <button class="btn">Start for Free</button>
    <button class="btn">Learn More</button>
</div>

<style>

    @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@300;600&family=Ubuntu:wght@400;500;700&display=swap');

    .container {
        position: relative;
        max-width: 1440px;    
        width: 100%;
        height: 400px;    
        background: linear-gradient(90.31deg, rgba(254, 134, 110, 0.77) 34.65%, #FF555E 99.72%);    
        margin-left: auto;
        margin-right: auto;
        border-bottom-left-radius: 50px;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;     
    }
    .container nav{ 
        position: relative;
        color: white;
        grid-row: 1/2;
        width: 90vw;
        display: flex;
        justify-self: center;
        margin-left: auto;
        margin-right: auto;
    }
    .logo{
        position: absolute;
        font-size: 23px;
        font-family: 'Overpass', sans-serif;
        justify-content: flex-start;
        align-self: center; 
        margin-top: auto;
        margin-bottom: auto;                
    }
    ul{
        position: relative;
        display: inline-block;
        text-align: center;
        margin-left: 40px;
        margin-right: 40px;
        align-self: center; 
    }
    li{
        position: relative;
        display: inline-block;
        justify-content: center;
        margin-left: 40px;
    }

    
    .btn-nav{
        position: relative;
        margin-left: 40px;
        display: inline-block;
        align-self: center;
        justify-self: end;
    }
    h1{
        position: absolute;
        grid-row: 2/3;
        align-self: start;
        justify-self: center;
        color: white;
        margin-top: 0;
    }
    p{
        position:absolute;
        grid-row: 2/3;
        justify-self: center;
        align-self: center;
        color: white;
    }
    .btn{
        position: relative;
        grid-row: 3/4;
        display: inline;
        width: 150px;
        height: 60px;
        justify-self: center;
    }



</style>