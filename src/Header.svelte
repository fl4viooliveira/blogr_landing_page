
<div class="container">    
    <nav>
        <a href="#0" class="logo">
            <img src="../images/logo.svg" alt="logo">
        </a>               
        <ul>
            <li>
                <a href="#0" class="product">Product<img src="../images/icon-arrow-light.svg" alt="arrow">
                    <div class="dropdown-product">
                        <a href="#0">Product 1</a>
                        <a href="#0">Product 2</a>
                        <a href="#0">Product 3</a>
                    </div>
                </a>
            </li>
            <li>
                <a href="#0" class="company">Company<img src="../images/icon-arrow-light.svg" alt="arrow">
                    <div class="dropdown-company">
                        <a href="#0">Company 1</a>
                        <a href="#0">Company 2</a>
                        <a href="#0">Company 3</a>
                    </div>
                </a>
            </li>
            <li>
                <a href="#0" class="connect">Connect<img src="../images/icon-arrow-light.svg" alt="arrow">
                    <div class="dropdown-connect">
                        <a href="#0">Contact</a>
                        <a href="#0">Newsletter</a>
                        <a href="#0">Linkedin</a>
                    </div>                    
                </a>
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
        position: relative; 
        display: inline-block;              
    }
    /* Dropdown Product*/
    ul li a .dropdown-product{
        display: none;
        position: absolute;
        background: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        border-radius: 15px;
    }
    ul li a .dropdown-product a{
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }
    .product:hover .dropdown-product{
        display: block;
    }
    .dropdown-product a:hover{
        font-weight: bold;
    }
        /* Dropdown Company*/
        ul li a .dropdown-company{
        display: none;
        position: absolute;
        background: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        border-radius: 15px;
    }
    ul li a .dropdown-company a{
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }
    .company:hover .dropdown-company{
        display: block;
    }
    .dropdown-company a:hover{
        font-weight: bold;
    }
        /* Dropdown Connect*/
        ul li a .dropdown-connect{
        display: none;
        position: absolute;
        background: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        border-radius: 15px;
    }
    ul li a .dropdown-connect a{
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }
    .connect:hover .dropdown-connect{
        display: block;
    }
    .dropdown-connect a:hover{
        font-weight: bold;
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
        display: block;
        padding: 10px;
        
    }
    .btn-nav button a:hover{
        font-size: 13px;
        color: rgb(247, 117, 10);
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