package SWP.Cyberkraftwerk2.Module;


import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

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

    /**
     * -- GETTER --
     *
     * @return the Users ID
     */
    private List<Integer> Users;

    private String description;

    public Achievement(String name, String description) {
        this.name = name;
        this.description = description;
        this.Users = new ArrayList<>();
    }


    public Achievement() {
    }

    public void setName(String name) {
        this.name = name;
    }


    public void setDescription(String description) {
        this.description = description;
    }

    public void addUser(User user) {
        Integer userId = user.get_ID();

        if (!this.Users.contains(userId)) {
            this.Users.add(userId);
        }
    }
}
