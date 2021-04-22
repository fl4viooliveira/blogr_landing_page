

<div class="container">
    <h1 class="head-line">Designed for the future</h1>
    <div class="content-1">
        <h2>Introducing an extensible editor</h2>
        <p>
            Blogr features an exceedingly intuitive interface which lets you focus on one thing: creating content. The editor supports management of mutiple blogs and allows easy manipulation of embeds such as images, videos, and Markdown. Extensibility with plugins and themes provide easy ways to add functionality or change the looks of a blog.
        </p>
    </div>
    <div class="content-2">
        <h2>Robust content management</h2>
        <p>
            Flexible content management enables users to easily move through posts. Increase the usability of your blog by adding customized categories, sections, format, or flow. With this functionslity, you're in full control.
        </p>
    </div>
    <img class="img-editor" src="./images/illustration-editor-desktop.svg" alt="editor">
    <img class="img-editor-mb" src="./images/illustration-editor-mobile.svg" alt="editor">    
    <div class="infrastructure"></div>
    <div class="img-phones">
        <img src="./images/illustration-phones.svg" alt="phones">        
    </div>
    <img src="./images/illustration-phones.svg" alt="phones" class="phones-mobile">
    <div class="content-3" id="content-3">
        <h1>State of the Art Infrastructure</h1>
        <p>
            With reliability and speed in mind, wordwide data centers provide the backbone for ultra-fast connectivity. This ensures your site will load instantly, no matter where your  readers are, keeping your site competitive.
        </p>
    </div> 
    <img class="img-laptop" src="./images/illustration-laptop-desktop.svg" alt="laptop">
    <img class="img-laptop-mobile" src="./images/illustration-laptop-mobile.svg" alt="laptop">
    <div class="content-4">
        <h2>
            Free, open, simple
        </h2>
        <p>
            Blogr is a free and open source application backed by a large community of helpful developers. It supports features such as code syntax highlightind, RSS feeds, social media integration, third-party commenting tools, and works seamlessly with Google Analytics. The architecture is clean and is relatively easy to learn.
        </p>        
    </div>
    <div class="content-5">
        <h2>Powerful tooling</h2>
        <p>
            Batteries included. We built a simple and straightforward CLI tool that makes customization and deployment a breeze, but capable of producing even the most complicated sites.
        </p>
    </div>
</div>

