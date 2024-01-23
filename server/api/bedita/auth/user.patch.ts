import { FormatUserInterceptor } from '@atlasconsulting/bedita-sdk';
import { UserAuth } from '@atlasconsulting/nuxt-bedita';

export default defineEventHandler(async (event) => {
    try {
        const reqBody = await readBody(event);
        await recaptchaVerifyToken(reqBody.recaptcha_token, 'user-patch');
        const client = await beditaApiClient(event);
        const changeBody = {
            name: reqBody.newname,
            surname: reqBody.newsurname,
            password: reqBody.newpassword,
            old_password: reqBody.oldpassword
        }
        await client.patch('/auth/user', changeBody);

        // update session data
        const response = await client.get('/auth/user', {
            responseInterceptors: [new FormatUserInterceptor(client)],
        });
        await client.getStorageService().set('user', filterUserDataToStore(response?.formattedData));

        return response.formattedData as UserAuth;
    } catch (error) {
        return handleBeditaApiError(event, error);
    }
});
