export default defineEventHandler(async (event) => {
    try {
        const reqBody = await readBody(event);
        // Verify the captcha
        const recaptchaVerify =  await recaptchaVerifyToken(reqBody.recaptcha_token);
        if (recaptchaVerify === false) {
            throw createError({
                statusCode: 400,
                message: 'Recaptcha token not valid',
            });
        }
        // Creating a new body
        const client = await beditaApiClient(event);
        const delBody = {
            username: reqBody.username,
            password: reqBody.password,
            grant_type: 'password'
        }
        const response = await client.post('/auth/optout', delBody);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
