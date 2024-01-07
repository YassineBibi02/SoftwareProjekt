package SWP.Cyberkraftwerk2.Lessons;

import org.springframework.stereotype.Service;

import java.util.List;

import org.json.JSONObject;
import org.json.JSONArray;

import SWP.Cyberkraftwerk2.Module.QuizCompService;
import SWP.Cyberkraftwerk2.Module.User;
import SWP.Cyberkraftwerk2.Databank.UserRepository;
import SWP.Cyberkraftwerk2.Databank.AchievementRepository;
import SWP.Cyberkraftwerk2.Module.Achievement;

/**
 * Service class to offer methods interacting with the quiz objects of the lesson registry.
 * @version 19.12.2023
 * @author Tristan Slodowski
 */
@Service
public class QuizMaster {
    // QuizCompService reference to interact with the QuizCompletion databank
    private QuizCompService qc_service;
    // UserRepository reference to get User information from the databank
    private UserRepository user_repo;
    private AchievementRepository ach_repo;

    /**
     * Default constructor of the QuizMaster class.
     * Requires references to the QuizCompService and the UserRepository
     * @param qc_serv QuizCompService reference to interact with the QuizCompletion databank
     * @param user_rep UserRepository reference to interact with the User repository
     * @author Tristan Slodowski
     */
    public QuizMaster(QuizCompService qc_serv, UserRepository user_rep, AchievementRepository a_rep) {
        this.qc_service = qc_serv;
        this.user_repo = user_rep;
        this.ach_repo = a_rep;
    }

    /**
     * Method to retrieve the right answer to a question from a quiz.
     * To locate the right 'right answer' the id of the lesson and the number of the specified question must be provided.
     * @param lesson_id Integer id of the lesson which contains the wanted quiz structure
     * @param question_number Integer number of which question the answer should be retrieved
     * @return String of the 'right answer' from one specific question
     */
    public String getRightAnswerFrom(int lesson_id, int question_number) {
        JSONObject registry = new JSONObject(LessonControl.getJsonString());
        JSONArray registered_ids = registry.getJSONArray("taken_ids");
        for(int i = 0; i < registered_ids.length(); i++) {
            int id = registered_ids.getInt(i);
            if(id == lesson_id) {                       // check if the desired entry id exists in the "taken_ids" array
                JSONObject lesson = (JSONObject) registry.get(Integer.toString(lesson_id));     // parsing the corresponding entry and quiz objects
                JSONObject quiz = (JSONObject) lesson.get("quiz");
                if(quiz.isEmpty()) {            // if the quiz is undefined for this entry, return an empty string
                    return "";
                }
                JSONObject question = (JSONObject) quiz.get("q" + Integer.toString(question_number));   // parse the question json object from the quiz designated by the question_number
                
                return (String) question.get("right_answer");               // return the right answer string from the question object
            }
        }

        return "";
    }

    /**
     * Method to validate given user answers with the saved 'right answers'.
     * <p> Depending on whether the user managed to answer more than half of the question correctly or not, the method will add the user to the
     * corresponding tracker lists of the QuizCompletion object for that specific quiz.
     * <p> If equal to or more than 50% of the questions were answered correctly, the user gets added to the Accomplished-List, otherwise they will
     * be added to the Attempted-List.
     * @param lesson_id Integer id of the lesson which contains the wanted quiz structure
     * @param user_id Integer id of the user that is answering the questions
     * @param answers String array of the given answers
     * @return boolean whether the user passed the quiz (>=50% answered correctly) or not
     */
    public boolean validateAnswers(int lesson_id, int user_id, String[] answers) {
        JSONObject registry = new JSONObject(LessonControl.getJsonString());
        JSONArray registered_ids = registry.getJSONArray("taken_ids");
        for(int i = 0; i < registered_ids.length(); i++) {
            int id = registered_ids.getInt(i);
            if(id == lesson_id) {                       // check if the desired entry id exists in the "taken_ids" array
                JSONObject target_lesson = (JSONObject) registry.get(Integer.toString(lesson_id));      // parsing the entry and quiz json objects
                JSONObject quiz_object = (JSONObject) target_lesson.get("quiz");
                int achievement_id = (Integer) target_lesson.get("achievement_id");
                if(quiz_object.isEmpty()) {             // nothing to validate with if the quiz is undefined
                    System.err.println("[QuizMaster - validateAnswer] No quiz data to validate answers with found in registry! Aborting operation ...");
                    return false;
                }

                int question_count = (Integer) quiz_object.get("question_count");
                if(question_count != answers.length) {              // abort if there are more/less answers than questions
                    System.err.println("[QuizMaster - validateAnswer] Incoming number of answers doesn't line up with number of questions in the quiz! Aborting operation ...");
                    return false;
                }
                String[] right_answers =  new String[question_count];
                for(int j = 0; j < question_count; j++) {
                    right_answers[j] = getRightAnswerFrom(lesson_id, j);        // get the right answers from the quiz questions
                }
                
                // compare the list of right answers with the list of given answers
                int right_answer_counter = 0;
                for(int j = 0; j < question_count; j++) {
                    if(answers[j].equals(right_answers[j])) {       // if the given answers is also the right answer, increment the right answer counter
                        right_answer_counter++;
                    }
                }

                User targeted_user = this.user_repo.findByid(user_id);          // get the user from the user databank
                if(targeted_user == null) {
                    System.err.println("[QuizMaster - validateAnswer] Given user id returned no registered user. Aborting ...");
                    return false;
                }
                if(right_answer_counter >= ((double) question_count) / 2.0) {           // compute if enough right answers were given
                    //this.qc_service.addAccomplishedUser(lesson_id, targeted_user);      // if half or more answers were correct, the user gets added to the list of user who cleared the quiz and receives the corresponding achievement
                    grantAchievement(user_id, achievement_id);
                    return true;
                } else {
                    //this.qc_service.addAttemptedUser(lesson_id, targeted_user);         // if less than half of the answers were correct, the user gets added to the list of user who attempted but failed the quiz
                    return false;
                }
            }
        }
        
        return false;
    }

