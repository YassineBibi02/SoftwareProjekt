package SWP.Cyberkraftwerk2.Databank;

import SWP.Cyberkraftwerk2.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}
