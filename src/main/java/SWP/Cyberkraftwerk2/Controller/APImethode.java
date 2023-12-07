package SWP.Cyberkraftwerk2.Controller;

import SWP.Cyberkraftwerk2.Databank.AchievementRepository;
import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Lessons.LessonControl;
import SWP.Cyberkraftwerk2.Mail.EmailService;
import SWP.Cyberkraftwerk2.Module.Achievement;
import SWP.Cyberkraftwerk2.Module.AchievementService;
import SWP.Cyberkraftwerk2.Module.User;
import SWP.Cyberkraftwerk2.Module.UserService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * This Class handles the API Calls
 *
 * @Author Soenke Harder
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/methode")
public class APImethode {

    private UserRepository userRepository;
    private AchievementRepository achievementRepository;
    private UserService userService;
    private AchievementService achievementService;

    public APImethode(UserRepository rep, AchievementRepository achievementRepository, UserService userService, AchievementService achievementService) {
        this.userRepository = rep;
        this.achievementRepository = achievementRepository;
        this.userService = userService;
        this.achievementService = achievementService;
    }


    @GetMapping("/GetUsers")
    public String[] getAllUsers (){
        //User test1 = new User("Soenke", "Harder", "soenke_harder@gmx.de", new int[]{1, 2}, 0);
        //User test2 = new User("Aaron", "Sava", "testest@fakemail.de", new int[]{1, 2}, 0);
        List<User> UserList = this.userRepository.findAll();
        String[] result = new String[UserList.size()];
        int i = 0;
        for (User n : UserList) {
            result[i] = (n.toJson());
            i++;
        }
        return result;
    }


    @PostMapping(value="/SendEmail", consumes = "application/json")
    public String sendEmail(@RequestBody String[] Subject) {
        EmailService mail = new EmailService();
        mail.sendEmail(Subject[0], "Test", "Hello World");
        System.out.println(Arrays.toString(Subject));
        return "Received : " + Arrays.toString(Subject) + "";
    }


    /**
     * Method accessible by the Frontend to blame a User for falling for a Phishing-Mail
     * Accessible by POSTing to the /BlameUser-Mapping with an Integer-Array consisting of the UID of the User and the MID of the Mail
     * @param ids Integer Array containing the UID and MID of the successful phishing attempt; [UID, MID]
     * @return String of the firstname of the UIDs User
     */
    @PostMapping("/BlameUser")
    public String blameUser(@RequestBody String[] ids) {
        String name = "NOT AVAILABLE";
        int uid = Integer.parseInt(ids[0]);
        int mid = Integer.parseInt(ids[1]);
        ObjectMapper objMapper = new ObjectMapper();

        //User.mail_clicked(uid, mid);    // User fuer das Anklicken der Mail anschwaerzen

        User gotcha = this.userRepository.findByid(uid);        // Abrufen des passenden Nutzers aus der Datenbank
        if(gotcha == null) {
            return "[USER NOT FOUND]";
        }
        try{
            Map<String, Object> map = objMapper.readValue(gotcha.toJson(), new TypeReference<Map<String, Object>>(){}); // Informationen des Nutzers zu einer nutzbaren Map umwandeln
            name = (String)map.get("firstname");
        } catch(Exception e) {
            return "ERROR WHILE GETTING NAME FROM DB";
        }

        return name;
    }

