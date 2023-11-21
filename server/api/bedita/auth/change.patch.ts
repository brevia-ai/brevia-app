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
        const changeBody = {
            uuid: reqBody.uuid,
            password: reqBody.password,
            login: false,
        }
        const response = await client.patch('/auth/change', changeBody);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
