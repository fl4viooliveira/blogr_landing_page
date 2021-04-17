
<div class="container">    
    
    <nav>
        <h1 class="logo">Blogr</h1>                
        <ul>
            <li>Product</li>
            <li>Company</li>
            <li>Connect</li>
        </ul>
        <div class="btn-nav">
            <button>Login</button>
            <button>Sign Up</button>
        </div>
    </nav>
    <main>
        <h1>
            A modern publishing platform
        </h1>
        <p>Grow your audience and build your online brand</p>
    </main>
    <div class="btn-botton">
        <button class="btn">Start for Free</button>
        <button class="btn">Learn More</button>
    </div>
</div>

<style>

    @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@300;600&family=Ubuntu:wght@400;500;700&display=swap');

    .container {        
        max-width: 1440px;           
        background: linear-gradient(90.31deg, rgba(254, 134, 110, 0.77) 34.65%, #FF555E 99.72%);    
        margin-left: auto;
        margin-right: auto;
        border-bottom-left-radius: 50px;
    }    
    nav{
        display: flex;                       
        color: white;        
        align-items: center;
        justify-content: flex-start;
    }
    .logo{                
        font-size: 25px;
        font-family: 'Overpass', sans-serif;        
        order: 1; 
        margin-left: 8vw;
    }
    ul{
        justify-self: flex-start;
        order: 2;
        width: 40%;
        
    }
    li{        
        display: inline;
        font-size: 12px;
        float: left;           
    }
    .btn-nav{
        display: inline;
        order: 3; 
        margin-right: 1em;   
    }
    .btn-nav button{
        color: white;
        background: none;
        border: 0;
        width: 90px;
        border-radius: 50px;
    }
    .btn-nav button:hover{
        background: white;
        color: #FF555E;
    }
    main{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    h1{        
        color: white;        
    }
    p{
        color: white;
        text-align: center;
        
    }
    .btn-botton{

        
    }



</style>