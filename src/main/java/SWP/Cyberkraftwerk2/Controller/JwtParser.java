package SWP.Cyberkraftwerk2.Controller;

import com.google.gson.Gson;

import java.util.Base64;
import java.util.List;

public class JwtParser {

    public static List<String> extractRealmAccessRoles(String jwtToken) {
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
