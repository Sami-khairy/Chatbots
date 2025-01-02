package ma.khairy.RAG.controllers;

import ma.khairy.RAG.services.ChatAiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat-ai")
public class ChatAiController {
    private ChatAiService chatAiService;


    public ChatAiController(ChatAiService chatAiService) {
        this.chatAiService = chatAiService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return chatAiService.chat(question);
    }
}
