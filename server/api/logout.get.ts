export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const session = await useSession(event, config.session);
    await session.clear();

    setResponseStatus(event, 204);
});
