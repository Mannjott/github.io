"use strict";

//IIFE - Immediately Invoked Functional  Expression
(function () {


    function DisplayHomePage(){
        console.log("Calling DisplayHomePage()...");

        let AboutUseBtn = document.getElementById("AboutUseBtn");
        AboutUseBtn.addEventListener("click", function(){
            location.href = "about.html";
        });

        let MainContent = document.getElementsByTagName("main")[0];

        let MainParagraph = document.createElement("p");
        MainParagraph.setAttribute("id", "mainParagraph");
        MainParagraph.setAttribute("class", "mt-3");

        MainParagraph.textContent = "This is the main Paragraph";
        MainContent.appendChild(MainParagraph);

        let FirstString = "This is";
        let SecondString = `${FirstString} the main Paragraph`;
        MainParagraph.textContent = SecondString;

        MainContent.appendChild(MainParagraph);
        let DocumentBody = document.body;

        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3"> This is my article paragraph</p>`;
        ArticleParagraph.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);
    }

    function DisplayAboutPage(){
        console.log("Calling AboutPage()...");
    }

    function DisplayProductsPage(){
        console.log("Calling ProductsPage()...");
    }

    function DisplayServicesPage(){
        console.log("Calling ServicesPage()...");
    }

    function DisplayContactPage(){
        console.log("Calling ContactsPage()...");
    }

    function Start(){
        console.log("Starting...");

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
        }
    }
    window.addEventListener("load", Start);

})();