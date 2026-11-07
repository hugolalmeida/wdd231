document.documentElement.classList.add("js");

const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const display = document.querySelector("#directory");
const directoryStatus = document.querySelector("#directory-status");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const membershipLabels = { 1: "Member", 2: "Silver", 3: "Gold" };

function setView(view) {
    display.classList.toggle("grid", view === "grid");
    display.classList.toggle("list", view === "list");
    gridButton.setAttribute("aria-pressed", String(view === "grid"));
    listButton.setAttribute("aria-pressed", String(view === "list"));
}

function createMemberCard(member) {
    const card = document.createElement("section");
    const image = document.createElement("img");
    image.src = `images/members/${member.image}`;
    image.alt = "";
    image.width = 160;
    image.height = 100;

    const identity = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = member.name;
    const category = document.createElement("p");
    category.className = "member-category";
    category.textContent = member.category;
    const level = document.createElement("p");
    level.className = "member-level";
    level.textContent = `Sample tier: ${membershipLabels[member.membershipLevel]}`;
    identity.append(heading, category, level);
    const address = document.createElement("p");
    address.textContent = member.address;

    const phone = document.createElement("a");
    phone.href = `tel:+55${member.phone.replace(/\D/g, "")}`;
    phone.textContent = member.phone;
    const website = document.createElement("a");
    website.href = member.website;
    website.target = "_blank";
    website.rel = "noopener noreferrer";
    website.textContent = member.website === member.source ? "CDL business profile" : "Business website";
    website.setAttribute("aria-label", `${website.textContent} for ${member.name}`);

    card.append(image, identity, address, phone, website);
    return card;
}

async function loadMembers() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) {
            throw new Error(`Member data returned HTTP ${response.status}`);
        }
        const members = await response.json();
        display.replaceChildren(...members.map(createMemberCard));
    } catch (error) {
        directoryStatus.textContent = "The member directory could not be loaded. Please try again later.";
        console.error(error);
    }
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));
menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastmodified").textContent = document.lastModified;
loadMembers();
