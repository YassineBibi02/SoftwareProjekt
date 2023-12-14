package SWP.Cyberkraftwerk2.Lessons;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import SWP.Cyberkraftwerk2.Module.QuizCompService;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;

/**
 * Class providing static methods to control registered lessons.
 * 
 * All static methods provided by this class interact with a register of all uploaded lessons called registry.json.
 * This registry consists of one JSONObject per registered lesson, containing more information about them, and one JSONArray (called "registered_lessons") 
 * which keeps track of all the keys required to access the JSONObjects for the registered lessons.
 * @author Tristan Slodowski
 * @version 14.12.2023
 */
public class LessonControl {
    static String res_directory = "frontend/public";

    /**
     * Internal method to initialize the registry file if there is no present yet.
     * Gets called automatically if no registry.json is present in the resource directory
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    private static boolean createRegistry() {
        File directory = new File(res_directory);
        File[] contents = directory.listFiles();
        for(File current_file : contents) {
            if(current_file.getName().equals("registry.json")) {
                System.out.println("[LessonControl] Registry already present.");
                return true;
            }
        }
        System.out.println("[LessonControl] No registry found. Creating one.");
        JSONObject new_registry = new JSONObject();
        JSONArray empty_id_list = new JSONArray();
        new_registry.put("taken_ids", empty_id_list);
        try {
            FileWriter fw = new FileWriter(res_directory + "\\registry.json");
            fw.write(new_registry.toString());
            fw.close();
            return true;
        } catch (IOException ioe) {
            System.out.println("[LessonControl] IO Error while trying to write new Registry!");
            System.out.println(ioe.getMessage());
            return false;
        }
    }

    /**
     * Internal method to get the lowest possible id from an array of ids.
     * Useful for easily assigning unique ids for new registry entries.
     * @param assigned_ids JSONArray containing the already assigned ids
     * @return Integer representing the lowest free id to be used
     */
    private static int searchNewID(JSONArray assigned_ids) {
        List<Object> taken_ids = assigned_ids.toList();
        List<Integer> int_ids = new ArrayList<>();
        for(Object o: taken_ids) {                      // Inhalt der List<Object> zu einer ArrayList<Integer> umarbeiten
            int_ids.add((Integer) o );
        }
        Collections.sort(int_ids);                      // Sortieren um schneller die kleinsten IDs zu finden

        for(int last = 0; last < int_ids.size(); last++) {
            if(last != int_ids.get(last)) {             // befindet sich eine ID an einer "falschen" Indexposition in der Liste, wurde eine neue "freie" gefunden
                return last;
            }
        }

        return int_ids.size();          // fehlt keine ID in der natuerlich aufsteigenden Reihenfolge, entspricht die Arraygroesse der neuen ID
    }

    /**
     * Internal method to quickly check whether the registry file currently exists
     * @return boolean whether registry.json exists
     * @author Tristan Slodowski
     */
    private static boolean checkForRegistry() {
        File registry = new File(res_directory + "\\registry.json");
        return registry.exists();
    }

    /**
     * Internal method to parse the contents of the registry.json from the resource directory into a JSONObject.
     * If there is no registry.json createRegistry() will be called automatically.
     * @return JSONObject of the entire registry.json
     * @author Tristan Slodowski
     */
    private static JSONObject parseRegistry() {
        if(!checkForRegistry()) {
            System.out.println("[LessonControl] Parsing failed. No Registry present.");
            createRegistry();
        }
        try{
            Path json_path = Path.of(res_directory + "\\registry.json");
            JSONObject out = new JSONObject(Files.readString(json_path));

            return out;
        } catch (Exception e) {
            System.out.println("[LessonControl] Exception occured while trying to parse Registry!");
            System.out.println(e.getMessage());
            return null;
        }
    }

