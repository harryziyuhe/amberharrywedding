const RSVP_ENTREE_OPTIONS = [
    { value: "chicken", label: "Roasted Chicken" },
    { value: "beef", label: "Seared Beef" },
    { value: "vegetarian", label: "Wild Mushroom Risotto" }
];

const state = {
    party: null,
    token: ""
};

const elements = {
    lookupForm: document.getElementById("rsvp-lookup-form"),
    lookupFirstName: document.getElementById("lookup-first-name"),
    lookupLastInitial: document.getElementById("lookup-last-initial"),
    lookupMessage: document.getElementById("lookup-message"),
    lookupSubmit: document.getElementById("lookup-submit"),
    lookupStep: document.getElementById("rsvp-step-lookup"),
    formStep: document.getElementById("rsvp-step-form"),
    formPartyCopy: document.getElementById("rsvp-form-party-copy"),
    form: document.getElementById("rsvp-form"),
    members: document.getElementById("rsvp-members"),
    formMessage: document.getElementById("form-message"),
    submitButton: document.getElementById("rsvp-submit"),
    editSearchButton: document.getElementById("edit-search-button"),
    successStep: document.getElementById("rsvp-step-success"),
    successCopy: document.getElementById("rsvp-success-copy"),
    submitAnotherButton: document.getElementById("submit-another-button")
};

function setMessage(node, text, tone) {
    node.textContent = text || "";
    node.classList.remove("is-error", "is-success");
    if (tone) {
        node.classList.add(tone === "error" ? "is-error" : "is-success");
    }
}

function showStep(stepName) {
    const steps = {
        lookup: elements.lookupStep,
        form: elements.formStep,
        success: elements.successStep
    };

    Object.entries(steps).forEach(([name, node]) => {
        node.hidden = name !== stepName;
    });
}

function resetExperience() {
    state.party = null;
    state.token = "";
    elements.lookupForm.reset();
    elements.members.innerHTML = "";
    setMessage(elements.lookupMessage, "", null);
    setMessage(elements.formMessage, "", null);
    showStep("lookup");
    elements.lookupFirstName.focus();
}

function describeParty(party) {
    const invitedCount = party.members.length;
    const baseLabel = invitedCount === 1 ? "1 invited guest" : `${invitedCount} invited guests`;
    if (party.plusOneAllowed) {
        return `${baseLabel} with one optional guest`;
    }
    return baseLabel;
}

function createOption(value, label, selectedValue) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = selectedValue === value;
    return option;
}

function buildMember(member) {
    const article = document.createElement("article");
    article.className = "rsvp-member";
    article.dataset.memberId = member.id;

    const header = document.createElement("div");
    header.className = "rsvp-member-header";

    const title = document.createElement("h3");
    title.textContent = member.firstName;

    const note = document.createElement("p");
    note.className = "rsvp-member-note";
    note.textContent = "Please let us know whether this guest will be attending.";

    header.append(title, note);

    const grid = document.createElement("div");
    grid.className = "rsvp-choice-grid";

    const fieldset = document.createElement("fieldset");
    fieldset.className = "rsvp-field";

    const legend = document.createElement("legend");
    legend.textContent = "Attending";

    const choiceSet = document.createElement("div");
    choiceSet.className = "rsvp-choice-set";

    const radioName = `attending-${member.id}`;

    [
        { value: "yes", label: "Joyfully Accepts" },
        { value: "no", label: "Regretfully Declines" }
    ].forEach((choice) => {
        const label = document.createElement("label");
        label.className = "rsvp-choice";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = radioName;
        input.value = choice.value;
        input.checked =
            (choice.value === "yes" && member.attending === true) ||
            (choice.value === "no" && member.attending === false);

        const pill = document.createElement("span");
        pill.textContent = choice.label;

        label.append(input, pill);
        choiceSet.append(label);
    });

    fieldset.append(legend, choiceSet);

    const entreeField = document.createElement("label");
    entreeField.className = "rsvp-field rsvp-entree";
    entreeField.hidden = member.attending !== true;

    const entreeLabel = document.createElement("span");
    entreeLabel.textContent = "Entree";

    const entreeSelect = document.createElement("select");
    entreeSelect.name = `entree-${member.id}`;
    entreeSelect.append(createOption("", "Select an entree", ""));
    RSVP_ENTREE_OPTIONS.forEach((choice) => {
        entreeSelect.append(createOption(choice.value, choice.label, member.entreeChoice || ""));
    });

    entreeField.append(entreeLabel, entreeSelect);
    grid.append(fieldset, entreeField);
    article.append(header, grid);

    article.querySelectorAll(`input[name="${radioName}"]`).forEach((input) => {
        input.addEventListener("change", () => {
            const isAttending = input.value === "yes";
            entreeField.hidden = !isAttending;
            if (!isAttending) {
                entreeSelect.value = "";
            }
        });
    });

    return article;
}

