package SWP.Cyberkraftwerk2.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class KeycloakController {

    private final KeycloakService keycloakService;

    @Autowired
    public KeycloakController(KeycloakService keycloakService) {
        this.keycloakService = keycloakService;
    }

    @GetMapping("/api/methode/roles")
    public ResponseEntity<List<String>> getAllRoles() {
        List<String> roles;
        try {

            roles = keycloakService.getAllRoles();
            if (roles.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 No Content when there are no roles
            }
            return ResponseEntity.ok(roles); // Return 200 OK with roles in the body
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build(); // Return 500 Internal Server Error in case of exceptions
        }
    }
}
