package SWP.Cyberkraftwerk2.Controller;

import SWP.Cyberkraftwerk2.Databank.AchievementRepository;
import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Lessons.LessonControl;
import SWP.Cyberkraftwerk2.Lessons.Question;
import SWP.Cyberkraftwerk2.Lessons.Quiz;
import SWP.Cyberkraftwerk2.Lessons.QuizMaster;
import SWP.Cyberkraftwerk2.Mail.EmailService;
import SWP.Cyberkraftwerk2.Mail.Mail;
import SWP.Cyberkraftwerk2.Module.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


/**
 * This Class handles the API Calls
 *
 * @Author Soenke Harder
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/methode")
public class APImethode {

    private UserRepository userRepository;
    private AchievementRepository achievementRepository;
    private UserService userService;
    private AchievementService achievementService;
    private QuizMaster quiz_master;

    // autowired email service instance; needs to be autowired to inject the login credentials properly
    @Autowired
    private EmailService mservice;

    public APImethode(UserRepository rep, AchievementRepository achievementRepository, UserService userService, AchievementService achievementService) {
        this.userRepository = rep;
        this.achievementRepository = achievementRepository;
        this.userService = userService;
        this.achievementService = achievementService;
        this.quiz_master = new QuizMaster(this.userRepository, this.achievementRepository);
    }


    @GetMapping("/GetUsers")
    public String[] getAllUsers (){
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
        mservice.sendEmail(Subject[0], "Test", "Hello World");
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

        this.userService.mail_clicked(uid, mid);    // blame the user for clicking the mail link

        User gotcha = this.userRepository.findByid(uid);        // get the user from the user databank
        if(gotcha == null) {
            return "[APImethode - BlameUser] User not found! Aborting ...";
        }
        try{
            name = gotcha.get_firstname();
            JSONObject response = new JSONObject();             // preparing the response json payload
            response.put("name", name);
            return response.toString();                        // returns the name from the user who clicked the link
        } catch(Exception e) {
            return "[APImethode - BlameUser] Firstname could not be retrieved.";
        }
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
        if(file.isEmpty()) {                                                                    // deny the upload if no file was selected
            System.out.println("[uploadLesson] No file provided. Please try again.");
            return false;
        }

        try {
            if(file.getOriginalFilename() == null) {                                // check if the original name of the file is not null
                throw new Exception("Original Filename may not be null!");
            }
            String normal_orig_path = file.getOriginalFilename().replace(" ", "_");     // replace all spaces " " with underscores "_" to avoid file system problems
            normal_orig_path = removeProblemCharacters(normal_orig_path);
            Path dest_path = Path.of("shared-data", normal_orig_path);

            file.transferTo(dest_path);                                     // save the uploaded pdf in the designated pdf folder
            System.out.println("[uploadLesson] Upload successful.");
            return true;
        } catch (Exception e) {
            System.out.println("[uploadLesson] Upload failed.");
            System.out.println("Error message: " + e.getMessage());
            System.out.println(e.toString());
            return false;
        }
    }

    /**
     * Private static method to remove and replace problematic characters that will corrupt the registry upon saving.
     * <p> Common german Umlaute and the "Esszett" will be replaced by their "written out" versions (ä -> ae, ü -> ue, ö -> oe & ß -> ss).
     * Characters like §, °, ´, ² and ³ will be removed, while empty spaces (" ") will be replaced with underscores ("_").
     * @param input_string String potentially containing problematic characters
     * @return input_string without certain characters
     * @author Tristan Slodowski
     */
    private String removeProblemCharacters(String input_string) {
        String result = input_string.replaceAll("[§°´²³]", "");     // regex-Expression to locate and replace certain characters
        result = result.replace("ä", "ae");
        result = result.replace("ö","oe");
        result = result.replace("ü","ue");
        result = result.replace("ß", "ss");

        return result;
    }

    /**
     * Method for the Frontend to register a newly uploaded lesson into the lesson registry
     * Ideal Input: "{"name", difficulty_level, quiz_id, achievement_id, pdf_name, quiz data...}"
     * @param input String array containing the name (as String), difficulty level (as Integer), an achievement ID (as Integer) and the name of the designated pdf (String) followed by the quiz data
     * @return Integer representing the id of the newly registered lesson
     * @author Tristan Slodowski
     */
    @PostMapping("/RegisterLesson")
    public boolean registerLesson(@RequestBody String[] input) {
        try{
            System.out.println("Input Array:" + Arrays.toString(input));
            String name = input[0];
            int difficulty = Integer.parseInt(input[1]);
            int achievement_id = Integer.parseInt(input[2]);
            String pdf_name = input[3];
            int id = LessonControl.addLessonEntry(name, difficulty, achievement_id, pdf_name);  // registering the new entry into the registry; returns the id of the new entry
            System.out.println(id);
            //Call create Quiz with the id and the rest of the input array:
            String[] quiz_input = Arrays.copyOfRange(input, 3, input.length);
            quiz_input[0] = Integer.toString(id);
            createQuiz(quiz_input);
        } catch (Exception e) {
            System.err.println("[APImethode - registerLesson] An error ocurred while executing and nothing has been registered: ");
            System.err.println(e.getMessage());
            return false;
        }
        return true;
    }

    /**
     * Method for the Frontend to delete the registration and corresponding pdf file of a lesson.
     * @param input String array with the id of the lesson to be deleted
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/RemoveFromRegistry")
    public boolean removeFromRegistry(@RequestBody String input) {
        try{
            int target_id = Integer.parseInt(input);
        

            JSONObject registry = new JSONObject(LessonControl.getJsonString());
            JSONObject entry = (JSONObject) registry.get(Integer.toString(target_id));      // parse the entry json object to be deleted
            String path = (String) entry.get("path");                                       // extract the path to the corresponding pdf file

            
            File to_be_deleted = new File(path);
            if (to_be_deleted.delete()) {               // deleting the pdf file
                System.out.println("[APImethode] Deletion of lesson file successful. Removing from registry ...");
                String[] inp_arr = {input};
                removeQuiz(inp_arr);                                // the quiz of the entry gets deleted seperately to ensure deletion of the quiz tracker
                return LessonControl.removeLessonEntry(target_id);  // deleting the entry in the registry
            } else {
                System.out.println("[APImethode] File could not be deleted. Removing from registry ...");
                LessonControl.removeLessonEntry(target_id);         // deleting the entry in the registry
                return false;
            }
        } catch(Exception e) {
            System.err.println("[APImethode - removeFromRegister] An error ocurred while executing and nothing has been removed: ");
            System.err.println(e.getMessage());
            return false;
        }
    }

    /**
     * Method for the Frontend to update the values of a lesson registration.
     * The id dictates which lesson registration will be changed with the input arguments.
     * @param input String array containing lesson id (Integer), name (String), difficulty (Integer), an achievement id (Integer) and the name of the designated pdf followed by quiz data
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/UpdateInRegistry")
    public boolean updateLessonInRegistry(@RequestBody String[] input) {
        try{
            int id = Integer.parseInt(input[0]);
            String name = input[1];
            int difficulty = Integer.parseInt(input[2]);
            int achievement_id = Integer.parseInt(input[3]);
            String new_pdf_name = input[4];
            boolean success;

            JSONObject registry = new JSONObject(LessonControl.getJsonString());
            JSONObject entry = (JSONObject) registry.get(Integer.toString(id));     // parse the entry json object from the registry
            String path = (String) entry.get("path");                               // get the path to the corresponding pdf from the entry json

            File to_be_deleted = new File(path);

            if(to_be_deleted.delete()) {                            // deleting the old pdf file
                success = LessonControl.updateLessonEntry(id, name, difficulty, achievement_id, new_pdf_name);      // updating the old entry with the new values and register a new pdf file
                String[] quiz_input = Arrays.copyOfRange(input, 4, input.length);
                quiz_input[0] = Integer.toString(id);
                createQuiz(quiz_input);                 // overwrite the quiz object with new values
                return success;
            } else {
                System.out.println("[UpdateInRegistry] Error while trying to delete old PDF file! Aborting ...");
                return false;
            }
        } catch(Exception e) {
            System.err.println("[APImethode - updateLessonInRegistry] An error ocurred while executing and the Update was stopped: ");
            System.err.println(e.getMessage());
            return false;
        }
    }

    /**
     * Method for the Frontend to update the values of a lesson registration without changing the designated pdf.
     * The id dictates which lesson registration will be changed with the input arguments.
     * @param input String array containing lesson id (Integer), name (String), difficulty (Integer) and achievement id (Integer) followed by quiz data
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    @PostMapping("/UpdateInRegistryNoNameChange")
    public boolean updateWithoutNameChng(@RequestBody String[] input) {
        try{
            int id = Integer.parseInt(input[0]);
            String name = input[1];
            int difficulty = Integer.parseInt(input[2]);
            int achievement_id = Integer.parseInt(input[3]);
            String[] quiz_input = Arrays.copyOfRange(input, 3, input.length);
            quiz_input[0] = Integer.toString(id);
            createQuiz(quiz_input);             // overwrite the quiz object with the new values
            return LessonControl.updateLessonEntry(id, name, difficulty, achievement_id);
        } catch(Exception e) {
            System.err.println("[APImethode - updateWhithoutNameChng] An error ocurred while executing and the Update was stopped: ");
            System.err.println(e.getMessage());
            return false;
        }  
    }

    /**
     * Method for the Frontend to get a JSON string representation of the lesson registry.
     * Can be used to access all information about the registered lessons.
     * @return Json-formatted String representation of the lesson registry
     * @author Tristan Slodowski
     */
    @GetMapping("/GetLessonRegistry")
    public String getJsonString() {
        System.out.println(LessonControl.getJsonString());
        return LessonControl.getJsonString();
    }


    private void createQuiz(String[] input) {
        try{
            System.out.println(Arrays.toString(input));
            int lesson_id = Integer.parseInt(input[0]);
            Quiz new_quiz = new Quiz(lesson_id);
            int number_of_qs = Integer.parseInt(input[1]);
            int index = 2;
            for (int current_q = 1; current_q <= number_of_qs; current_q++) {
                Question new_question = new Question();
                new_question.setQuestion(input[index]);
                index++;
                int number_of_wrong_as = Integer.parseInt(input[index]);
                index++;
                new_question.setRightAnswer(input[index]);
                index++;
                for (int current_a = 1; current_a <= number_of_wrong_as; current_a++) {
                    new_question.addWrongAnswer(input[index]);
                    index++;
                }
                new_quiz.addQuestion(new_question);
            }
            LessonControl.setQuiz(lesson_id, new_quiz);
        } catch(Exception e) {
            System.err.println("[APImethode - createQuiz] An error ocurred while executing and no Quiz has been created: ");
            System.err.println(e.getMessage());
        }
    }
    /**
     * Method for the Frontend to add/set a quiz for a registered lesson.
     * <p> The input String array contains multiple Integers and Strings in a very specific order to correctly convey the quiz to be added.
     * <p> The first entry of the input array must be the id of the lesson the quiz corresponds to while the second entry must be the number of questions the quiz will contain.
     * The following entries contain the questions the quiz will have and follow a very specific order of arguments. First of all the question itself as a String, second of all comes an
     * Integer representing how many false answers this question is supposed to show. The entry after that must be a String of the right answer to the question. The following entries must
     * be filled with wrong answers equal to the Integer representing the number of wrong answers to the quiz.
     * <p> [Lesson-ID, Number of questions, "Question", Number of wrong answers, "Right answer", "Wrong answer 1", "Wrong answer 2", ... , "Question 2", Number of wrong answers 2, ... ]
     * @param input String array containing an Integer id of the target lesson and JSON strings per question to be added to the quiz
     * @author Tristan Slodowski
     * @author Soenke Harder
     */
    // Notiz ans Frontend: registerLesson() gibt bei der Registrierung einer Lesson die lesson_id ans Frontend zurück; diese muss daraufhin hier für addQuiz() verwendet werden
    @PostMapping("/AddQuiz")
    public void addQuiz(@RequestBody String[] input) {
        createQuiz(input);
    }

    /**
     * Function for the Frontend to delete a quiz from a specified lesson entry.
     * @param lesson_id Integer id of the lesson from which the quiz will be removed
     * @author Tristan Slodowski
     */
    @PostMapping("/RemoveQuiz")
    public void removeQuiz(@RequestBody String[] lesson_id) {
        try{
            int target_id = Integer.parseInt(lesson_id[0]);

            LessonControl.removeQuiz(target_id);                                // remove the quiz from the entry of the given id
        } catch(Exception e) {
            System.err.println("[APImethode - removeQuiz] An error ocurred while executing and no quiz has been altered: ");
            System.err.println(e.getMessage());
        }
    }
    
    /**
     * Function for the Frontend to evaluate the answers given by a user to a quiz.
     * <p>
     * The input array must contain the id of the lesson/quiz (Integer), the Email of the user giving the answers (Integer) and all the answer Strings.
     * The function will return an Integer representing if the operation was successful and whether the user cleared the quiz or failed.
     * <p> A return value of Zero means that the user has failed the quiz. A positive return value means that the user successfully cleared the quiz.
     * A negative return value means that the operation failed while executing and no changes to any database were made.
     * 
     * @param input String array containing the lesson/quiz id (Integer), user email address (String) and all the answers as Strings
     * @return Integer; Zero -> User has failed the quiz, Positive -> User has cleared the quiz, Negative -> Operation failed while executing
     * @author Tristan Slodowski
     */
    @PostMapping("/EvaluateQuiz")
    public int evaluateQuiz(@RequestBody String[] input) {
        try{
            if(input.length <= 2) {                             // Less or equal two given arguments means not enough or no answers were transmitted; immediate termination of the process
                System.err.println("[APImethode - evaluateQuiz] No or not enough arguments given. Aborting ...");
                return -1;
            }
            int lesson_id = Integer.parseInt(input[0]);
            String user_email = input[1];                                                       // Email-to-ID-Adapter to adhere to the databank conventions
            User target_user = this.userRepository.findByEmail(user_email);                     // get the user from the user databank
            if(target_user == null) {
                System.err.println("[APImethode - EvaluateQuiz] User not found! Aborting!");
                return -1;
            }
            int user_id = target_user.get_ID();                                                 // extract the user id from the user object
            String[] given_answers = new String[input.length - 2];
            for(int i = 2; i < input.length; i++) {
                given_answers[i - 2] = input[i];                                                // transfer the given answers to a new array
            }

            boolean result = quiz_master.validateAnswers(lesson_id, user_id, given_answers);    // validate the answers with the registered right answers in the registry

            if (result) {
                return 1;       // User has cleared the quiz
            } else {
                return 0;       // User has failed the quiz
            }
        } catch(Exception e) {
            System.err.println("[APImethode - evaluateQuiz] An error ocurred while executing and the Evaluation failed: ");
            System.err.println(e.getMessage());
            return -1;
        }
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
        LessonControl.invalidateAchievementId(achievementID);       // remove all references to this achievement from the registry
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

    @PostMapping("/NewMail")
    public boolean newMail(@RequestBody String[] input) {
        String text = input[0];
        String subject = input[1];
        int level = Integer.parseInt(input[2]);

        Mail mail = new Mail(userService);
        return mail.new_mail(text, subject, level);
    }

    
    @PostMapping("/SendMails")
    public boolean sendMails(@RequestBody Map<String, int[]> data){
        int[] UIDs = data.get("UIDs");
        int[] start_date = data.get("start_date");
        int[] end_date = data.get("end_date");
        System.out.println(Arrays.toString(UIDs));
        System.out.println(Arrays.toString(start_date));
        System.out.println(Arrays.toString(end_date));
        Mail mail = new Mail(userService);
        return mail.send_mails(UIDs, start_date, end_date);
    }


    @PostMapping("/SaveMail")
    public boolean saveMail(@RequestBody String[] input){
        String text = input[0];
        String subject = input[1];
        int level = Integer.parseInt(input[2]);
        int id = Integer.parseInt(input[3]);

        Mail mail = new Mail(userService);
        return mail.save_mail(text, level, subject, id);
    }


    @PostMapping("/GetMail")
    public String[] getMail(@RequestBody int id){
        Mail mail = new Mail(userService);
        String[] email = new String[2];
        email[0] = mail.get_subject(id);
        email[1] = mail.get_mail(id);
        return email;
    }


    @GetMapping("/GetAllMails")
    public String[][] getAllMails(){
        Mail mail = new Mail(userService);
        System.out.println("Test----------a--dwa-daw-");
        String[][] result = mail.get_all();
        System.out.println(Arrays.deepToString(result));
        return result;
    }
}