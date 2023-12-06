package SWP.Cyberkraftwerk2.Databank;

import SWP.Cyberkraftwerk2.Module.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface function to interact with databank Achievements
 * w
 *
 * @author Yassine Bibi
 */
@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Integer> {

    Achievement findByid(int id);

    Achievement findByName(String name);

}
