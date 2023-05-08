import {FormData} from "node-fetch-native";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const url = config.apiBaseUrl + '/upload_summarize'
    const form = await readMultipartFormData(event);
    console.log(form);

    const formData = new FormData();

    if (form) {
        form.forEach((item) => {
            if (!item.name) {
                return;
            }
            if (!item.filename) {
                formData.append(item.name, item.data.toString())
            } else {
                formData.append(item.name, new Blob([item.data], {type: item.type}), item.filename);
            }
        });
    }

    console.log(formData);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + config.apiSecret,
        },
        body: formData,
    });

    return await response.json();
});