    /**
     * Method accessible by the Frontend to be able to upload lesson pdfs into the resources directory of the server.
     * @param file File to be uploaded on the server
     * @param redirectAttributes
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/UploadLesson")
    public boolean uploadLesson(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
        if(file.isEmpty()) {
            System.out.println("[uploadLesson] No file provided. Please try again.");
            return false;
        }

        try {
            Path dest_path = Paths.get("\\frontend\\src\\ressources" + file.getOriginalFilename());
            file.transferTo(dest_path);
            System.out.println("[uploadLesson] Upload successful.");
            return true;
        } catch (Exception e) {
            System.out.println("[uploadLesson] Upload failed.");
            System.out.println(e.getMessage());
            return false;
        }
    }

    /**
     * Method for the Frontend to register a newly uploaded lesson into the lesson registry
     * Ideal Input: "{"name", difficulty_level, quiz_id, achievement_id}"
     * @param input String array containing the name (as String), difficulty level (as Integer), a quiz ID (as Integer) and a achievement ID (as Integer)
     * @return Integer representing the id of the newly registered lesson
     * @author Tristan Slodowski
     */
    @PostMapping("/RegisterLesson")                                         // TODO Auslesen der Argumente aus den Inputs für alle Lesson-Methoden sicherer machen
    public int registerLesson(@RequestBody String[] input) {
        String name = input[0];
        int difficulty = Integer.parseInt(input[1]);
        int quiz_id = Integer.parseInt(input[2]);
        int achievement_id = Integer.parseInt(input[3]);
        return LessonControl.addLessonEntry(name, difficulty, quiz_id, achievement_id);
    }

    /**
     * Method for the Frontend to delete the registration of a lesson from the registry.
     * @param input String array with the id of the lesson to be deleted
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/RemoveFromRegistry")
    public boolean removeFromRegistry(@RequestBody String input) {
       int target_id = Integer.parseInt(input);

        return LessonControl.removeLessonEntry(target_id);
    }

    /**
     * Method for the Frontend to update the values of a lesson registration.
     * The id dictates which lesson registration will be changed with the input arguments.
     * @param input String array containing lesson id (Integer), name (String), difficulty (Integer), quiz id (Integer) and achievement id (Integer)
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/UpdateInRegistry")
    public boolean updateLessonInRegistry(@RequestBody String[] input) {
        int id = Integer.parseInt(input[0]);
        String name = input[1];
        int difficulty = Integer.parseInt(input[2]);
        int quiz_id = Integer.parseInt(input[3]);
        int achievement_id = Integer.parseInt(input[4]);
        
        return LessonControl.updateLessonEntry(id, name, difficulty, quiz_id, achievement_id);
    }

    /**
     * Method for the Frontend to get a json string representation of the lesson registry.
     * Can be used to access all information about the registered lessons.
     * @return Json-formatted String representation of the lesson registry
     * @author Tristan Slodowski
     */
    @GetMapping("/GetLessonRegistry")
    public String getJsonString() {
        System.out.println(LessonControl.getJsonString());
        return LessonControl.getJsonString();
    }


