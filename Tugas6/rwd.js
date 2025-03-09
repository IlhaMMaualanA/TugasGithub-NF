document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".navbar-nav .nav-link");
    const mainContent = document.getElementById("main-content");

    function loadPage(page, addToHistory = true) {
        if (!page || page === window.location.pathname.split("/").pop()) return; // Cegah reload jika halaman sama

        mainContent.innerHTML = "<p>Loading...</p>"; // Preloader sederhana
        
        fetch(page) 
            .then(response => {
                if (!response.ok) {
                    throw new Error("Halaman tidak ditemukan.");
                }
                return response.text();
            })
            .then(data => {
                mainContent.innerHTML = data;
                if (addToHistory) {
                    history.pushState({ page: page }, "", page); // Ubah URL tanpa reload
                }
            })
            .catch(error => {
                mainContent.innerHTML = "<p style='color:red;'>Error: Halaman tidak ditemukan.</p>";
                console.error("Error loading page:", error);
            });
    }

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("data-page");
            loadPage(page);
        });
    });

    // Untuk tombol "Back" & "Forward" di browser
    window.addEventListener("popstate", function (event) {
        const page = event.state ? event.state.page : "main.html"; // Jika tidak ada state, default ke home
        loadPage(page, false); // Jangan tambahkan ke history lagi
    });

    // Load halaman awal sesuai dengan URL
    const initialPage = window.location.pathname.split("/").pop() || "main.html";
    loadPage(initialPage, false);
});
