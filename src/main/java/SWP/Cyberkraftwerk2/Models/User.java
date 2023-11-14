package SWP.Cyberkraftwerk2.Models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Entity
@Table(name = "UserList") // Choose a different name for your table
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private int active;
    private String roles = "";
    private String Permissions = "";

    public User(String username, String password, String roles, String permissions) {
        this.username = username;
        this.password = password;
        this.active = 1;
        this.roles = roles;
        this.Permissions = permissions;
    }

    public User() {
    }


    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public int getActive() {
        return active;
    }

    public String getRoles() {
        return roles;
    }

    public String getPermissions() {
        return Permissions;
    }

    public List<String> getRoleList(){
        if(!this.roles.isEmpty()){
            return Arrays.asList(this.roles.split(","));
        }
        return new ArrayList<String>();

    }

    public List<String> getPermissionList(){
        if(!this.Permissions.isEmpty()){
            return Arrays.asList(this.Permissions.split(","));
        }
        return new ArrayList<String>();

    }




}



