const {
    badRequest,
    createUpdateToken,
    getEnv,
    json,
    methodNotAllowed,
    normalizeLookup,
    parseBody,
    supabaseRequest
} = require("./_shared");

const TOKEN_TTL_SECONDS = 60 * 30;

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return methodNotAllowed();
    }

    const body = parseBody(event);
    if (!body) {
        return badRequest("Please send a valid JSON request body.");
    }

    const normalized = normalizeLookup(body.firstName, body.lastInitial);
    if (!normalized) {
        return badRequest("Please provide both first name and last initial.");
    }

    try {
        const partyRows = await supabaseRequest(
            `parties?select=id,display_name,party_members(id,first_name,invited,attending,entree_choice)&lookup_key_normalized=eq.${encodeURIComponent(normalized.lookupKey)}&limit=1`
        );

        if (!partyRows || partyRows.length === 0) {
            return json(200, { found: false });
        }

        const party = partyRows[0];
        const members = Array.isArray(party.party_members)
            ? party.party_members
                  .filter((member) => member.invited !== false)
                  .map((member) => ({
                      id: member.id,
                      firstName: member.first_name,
                      attending: typeof member.attending === "boolean" ? member.attending : null,
                      entreeChoice: member.entree_choice || ""
                  }))
            : [];

        return json(200, {
            found: true,
            updateToken: createUpdateToken(party.id, getEnv("RSVP_TOKEN_SECRET"), TOKEN_TTL_SECONDS),
            party: {
                displayName: party.display_name,
                members
            }
        });
    } catch (error) {
        return json(500, {
            error: "We could not look up your invitation right now. Please try again in a moment."
        });
    }
};