function buildPlusOne(plusOneState) {
    const article = document.createElement("article");
    article.className = "rsvp-member rsvp-member--plus-one";

    const header = document.createElement("div");
    header.className = "rsvp-member-header";

    const title = document.createElement("h3");
    title.textContent = "Guest";

    const note = document.createElement("p");
    note.className = "rsvp-member-note";
    note.textContent = "You may bring one guest if you would like. Their name is optional.";

    header.append(title, note);

    const grid = document.createElement("div");
    grid.className = "rsvp-choice-grid";

    const fieldset = document.createElement("fieldset");
    fieldset.className = "rsvp-field";

    const legend = document.createElement("legend");
    legend.textContent = "Attending";

    const choiceSet = document.createElement("div");
    choiceSet.className = "rsvp-choice-set";
    const radioName = "plus-one-attending";

    [
        { value: "yes", label: "Will Attend" },
        { value: "no", label: "Will Not Attend" }
    ].forEach((choice) => {
        const label = document.createElement("label");
        label.className = "rsvp-choice";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = radioName;
        input.value = choice.value;
        input.checked =
            (choice.value === "yes" && plusOneState.attending === true) ||
            (choice.value === "no" && plusOneState.attending === false);

        const pill = document.createElement("span");
        pill.textContent = choice.label;

        label.append(input, pill);
        choiceSet.append(label);
    });

    fieldset.append(legend, choiceSet);

    const entreeField = document.createElement("label");
    entreeField.className = "rsvp-field rsvp-entree";
    entreeField.hidden = plusOneState.attending !== true;

    const entreeLabel = document.createElement("span");
    entreeLabel.textContent = "Entree";

    const entreeSelect = document.createElement("select");
    entreeSelect.name = "plus-one-entree";
    entreeSelect.append(createOption("", "Select an entree", ""));
    RSVP_ENTREE_OPTIONS.forEach((choice) => {
        entreeSelect.append(createOption(choice.value, choice.label, plusOneState.entreeChoice || ""));
    });
    entreeField.append(entreeLabel, entreeSelect);

    const nameField = document.createElement("label");
    nameField.className = "rsvp-field rsvp-plus-one-name";
    nameField.hidden = plusOneState.attending !== true;

    const nameLabel = document.createElement("span");
    nameLabel.textContent = "Guest Name (Optional)";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "plus-one-name";
    nameInput.autocomplete = "name";
    nameInput.value = plusOneState.name || "";

    nameField.append(nameLabel, nameInput);

    article.querySelectorAll(`input[name="${radioName}"]`);
    grid.append(fieldset, entreeField);
    article.append(header, grid, nameField);

    article.querySelectorAll(`input[name="${radioName}"]`).forEach((input) => {
        input.addEventListener("change", () => {
            const isAttending = input.value === "yes";
            entreeField.hidden = !isAttending;
            nameField.hidden = !isAttending;
            if (!isAttending) {
                entreeSelect.value = "";
                nameInput.value = "";
            }
        });
    });

    return article;
}

function renderPartyForm() {
    elements.members.innerHTML = "";
    state.party.members.forEach((member) => {
        elements.members.append(buildMember(member));
    });
    if (state.party.plusOneAllowed) {
        elements.members.append(buildPlusOne(state.party.plusOne || { attending: null, name: "", entreeChoice: "" }));
    }
    elements.formPartyCopy.textContent = `Reply for ${state.party.displayName}. Any previous response is already filled in so updating later stays simple.`;
}

