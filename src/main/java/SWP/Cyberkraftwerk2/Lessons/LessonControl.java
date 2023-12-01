package SWP.Cyberkraftwerk2.Lessons;

import org.json.JSONObject;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
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
    static String res_directory = "frontend\\src\\ressources";

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
        JSONArray empty_lesson_list = new JSONArray();
        new_registry.put("registered_lessons", empty_lesson_list);
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
     * @param quiz_ids Integer array containing the ids of the quiz relating to the lesson
     * @param achievement_ids Integer array containing the ids of the achievements relating to the lesson
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean addLessonEntry(String name, int difficulty_level, int[] quiz_ids, int[] achievement_ids) {
        JSONObject obj = new JSONObject();
        obj.put("name", name);
        obj.put("difficulty", difficulty_level);
        obj.put("quiz_ids", quiz_ids);
        obj.put("achievement_ids", achievement_ids);

        JSONObject registry = parseRegistry();
        JSONArray reg_lessons = (JSONArray) registry.get("registered_lessons");

        for(int i = 0; i < reg_lessons.length(); i++) {
            if(((String) reg_lessons.get(i)).equals(name)) {
                return false;                                         // eine Lesson mit diesem Titel wurde bereits hinzugefuegt
            }
        }

        registry.put(name, obj);
        reg_lessons.put(name);
        registry.put("registered_lessons", reg_lessons);

        return writeRegistry(registry);
    }

    /**
     * Method to register a new lesson by inserting an already pre-prepared JSONObject.
     * The JSONObject should contain keys and values for "name", "difficulty", "quiz_ids" and "achievement_ids".
     * @param new_obj JSONObject of the new lesson registry entry
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    private static boolean addLessonEntry(JSONObject new_obj) {
        JSONObject registry = parseRegistry();
        JSONArray reg_lessons = (JSONArray) registry.get("registered_lessons");
        String name = (String) new_obj.get("name");

        for(int i = 0; i < reg_lessons.length(); i++) {
            if(((String) reg_lessons.get(i)).equals(name)) {
                return false;
            }
        }

        registry.put(name, new_obj);
        reg_lessons.put(name);
        registry.put("registered_lessons", reg_lessons);

        return writeRegistry(registry);
    }

    /**
     * Static method to remove a lesson entry by its name from the register.
     * @param name String of the lesson entry to be deleted from the registry
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean removeLessonEntry(String name) {
        JSONObject registry = parseRegistry();
        JSONArray reg_lessons = (JSONArray) registry.get("registered_lessons");

        for(int i = 0; i < reg_lessons.length(); i++) {
            if(((String) reg_lessons.get(i)).equals(name)) {
                registry.remove(name);

                reg_lessons.remove(i);
                registry.put("registered_lessons", reg_lessons);
                return writeRegistry(registry);
            }
        }
        return false;
    }

    /**
     * Static function to update the values of a lessons entry inside the registry of lessons.
     * @param name String of the lesson registry entry to be updated.
     * @param difficulty integer representing the difficulty of the corresponding lesson
     * @param quiz_ids Integer array containing the ids of the quiz relating to the lesson
     * @param achievement_ids Integer array containing the ids of the achievements relating to the lesson
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean updateLessonEntry(String name, int difficulty, int[] quiz_ids, int[] achievement_ids) {
        JSONObject registry = parseRegistry();
        JSONArray reg_lessons = (JSONArray) registry.get("registered_lessons");

        for(int i = 0; i < reg_lessons.length(); i++) {
            if(((String) reg_lessons.get(i)).equals(name)) {
                JSONObject chosen_entry = (JSONObject) registry.get(name);

                chosen_entry.put("difficulty", difficulty);
                chosen_entry.put("quiz_ids", quiz_ids);
                chosen_entry.put("achievement_ids", achievement_ids);

                registry.put(name, chosen_entry);
                return writeRegistry(registry);
            }
        }
        return false;
    }

    /**
     * Static function to rename the main name of a lessons entry inside the lessons registry
     * @param old_name String of the name of a lesson registry entry to be changed
     * @param new_name String of the new name for the lesson registry entry
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public static boolean updateLessonEntry(String old_name, String new_name) {
        JSONObject registry = parseRegistry();
        JSONArray reg_lessons = (JSONArray) registry.get("registered_lessons");

        for(int i = 0; i < reg_lessons.length(); i++) {
            if(((String) reg_lessons.get(i)).equals(old_name)) {
                JSONObject old_entry = (JSONObject) registry.get(old_name);
                JSONObject new_entry = new JSONObject(old_entry, "difficulty", "quiz_ids", "achievement_ids");
                new_entry.put("name", new_name);

                return removeLessonEntry(old_name) && addLessonEntry(new_entry);
            }
        }
        return false;
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
}
