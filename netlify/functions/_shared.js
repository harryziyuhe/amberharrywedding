const crypto = require("node:crypto");

const JSON_HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
};

function json(statusCode, payload) {
    return {
        statusCode,
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
    };
}

function badRequest(message) {
    return json(400, { error: message });
}

function methodNotAllowed() {
    return json(405, { error: "Method not allowed." });
}

function getEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function parseBody(event) {
    try {
        return JSON.parse(event.body || "{}");
    } catch (error) {
        return null;
    }
}

function normalizeLookup(firstName, lastInitial) {
    const lookupFirstName = String(firstName || "").trim().toLowerCase();
    const lookupLastInitial = String(lastInitial || "").trim().toLowerCase().slice(0, 1);

    if (!lookupFirstName || !lookupLastInitial) {
        return null;
    }

    return {
        lookupFirstName,
        lookupLastInitial,
        lookupKey: `${lookupFirstName}:${lookupLastInitial}`
    };
}

function signPayload(payload, secret) {
    return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function createUpdateToken(partyId, secret, expiresInSeconds) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresInSeconds;
    const payload = Buffer.from(
        JSON.stringify({
            partyId,
            iat: issuedAt,
            exp: expiresAt
        })
    ).toString("base64url");

    return `${payload}.${signPayload(payload, secret)}`;
}

function verifyUpdateToken(token, secret) {
    if (!token || typeof token !== "string" || !token.includes(".")) {
        return null;
    }

    const [payload, signature] = token.split(".");
    const expectedSignature = signPayload(payload, secret);

    if (
        !signature ||
        signature.length !== expectedSignature.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
        return null;
    }

    let decoded;
    try {
        decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    } catch (error) {
        return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (!decoded.partyId || !decoded.exp || decoded.exp < now) {
        return null;
    }

    return decoded;
}

async function supabaseRequest(path, options = {}) {
    const baseUrl = getEnv("SUPABASE_URL").replace(/\/$/, "");
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    const headers = {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json"
    };

    if (options.prefer) {
        headers.Prefer = options.prefer;
    }

    const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Supabase request failed: ${response.status} ${text}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

module.exports = {
    badRequest,
    createUpdateToken,
    getEnv,
    json,
    methodNotAllowed,
    normalizeLookup,
    parseBody,
    supabaseRequest,
    verifyUpdateToken
};
