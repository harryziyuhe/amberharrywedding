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
        return badRequest("Please provide a first name or nickname and last initial.");
    }

    try {
        const memberLookupParams = new URLSearchParams({
            select: "id,party_id",
            invited: "is.true",
            lookup_last_initial_normalized: `eq.${normalized.lookupLastInitial}`,
            or: `(lookup_first_name_normalized.eq.${normalized.lookupFirstName},lookup_nickname_normalized.eq.${normalized.lookupFirstName})`,
            limit: "10"
        });

        const memberMatches = await supabaseRequest(`party_members?${memberLookupParams.toString()}`);

        if (!memberMatches || memberMatches.length === 0) {
            return json(200, { found: false });
        }

        const partyIds = [...new Set(memberMatches.map((member) => member.party_id))];
        if (partyIds.length > 1) {
            return json(200, {
                found: false,
                error: "We found more than one invitation with that name. Please try a different name from your party."
            });
        }

        const partyRows = await supabaseRequest(
            `parties?select=id,display_name,plus_one_allowed,plus_one_attending,plus_one_name,plus_one_entree_choice,party_members(id,first_name,nickname,invited,attending,entree_choice)&id=eq.${partyIds[0]}&limit=1`
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
                members,
                plusOneAllowed: party.plus_one_allowed === true,
                plusOne: party.plus_one_allowed === true
                    ? {
                        attending: typeof party.plus_one_attending === "boolean" ? party.plus_one_attending : null,
                        name: party.plus_one_name || "",
                        entreeChoice: party.plus_one_entree_choice || ""
                    }
                    : null
            }
        });
    } catch (error) {
        return json(500, {
            error: "We could not look up your invitation right now. Please try again in a moment."
        });
    }
};
