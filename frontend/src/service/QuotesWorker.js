import axios from "axios"

self.onmessage=async ()=>{
    try {
        console.log("In worker thread")
        console.log(import.meta.QUOTEAPIKEY)
        const resp = await axios.get(
            'https://api.api-ninjas.com/v1/quotes?category=communication',{headers:{'X-Api-Key': import.meta.env.QUOTEAPIKEY}}
        );
        const data= await resp.json()
        self.postMessage(data)
    } catch (error) {
        console.log("Error ",error.message)
        self.postMessage({error:error.message})
    }
}