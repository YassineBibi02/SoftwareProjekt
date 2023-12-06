package SWP.Cyberkraftwerk2.Controller;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.ClientRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KeycloakService {

    static Keycloak keycloak = null;
    @Value("${keycloak.auth-server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    private String userName = "admin";
    private String password = "mX3LlqFnO0QwzxRIM9eSChP0lrDfALwK";

    // Rest of the fields...

    private Keycloak getInstance() {
        if (keycloak == null) {
            keycloak = KeycloakBuilder.builder()
                    .serverUrl(serverUrl)
                    .realm(realm)
                    .grantType(OAuth2Constants.PASSWORD)
                    .username(userName)
                    .password(password)
                    .clientId(clientId)
                    .clientSecret(clientSecret)

                    // Rest of the builder...
                    .build();
        }
        return keycloak;
    }

    public List<String> getAllRoles() {

        ClientRepresentation clientRep = getInstance()
                .realm(realm)
                .clients()
                .findByClientId(clientId)
                .get(0);
        return keycloak
                .realm(realm)
                .clients()
                .get(clientRep.getId())
                .roles()
                .list()
                .stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());
    }
}

