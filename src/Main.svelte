

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
    <div class="img-editor">
        <img src="./images/illustration-editor-desktop.svg" alt="editor">
    </div>
    <div class="infrastructure"></div>
    <div class="img-phones">
        <img src="./images/illustration-phones.svg" alt="phones">
    </div>
    <div class="content-3">
        <h1>State of the Art Infrastructure</h1>
        <p>
            With reliability and speed in mind, wordwide data centers provide the backbone for ultra-fast connectivity. This ensures your site will load instantly, no matter where your  readers are, keeping your site competitive.
        </p>
    </div>    
    <div class="img-laptop">
        <img src="./images/illustration-laptop-desktop.svg" alt="laptop">
    </div>
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
        grid-template-rows: 100px 0.50fr 0.50fr .50fr 0.50fr 0.50fr;
    }
    .head-line{
        justify-self: center;
        margin-top: 150px;
        grid-column: 1/3;
        grid-row: 1/2;
        font-weight: 500;
        font-size: 33px;
    }
    .content-1{
        grid-column: 1/2;
        grid-row: 2/3;
        width: 520px;
        align-self: end;
        justify-self: center;
    }
    .content-1 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;
    }
    .content-1 p{
        line-height: 1.8;
        margin-bottom: 50px;
    }
    .content-2{
        grid-column: 1/2;
        grid-row: 3/4;
        width: 520px;
        align-self: start;
        justify-self: center;
    }
    .content-2 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;
    }
    .content-2 p{
        line-height: 1.8;
        margin-bottom: 50px;
    }
    
    .img-editor{
        grid-column: 2/3;
        grid-row: 1/4;
        margin-top: 80px;        
    }
    .infrastructure{
        grid-column: 1/3;
        grid-row: 4/5;
        background: linear-gradient(70.28deg, #2E2F41 11.18%, #3D4063 84.37%);
        height: 400px;
        align-self: center;
        border-bottom-left-radius: 90px;
        border-top-right-radius: 90px;
    }
    .img-phones{
        grid-column: 1/2;
        grid-row: 4/5;
        justify-self: center;
        margin-top: 40px;        
    }
    .content-3{
        grid-column: 2/3;
        grid-row: 4/5;
        align-self: center;
        color: white;
        width: 540px        
    }
    .content-3 h1{
        font-size: 38px;
        font-weight: 500;
        margin: 30px 0;
    }
    .content-3 p{
        line-height: 1.8;
        margin-bottom: 50px;
    }
    .img-laptop{
        grid-column: 1/2;
        grid-row: 5/7;
        justify-self: end;
    }
    .content-4{
        grid-column: 2/3;
        grid-row: 5/6;
        align-self: end;
        width: 520px;
    }
    .content-4 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;
    }
    .content-4 p{
        line-height: 1.8;
        margin-bottom: 50px;
    }
    .content-5{
        grid-column: 2/3;
        grid-row: 6/7;
        align-self: start;
        width: 520px; 
    }
    .content-5 h2{
        font-size: 28px;
        font-weight: 400;
        margin: 30px 0;

    }
    .content-5 p{
        line-height: 1.8;
        margin-bottom: 50px;
    }

</style>