    /**
     * This Function adds an Achievement to a User
     *
     * @param achievementID ID of the Achievement
     * @param userEmail     Email of the User
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/AddAchievement")
    public ResponseEntity<?> addAchievement(@RequestBody Integer achievementID, @RequestBody String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        Achievement achievement = achievementRepository.findByid(achievementID);
        if (user == null || achievement == null) {
            return new ResponseEntity<>("No user found", HttpStatus.NOT_FOUND);
        } else {
            achievement.addUser(user);
            achievementRepository.save(achievement);
            return ResponseEntity.ok().body("Achievement added");
        }
    }

    /**
     * This Function adds multiple Achievements to a User
     *
     * @param input String Array containing the ID of the User and the IDs of the Achievements
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/AddBulkAchievement")
    public ResponseEntity<?> addBulkAchievement(@RequestBody String[] input) {
        int ID = Integer.parseInt(input[0]);
        String[] achievementIDs = input[1].split(",");
        User user = userService.getUserByID(ID);
        if (user == null) {
            return new ResponseEntity<>("No user found", HttpStatus.NOT_FOUND);
        } else {
            for (String achievementID : achievementIDs) {
                Achievement achievement = achievementRepository.findByid(Integer.parseInt(achievementID));
                if (achievement == null) {
                    return new ResponseEntity<>("No achievement found", HttpStatus.NOT_FOUND);
                } else {
                    achievement.addUser(user);
                    achievementRepository.save(achievement);
                }
            }
            return ResponseEntity.ok().body("Achievements added");
        }
    }

    /**
     * This Function removes an Achievement from a User
     *
     * @param achievementID ID of the Achievement
     * @param userEmail     Email of the User
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/RemoveAchievement")
    public ResponseEntity<?> removeAchievement(@RequestBody Integer achievementID, @RequestBody String userEmail) {
        User user = userService.getUserByEmail(userEmail);
        Achievement achievement = achievementRepository.findByid(achievementID);
        if (user == null || achievement == null) {
            return new ResponseEntity<>("No user found", HttpStatus.NOT_FOUND);
        } else {
            achievement.removeUser(user);
            return ResponseEntity.ok().body("Achievement removed");
        }
    }

    /**
     * This Function creates an Achievement
     *
     * @param input Name, Description and weight of the Achievement in a String Array
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/CreateAchievement")
    public ResponseEntity<?> createAchievement(@RequestBody String[] input) {
        String name = input[0];
        String description = input[1];
        Integer weight = Integer.parseInt(input[2]);

        achievementService.addAchievement(name, description, weight);
        return ResponseEntity.ok().body("Achievement created");
    }

    /**
     * This Function deletes an Achievement
     *
     * @param achievementID ID of the Achievement
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/DeleteAchievement")
    public ResponseEntity<?> deleteAchievement(@RequestBody Integer achievementID) {
        achievementService.removeAchievement(achievementID);
        return ResponseEntity.ok().body("Achievement deleted");
    }

    /**
     * This functions returns the Achievement Detilas of an Achievement
     *
     * @param achievementID ID of the Achievement
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/AchievementDetails")
    public ResponseEntity<?> getAchievementDetails(@RequestBody Integer achievementID) {
        Achievement achievement = achievementRepository.findByid(achievementID);
        if (achievement == null) {
            return new ResponseEntity<>("No achievement found", HttpStatus.NOT_FOUND);
        } else {
            return ResponseEntity.ok().body(achievement);
        }
    }

    /**
     * This function creates a new user
     *
     * @param input String Array containing the firstname, lastname and email of the new user
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/AddUser")
    public ResponseEntity<?> addUser(@RequestBody String[] input) {
        String firstname = input[0];
        String lastname = input[1];
        String email = input[2];
        userService.create_user(firstname, lastname, email);
        return ResponseEntity.ok().body("User created");
    }

    /**
     * This function deletes a user
     *
     * @param input String Array containing the email of the user to be deleted
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/RemoveUser")
    public ResponseEntity<?> removeUser(@RequestBody String[] input) {
        String email = input[0];
        userService.removeUserByEmail(email);
        return ResponseEntity.ok().body("User removed");
    }

    /**
     * this functions returns all existing achievements
     *
     * @return String Array containing all achievements
     * @Author Yassine Bibi
     */
    @GetMapping("/GetAllAchievements")
    public ResponseEntity<?> getAllAchievements() {
        List<Achievement> achievementList = this.achievementRepository.findAll();
        return ResponseEntity.ok().body(achievementList);
    }

    /**
     * this function edits an achievement
     *
     * @param input String Array containing the id, name and description of the achievement to be edited
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/EditAchievement")
    public ResponseEntity<?> editAchievement(@RequestBody String[] input) {
        int id = Integer.parseInt(input[0]);
        String name = input[1];
        String description = input[2];
        int weight = Integer.parseInt(input[3]);
        achievementService.editAchievement(id, name, description, weight);
        return ResponseEntity.ok().body("Achievement edited");
    }

    /**
     * this function edits an user
     *
     * @param input String Array containing the id, firstname, lastname, email and level of the user to be edited
     * @return ResponseEntity Indicating Success or Failure
     * @Author Yassine Bibi
     */
    @PostMapping("/EditUser")
    public ResponseEntity<?> editUser(@RequestBody String[] input) {
        int id = Integer.parseInt(input[0]);
        String firstname = input[1];
        String lastname = input[2];
        String email = input[3];
        int Level = Integer.parseInt(input[4]);
        userService.change_user(id, firstname, lastname, email, Level);
        return ResponseEntity.ok().body("User edited");
    }


}