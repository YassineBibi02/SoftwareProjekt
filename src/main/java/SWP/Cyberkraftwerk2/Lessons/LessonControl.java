package SWP.Cyberkraftwerk2.Lessons;

import org.json.JSONObject;
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
 * @version 01.12.2023
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
     * @param quiz_id Integer id of the quiz relating to the lesson
     * @param achievement_id Integer id of the achievements relating to the lesson
     * @param pdf_name String of the pdf designated by this lesson entry
     * @return Integer representing the newly registered lesson
     * @author Tristan Slodowski
     */
    public static int addLessonEntry(String name, int difficulty_level, int quiz_id, int achievement_id, String pdf_name) {
        JSONObject obj = new JSONObject();
        obj.put("name", name);
        obj.put("difficulty", difficulty_level);
        obj.put("quiz_id", quiz_id);
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
        //String name = (String) new_obj.get("name");
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
     * @param quiz_id Integer id of the quiz relating to the lesson
     * @param achievement_id Integer id of the achievements relating to the lesson
     * @param pdf_name String name of the pdf file designated by this lesson entry
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean updateLessonEntry(int id, String name, int difficulty, int quiz_id, int achievement_id, String pdf_name) {
        JSONObject registry = parseRegistry();
        JSONArray assigned_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < assigned_ids.length(); i++) {
            if((assigned_ids.get(i)).equals(id)) {
                JSONObject chosen_entry = (JSONObject) registry.get(Integer.toString(id));

                chosen_entry.put("name", name);
                String file_name = pdf_name.replace(" ", "_");
                chosen_entry.put("path", res_directory + "/" + file_name);
                chosen_entry.put("difficulty", difficulty);
                chosen_entry.put("quiz_id", quiz_id);
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
     * @param quiz_id Integer id of the quiz relating to the lesson
     * @param achievement_id Integer id of the achievements relating to the lesson
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean updateLessonEntry(int id, String name, int difficulty, int quiz_id, int achievement_id) {
        JSONObject registry = parseRegistry();
        JSONArray assigned_ids = (JSONArray) registry.get("taken_ids");

        for(int i = 0; i < assigned_ids.length(); i++) {
            if((assigned_ids.get(i)).equals(id)) {
                JSONObject chosen_entry = (JSONObject) registry.get(Integer.toString(id));

                chosen_entry.put("name", name);
                chosen_entry.put("difficulty", difficulty);
                chosen_entry.put("quiz_id", quiz_id);
                chosen_entry.put("achievement_id", achievement_id);

                registry.put(Integer.toString(id), chosen_entry);
                return writeRegistry(registry);
            }
        }
        return false;
    }

    /**
     * Adds a new quiz for given lesson. Can be searched in the registry as quiz_<quiz_id>.
     * @param quiz_id Int that represents the quiz id given to the Lesson.
     * @param Question String that is the question that the quiz is about.
     * @param wrongAnswers String[] that represents all the wrong answers in for the question
     * @param rightAnswer String that is the only right answer to the question.
     * @author Kevin Kempa
     */
    public static void addQuiz(int quiz_id, String Question, String[] wrongAnswers, String rightAnswer){
        JSONObject registry = parseRegistry();
    
        JSONObject obj = new JSONObject();
        JSONArray arr = new JSONArray();
        for(int i=0; wrongAnswers.length > i; i++){
            arr.put(wrongAnswers[i]);
        }
    
        obj.put("quiz_id", quiz_id);
        obj.put("Question", Question);
        obj.put("rightAnswer", rightAnswer);
        obj.put("wrongAnswers", arr);
    
        String str = "quiz" + Integer.toString(quiz_id);
        registry.put(str, obj);
        writeRegistry(registry);
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
        LessonControl.addLessonEntry("Passwortsicherheit", 1, 1, 1, "test1.pdf");
        LessonControl.addLessonEntry("Phishing", 1, 2, 2, "test2.pdf");

        LessonControl.removeLessonEntry(0);
        LessonControl.addLessonEntry("Hashing", 3, 3, 3, "test3.pdf");
        LessonControl.addLessonEntry("Social Engineering", 2, 4, 4, "test4.pdf");
        LessonControl.updateLessonEntry(1, "FIDO2 Keys", 3, 5, 5, "test5.pdf");

        String[] w_q = {"a", "b", "c"};
        LessonControl.addQuiz(3, "Warum?", w_q, "Right");
    }
}
