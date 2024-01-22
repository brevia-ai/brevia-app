export default defineEventHandler(async (event) => {
    try {
        const reqBody = await readBody(event);
        // Verify the captcha
        await recaptchaVerifyToken(reqBody.recaptcha_token, 'user-patch');
        // Creating a new body
        const client = await beditaApiClient(event);
        const changeBody = {
            name: reqBody.newname,
            surname: reqBody.newsurname,
            password: reqBody.newpassword,
            old_password: reqBody.oldpassword
        }
        const response = await client.patch('/auth/user', changeBody);
        return response.data;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
