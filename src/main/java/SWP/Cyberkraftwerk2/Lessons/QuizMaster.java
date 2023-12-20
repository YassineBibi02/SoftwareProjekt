package SWP.Cyberkraftwerk2.Lessons;

import org.springframework.stereotype.Service;
import org.json.JSONObject;

import SWP.Cyberkraftwerk2.Module.QuizCompService;
import SWP.Cyberkraftwerk2.Module.User;
import SWP.Cyberkraftwerk2.Databank.UserRepository;

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

    /**
     * Default constructor of the QuizMaster class.
     * Requires references to the QuizCompService and the UserRepository
     * @param qc_serv QuizCompService reference to interact with the QuizCompletion databank
     * @param user_rep UserRepository reference to interact with the User repository
     * @author Tristan Slodowski
     */
    public QuizMaster(QuizCompService qc_serv, UserRepository user_rep) {
        this.qc_service = qc_serv;
        this.user_repo = user_rep;
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
        int[] registered_ids = (int[]) registry.get("taken_ids");
        for(int id : registered_ids) {
            if(id == lesson_id) {
                JSONObject lesson = (JSONObject) registry.get(Integer.toString(lesson_id));
                JSONObject quiz = (JSONObject) lesson.get("quiz");
                if(quiz.isEmpty()) {
                    return "";
                }
                JSONObject question = (JSONObject) quiz.get("q" + Integer.toString(question_number));
                
                return (String) question.get("right_answer");
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
        JSONObject target_lesson = (JSONObject) registry.get(Integer.toString(lesson_id));
        JSONObject quiz_object = (JSONObject) target_lesson.get("quiz");
        if(quiz_object.isEmpty()) {
            System.err.println("[QuizMaster - validateAnswer] No quiz data to validate answers with found in registry! Aborting operation ...");
            return false;
        }
        // alle einzelnen Fragen des Quizzes abarbeiten und richtige Antworten extrahieren
        int question_count = (Integer) quiz_object.get("question_count");
        if(question_count != answers.length) {
            System.err.println("[QuizMaster - validateAnswer] Incoming number of answers doesn't line up with number of questions in the quiz! Aborting operation ...");
            return false;
        }
        String[] right_answers =  new String[question_count];
        for(int i = 0; i < question_count; i++) {
            right_answers[i] = getRightAnswerFrom(lesson_id, i);
        }
        
        // Liste der richtigen Antworten mit der Liste der gegebenen Antworten vergleichen
        int right_answer_counter = 0;
        for(int i = 0; i < question_count; i++) {
            if(answers[i].equals(right_answers[i])) {
                right_answer_counter++;
            }
        }

        User targeted_user = this.user_repo.findByid(user_id);
        if(right_answer_counter >= question_count / 2) {
            this.qc_service.addAccomplishedUser(user_id, targeted_user);    // ist mehr als die Hälfte richtig, User der accomplished-Liste hinzufügen
            return true;
        } else {
            this.qc_service.addAttemptedUser(user_id, targeted_user);       // ist weniger als die Hälfte richtig, User der attempted-Liste hinzufügen
            return false;
        }
    }
}
