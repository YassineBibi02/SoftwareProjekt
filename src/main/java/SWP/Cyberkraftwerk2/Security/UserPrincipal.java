package SWP.Cyberkraftwerk2.Security;

import SWP.Cyberkraftwerk2.Models.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * This Class is essentially a proxy - javadoc WIP
 *
 * @author Yassine Bibi
 */
public class UserPrincipal implements UserDetails {

    /**
     * The referenced User
     */
    private User user;

    /**
     * Constructor Function to allocate user
     *
     * @param user The user
     */
    public UserPrincipal(User user) {
        this.user = user;
    }

    /**
     * @return a collection of all authorities and Roles a user has.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        //get permissions
        this.user.getPermissionList().forEach( p-> {
            GrantedAuthority authority = new SimpleGrantedAuthority(p);
            authorities.add(authority);
        });

        //get roles
        this.user.getRoleList().forEach( r-> {
            GrantedAuthority authority = new SimpleGrantedAuthority("Role_"+r);
            authorities.add(authority);
        });

        return authorities;
    }

    /**
     * @return the Encrypted password as a String
     */
    @Override
    public String getPassword() {
        return this.user.getPassword();
    }

    /**
     * @return The Username as a String
     */
    @Override
    public String getUsername() {
        return this.user.getUsername();
    }

    /**
     * @return A boolean to indicate if the account is not expired
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * @return A boolean to indicate if the account is not Locked
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * @return A boolean to indicate if the Credentials are not expired
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * @return A boolean to indicate if the account is Enabled
     */
    @Override
    public boolean isEnabled() {
        return this.user.getActive() == 1;
    }
}
