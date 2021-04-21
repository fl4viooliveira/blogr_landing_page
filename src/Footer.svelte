
<div class="container">
    <img src="./images/logo.svg" alt="logo" class="logo">
    <ul>
        <li>
            <a href="#0" class="product">
                <h3>Product</h3> 
                <li><a href="#0">Overview</a></li>
                <li><a href="#0">Pricing</a></li>
                <li><a href="#0">Marketplace</a></li>
                <li><a href="#0">Features</a></li>
                <li><a href="#0">Integrations</a></li>     
            </a>
        </li>
        <li>
            <a href="#0" class="company">
                <h3>Company</h3>                
                <li><a href="#0">About</a></li>
                <li><a href="#0">Team</a></li>
                <li><a href="#0">Blog</a></li>
                <li><a href="#0">Careers</a></li> 
            </a>
        </li>
        <li>
            <a href="#0" class="connect">
                <h3>Connect</h3> 
                <li><a href="#0">Contact</a></li>
                <li><a href="#0">Newsletter</a></li>
                <li><a href="#0">Linkedin</a> </li>                        
            </a>
        </li>
    </ul>
</div>

<style>

    * {
        margin: 0;
        padding: 0;
        font-family: 'Overpass' sans-serif;
    }
    @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@300;600&family=Ubuntu:wght@400;500;700&display=swap');

    .container{
        background: rgba(36, 36, 44, 1);
        border-top-right-radius: 90px;
        max-width: 1440px;
        height: auto;
        margin: auto;
        color: white;
        display: grid;
        grid-template-columns: .30fr 1fr;
        padding: 0 50px;
    }
    .logo{
        grid-column: 1/2;
        align-self: start;
        margin-top: 40px;
        justify-self: center;
    }

    ul{
        grid-column: 2/3;
        justify-self: stretch;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        list-style: none;
        margin: 50px 0;
        
    }
    li .product h3{
        grid-column: 1/2;
        color: white;
        margin-bottom: 25px;         
    }
    .product li {        
        margin-bottom: 10px;    
    }
    .product li a{
        color: white;
        font-size: 15px;
    }
    li .company h3{
        grid-column: 2/3;
        color: white;
        margin-bottom: 25px;
    }
    .company li {        
        margin-bottom: 10px;    
    }
    .company li a{
        color: white;
        font-size: 15px;
    }
    li .connect h3{
        grid-column: 3/4;
        color: white;
        margin-bottom: 25px;
    }
    .connect li {        
        margin-bottom: 10px;    
    }
    .connect li a{
        color: white;
        font-size: 15px;
    }
    

</style>