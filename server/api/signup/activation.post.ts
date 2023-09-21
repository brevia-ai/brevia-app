export default defineEventHandler(async (event) => {
    try{
        const body = await readBody(event);
        const client = beditaApiClient();
        console.log("Call to /signup/activation with body:");
        console.log(body);
        const resp = await client.post('/signup/activation',body);
        return resp.data;
    }catch(err){
        console.log("ERROR:");
        console.log(err);
        return err;
    }
})