package SWP.Cyberkraftwerk2.Module;

import SWP.Cyberkraftwerk2.Databank.AchievementRepository;
import SWP.Cyberkraftwerk2.Databank.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


@Repository
public class UserService {

    private UserRepository userRepository;
    private AchievementRepository achievementRepository;

    @Autowired
    public UserService(UserRepository userRepository, AchievementRepository achievementRepository) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
    }

    public User getUserByID(int ID){
        return this.userRepository.findByid(ID);
    }

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public void mail_received(int ID, int mailID){
        /*sets receivedmails[mailID] to 1*/
        //UNFINISHED
    }


    public void mail_clicked(int ID, int mailID){
        /*sets receivedmails[mailID] to 0*/
        //UNFINISHED
    }


    public void raise_userlevel(int ID){
        /*raise Userlevel by one*/
        //UNFINISHED
    }


    /**
     * This function changes the user
     *
     * @param ID        ID of the user
     * @param firstname firstname
     * @param lastname  lastname
     * @param email     email
     * @Author: Yassine Bibi
     */
    public void change_user(int ID, String firstname, String lastname, String email, Integer level) {
        User user = userRepository.findByid(ID);
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setEmail(email);
        user.setMaillevel(level);
        userRepository.save(user);
    }


    /**
     * This function returns all achievements of a user
     *
     * @param user User
     * @return List of Achievements
     * @Author: Yassine Bibi
     */
    public List<Achievement> getUserAchievements(User user) {
        Integer userId = user.get_ID();
        List<Achievement> achievements = new ArrayList<>();
        this.achievementRepository.findAll().forEach(achievement -> {
            if (achievement.getUsers().contains(userId)) {
                achievements.add(achievement);
            }
        });

        return achievements;
    }

    /**
     * this function creates a new user
     *
     * @param firstname firstname
     * @param lastname  lastname
     * @param email     email
     */
    public void create_user(String firstname, String lastname, String email) {
        User user = new User(firstname, lastname, email);
        this.userRepository.save(user);
    }

    /**
     * this function deletes a user
     *
     * @param ID ID of the user
     */
    public void removeUserByID(int ID) {
        this.userRepository.deleteById(ID);
    }

    /**
     * this function deletes a user
     *
     * @param email email of the user
     */
    public void removeUserByEmail(String email) {
        this.userRepository.deleteByEmail(email);
    }

}
