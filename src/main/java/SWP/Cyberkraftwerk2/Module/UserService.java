package SWP.Cyberkraftwerk2.Module;

import SWP.Cyberkraftwerk2.Databank.AchievementRepository;
import SWP.Cyberkraftwerk2.Databank.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Repository
public class UserService {

    private UserRepository userRepository;
    private AchievementRepository achievementRepository;

    @Autowired
    public UserService(UserRepository userRepository, AchievementRepository achievementRepository) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
    }


    /**
     * This function returns a user referenced by their ID
     * @param ID ID of the user
     * @return the user
    */
    public User getUserByID(int ID) {
        return this.userRepository.findByid(ID);
    }


    /**
     * This function returns a user referenced by their email
     * @param email email of the user
     * @return the user
    */
    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }


    /**
     * This function logs a mail as received for the specified user
     * @param ID ID of the user
     * @param mailID ID of the mail
     * @return void
    */
    public void mail_received(int ID, int mailID) {
        /*sets receivedmails[mailID] to 1*/
        Optional<User> user_optional = Optional.ofNullable(this.userRepository.findByid(ID));
        if(user_optional.isPresent()) {
            User user = user_optional.get();
            int[] tempmailsreceived = user.get_mailsreceived();
            tempmailsreceived[mailID] = 1;
            user.setMailsreceived(tempmailsreceived);
            // Save the user back to the database
            userRepository.save(user);
        } 
    }


    /**
     * This function logs a mail as clicked for the specified user
     * @param ID ID of the user
     * @param mailID ID of the mail
     * @return void
    */
    public void mail_clicked(int ID, int mailID) {
        /*sets receivedmails[mailID] to 0*/
        Optional<User> user_optional = Optional.ofNullable(this.userRepository.findByid(ID));
        if(user_optional.isPresent()) {
            User user = user_optional.get();
            int[] tempmailsreceived = user.get_mailsreceived();
            tempmailsreceived[mailID] = 0;
            user.setMailsreceived(tempmailsreceived);
            // Save the user back to the database
            userRepository.save(user);
        }
    }


    /**
     * This function raies the userlevel of the specified user
     * @param ID ID of the user
     * @return void
    */
    public void raise_userlevel(int ID) {
        /*raise Userlevel by one*/
        Optional<User> user_optional = Optional.ofNullable(this.userRepository.findByid(ID));
        if(user_optional.isPresent()) {
            User user = user_optional.get();
            int templevel = user.get_maillevel();
            if (templevel < 3){
                templevel++;
                }
            user.setMaillevel(templevel);
            // Save the user back to the database
            userRepository.save(user);
        }
    }


    /**
     * This function logs a new mail for all users
     * @return void
    */
    public void new_mail() {
        /*adds a new mail to the receivedmails array*/
        User[] users = this.userRepository.findAll().toArray(new User[0]);
        for (User user : users) {
            int[] tempmailsreceived = user.get_mailsreceived();
            int[] newmailsreceived = new int[tempmailsreceived.length + 1];
            System.arraycopy(tempmailsreceived, 0, newmailsreceived, 0, tempmailsreceived.length);
            newmailsreceived[newmailsreceived.length - 1] = 0;
            user.setMailsreceived(newmailsreceived);
            // Save the user back to the database
            userRepository.save(user);
        }
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
    @Transactional
    public void removeUserByID(int ID) {
        this.userRepository.deleteById(ID);
    }


    /**
     * this function deletes a user
     *
     * @param email email of the user
     */
    @Transactional
    public void removeUserByEmail(String email) {
        this.userRepository.deleteByEmail(email);
    }

    
    /**
     * Fetches a random user from the database
     * @return random User
     */
    public User getRandomUser() {
        List<User> users = this.userRepository.findAll();
        int random = (int) (Math.random() * users.size());
        return users.get(random);
    }

}
