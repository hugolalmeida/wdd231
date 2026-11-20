const query = new URLSearchParams(window.location.search);
const detailList = document.querySelector("#submission-details");
const message = document.querySelector("#submission-message");
const fields = [
    ["First name", "firstName"],
    ["Last name", "lastName"],
    ["Email address", "email"],
    ["Mobile phone number", "phone"],
    ["Business or organization", "organization"],
    ["Application date and time", "timestamp"]
];

const missingFields = fields.filter(([, name]) => !query.get(name));

if (missingFields.length > 0) {
    message.textContent = "We could not find a complete application in this page address. Please submit the membership form to see your application details.";
    message.hidden = false;
} else {
    fields.forEach(([label, name]) => {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = name === "timestamp"
            ? new Date(query.get(name)).toLocaleString()
            : query.get(name);
        row.append(term, description);
        detailList.append(row);
    });
}
