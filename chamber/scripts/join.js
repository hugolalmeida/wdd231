const timestamp = document.querySelector("#timestamp");
timestamp.value = new Date().toISOString();

document.querySelectorAll(".membership-card a").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(link.getAttribute("href")).showModal();
    });
});

document.querySelectorAll(".membership-dialog").forEach((dialog) => {
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
});
