package SWP.Cyberkraftwerk2.Controller;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class UserController {
    private final ClientRegistration registration;
    private final OAuth2AuthorizedClientRepository authorizedClientRepository;


    public UserController(ClientRegistrationRepository registrations, OAuth2AuthorizedClientRepository authorizedClientRepository) {
        this.registration = registrations.findByRegistrationId("kraftcloud-ops-thymeleaf-client");
        this.authorizedClientRepository = authorizedClientRepository;
    }

    @GetMapping("/api/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            return ResponseEntity.ok().body(user.getAttributes());
        }
    }

    @PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request,
                                    @AuthenticationPrincipal(expression = "idToken") OidcIdToken idToken) {
        // send logout URL to client so they can initiate logout
        String logoutUrl = this.registration.getProviderDetails()
                .getConfigurationMetadata().get("end_session_endpoint").toString();

        Map<String, String> logoutDetails = new HashMap<>();
        logoutDetails.put("logoutUrl", logoutUrl);
        logoutDetails.put("idToken", idToken.getTokenValue());
        request.getSession(false).invalidate();
        return ResponseEntity.ok().body(logoutDetails);

    }


    @GetMapping("/api/methode/user/roles")
    public ResponseEntity<?> getUserRoles(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return new ResponseEntity<>("No user found", HttpStatus.NOT_FOUND);
        } else {
            Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
            List<String> roles = authorities.stream()
                    .map(GrantedAuthority::getAuthority) // Using a lambda expression
                    .collect(Collectors.toList());
            return ResponseEntity.ok().body(roles);
        }
    }

    @GetMapping("/api/methode/token")
    public ResponseEntity<?> getAccessToken(HttpServletRequest request, OAuth2AuthenticationToken authentication) {
        OAuth2AuthorizedClient authorizedClient = authorizedClientRepository.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(), authentication, request);

        if (authorizedClient == null) {
            return new ResponseEntity<>("No authorized client found", HttpStatus.NOT_FOUND);
        } else {
            String accessToken = authorizedClient.getAccessToken().getTokenValue();
            List<String> roles = extractRealmAccessRoles(accessToken);

            Map<String, Object> tokenDetails = new HashMap<>();
            tokenDetails.put("roles", roles);

            return ResponseEntity.ok().body(tokenDetails);
        }
    }

    private List<String> extractRealmAccessRoles(String jwtToken) {
        String[] splitToken = jwtToken.split("\\.");
        if (splitToken.length < 2) {
            throw new IllegalArgumentException("Invalid JWT token");
        }

        String payload = new String(Base64.getUrlDecoder().decode(splitToken[1]));
        Gson gson = new Gson();
        JwtPayload jwtPayload = gson.fromJson(payload, JwtPayload.class);

        return jwtPayload.getRealm_access().getRoles();
    }

}