    /**
     * Function to compile an overview of a users progression over all the registered quizzes.
     * <p> The funtion only needs the email of the user as an argument and returns a JSON structure representing the progression of the user.
     * <p> Inside the JSON structure are Key-Value-Pairs using the lesson/quiz ids as keys and containing either a -1, 0 or 1 as values.
     * A negative value of -1 means the user hasn't interacted with this quiz as of yet, 0 means the user has tried but failed the quiz and a value of 1 means the user passed the quiz.
     * <p>  Example: <code> {"1": 1, "2": 1, "3": 0, "4": -1, "5": -1} </code>
     * <p> Returns an empty string if the user couldn't be found in the databank.
     * @param user_mail String of the target users email address
     * @return JSON formatted String of the users quiz progression
     */
    public String getProgressionOf(String user_mail) {
        JSONObject progression_json = new JSONObject();
        User target_user = this.user_repo.findByEmail(user_mail);       // get the user from the user databank
        if(target_user == null) {
            return "";
        }

        int user_id = target_user.get_ID();                                                 // extract the user id from the user
        List<Integer> attempted_quizzes = this.qc_service.checkForAttempted(user_id);       // get the list of quizzes this user has attempted
        List<Integer> accomplished_quizzes = this.qc_service.checkForAccomplished(user_id); // get the list of quizzes this user has accomplished
        List<Integer> qc_ids = this.qc_service.getAllQCIds();                               // get list of all registered quiz tracker

        for(int qc_id : qc_ids) {                                   // iterate over the list of all quiz tracker
            if(accomplished_quizzes.contains(qc_id)) {
                progression_json.put(Integer.toString(qc_id), 1);       // if the user has cleared this quiz, mark it with a 1
                continue;
            }
            if(attempted_quizzes.contains(qc_id)) {
                progression_json.put(Integer.toString(qc_id), 0);       // if the user has attempted but not cleared this quiz, mark it with a 0
            }
            progression_json.put(Integer.toString(qc_id), -1);          // if the user hasn't interacted with this quiz at all, mark it with a -1
        }

        return progression_json.toString();
    }

    /**
     * Method to grant a user a specific achievement.
     * 
     * @param user_id Integer representing the id of the user
     * @param achievement_id Integer representing the achievment to be given to the user
     */
    public void grantAchievement(int user_id, int achievement_id) {
        User targeted_user = this.user_repo.findByid(user_id);          // get the user from the user databank
        if(targeted_user == null) {
            System.err.println("[QuizMaster - grantAchievement] User not found. No achievements were granted.");
            return;    
        }

        Achievement target_achievement = this.ach_repo.findByid(achievement_id);    // get the achievement from the achievement databank
        if(target_achievement == null) {
            System.err.println("[QuizMaster - grantAchievement] Achievement not found! No achievements were granted.");
            return;
        }

        target_achievement.addUser(targeted_user);      // evoke the method to grant the user the specified achievement
        this.ach_repo.save(target_achievement);
    }
}
