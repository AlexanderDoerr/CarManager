package UserAuth.UserAuth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    private UserRepository userRepository;

//    private final UserRepository userRepository;
//    @Autowired
//    public UserRestController(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }

    @PostMapping("/register")
    public User registerUser(User user) {

        return userRepository.save(user);
    }

}