async function postJson(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    let result = {};
    try {
        result = await response.json();
    } catch (error) {
        result = {};
    }

    if (!response.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
    }

    return result;
}

elements.lookupLastInitial.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^a-z]/gi, "").slice(0, 1).toUpperCase();
});

elements.lookupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(elements.lookupMessage, "", null);

    const firstName = elements.lookupFirstName.value.trim();
    const lastInitial = elements.lookupLastInitial.value.trim();

    if (!firstName || !lastInitial) {
        setMessage(elements.lookupMessage, "Please enter a first name or nickname and a last initial.", "error");
        return;
    }

    elements.lookupSubmit.disabled = true;
    elements.lookupSubmit.textContent = "Searching...";

    try {
        const result = await postJson("/.netlify/functions/lookup-party", {
            firstName,
            lastInitial
        });

        if (!result.found || !result.party) {
            setMessage(elements.lookupMessage, result.error || "We could not find a matching invitation with that information. Please try again.", "error");
            return;
        }

        state.party = result.party;
        state.token = result.updateToken;
        renderPartyForm();
        showStep("form");
    } catch (error) {
        setMessage(elements.lookupMessage, error.message, "error");
    } finally {
        elements.lookupSubmit.disabled = false;
        elements.lookupSubmit.textContent = "Find My Invitation";
    }
});
elements.editSearchButton.addEventListener("click", resetExperience);
elements.submitAnotherButton.addEventListener("click", resetExperience);

elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(elements.formMessage, "", null);

    if (!state.party || !state.token) {
        setMessage(elements.formMessage, "Please look up your invitation again before submitting.", "error");
        showStep("lookup");
        return;
    }

    const members = state.party.members.map((member) => {
        const attendingInput = elements.form.querySelector(`input[name="attending-${member.id}"]:checked`);
        const entreeInput = elements.form.querySelector(`select[name="entree-${member.id}"]`);
        const attending = attendingInput ? attendingInput.value === "yes" : null;

        return {
            id: member.id,
            attending,
            entreeChoice: attending ? entreeInput.value : ""
        };
    });

    let plusOne = null;
    if (state.party.plusOneAllowed) {
        const plusOneAttendingInput = elements.form.querySelector('input[name="plus-one-attending"]:checked');
        const plusOneEntreeInput = elements.form.querySelector('select[name="plus-one-entree"]');
        const plusOneNameInput = elements.form.querySelector('input[name="plus-one-name"]');
        const attending = plusOneAttendingInput ? plusOneAttendingInput.value === "yes" : null;

        plusOne = {
            attending,
            entreeChoice: attending ? plusOneEntreeInput.value : "",
            name: attending ? plusOneNameInput.value.trim() : ""
        };
    }

    if (members.some((member) => member.attending === null)) {
        setMessage(elements.formMessage, "Please choose attending or not attending for each invited guest.", "error");
        return;
    }

    if (state.party.plusOneAllowed && plusOne.attending === null) {
        setMessage(elements.formMessage, "Please choose attending or not attending for your guest.", "error");
        return;
    }

    if (members.some((member) => member.attending && !member.entreeChoice)) {
        setMessage(elements.formMessage, "Please choose an entree for each attending guest.", "error");
        return;
    }

    if (state.party.plusOneAllowed && plusOne.attending && !plusOne.entreeChoice) {
        setMessage(elements.formMessage, "Please choose an entree for your attending guest.", "error");
        return;
    }

    elements.submitButton.disabled = true;
    elements.submitButton.textContent = "Saving...";

    try {
        await postJson("/.netlify/functions/update-rsvp", {
            token: state.token,
            members,
            plusOne
        });

        elements.successCopy.textContent = `Your RSVP has been recorded for ${state.party.displayName}. If your plans change later, you can return here and update your responses with the same lookup.`;
        showStep("success");
    } catch (error) {
        setMessage(elements.formMessage, error.message, "error");
    } finally {
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = "Save RSVP";
    }
});

resetExperience();
