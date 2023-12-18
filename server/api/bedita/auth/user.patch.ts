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
            name: reqBody.newname,
            surname: reqBody.newsurname,
            password: reqBody.newpassword,
            old_password: reqBody.oldpassword
        }
        const response = await client.patch('/auth/user', changeBody);
        console.log(response.data);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
