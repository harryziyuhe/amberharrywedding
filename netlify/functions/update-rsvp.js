const {
    badRequest,
    getEnv,
    json,
    methodNotAllowed,
    parseBody,
    supabaseRequest,
    verifyUpdateToken
} = require("./_shared");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return methodNotAllowed();
    }

    const body = parseBody(event);
    if (!body) {
        return badRequest("Please send a valid JSON request body.");
    }

    const token = body.token;
    const members = Array.isArray(body.members) ? body.members : null;

    if (!token || !members || members.length === 0) {
        return badRequest("Please provide a valid RSVP payload.");
    }

    const tokenPayload = verifyUpdateToken(token, getEnv("RSVP_TOKEN_SECRET"));
    if (!tokenPayload) {
        return json(401, {
            error: "Your RSVP session has expired. Please look up your invitation again."
        });
    }

    try {
        const invitedMembers = await supabaseRequest(
            `party_members?select=id,party_id,invited&party_id=eq.${tokenPayload.partyId}&invited=is.true`
        );

        const invitedIds = new Set(invitedMembers.map((member) => member.id));
        const payloadIds = new Set(members.map((member) => member.id));

        if (invitedIds.size !== payloadIds.size) {
            return badRequest("Please submit responses for every invited member in your party.");
        }

        for (const invitedId of invitedIds) {
            if (!payloadIds.has(invitedId)) {
                return badRequest("Please submit responses for every invited member in your party.");
            }
        }

        for (const member of members) {
            if (!invitedIds.has(member.id)) {
                return json(403, {
                    error: "That RSVP update does not match your party."
                });
            }

            if (typeof member.attending !== "boolean") {
                return badRequest("Please choose attending or not attending for each guest.");
            }

            if (member.attending && !String(member.entreeChoice || "").trim()) {
                return badRequest("Please choose an entree for each attending guest.");
            }

            await supabaseRequest(`party_members?id=eq.${member.id}`, {
                method: "PATCH",
                prefer: "return=minimal",
                body: {
                    attending: member.attending,
                    entree_choice: member.attending ? String(member.entreeChoice).trim() : null,
                    updated_at: new Date().toISOString()
                }
            });
        }

        await supabaseRequest(`parties?id=eq.${tokenPayload.partyId}`, {
            method: "PATCH",
            prefer: "return=minimal",
            body: {
                updated_at: new Date().toISOString()
            }
        });

        return json(200, { success: true });
    } catch (error) {
        return json(500, {
            error: "We could not save your RSVP right now. Please try again in a moment."
        });
    }
};
