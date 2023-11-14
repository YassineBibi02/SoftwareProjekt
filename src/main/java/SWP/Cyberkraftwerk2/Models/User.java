package SWP.Cyberkraftwerk2.Models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


/**
 * User Class to keep track of Roles and Authorities
 *
 * @author Yassine Bibi
 */
@Entity
@Table(name = "UserList") // Choose a different name for your table
public class User {
    /**
     * They Key ID of every User. to be kept in the data table.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     *The Username
     */
    @Column(nullable = false)
    private String username;

    /**
     *The encrypted password
     */
    @Column(nullable = false)
    private String password;

    /**
     *An Integer to indicate if the user is active and allowed to log into the system
     */
    private int active;
    /**
     *a String of Roles that are assigned to this user.
     */
    private String roles = "";
    /**
     *a String of Permissions that are assigned to this user.
     */
    private String Permissions = "";

    /**
     * Constructor function for the User class
     * @param username The User's Username
     * @param password The User's Encrypted Password
     * @param roles The User's Roles
     * @param permissions The User's Permissions
     */
    public User(String username, String password, String roles, String permissions) {
        this.username = username;
        this.password = password;
        this.active = 1;
        this.roles = roles;
        this.Permissions = permissions;
    }

    /**
     * Default Constructor function
     */
    public User() {
    }


    /**
     * @return ID  as a Long
     */
    public Long getId() {
        return id;
    }

    /**
     * @return Username as a String
     */
    public String getUsername() {
        return username;
    }

    /**
     * @return Password as a String
     */
    public String getPassword() {
        return password;
    }

    /**
     * @return Active status as an Integer
     */
    public int getActive() {
        return active;
    }

    /**
     * @return Roles as a String
     */
    public String getRoles() {
        return roles;
    }

    /**
     * @return Permissions as a String
     */
    public String getPermissions() {
        return Permissions;
    }

    /**
     * @return A list of Roles assigned to this user
     */
    public List<String> getRoleList(){
        if(!this.roles.isEmpty()){
            return Arrays.asList(this.roles.split(","));
        }
        return new ArrayList<String>();

    }

    /**
     * @return A list of Permissions assigned to this user
     */
    public List<String> getPermissionList(){
        if(!this.Permissions.isEmpty()){
            return Arrays.asList(this.Permissions.split(","));
        }
        return new ArrayList<String>();

    }




}