    /**
     * Internal method to finalize changes to the registry and save them.
     * Ideally the parameter new_register consists of an altered JSONObject returned from parseRegistry() to avoid large changes in format.
     * @param new_registry JSONObject of the new registry
     * @return boolean whether the writing to the file was successful
     * @author Tristan Slodowski
     */
    private static boolean writeRegistry(JSONObject new_registry) {
        try {
            FileWriter writer = new FileWriter(res_directory + "\\registry.json");
            writer.write(new_registry.toString());

            writer.close();
            return true;
        } catch (Exception e) {
            System.out.println("[LessonControl] Exception occured while trying to write to Registry.");
            System.out.println(e.getMessage());
        }

        return false;
    }

    /**
     * Method to register a new lesson into the registry by inserting its values.
     * @param name String of the name of the lesson
     * @param difficulty_level integer representing the difficulty of the corresponding lesson
     * @param achievement_id Integer id of the achievements relating to the lesson
     * @param pdf_name String of the pdf designated by this lesson entry
     * @return Integer representing the newly registered lesson
     * @author Tristan Slodowski
     */
    public static int addLessonEntry(String name, int difficulty_level, int achievement_id, String pdf_name) {
        JSONObject obj = new JSONObject();
        obj.put("name", name);
        obj.put("difficulty", difficulty_level);
        JSONObject quiz = new JSONObject();
        obj.put("quiz", quiz);                                                  // leerer Slot fuer das dazugehoerige Quiz
        obj.put("achievement_id", achievement_id);
        String file_name = pdf_name.replace(" ", "_");
        obj.put("path", res_directory + "/" + file_name);

        JSONObject registry = parseRegistry();
        JSONArray assigned_ids = (JSONArray) registry.get("taken_ids");

        int new_id = searchNewID(assigned_ids);
        obj.put("id", new_id);

        registry.put(Integer.toString(new_id), obj);
        assigned_ids.put(new_id);
        registry.put("taken_ids", assigned_ids);

        writeRegistry(registry);
        return new_id;
    }

    /**
     * Method to register a new lesson by inserting an already pre-prepared JSONObject.
     * The JSONObject should contain keys and values for "id", "name", "difficulty", "path", "quiz_ids" and "achievement_ids".
     * @param new_obj JSONObject of the new lesson registry entry
     * @return Integer representing the newly registered lesson
     * @author Tristan Slodowski
     */
    private static int addLessonEntry(JSONObject new_obj) {
        JSONObject registry = parseRegistry();
        JSONArray assigned_ids = (JSONArray) registry.get("taken_ids");
        int new_id = searchNewID(assigned_ids);

        registry.put(Integer.toString(new_id), new_obj);
        assigned_ids.put(new_id);
        registry.put("taken_ids", assigned_ids);

        writeRegistry(registry);
        return new_id;
    }

