const spotlightDisplay = document.querySelector("#spotlights");
const spotlightStatus = document.querySelector("#spotlight-status");

function createSpotlight(member) {
    const card = document.createElement("article");
    card.className = "spotlight-card";
    const logo = document.createElement("img");
    logo.src = `images/members/${member.image}`;
    logo.alt = `${member.name} logo`;
    logo.width = 160;
    logo.height = 100;
    logo.loading = "lazy";
    const title = document.createElement("h3");
    title.textContent = member.name;
    const level = document.createElement("p");
    level.className = "membership-badge";
    level.textContent = `${member.membershipLevel === 3 ? "Gold" : "Silver"} member`;
    const address = document.createElement("p");
    address.textContent = member.address;
    const phone = document.createElement("a");
    phone.href = `tel:+55${member.phone.replace(/\D/g, "")}`;
    phone.textContent = member.phone;
    const website = document.createElement("a");
    website.href = member.website;
    website.textContent = "Visit website";
    website.setAttribute("aria-label", `Visit ${member.name} website`);
    card.append(logo, title, level, address, phone, website);
    return card;
}

async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Member data unavailable");
        const members = await response.json();
        const eligible = members.filter((member) => [2, 3].includes(member.membershipLevel));
        // Fisher–Yates gives every eligible member the same chance, without repeats.
        for (let index = eligible.length - 1; index > 0; index--) {
            const random = Math.floor(Math.random() * (index + 1));
            [eligible[index], eligible[random]] = [eligible[random], eligible[index]];
        }
        if (eligible.length < 2) throw new Error("Not enough eligible members");
        spotlightDisplay.replaceChildren(...eligible.slice(0, 3).map(createSpotlight));
        spotlightStatus.textContent = "";
    } catch {
        spotlightStatus.textContent = "Member spotlights could not be loaded. Please try again later.";
    }
}

loadSpotlights();
