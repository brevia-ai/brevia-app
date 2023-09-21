export default defineEventHandler(async (event) => {
    try{
        const body = await readBody(event);
        console.log("Call to /signup with body:");
        console.log(body);
        const client = beditaApiClient();
        const resp = await client.post('/signup',body);
        return resp.data;
    }catch(error){
        //console.log(error);
        return {data:error, err: error?.message || 'Unknown error'};
    }
})