    /**
     * Static method to remove a lesson entry by its id from the register.
     * @param target_id Integer id of the lesson entry to be deleted from the registry
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean removeLessonEntry(int target_id) {
        JSONObject registry = parseRegistry();
        JSONArray assigned_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < assigned_ids.length(); i++) {
            if((assigned_ids.get(i)).equals(target_id)) {
                registry.remove(Integer.toString(target_id));

                assigned_ids.remove(i);
                registry.put("taken_ids", assigned_ids);
                return writeRegistry(registry);
            }
        }
        return false;
    }

    /**
     * Static function to update the values of a lessons entry inside the registry of lessons.
     * @param id Integer id of the whole lesson
     * @param name String of the lesson registry entry to be updated.
     * @param difficulty integer representing the difficulty of the corresponding lesson
     * @param achievement_id Integer id of the achievements relating to the lesson
     * @param pdf_name String name of the pdf file designated by this lesson entry
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean updateLessonEntry(int id, String name, int difficulty, int achievement_id, String pdf_name) {
        JSONObject registry = parseRegistry();
        JSONArray assigned_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < assigned_ids.length(); i++) {
            if((assigned_ids.get(i)).equals(id)) {
                JSONObject chosen_entry = (JSONObject) registry.get(Integer.toString(id));

                chosen_entry.put("name", name);
                String file_name = pdf_name.replace(" ", "_");
                chosen_entry.put("path", res_directory + "/" + file_name);
                chosen_entry.put("difficulty", difficulty);
                chosen_entry.put("achievement_id", achievement_id);

                registry.put(Integer.toString(id), chosen_entry);
                return writeRegistry(registry);
            }
        }
        return false;
    }

    /**
     * Static function to update the values of a lessons entry inside the registry of lessons without changing the designated pdf.
     * @param id Integer id of the whole lesson
     * @param name String of the lesson registry entry to be updated.
     * @param difficulty integer representing the difficulty of the corresponding lesson
     * @param achievement_id Integer id of the achievements relating to the lesson
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean updateLessonEntry(int id, String name, int difficulty, int achievement_id) {
        JSONObject registry = parseRegistry();
        JSONArray assigned_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < assigned_ids.length(); i++) {
            if((assigned_ids.get(i)).equals(id)) {
                JSONObject chosen_entry = (JSONObject) registry.get(Integer.toString(id));

                chosen_entry.put("name", name);
                chosen_entry.put("difficulty", difficulty);
                chosen_entry.put("achievement_id", achievement_id);

                registry.put(Integer.toString(id), chosen_entry);
                return writeRegistry(registry);
            }
        }
        return false;
    }


    /**
     * Static function to add a quiz object to the json entry of a lesson.
     * A Quiz object consists of a quiz_id that is equivalent to the id of the corresponding lesson, an Integer representing the number of questions in the quiz and a list
     * of Questions consisting of the question itself (String), the right answers (String) and the possible wrong answers (String[])
     * @param lesson_id Integer of the lesson id to add a quiz to
     * @param q Quiz object containing the questions for the lesson
     * @author Tristan Slodowski
     */
    public static void setQuiz(int lesson_id, Quiz q){
        JSONObject registry = parseRegistry();
        JSONArray registered_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < registered_ids.length(); i++) {
            if((registered_ids.get(i)).equals(lesson_id)) {             // check if the given lesson of lesson_id exists
                JSONObject targeted_lesson = (JSONObject) registry.get(Integer.toString(lesson_id));
                JSONObject new_quiz = new JSONObject();
                new_quiz.put("id", q.getId());                          // adding the id and the number of questions into the json
                new_quiz.put("question_count", q.getQuestionCount());

                for(int j = 0; j < q.getQuestionCount(); j++) {                     // creating a json equivalent of a question object
                    Question quest = q.getQuestions().get(j);
                    JSONObject new_question = new JSONObject();
                    new_question.put("question", quest.getQuestion());
                    new_question.put("right_answer", quest.getRightAnswer());
                    new_question.put("wrong_answers", quest.getWrongAnswers());

                    new_quiz.put("q" + Integer.toString(j), new_question);      // adding the formed json question into the quiz json
                }

                targeted_lesson.put("quiz", new_quiz);                          // setting the newly formed quiz json as the quiz of the given lesson
                registry.put(Integer.toString(lesson_id), targeted_lesson);
                writeRegistry(registry);
            }
        }
    }

    /**
     * Static function to remove the quiz from the lesson registry.
     * @param lesson_id Integer of the lesson id to remove the quiz from
     * @author Tristan Slodowski
     */
    public static void removeQuiz(int lesson_id) {
        JSONObject registry = parseRegistry();
        JSONArray registered_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < registered_ids.length(); i++) {
            if((registered_ids.get(i)).equals(lesson_id)) {                                         // check if the given lesson of lesson_id exists
                JSONObject targeted_lesson = (JSONObject) registry.get(Integer.toString(lesson_id));        
                JSONObject empty_quiz = new JSONObject();                       // insert an empty json object to replace the quiz
                targeted_lesson.put("quiz", empty_quiz);
                registry.put(Integer.toString(lesson_id), targeted_lesson);
                writeRegistry(registry);
            }
        }
    }

    /**
     * Static function to get the quiz assigned to a specific lesson as a Quiz object.
     * This quiz object is ideal to be able to change parameters of the quiz and then {@link SWP.Cyberkraftwerk2.Lessons.LessonControl#setQuiz(int, Quiz) re-setting} it into the registry.
     * <p>
     * If the lesson doesn't have an assigned lesson or the lesson specified by the id doesn't exist, this function will return null instead.
     * @param lesson_id Integer of the lesson id to get the quiz from
     * @return Quiz object of the requested lesson quiz, or null if there is no quiz assigned or the lesson_id doesn't exist
     */
    public static Quiz getQuiz(int lesson_id) {
        JSONObject registry = parseRegistry();
        JSONArray registered_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < registered_ids.length(); i++) {
            if((registered_ids.get(i)).equals(lesson_id)) {                     // check if the requested lesson even exists
                JSONObject targeted_lesson = (JSONObject) registry.get(Integer.toString(lesson_id));
                if(((JSONObject) targeted_lesson.get("quiz")).isEmpty()) {      // if the lesson doesn't have a quiz return null
                    return null;
                }

                JSONObject quiz = (JSONObject) targeted_lesson.get("quiz");             // extract the quiz json object from the lesson json
                Quiz result = new Quiz(lesson_id);
                for(int j = 0; j < (Integer) quiz.get("question_count"); j++) {                         // per question saved in the json, one Question object will be created and added to a Quiz object
                    JSONObject current_question = (JSONObject) quiz.get("q" + Integer.toString(j));
                    Question new_question = new Question();
                    new_question.setQuestion((String) current_question.get("question"));
                    new_question.setRightAnswer((String) current_question.get("right_answer"));
                    for(Object answer : (JSONArray) current_question.get("wrong_answers")) {
                        new_question.addWrongAnswer((String) answer);
                    }

                    result.addQuestion(new_question);
                }

                return result;
            }
        }

        return null;
    }


    /**
     * Static method to get a Json String representation of the whole registry
     * 
     * Ideally this String can be used to easily access all the data in JavaScript
     * @return String of the json String representation of the registry
     * @author Tristan Slodowski
     */
    public static String getJsonString() {
        JSONObject registry = parseRegistry();
        String result = registry.toString();
        return result;
    }

    public static void main(String[] args) {                // TODO die Main hier ist zum lokalen Testen der Methoden; am Ende bitte entfernen!
        LessonControl.addLessonEntry("Passwortsicherheit", 1, 1, "test1.pdf");
        LessonControl.addLessonEntry("Phishing", 1, 2, "test2.pdf");

        LessonControl.removeLessonEntry(0);
        LessonControl.addLessonEntry("Hashing", 3, 3, "test3.pdf");
        LessonControl.addLessonEntry("Social Engineering", 2, 4, "test4.pdf");
        LessonControl.updateLessonEntry(1, "FIDO2 Keys", 3, 5, "test5.pdf");

        Quiz new_quiz = new Quiz(1);
        Question q1 = new Question();
        q1.setQuestion("Was ist ein FIDO2 Key?");
        q1.setRightAnswer("ein physikalischer Schluessel um sich Authentifizieren zu koennen");
        q1.addWrongAnswer("ein Weg um Hundehuetten abzuschliessen");
        q1.addWrongAnswer("ein hunde-foermiger Schluessel");

        Question q2 = new Question();
        q2.setQuestion("Wie verwendet man einen FIDO2 Key?");
        q2.setRightAnswer("An Rechner anschliessen und Treiber arbeiten lassen");
        q2.addWrongAnswer("In Schluesselloch stecken und drehen");
        q2.addWrongAnswer("Just use it 5head");

        new_quiz.addQuestion(q1);
        new_quiz.addQuestion(q2);

        Question q3 = new Question("Warum", "Darum", "Nein", "Auch nicht", "Das hier erst recht nicht");
        Question q4 = new Question("JA oder NEIN", "JA", "NEIN");
        Quiz second_quiz = new Quiz(2, q3, q4);

        LessonControl.setQuiz(1, new_quiz);
        LessonControl.setQuiz(0, second_quiz);

        Quiz extracted_quiz = LessonControl.getQuiz(0);
        extracted_quiz.removeQuestion("Warum");
        LessonControl.setQuiz(0, extracted_quiz);
    }
}
