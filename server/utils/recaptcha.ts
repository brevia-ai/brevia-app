export const recaptchaVerifyToken = async (token: string) => {
    const config = useRuntimeConfig();

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${config.recaptchaSecret}&response=${token}`,
    });
    const data = await response.json();

    return data.success && data.score > 0.5;
};
