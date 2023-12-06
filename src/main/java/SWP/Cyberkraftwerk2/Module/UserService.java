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
    

    public void change_user(int ID, String firstname, String lastname, String email){
        /*change User "ID" in database*/
        //UNFINISHED
    }

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
}