<style>

    * {
        margin: 0;
        padding: 0;
        font-family: 'Overpass' sans-serif;
    }

    @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@300;600&family=Ubuntu:wght@400;500;700&display=swap');

    .container{
        max-width: 1440px;
        margin: auto;
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 0.2fr 0.50fr 0.50fr .50fr 0.50fr 0.50fr;
    }
    .head-line{
        justify-self: center;
        text-align: center;
        align-self: center;
        grid-column: 1/3;
        grid-row: 1/2;
        font-weight: 500;
        font-size: 33px;
        color: rgba(21, 51, 77, 1);
        width: 100%;
    }
    .content-1{
        grid-column: 1/2;
        grid-row: 2/3;
        width: 100%;
        align-self: end;
        justify-self: center;
    }
    .content-1 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;
        color: rgba(21, 51, 77, 1);
        width: 80%;
        padding-left: 10%;
        padding-right: 10%;

    }
    .content-1 p{
        line-height: 1.8;
        margin-bottom: 50px;
        width: 80%;
        padding-left: 10%;
        padding-right: 10%;
    }
    .content-2{
        position: relative;
        grid-column: 1/2;
        grid-row: 3/4;
        width: 100%;
        align-self: start;
        justify-self: center;
        z-index: 3;
    }
    .content-2 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;
        color: rgba(21, 51, 77, 1);
        width: 80%;
        padding-left: 10%;
        padding-right: 10%;
    }
    .content-2 p{
        line-height: 1.8;
        margin-bottom: 50px;
        width: 80%;
        padding-left: 10%;
        padding-right: 10%;
    }
    
    .img-editor{
        grid-column: 2/3;
        grid-row: 1/4;
        margin-top: 80px;
        margin-left: 8%;
        width: 125%; 
        align-items: center;  
    }

    .infrastructure{
        position: relative;
        grid-column: 1/3;
        grid-row: 4/5;
        background: url(../images/bg-pattern-circles.svg) no-repeat, linear-gradient(70.28deg, #2E2F41 11.18%, #3D4063 84.37%);
        background-position-x: -50%, 0;
        background-position-y: 80%, 0;
        background-size: 70%, 100%;
        height: 400px;
        align-self: center;
        border-bottom-left-radius: 90px;
        border-top-right-radius: 90px;               
    }
    .img-phones{
        position: relative; 
        grid-column: 1/2;
        grid-row: 4/5;
        justify-self: center;
        align-self: center; 
        width: 100%; 
        z-index: 3;     
    }
    .img-phones img{
        width: 80%;
        margin-top: 5%;
        margin-left: 20%;
    }
    .content-3{
        position: relative;
        grid-column: 2/3;
        grid-row: 4/5;        
        color: white;
        width: 100%;         
        justify-self: center;
        align-self: center; 
        z-index: 3;      
    }
    .content-3 h1{
        font-size: 32px;
        font-weight: 500;
        margin: 30px 0;
        width: 80%;
        padding-right: 10%;
    }
    .content-3 p{
        line-height: 1.8;
        margin-bottom: 50px;
        width: 80%;
        padding-right: 10%;
    }
    .img-laptop{
        grid-column: 1/2;
        grid-row: 5/7;
        justify-self: end;
        width: 140%;
    }
    .img-laptop-mobile{
        display: none;
    }
    .content-4{
        grid-column: 2/3;
        grid-row: 5/6;
        align-self: end;
        width: 100%;
        align-self: end;
        justify-self: center;
    }
    .content-4 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;
        color: rgba(21, 51, 77, 1);
        width: 80%;
        padding-right: 10%;
    }
    .content-4 p{
        line-height: 1.8;
        width: 80%;
        padding-right: 10%;
    }
    .content-5{
        grid-column: 2/3;
        grid-row: 6/7;
        align-self: start;
        width: 100%;
        align-self: start;
        justify-self: center;
        margin-top: 5%;
    }
    .content-5 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;
        color: rgba(21, 51, 77, 1);
        width: 80%;
        padding-right: 10%;

    }
    .content-5 p{
        line-height: 1.8;
        margin-bottom: 50px;
        width: 80%;
        padding-right: 10%;
    }
    .img-editor-mb{
        display: none;
    }
    @media screen and (max-width: 700px){
        .container{
        max-width: 100%;
        display: flex;
        flex-direction: column;
        }
        .head-line{
            margin-top: 30px;
            order: 1;
            margin-bottom: 40px;
            word-wrap: break-word;  
            width: 90%;
            margin-left: auto;
            margin-right: auto;
        }
        .img-editor{
            display: none;
        }
        .img-editor-mb{
            display: block;
            order: 2;
        }
        .content-1{
            order: 3;
            text-align: center;
        }
        .content-2{
            order: 4;
            text-align: center;
        }
        .img-phones{
                            
        display: none;
                      
        }
        .phones-mobile{
            order: 5;
            margin-bottom: -180px;
            z-index: 1;

        }
        .infrastructure{
            order: 6;
            width: 100%;
            height: 500px;            
            background: url(../images/bg-pattern-circles.svg) no-repeat, linear-gradient(70.28deg, #2E2F41 11.18%, #3D4063 84.37%);
            background-position-x: 50%, 0;
            background-position-y: -200%, 0;
            background-size: 140%, 100%;
            text-align: center;
        }
        /* TODO */

        #content-3{
            text-align: center;
            order: 7;
            margin-top: -380px;
            width: 100%;
        }
       
        .img-laptop-mobile{
            margin-top: 50px;
            order: 8;
            display: block;
        }
        .img-laptop{
            display: none;
        }
        .content-4{
            order: 9;
            text-align: center;
        }
        .content-5{
            order: 10;
            text-align: center;
        }


    }

</style>