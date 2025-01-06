import {Button, TextField} from "@vaadin/react-components";
import {useState} from "react";
import {ChatAiService} from "Frontend/generated/endpoints";
import Markdown from "react-markdown";

export default function chat(){
    const [question, setQuestion] = useState<String>("");
    const [response, setResponse] = useState<String >("");

    async function sendQuestion(){
        ChatAiService.chat(question)
            .then(response => setResponse(response))
            .catch();
    }
    return (
        <div className="p-m">
            <h1>Chat</h1>
            <div>
                <TextField
                    className="w-full" label="Message"
                    onChange={e => setQuestion(e.target.value)}></TextField>
                <Button theme="primary" onClick={sendQuestion}>Send</Button>
                <div>
                    <Markdown>
                        {response}
                    </Markdown>
                </div>
            </div>
        </div>
    )
}