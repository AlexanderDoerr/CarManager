package UserAuth.UserAuth;

import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {
}
