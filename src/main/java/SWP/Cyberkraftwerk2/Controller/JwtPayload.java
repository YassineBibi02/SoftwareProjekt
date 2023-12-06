package SWP.Cyberkraftwerk2.Controller;

import java.util.List;

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
