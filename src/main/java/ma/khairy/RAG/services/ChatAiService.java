package ma.khairy.RAG.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatAiService {

    private ChatClient chatClient;

    public ChatAiService(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }

    public String chat(String question) {
        return chatClient.prompt()
                .user(question)
                .call().content();
    }
}
