export default defineEventHandler(async (event) => {
    try {
        const resetUrl = (`${getRequestURL(event).origin}/reset-password`);
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
        const resetBody = {
            contact: reqBody?.contact,
            change_url: resetUrl,
        }
        const response = await client.post('/auth/change', resetBody);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
