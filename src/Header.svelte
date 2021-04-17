
<div class="container">    
    <nav>
        <a href="#0" class="logo">
            <img src="../images/logo.svg" alt="logo">
        </a>               
        <ul>
            <li>
                <a href="#0">Product<img src="../images/icon-arrow-light.svg" alt="arrow"></a>
            </li>
            <li>
                <a href="#0">Company<img src="../images/icon-arrow-light.svg" alt="arrow"></a>
            </li>
            <li>
                <a href="#0">Connect<img src="../images/icon-arrow-light.svg" alt="arrow"></a>
            </li>
        </ul>
        <div class="btn-nav">
            <button><a href="#0">Login</a></button>
            <button><a href="#0">Sign Up</a></button>
        </div>
    </nav>
    <main>
        <h1>
            A modern publishing platform
        </h1>
        <p>Grow your audience and build your online brand</p>
    </main>
    <div class="btn-botton">
        <button><a href="#0">Start for Free</a></button>
        <button><a href="#0">Learn More</a></button>
    </div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@300;600&family=Ubuntu:wght@400;500;700&display=swap');

    .container {        
        max-width: 1440px;           
        background: linear-gradient(90.31deg, rgba(254, 134, 110, 0.77) 34.65%, #FF555E 99.72%);
        margin: auto;
        border-bottom-left-radius: 90px ;
    } 
    nav{
        display: grid;
        grid-template-columns: .5fr 2fr .5fr;
        /* display: flex;
        justify-content: space-between; */
        align-items: center;
        padding:40px 60px;        
    }
    .logo{
        order: 1;
        grid-column: 1/2;
        justify-self: center;

    }
    ul{
        display: flex;
        order: 1;
        justify-self: start;
        grid-column: 2/3;
        
        
    }
    ul li{
        list-style: none;
        margin-left: 5px;
    }
    ul li a{
        font-family: 'Overpass', sans-serif;
        color: white;
        margin-right: 5px;
        font-size: 12px;
        padding-left: 20px;
        
    }
    .btn-nav{
        order: 2;
        display: flex;
        grid-column: 3/4;
        justify-self: start;
    }
    .btn-nav button{
        background: none;
        width: 100px;
        height: 35px;
        border-radius: 50px;
        border: none;
    }
    .btn-nav button:hover{
        background: white;        
    }
    .btn-nav button a{
        color: white;
        font-family: 'Overpass', sans-serif;
        font-size: 12px;
        font-weight: 600;
        text-decoration: none;
    }
    .btn-nav button a:hover{
        font-size: 13px;
        color: orange;
        display:block
    }
    main{
        padding: 1em;
        color: white;
    }
    main h1{
        display: flex;        
        justify-content: center;
        padding-bottom: 20px;
        font-size: 50px;
        font-weight: 500;
        
    }
    main p{
        display: flex;        
        justify-content: center;
        font-size: 20px;
        font-weight: 300;
        padding-bottom: 20px;
    }
    .btn-botton{
        display: flex;        
        justify-content: center;
        padding-bottom: 80px;       
    }
    .btn-botton button{
        background: none;
        width: 130px;
        height: 40px;
        border-radius: 50px;
        border: 1px solid white;
        margin: 10px;        
    }
    .btn-botton button a{
        color: white;
        font-family: 'Overpass', sans-serif;
        font-size: 12px;
        font-weight: 600;
        text-decoration: none;
    }




</style>