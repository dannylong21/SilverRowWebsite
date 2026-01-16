const loading = () => {

    const loadtext = document.getElementById("text-container");
    loadtext.classList.remove("opacity-0");
    setTimeout(() => {
        window.location.href = "home.html";
    }, 3000);

}

loading();
