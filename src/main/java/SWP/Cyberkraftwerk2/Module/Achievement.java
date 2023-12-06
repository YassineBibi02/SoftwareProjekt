package SWP.Cyberkraftwerk2.Module;


import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;


/**
 * This class represents the achievements of the users.
 *
 * @Author: Yassine Bibi
 */


@Getter
@Entity
@Table(
        name = "Achievements"
)
public class Achievement {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private int id;

    @Column(
            nullable = false
    )
    private String name;

    private List<Integer> Users;

    private String description;

    public Achievement(String name, String description) {
        this.name = name;
        this.description = description;
        this.Users = new ArrayList<>();
    }


    public Achievement() {
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<Integer> getUsers() {
        return Users;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    /**
     * This function adds a user to the achievement
     * @param user User to be added
     * @Author Yassine Bibi
     */
    public void addUser(User user) {
        Integer userId = user.get_ID();

        if (!this.Users.contains(userId)) {
            this.Users.add(userId);
        }
    }
}
