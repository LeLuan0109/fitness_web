package com.example.DoanBE.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FacebookAuthService {
    private final WebClient webClient;
    private static final String FACEBOOK_GRAPH_API_URL =
            "https://graph.facebook.com/me?fields=id,name,email,picture&access_token=%s";

    public Map<String, Object> getUserInfo(String accessToken) {
        return webClient.get()
                .uri(String.format(FACEBOOK_GRAPH_API_URL, accessToken))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }
}
