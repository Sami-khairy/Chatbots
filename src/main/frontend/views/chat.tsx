import { Button, TextField } from "@vaadin/react-components";
import { useEffect, useRef, useState } from "react";
import { ChatAiService } from "Frontend/generated/endpoints";
import Markdown from "react-markdown";
import { chatStreamingData } from "Frontend/generated/ChatAiService";
import { Subscription } from "@vaadin/hilla-frontend";

export default function Chat() {
    const [question, setQuestion] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const subscriptionRef = useRef<Subscription<string> | null>(null);

    useEffect(() => {
        return () => {
            subscriptionRef.current?.cancel();
        };
    }, []);

    async function sendQuestion() {
        setIsLoading(true);
        try {
            const response = await ChatAiService.chat(question);
            setResponse(response);
        } catch (error) {
            setResponse("Erreur : Impossible d'obtenir une réponse.");
        } finally {
            setIsLoading(false);
        }
    }

    async function sendQuestionStream() {
        if (!question.trim()) {
            setResponse("Erreur : Veuillez saisir une question.");
            return;
        }
        if (subscriptionRef.current) {
            subscriptionRef.current.cancel();
        }

        setIsLoading(true);
        setResponse("");

        const subscription = ChatAiService.chatStreamingData(question);
        subscriptionRef.current = subscription;

        subscription.onNext((chunk: string) => {
            setResponse((prevResponse) => prevResponse + chunk);
        });

        subscription.onError(() => {
            setResponse("Erreur : Une erreur s'est produite lors du streaming.");
            setIsLoading(false);
        });

        subscription.onComplete(() => {
            setIsLoading(false);
            console.log("Flux terminé.");
        });
    }

    async function ragQuestion() {
        setIsLoading(true);
        try {
            const response = await ChatAiService.rag(question);
            setResponse(response);
        } catch (error) {
            setResponse("Erreur : Impossible d'obtenir une réponse RAG.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-m">
            <h1>ChatBot</h1>

            {/* Champ de saisie et boutons */}
            <div className="flex gap-s">
                <TextField
                    className="w-full"
                    label="Message"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <Button theme="primary" onClick={sendQuestion} disabled={isLoading}>
                    Envoyer (Simple)
                </Button>
                <Button theme="primary" onClick={sendQuestionStream} disabled={isLoading}>
                    Envoyer (Streaming)
                </Button>
                <Button theme="primary" onClick={ragQuestion} disabled={isLoading}>
                    Envoyer (RAG)
                </Button>
            </div>

            <div className="mt-m">
                <h2>Réponse :</h2>
                <div className="response-box">
                    <Markdown>{response}</Markdown>
                </div>
            </div>

            {isLoading && <p>Chargement en cours...</p>}
        </div>
    );
}