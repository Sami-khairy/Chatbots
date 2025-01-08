import {Button, TextField} from "@vaadin/react-components";
import {useEffect, useRef, useState} from "react";
import {ChatAiService} from "Frontend/generated/endpoints";
import Markdown from "react-markdown";
import {chatStreamingData} from "Frontend/generated/ChatAiService";
import {Subscription} from "@vaadin/hilla-frontend";

export default function chat(){
    const [question, setQuestion] = useState<string>("");
    const [response, setResponse] = useState<string >("");
    const subscriptionRef = useRef<Subscription<string> | null>(null);

    useEffect(() => {
        return () => {
            subscriptionRef.current?.cancel();
        };
    }, []);


    async function sendQuestion(){
        ChatAiService.chat(question)
            .then(response => setResponse(response))
            .catch();
    }

    async function sendQuestionStream() {
        if (subscriptionRef.current) {
            subscriptionRef.current?.cancel();
        }

        setResponse("");

        const subscription = ChatAiService.chatStreamingData(question);
        subscriptionRef.current = subscription;

        subscription.onNext((chunk: string) => {
            setResponse((prevResponse) => prevResponse + chunk);
        });

        subscription.onError(() => {
            setResponse("Erreur : Une erreur s'est produite.");
        });

        subscription.onComplete(() => {
            console.log("Flux terminé.");
        });
    }

    async function ragQuestion(){
        ChatAiService.rag(question)
            .then(response => setResponse(response))
            .catch();
    }
    return (
        <div className="p-m">
            <h1>Simple ChatBot</h1>
            <div>
                <TextField
                    className="w-full" label="Message"
                    onChange={e => setQuestion(e.target.value)}></TextField>
                <Button theme="primary" onClick={sendQuestion}>Send</Button>
            </div>
            <h1>Flux ChatBot</h1>
            <div>
                <TextField
                    className="w-full" label="Message"
                    onChange={e => setQuestion(e.target.value)}></TextField>
                <Button theme="primary" onClick={sendQuestionStream}>Send</Button>
            </div>
            <h1>RAG </h1>
            <div>
                <TextField
                    className="w-full" label="Message"
                    onChange={e => setQuestion(e.target.value)}></TextField>
                <Button theme="primary" onClick={ragQuestion}>Send</Button>
                <div>
                    <Markdown>
                        {response}
                    </Markdown>
                </div>
            </div>
        </div>
    )
}