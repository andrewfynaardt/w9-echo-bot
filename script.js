const abortController = new AbortController();
let requestInFlight = undefined;
 
 
function main() {
    const input = document.querySelector("input");
    const output = document.querySelector("#output");

    // getting the input element
    input.addEventListener("change", () => {
        // abort the previous request if it is in flight
        if(requestInFlight) {
            abortController.abort("new request");
            console.log("aborting");
            requestInFlight = false;
        }

        // send the request
        const text = input.value;
        requestInFlight = true;

        fetch("https://echo-bot-shy-sea-4425.fly.dev/echo", {
            method: "POST",
            body: JSON.stringify({ text: text }),
            headers: { "Content-Type": "application/json" },
            signal: abortController.signal
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    output.textContent = "Error: Request failed.";
                    throw new Error("Request failed");
                }
            })
            .then((json) => {
                output.textContent = `Response: ${json.text}`;
            })
            .catch((error) => {
                if (error === "AbortError") {
                    output.textContent = "Request was aborted.";
                } else {
                    console.error("Fetch Error:", error);
                    output.textContent = "Error sending request.";
                }
            })
            .finally(() => {
                requestInFlight = false;
            });
    })
}
 
document.addEventListener("DOMContentLoaded", main);