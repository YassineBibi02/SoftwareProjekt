package SWP.Cyberkraftwerk2.Models;

import jakarta.persistence.*;


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
     * Constructor function for the User class
     * @param username The User's Username
     */
    public User(String username) {
        this.username = username;
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


}



