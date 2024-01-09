package SWP.Cyberkraftwerk2.Controller;

import SWP.Cyberkraftwerk2.Module.User;
import SWP.Cyberkraftwerk2.Module.UserService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;


/**
 * This Class handles the User related API Calls
 *
 * @Author Yassine Bibi
 */
@RestController
public class UserController {
    private final ClientRegistration registration;
    private final OAuth2AuthorizedClientRepository authorizedClientRepository;

    private UserService userService;

    public UserController(ClientRegistrationRepository registrations, OAuth2AuthorizedClientRepository authorizedClientRepository, UserService userService) {
        this.registration = registrations.findByRegistrationId("kraftcloud-ops-thymeleaf-client");
        this.authorizedClientRepository = authorizedClientRepository;

        this.userService = userService;
    }


    /**
     * This function returns the User from the oauth2 token
     * it also combines the roles and achievements of the user from the functions in this class
     * @param user User
     * @return User
     * @Author Yassine Bibi
     */
    @GetMapping("/api/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User user, HttpServletRequest request, OAuth2AuthenticationToken authentication) {
        if (user == null) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            // Extract user details from OAuth2 token
            String email = user.getAttribute("email");
            String firstName = user.getAttribute("given_name");
            String lastName = user.getAttribute("family_name");

            // Check if user exists in the database, and if not, create a new user
            User existingUser = userService.getUserByEmail(email);
            if (existingUser == null) {
                userService.create_user(firstName, lastName, email);
            }

            Map<String, Object> userAttributes = new HashMap<>();
            userAttributes.put("email", user.getAttribute("email"));
            userAttributes.put("email_verified", user.getAttribute("email_verified"));
            userAttributes.put("preferred_username", user.getAttribute("preferred_username"));
            userAttributes.put("given_name", user.getAttribute("given_name"));
            userAttributes.put("name", user.getAttribute("name"));
            userAttributes.put("family_name", user.getAttribute("family_name"));

            try {
                List<String> roles = (List<String>) getAccessToken(request, authentication).get("roles");

                userAttributes.put("roles", roles);
            } catch (Exception e) {
                userAttributes.put("roles", new ArrayList<>());
            }

            try {
                List<Integer> achievements = (List<Integer>) getUserAchievements(email).getBody();
                userAttributes.put("achievements", achievements);
            } catch (Exception e) {
                userAttributes.put("achievements", new ArrayList<>());
            }

            try {
                Integer Level = (Integer) getUserLevel(email).getBody();
                userAttributes.put("Level", Level);
            } catch (Exception e) {
                userAttributes.put("Level", 0);
            }

            return ResponseEntity.ok().body(userAttributes);
        }
    }

    /**
     * This function returns logout instructions from the oauth2 token
     * @Author Yassine Bibi
     */
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

    /**
     * This function returns the Roles from the oauth2 token
     *
     * @param user User
     * @return List of Roles
     * @Author Yassine Bibi
     */
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

    /**
     * This function returns the Roles from the Access Token of a User
     * @param request Request
     * @param authentication Authentication
     * @return the Roles from the Access Token
     * @Author Yassine Bibi
     */
    public Map<String, Object> getAccessToken(HttpServletRequest request, OAuth2AuthenticationToken authentication) {
        OAuth2AuthorizedClient authorizedClient = authorizedClientRepository.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(), authentication, request);

        if (authorizedClient == null) {
            return new HashMap<>();
        } else {
            String accessToken = authorizedClient.getAccessToken().getTokenValue();
            List<String> roles = extractRealmAccessRoles(accessToken);

            Map<String, Object> tokenDetails = new HashMap<>();
            tokenDetails.put("roles", roles);

            return tokenDetails;
        }
    }

    /**
     * This function extracts the Realm Access Roles from a JWT Token
     * @param jwtToken JWT Token
     * @return List of Roles
     * @Author Yassine Bibi
     */
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


    /**
     * This function returns the Achievements of a User
     * @param Email Email of the User
     * @return List of Achievement IDs
     * @Author Yassine Bibi
     */
    private ResponseEntity<?> getUserAchievements(@RequestBody String Email) {
        User user = userService.getUserByEmail(Email);
        List<Integer> IDs = new ArrayList<>();
        if (user == null) {
            return new ResponseEntity<>("No user found", HttpStatus.NOT_FOUND);
        } else {
            userService.getUserAchievements(user).forEach(achievement -> {

                IDs.add(achievement.getId());

            });
            return ResponseEntity.ok().body(IDs);
        }

    }


    /**
     * This function returns the Level of a User
     *
     * @param Email Email of the User
     * @return Level of the User
     * @Author Yassine Bibi
     */
    private ResponseEntity<?> getUserLevel(@RequestBody String Email) {
        User user = userService.getUserByEmail(Email);
        if (user == null) {
            return new ResponseEntity<>("No user found", HttpStatus.NOT_FOUND);
        } else {
            return ResponseEntity.ok().body(user.get_maillevel());
        }

    }

}