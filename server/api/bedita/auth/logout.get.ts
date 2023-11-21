export default defineEventHandler(async (event) => {
    const session = await useSession(event, getSessionConfig());
    await session.clear();

    setResponseStatus(event, 204);
});
