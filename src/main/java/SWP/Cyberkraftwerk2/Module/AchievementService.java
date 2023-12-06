package SWP.Cyberkraftwerk2.Module;

import SWP.Cyberkraftwerk2.Databank.AchievementRepository;
import org.springframework.stereotype.Service;


/**
 * This Class handles the Achievements
 *
 * @Author Yassine Bibi
 */
@Service
public class AchievementService {

    private AchievementRepository achievementRepository;
    private UserService userService;

    public AchievementService(AchievementRepository achievementRepository, UserService userService) {
        this.achievementRepository = achievementRepository;
        this.userService = userService;
    }

    /**
     * This function adds an achievement to the databank
     *
     * @param name
     * @param description
     */
    public void addAchievement(String name, String description, Integer weight) {
        Achievement achievement = new Achievement(name, description, weight);
        achievementRepository.save(achievement);
    }

    /**
     * This function removes an achievement from the databank
     *
     * @param ID
     */
    public void removeAchievement(Integer ID) {
        Achievement achievement = achievementRepository.findByid(ID);
        achievementRepository.delete(achievement);
    }

    /**
     * This function edits an achievement
     *
     * @param ID          ID of the achievement
     * @param name        new name
     * @param description new description
     */
    public void editAchievement(Integer ID, String name, String description, Integer weight) {
        Achievement achievement = achievementRepository.findByid(ID);
        achievement.setName(name);
        achievement.setDescription(description);
        achievement.setWeight(weight);
        achievementRepository.save(achievement);
    }

}
