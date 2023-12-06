package SWP.Cyberkraftwerk2.Controller;

import java.util.List;


/**
 * This class represents the payload of the JWT token.
 * It contains the realm_access object which contains the roles of the user.
 *
 * @Author: Yassine Bibi
 */
public class JwtPayload {
    private RealmAccess realm_access;

    // Getters and setters

    public RealmAccess getRealm_access() {
        return realm_access;
    }

    public void setRealm_access(RealmAccess realm_access) {
        this.realm_access = realm_access;
    }

    public static class RealmAccess {
        private List<String> roles;

        public List<String> getRoles() {
            return roles;
        }

        // Getters and setters
    }
}
