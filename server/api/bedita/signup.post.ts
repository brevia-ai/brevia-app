export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        // Verify the recaptcha
        const recaptchaVerify = await recaptchaVerifyToken(body.recaptcha_token);
        if (recaptchaVerify === false) {
            throw createError({
                statusCode: 400,
                message: 'Recaptcha token not valid',
            });
        }
        // Creating a new body
        const client = await beditaApiClient(event);
        const signupBody = {
            name: body.name,
            surname: body.surname,
            username: body.username,
            password: body.password,
            email: body.email,
        }
        const resp = await client.post('/signup', signupBody);

        return resp.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
})
